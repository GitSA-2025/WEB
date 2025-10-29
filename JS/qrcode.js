document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user_email = localStorage.getItem("user_email");

  if (!token || !user_email) return alert("Você precisa estar logado.");

  const API_BASE_URL = "https://apiwebmobile-production.up.railway.app/api";
  const btnSolicitarQR = document.querySelector(".btnSolicitarQR");

  if (btnSolicitarQR) {
    btnSolicitarQR.addEventListener("click", async () => {
      const url = `${API_BASE_URL}/solicitar-qrcode/${encodeURIComponent(user_email)}`;

      try {
        const res = await fetch(url, {
          method: 'POST', // Certifique-se de que a rota da API aceite POST
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // --- INÍCIO DA VERIFICAÇÃO DETALHADA ---
        const contentType = res.headers.get("content-type");

        if (!res.ok) {
          console.error(`Erro HTTP: ${res.status}`);

          if (contentType && contentType.includes("application/json")) {
            // Se a API retornou erro em JSON (ex: { error: "Usuário não encontrado" })
            const errorData = await res.json();
            return alert(`Erro na API (${res.status}): ${errorData.error || errorData.message || "Erro desconhecido."}`);
          } else {
            // Se a API retornou erro em HTML (o seu caso)
            const errorText = await res.text();
            console.error("Resposta não é JSON:", errorText.substring(0, 100) + "...");
            return alert(`Erro na solicitação. Verifique se a rota ${url} e o método (POST) estão corretos na sua API.`);
          }
        }

        // A requisição foi bem-sucedida (status 200 ou 201)
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();

          // 2. SOLICITAÇÃO BEM-SUCEDIDA (PENDENTE ou JÁ PENDENTE)
          if (data.status === 'pendente' || data.message.includes('Solicitação feita')) {
            // Redireciona para a tela de espera para iniciar o polling
            window.location.href = "waiting.html";
          } else {
            // Outras mensagens de sucesso (se houver)
            alert(data.message);
          }
        } else {
          // Se o status é 200/201 mas o tipo de conteúdo não é JSON
          return alert("A API retornou sucesso, mas o formato não é JSON. Verifique o `res.json()` na API.");
        }
        // --- FIM DA VERIFICAÇÃO DETALHADA ---

      } catch (error) {
        console.error("Erro na requisição de solicitação:", error);
        alert("Erro de comunicação com a API. Verifique sua conexão ou a URL.");
      }
    });
  }

  if (window.location.pathname.endsWith('waiting.html')) {
    let pollingInterval;
    const statusDisplay = document.querySelector(".inter-subtitle");

    async function verificarStatusQRCode() {
      const url = `${API_BASE_URL}/gerar-qrcode/${encodeURIComponent(user_email)}`;

      try {
        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();

        if (data.status === 'aprovado') {
          clearInterval(pollingInterval);

          if (data.qrCode) {
            localStorage.setItem("qrCodeUrl", data.qrCode);
            localStorage.setItem("qrMessage", "QR Code aprovado e gerado!");
            window.location.href = "viewqrcode.html";
          } else {
            statusDisplay.innerText = "Erro: QR Code não retornado após aprovação.";
          }

        } else if (data.status === 'negado') {
          clearInterval(pollingInterval);
          statusDisplay.innerHTML = `❌ Sua solicitação foi negada.<br>Volte para a <a href="home.html">Home</a> para solicitar novamente.`;

        } else if (data.status === 'pendente') {
          statusDisplay.innerText = "Aguarde a aprovação... .";

        } else {
          clearInterval(pollingInterval);
          statusDisplay.innerHTML = `⚠️ Erro na verificação: ${data.error || 'Status desconhecido.'}<br>Volte para a <a href="home.html">Home</a>.`;
        }

      } catch (error) {
        console.error("Erro no polling de status:", error);
        statusDisplay.innerText = "Aguarde a aprovação... (Erro de conexão, tentando novamente)";
      }
    }

    const POLLING_INTERVAL_MS = 5000;
    verificarStatusQRCode();
    pollingInterval = setInterval(verificarStatusQRCode, POLLING_INTERVAL_MS);
  }

});