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
      try {
        // Cria URL com encodeURIComponent para emails
        const url = `${API_BASE_URL}/solicitar-qrcode/${encodeURIComponent(user_email)}`;
        console.log("Chamando URL:", url);

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Erro HTTP:", res.status, errorData);
          return alert(`Erro (${res.status}): ${errorData.error || "Erro desconhecido"}`);
        }

        const data = await res.json();
        console.log("Resposta da solicitação:", data);

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
    console.log("✅ Polling iniciado...");

    let pollingInterval;

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
          console.error("❌ Erro HTTP:", res.status);
          statusDisplay.innerText = "Erro ao consultar status...";
          return;
        }

        const data = await res.json();
        console.log("Status recebido:", data);


        if (data.status === "aprovado") {
          clearInterval(pollingInterval);

          const payload = JSON.stringify(data.userData);

          QRCode.toDataURL(payload)
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
        clearInterval(pollingInterval);
        statusDisplay.innerHTML = `❌ Solicitação negada.<br>Volte para a <a href="home.html">Home</a>.`;
      } else if (data.status === "pendente") {
        statusDisplay.innerText = "Aguardando aprovação do porteiro...";
      } else {
        statusDisplay.innerHTML = `⚠️ Status desconhecido.`;
      }

    } catch (err) {
      console.error("❌ Erro no polling:", err);
      statusDisplay.innerText = "Erro de conexão...";
    }
  }

  const POLLING_INTERVAL_MS = 5000;
  verificarStatusQRCode();
  pollingInterval = setInterval(verificarStatusQRCode, POLLING_INTERVAL_MS);
}
});
