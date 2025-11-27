// Adiciona listener ao formulário de login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // previne o envio padrão do formulário

  // Pega valores digitados pelo usuário
  const email = document.getElementById("useremail").value;
  const senha = document.getElementById("userpass").value;

  // Faz requisição POST para a API de login
  const res = await fetch("https://api-web-mobile.accesssystemfatec.workers.dev/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }) // envia email e senha
  });

  // Se login bem-sucedido
  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("token", data.token); // salva token no localStorage
    localStorage.setItem("user_email", email); // salva email do usuário
    window.location.href = "home.html"; // redireciona para home
  } else {
    // Caso login falhe ou 2FA não esteja verificado
    alert("Login inválido ou 2FA não verificado.");
  }
});
