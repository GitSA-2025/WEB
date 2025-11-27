window.addEventListener("DOMContentLoaded", async () => {
  // Recupera o token e o email do usuário armazenados no localStorage
  const token = localStorage.getItem("token");
  const user_email = localStorage.getItem("user_email");

  // Se não houver token, redireciona para a página de login
  if (!token) return window.location.href = "index.html";
  // Se não houver email do usuário, loga no console e redireciona para login
  if (!user_email) {
    console.error("user_email não encontrado no localStorage.");
    return window.location.href = "index.html";
  }

  try {
    // Faz uma requisição POST para a API /conta enviando o email do usuário
    const res = await fetch(`https://api-web-mobile.accesssystemfatec.workers.dev/api/conta`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`, // Envia token para autenticação
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_email }) // Envia email no corpo da requisição
    });

    // Se a resposta não for OK (erro), loga e redireciona para login
    if (!res.ok) {
      const txt = await res.text();
      console.error("Erro ao carregar dados. Status:", res.status, txt);
      alert("Erro ao carregar dados. Faça login novamente.");
      return window.location.href = "index.html";
    }

    // Converte a resposta da API em JSON
    const user = await res.json();

    // Atualiza os elementos do DOM com os dados do usuário
    document.getElementById("userName").innerText = user.name || user.nome || "";
    document.getElementById("userCPF").innerText = user.cpf || "";
    document.getElementById("userEmail").innerText = user.user_email || user.email || "";
    document.getElementById("userPhone").innerText = user.phone || user.telefone || "";
    document.getElementById("userType").innerText = user.type_user || user.tipo || "";
    document.getElementById("plate").innerText = user.plate || user.placa || "";
  } catch (err) {
    // Captura erros de rede ou outros problemas e exibe no console e alerta
    console.error("Erro na requisição para /conta:", err);
    alert("Erro ao carregar dados. Verifique a conexão.");
  }
});
