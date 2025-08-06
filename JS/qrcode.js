document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Você precisa estar logado.");

  const btnWeb = document.querySelector(".btnWeb");
  const btnWhats = document.querySelector(".btnWhatsApp");
  const btnEmail = document.querySelector(".btnEmail");

  if (btnWeb) {
    btnWeb.addEventListener("click", async () => {
      const res = await fetch("http://localhost:3000/api/gerar-qrcode", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return alert("Erro ao gerar QR Code.");

      const data = await res.json();
      localStorage.setItem("qrCodeUrl", data.qrCode);
      localStorage.setItem("qrMessage", "QR Code gerado com sucesso!");
      window.location.href = "viewqrcode.html";
    });
  }

  if (btnWhats) {
    btnWhats.addEventListener("click", async () => {
      const res = await fetch("http://localhost:3000/api/enviar-qrcode-whatsapp", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) alert("QR Code enviado por WhatsApp com sucesso!");
      else alert("Erro ao enviar via WhatsApp.");
    });
  }

  if (btnEmail) {
    btnEmail.addEventListener("click", async () => {
      const res = await fetch("http://localhost:3000/api/enviar-qrcode-email", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) alert("QR Code enviado por e-mail com sucesso!");
      else alert("Erro ao enviar por e-mail.");
    });
  }

  const qrImage = document.getElementById("qrImage");
  if (qrImage) {
    const qrCodeUrl = localStorage.getItem("qrCodeUrl");
    const qrMessage = localStorage.getItem("qrMessage");

    if (qrCodeUrl) {
      qrImage.src = qrCodeUrl;
      document.getElementById("qrMessage").innerText = qrMessage;
    } else {
      document.body.innerHTML = "<p>QR Code não encontrado. Volte e gere novamente.</p>";
    }

    localStorage.removeItem("qrCodeUrl");
    localStorage.removeItem("qrMessage");
  }
});
