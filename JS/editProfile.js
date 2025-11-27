// Seleciona o formulário de edição de perfil e adiciona listener para o submit
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita que a página recarregue ao enviar o formulário

  // Captura os valores dos inputs
  const nome = document.getElementById("username").value;
  const cpf = document.getElementById("usercpf").value;
  const telefoneRaw = document.getElementById("userphone").value;
  const telefone = telefoneRaw.replace(/\D/g, ''); // Remove qualquer caractere não numérico
  const placa = document.getElementById("placa").value;

  // Pega o email do usuário salvo no login
  const user_email = localStorage.getItem("user_email");

  // Verifica se existe email salvo
  if (!user_email) {
    alert("Usuário não identificado. Faça login novamente.");
    return;
  }

  try {
    // Faz a requisição POST para a API de edição de perfil
    const res = await fetch("https://api-web-mobile.accesssystemfatec.workers.dev/api/editar-perfil", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` // envia token do usuário
      },
      body: JSON.stringify({
        nome,
        cpf,
        telefone,
        placa,
        user_email
      })
    });

    const data = await res.json();

    // Se a resposta for OK, mantém o email no localStorage e redireciona
    if (res.ok) {
      localStorage.setItem("user_email", user_email);
      window.location.href = "home.html";
    } else {
      alert("❌ Erro: " + data.error);
    }

  } catch (error) {
    alert("Erro ao conectar com o servidor.");
    console.error(error);
  }
});
