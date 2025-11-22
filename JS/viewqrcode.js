document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você precisa estar logado.");
        return window.location.href = "index.html";
    }

    const qrImage = document.getElementById("qrImage");
    const qrCodeUrl = localStorage.getItem("qrCodeUrl");
    
    const btnWhats = document.querySelector(".btnWhatsApp");
    const btnEmail = document.querySelector(".btnEmail");
    
    const API_BASE_URL_LOCAL = "https://api-web-mobile.accesssystemfatec.workers.dev/api";

    if (qrImage) {
        if (qrCodeUrl) {
            qrImage.src = qrCodeUrl;
        } else {

            document.body.innerHTML = `
                <div class="container"><div class="background_form">
                    <p>QR Code não encontrado. Volte e <a href="qrcode.html">gere novamente</a>.</p>
                </div></div>
            `;
        }

        localStorage.removeItem("qrCodeUrl");
        localStorage.removeItem("qrMessage");
    }

    if (btnWhats) {
        btnWhats.addEventListener("click", async () => {
            const res = await fetch(`${API_BASE_URL_LOCAL}/enviar-qrcode-whatsapp`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.ok) alert("QR Code enviado por WhatsApp com sucesso!");
            else alert("Erro ao enviar via WhatsApp. Verifique o servidor local.");
        });
    }

    if (btnEmail) {
        btnEmail.addEventListener("click", async () => {
            const res = await fetch(`${API_BASE_URL_LOCAL}/enviar-qrcode-email`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (res.ok) alert("QR Code enviado por e-mail com sucesso!");
            else alert("Erro ao enviar por e-mail. Verifique o servidor local.");
        });
    }
});