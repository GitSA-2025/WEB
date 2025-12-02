window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const user_email = localStorage.getItem("user_email");

  if (!token || !user_email) {
    return window.location.href = "index.html";
  }

  try {

    // 1. Buscar dados do usuário
    const res = await fetch(
      "https://api-web-mobile.accesssystemfatec.workers.dev/api/conta",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_email })
      }
    );

    if (!res.ok) throw new Error("Erro ao buscar usuário");

    const user = await res.json();

    const tipo = (user.type_user || user.tipo || "").toLowerCase();

    if (tipo !== "colaborador") {
      return window.location.href = "home.html";
    }

    // 2. Preencher dados na tela
    document.getElementById("userName").innerText = user.name || user.nome;
    document.getElementById("userCPF").innerText = user.cpf;
    document.getElementById("userEmail").innerText = user.user_email || user.email;
    document.getElementById("userPhone").innerText = user.phone || user.telefone;
    document.getElementById("userType").innerText = tipo;
    document.getElementById("plate").innerText = user.plate || user.placa;

    // 3. Gerar qrId fixo para colaborador
    const qrId = `COLAB-${user.user_email || user.email}`;

    const payload = {
      ...user,
      qrId,
      colaborador: true,
      singleUse: false,
      expiresAt: null
    };

    // 4. SALVAR QR NA API (MUITO IMPORTANTE)
    await fetch(
      "https://api-web-mobile.accesssystemfatec.workers.dev/api/salvar-qrcode",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          qrId,
          email: user.user_email || user.email,
          expiresAt: null,
          singleUse: false
        })
      }
    );

    // 5. Gerar imagem do QR
    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(payload));

    document.getElementById("qrcodeImage").src = qrCodeUrl;

  } catch (error) {
    console.error(error);
    alert("Erro ao carregar QR Code do colaborador");
    window.location.href = "index.html";
  }
});

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
