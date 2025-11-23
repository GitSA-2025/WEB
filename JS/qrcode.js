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
  // 1) SOLICITAR QRCODE
  // ==============================
  if (btnSolicitarQR) {
    btnSolicitarQR.addEventListener("click", async () => {
      const url = `${API_BASE_URL}/solicitar-qrcode/${encodeURIComponent(user_email)}`;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
          const errorData = await res.json();
          return alert(`Erro (${res.status}): ${errorData.error || errorData.message}`);
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
  const statusDisplay = document.querySelector(".inter-subtitle");
  if (statusDisplay) {
    let pollingInterval;
    console.log("✅ Polling iniciado...");

    async function verificarStatusQRCode() {
      console.log("🔄 Verificando status do QR Code...");

      try {
        const res = await fetch(`${API_BASE_URL}/solicitar-qrcode/${encodeURIComponent(user_email)}`, {
          method: "GET", // apenas verifica status
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
          console.log("❌ Erro HTTP:", res.status);
          statusDisplay.innerText = "Erro ao consultar status...";
          return;
        }

        const data = await res.json();
        console.log("✅ Status recebido:", data);

        if (data.status === "aprovado") {
          clearInterval(pollingInterval);

          // ==============================
          // Gerar QR Code localmente
          // ==============================
          const payload = {
            id_user: data.user.id_user,
            name: data.user.name,
            cpf: data.user.cpf,
            user_email: data.user.user_email,
            phone: data.user.phone,
            type_user: data.user.type_user,
            verify2fa: data.user.verify2fa
          };

          const qrSvg = generateQRCode(payload); // função JS no frontend
          const qrDataUrl = `data:image/svg+xml;base64,${btoa(qrSvg)}`;

          localStorage.setItem("qrCodeUrl", qrDataUrl);
          localStorage.setItem("qrMessage", "QR Code aprovado!");
          window.location.href = "viewqrcode.html";
        } else if (data.status === "negado") {
          clearInterval(pollingInterval);
          statusDisplay.innerHTML = `❌ Solicitação negada.<br>Volte para a <a href="home.html">Home</a>.`;
        } else if (data.status === "pendente") {
          statusDisplay.innerText = "Aguardando aprovação do porteiro...";
        } else {
          statusDisplay.innerHTML = `⚠️ Status desconhecido.`;
        }
      } catch (error) {
        console.error("❌ Erro no polling:", error);
        statusDisplay.innerText = "Erro de conexão...";
      }
    }

    const POLLING_INTERVAL_MS = 5000;
    verificarStatusQRCode();
    pollingInterval = setInterval(verificarStatusQRCode, POLLING_INTERVAL_MS);
  }

  // ==============================
  // Função para gerar QR Code no frontend
  // ==============================
  function generateQRCode(data) {
    const json = JSON.stringify(data);
    const qr = new QRCode({
      content: json,
      padding: 2,
      width: 256,
      height: 256
    });
    return qr.svg();
  }
});
