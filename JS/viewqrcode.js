document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você precisa estar logado.");
        return window.location.href = "index.html";
    }

    const qrImage = document.getElementById("qrImage");
    const payloadStr = localStorage.getItem("qrCodePayload");

    if (!payloadStr) {
        document.body.innerHTML = `
            <div class="container"><div class="background_form">
                <p>QR Code não encontrado. Volte e <a href="qrcode.html">gere novamente</a>.</p>
            </div></div>
        `;
        return;
    }

    QRCode.toDataURL(payloadStr, { width: 256, margin: 2 }, (err, url) => {
        if (err) {
            console.error("Erro ao gerar QR Code:", err);
            return;
        }
        qrImage.src = url;
    });

    // Limpar localStorage
    localStorage.removeItem("qrCodePayload");
});
