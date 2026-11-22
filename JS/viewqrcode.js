document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado.");
    return (window.location.href = "index.html");
  }

  const qrImage = document.getElementById("qrImage");
  const qrCodeUrl = localStorage.getItem("qrCodeUrl");
  const qrMessage = localStorage.getItem("qrMessage") || "Aproxime o QR Code do leitor na portaria.";
  const qrExpiresAt = localStorage.getItem("qrExpiresAt");

  const messageElement = document.getElementById("qrMessage");
  const timerElement = document.getElementById("qrTimer");
  const btnDownload = document.getElementById("btnDownloadQR");

  if (messageElement) {
    messageElement.innerText = qrMessage;
  }

  if (!qrCodeUrl || !qrCodeUrl.startsWith("data:image")) {
    document.body.innerHTML = `
      <div class="container">
        <div class="background_form">
          <h1 class="inter-title">Nenhum QR Code ativo</h1>
          <p class="inter-subtitle">Solicite um novo código de acesso para entrar.</p>
          <button type="button" class="btnSolicitarQR" onclick="window.location.href='qrcode.html'">
            <span class="material-icons">qr_code</span>
            Solicitar QR Code
          </button>
        </div>
      </div>
    `;
    return;
  }

  if (qrImage) {
    qrImage.src = qrCodeUrl;
  }

  // Botão para baixar o QR Code como imagem
  if (btnDownload) {
    btnDownload.addEventListener("click", () => {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = "cracha-qrcode.png";
      link.click();
    });
  }

  // Contador regressivo de 45 minutos para visitantes
  if (qrExpiresAt && timerElement) {
    const expiraEm = new Date(qrExpiresAt).getTime();

    const atualizarContador = () => {
      const restante = expiraEm - Date.now();
      if (restante <= 0) {
        timerElement.innerText = "QR Code expirado";
        localStorage.removeItem("qrCodeUrl");
        localStorage.removeItem("qrExpiresAt");
        return;
      }
      const min = Math.floor(restante / 60000);
      const seg = Math.floor((restante % 60000) / 1000);
      timerElement.innerText = `Válido por ${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
    };

    atualizarContador();
    setInterval(atualizarContador, 1000);
  }
});