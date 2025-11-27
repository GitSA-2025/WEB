// Seleciona o formulário de login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // previne o envio padrão do formulário

  const senha = document.getElementById("userpass").value; // pega o valor da senha

  // Verifica se a senha é "admin"
  if (senha === "admin") {
    // Redireciona para a página de cadastro de colaboradores
    window.location.href = "registerColab.html"; 
  } else {
    // Mostra alerta se a senha estiver incorreta
    alert("Senha incorreta!");
  }
});
