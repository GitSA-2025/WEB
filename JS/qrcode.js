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
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const contentType = res.headers.get("content-type");

        if (!res.ok) {
          console.error(`Erro HTTP: ${res.status}`);

          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            return alert(`Erro na API (${res.status}): ${errorData.error || errorData.message || "Erro desconhecido."}`);
          } else {
            const errorText = await res.text();
            console.error("Resposta não é JSON:", errorText.substring(0, 100) + "...");
            return alert(`Erro na solicitação. Verifique se a rota ${url} e o método (POST) estão corretos na sua API.`);
          }
        }
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();

          if (data.status === 'pendente' || data.message.includes('Solicitação feita')) {
            window.location.href = "waiting.html";
          } else {
            alert(data.message);
          }
        } else {
          return alert("A API retornou sucesso, mas o formato não é JSON. Verifique o `res.json()` na API.");
        }

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
          statusDisplay.innerText = "Por favor, NÂO feche o navegador e aguarde a aprovação... .";

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
