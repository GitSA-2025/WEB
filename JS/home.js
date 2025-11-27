window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const user_email = localStorage.getItem("user_email");

  if (!token) return window.location.href = "index.html";
  if (!user_email) {
    console.error("user_email não encontrado no localStorage.");
    return window.location.href = "index.html";
  }

  try {
    const res = await fetch(`https://apiwebmobile-production.up.railway.app/api/conta/${encodeURIComponent(user_email)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Erro ao carregar dados. Status:", res.status, txt);
      alert("Erro ao carregar dados. Faça login novamente.");
      return window.location.href = "index.html";
    }

    const user = await res.json();

    document.getElementById("userName").innerText = user.name || user.nome || "";
    document.getElementById("userCPF").innerText = user.cpf || "";
    document.getElementById("userEmail").innerText = user.user_email || user.email || "";
    document.getElementById("userPhone").innerText = user.phone || user.telefone || "";
    document.getElementById("userType").innerText = user.type_user || user.tipo || "";
  } catch (err) {
    console.error("Erro na requisição para /conta:", err);
    alert("Erro ao carregar dados. Verifique a conexão.");
  }
});