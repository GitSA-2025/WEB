window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) return window.location.href = "index.html";

  const res = await fetch("http://localhost:3000/api/conta", {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    alert("Erro ao carregar dados.");
    return;
  }

  const user = await res.json();
  document.getElementById("userName").innerText = user.nome;
  document.getElementById("userCPF").innerText = user.cpf;
  document.getElementById("userEmail").innerText = user.email;
  document.getElementById("userPhone").innerText = user.telefone;
  document.getElementById("userType").innerText = user.tipo;
});