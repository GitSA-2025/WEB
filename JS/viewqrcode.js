document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado.");
    return window.location.href = "index.html";
  }

  const qrImage = document.getElementById("qrImage");
  const qrCodeUrl = localStorage.getItem("qrCodeUrl");
  const qrMessage = localStorage.getItem("qrMessage") || "Aproxime o QR Code ao leitor.";

  const btnWhats = document.querySelector(".btnWhatsApp");
  const btnEmail = document.querySelector(".btnEmail");

  const API_BASE_URL = "https://api-web-mobile.accesssystemfatec.workers.dev/api";

  // Mostra mensagem e QR Code
  const messageElement = document.getElementById("qrMessage");
  if (messageElement) messageElement.innerText = qrMessage;

  if (qrImage) {
    if (qrCodeUrl && qrCodeUrl.startsWith("data:image")) {
      qrImage.src = qrCodeUrl;
    } else {
      document.body.innerHTML = `
      <div class="container">
        <div class="background_form">
          <p>QR Code não encontrado ou inválido. Volte e <a href="qrcode.html">gere novamente</a>.</p>
        </div>
      </div>
    `;
    }

    setTimeout(() => {
      localStorage.removeItem("qrCodeUrl");
      localStorage.removeItem("qrMessage");
    }, 60000); // só apaga depois de 1 min
  }

  // Envio por WhatsApp
  if (btnWhats) {
    btnWhats.addEventListener("click", async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/enviar-qrcode-whatsapp`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (res.ok) alert("QR Code enviado por WhatsApp com sucesso!");
        else alert("Erro ao enviar via WhatsApp. Verifique o servidor.");
      } catch (err) {
        console.error(err);
        alert("Erro de conexão ao enviar WhatsApp.");
      }
    });
  }

  // Envio por e-mail
  if (btnEmail) {
    btnEmail.addEventListener("click", async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/enviar-qrcode-email`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (res.ok) alert("QR Code enviado por e-mail com sucesso!");
        else alert("Erro ao enviar por e-mail. Verifique o servidor.");
      } catch (err) {
        console.error(err);
        alert("Erro de conexão ao enviar e-mail.");
      }
    });
  }
});
