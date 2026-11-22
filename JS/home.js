window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const user_email = localStorage.getItem("user_email");

  if (!token || !user_email) {
    return (window.location.href = "index.html");
  }

  try {
    const res = await fetch(`https://api-web-mobile.accesssystemfatec.workers.dev/api/conta`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_email }),
    });

    if (!res.ok) {
      alert("Sessão expirada. Faça login novamente.");
      return (window.location.href = "index.html");
    }

    const user = await res.json();

    document.getElementById("userName").innerText = user.name || user.nome || "-";
    document.getElementById("userCPF").innerText = user.cpf || "-";
    document.getElementById("userEmail").innerText = user.user_email || user.email || "-";
    document.getElementById("userPhone").innerText = user.phone || user.telefone || "-";
    document.getElementById("userType").innerText = user.type_user || user.tipo || "Visitante";
    document.getElementById("plate").innerText = user.plate || user.placa || "Sem veículo";
  } catch (err) {
    console.error("Erro na requisição para /conta:", err);
    alert("Erro ao carregar dados. Verifique a conexão.");
  }
});

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}