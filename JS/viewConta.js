// Aguarda o carregamento completo do DOM
window.addEventListener("DOMContentLoaded", async () => {
  // Recupera token e email do localStorage
  const token = localStorage.getItem("token");
  const user_email = localStorage.getItem("user_email");

  // Se não houver token ou email, redireciona para a página de login
  if (!token) return window.location.href = "index.html";
  if (!user_email) return window.location.href = "index.html";

  try {
    // Faz a requisição para obter os dados do usuário
    const res = await fetch(`https://api-web-mobile.accesssystemfatec.workers.dev/api/conta`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_email })
    });

    // Se houver erro na resposta, avisa e redireciona
    if (!res.ok) {
      alert("Erro ao carregar dados. Faça login novamente.");
      return window.location.href = "index.html";
    }

    // Converte a resposta em JSON
    const user = await res.json();

    // Preenche os campos do formulário com os dados do usuário
    document.getElementById("username").value   = user.name || user.nome || "";
    document.getElementById("usercpf").value    = user.cpf || "";
    document.getElementById("userphone").value  = user.phone || user.telefone || "";

    // Se houver placa cadastrada, mostra o campo e marca o checkbox
    if (user.plate || user.placa) {
      document.getElementById("temVeiculo").checked = true;
      document.getElementById("placaGroup").style.display = "block";
      document.getElementById("placa").value = user.plate || user.placa;
    }

  } catch (err) {
    // Trata erros de requisição ou de conexão
    console.error("Erro ao carregar dados:", err);
    alert("Erro ao carregar dados.");
  }
});
