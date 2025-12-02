// Espera o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
  // Pega token e email do localStorage para autenticação
  const token = localStorage.getItem("token");
  const user_email = localStorage.getItem("user_email");

  // Se não tiver token ou email, redireciona para login
  if (!token || !user_email) {
    alert("Você precisa estar logado.");
    return window.location.href = "index.html";
  }

  const API_BASE_URL = "https://api-web-mobile.accesssystemfatec.workers.dev/api";
  const btnSolicitarQR = document.querySelector(".btnSolicitarQR");

  // ==============================
  // 1) SOLICITAR QRCODE
  // ==============================
  if (btnSolicitarQR) {
    btnSolicitarQR.addEventListener("click", async () => {

      localStorage.removeItem("qrCodeUrl");
      localStorage.removeItem("qrMessage");
      console.log("Dados antigos de QR Code limpos.");
      try {
        // Cria URL para solicitação de QR Code, encodeURIComponent para email
        const url = `${API_BASE_URL}/solicitar-qrcode/${encodeURIComponent(user_email)}`;
        console.log("Chamando URL:", url);

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        // Trata erro HTTP
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Erro HTTP:", res.status, errorData);
          return alert(`Erro (${res.status}): ${errorData.error || "Erro desconhecido"}`);
        }

        const data = await res.json();
        console.log("Resposta da solicitação:", data);

        // Se a solicitação estiver pendente, redireciona para waiting.html
        if (data.status === "pendente" || (data.message && data.message.includes("Solicitação"))) {
          window.location.href = "waiting.html";
        } else {
          alert(data.message || "Resposta inesperada da API.");
        }

      } catch (err) {
        console.error("Erro ao solicitar QR Code:", err);
        alert("Erro de comunicação com o servidor.");
      }
    });
  }

  // ==============================
  // 2) POLLING NA waiting.html
  // ==============================
  const statusDisplay = document.querySelector(".inter-subtitle");
  if (statusDisplay) {
    console.log("Polling iniciado...");

    let pollingInterval;

    // Função para consultar status do QR Code
    async function verificarStatusQRCode() {
      try {
        const url = `${API_BASE_URL}/gerar-qrcode`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ user_email })
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("❌ Erro HTTP:", res.status, errorData);

          /*if (res.status === 403 || res.status === 404) {
            clearInterval(pollingInterval); // 🛑 PARA O POLLING
            statusDisplay.innerHTML = `
               <span style="color: red">Erro: ${errorData.error || "Solicitação não encontrada."}</span><br>
               <a href="home.html" style="text-decoration: underline;">Voltar para Home e tentar novamente</a>
             `;
          }*/
          return;
        }

        const data = await res.json();
        console.log("Status recebido:", data);

        // Se aprovado, gera o QR Code e salva no localStorage
        if (data.status === "aprovado") {
          clearInterval(pollingInterval);
          statusDisplay.innerText = "Aprovado! Gerando QR Code...";

          const agora = new Date().toLocaleString("pt-BR");
          localStorage.setItem("qrGeneratedAt", agora);

          const isVisitante = data.userData.type_user === "visitante";
          const qrId = crypto.randomUUID();

          let expiresAt = null;

          if (isVisitante) {
            const agora = new Date();
            expiresAt = new Date(agora.getTime() + 45 * 60000); // 45 minutos
          }

          const payload = {
            ...data.userData,
            qrId,
            expiresAt,
            singleUse: isVisitante
          };

          await fetch(`${API_BASE_URL}/salvar-qrcode`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              qrId,
              email: data.userData.email,
              expiresAt,
              singleUse: isVisitante
            })
          });

          QRCode.toDataURL(JSON.stringify(payload))
            .then(url => {
              localStorage.setItem("qrCodeUrl", url);
              localStorage.setItem("qrMessage", "QR Code aprovado!");
              window.location.href = "viewqrcode.html";
            })
            .catch(err => {
              console.error("Erro ao gerar QR Code:", err);
              statusDisplay.innerText = "Erro ao gerar QR Code.";
            });
        } else if (data.status === "negado") {
          // Se negado, mostra mensagem e limpa o polling
          clearInterval(pollingInterval);
          statusDisplay.innerHTML = `Solicitação negada pelo porteiro.<br><a href="home.html">Voltar</a>`;
        } else if (data.status === "pendente") {
          // Se ainda pendente, atualiza status
          statusDisplay.innerText = "Aguardando aprovação do porteiro...";
        } else {
          statusDisplay.innerHTML = `Status desconhecido.`;
        }

      } catch (err) {
        console.error("Erro no polling:", err);
        statusDisplay.innerText = "Erro de conexão...";
      }
    }

    // Configura polling a cada 5 segundos
    const POLLING_INTERVAL_MS = 5000;
    verificarStatusQRCode();
    pollingInterval = setInterval(verificarStatusQRCode, POLLING_INTERVAL_MS);
  }
});
