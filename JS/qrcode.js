document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user_email = localStorage.getItem("user_email");

  if (!token || !user_email) {
    alert("Você precisa estar logado.");
    return window.location.href = "index.html";
  }

  const API_BASE_URL = "https://api-web-mobile.accesssystemfatec.workers.dev/api";
  const btnSolicitarQR = document.querySelector(".btnSolicitarQR");

  // ==============================
  // 1) SOLICITAR QRCODE (CORRETO)
  // ==============================
  if (btnSolicitarQR) {
    btnSolicitarQR.addEventListener("click", async () => {
      const url = `${API_BASE_URL}/solicitar-qrcode/${encodeURIComponent(user_email)}`;

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const contentType = res.headers.get("content-type");

        if (!res.ok) {
          console.error(`Erro HTTP: ${res.status}`);

          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            return alert(`Erro (${res.status}): ${errorData.error || errorData.message || "Erro desconhecido."}`);
          }

          return alert("Erro ao solicitar QR Code. Verifique a API.");
        }

        const data = await res.json();

        if (data.status === "pendente" || (data.message && data.message.includes("Solicitação"))) {
          window.location.href = "waiting.html";
        } else {
          alert(data.message || "Resposta inesperada da API.");
        }

      } catch (error) {
        console.error("Erro na solicitação:", error);
        alert("Erro de comunicação com o servidor.");
      }
    });
  }

  // ==============================
  // 2) POLLING NA waiting.html
  // ==============================
  // ==============================
  // 2) POLLING NA waiting.html
  // ==============================
  if (window.location.pathname.endsWith("waiting.html")) {
    let pollingInterval;
    const statusDisplay = document.querySelector(".inter-subtitle");

    async function verificarStatusQRCode() {


      try {
        const res = await fetch(`${API_BASE_URL}/gerar-qrcode`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            user_email
          })
        });

        if (!res.ok) {
          console.log("Erro HTTP:", res.status);
          statusDisplay.innerText = "Erro ao consultar status...";
          return;
        }

        const data = await res.json();
        console.log("Status recebido:", data);

        if (data.status === "aprovado") {
          clearInterval(pollingInterval);

          if (data.qrCode) {
            localStorage.setItem("qrCodeUrl", data.qrCode);
            localStorage.setItem("qrMessage", "QR Code aprovado!");
            window.location.href = "viewqrcode.html";
          } else {
            statusDisplay.innerText = "Erro: QR Code não retornado.";
          }

        } else if (data.status === "negado") {
          clearInterval(pollingInterval);
          statusDisplay.innerHTML = `❌ Solicitação negada.<br>Volte para a <a href="home.html">Home</a>.`;

        } else if (data.status === "pendente") {
          statusDisplay.innerText = "Aguardando aprovação do porteiro...";

        } else {
          statusDisplay.innerHTML = `⚠️ Status desconhecido.`;
        }

      } catch (error) {
        console.error("Erro no polling:", error);
        statusDisplay.innerText = "Erro de conexão...";
      }
    }

    const POLLING_INTERVAL_MS = 5000;
    verificarStatusQRCode();
    pollingInterval = setInterval(verificarStatusQRCode, POLLING_INTERVAL_MS);
  }
});
