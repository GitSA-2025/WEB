// Seleciona o formulário de verificação de 2FA e adiciona um listener para o evento de submit
document.getElementById("verificationForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Previne que o formulário faça o submit padrão (recarregando a página)

  // Seleciona todos os inputs do código (cada dígito do 2FA)
  const inputs = document.querySelectorAll(".code-input input");

  // Concatena todos os valores dos inputs em uma string única (o código completo)
  const code = Array.from(inputs).map(input => input.value).join("");

  // Pega o e-mail do usuário que foi armazenado anteriormente no localStorage
  const user_email = localStorage.getItem("user_email"); // importante usar o mesmo nome que você salvou

  // Faz requisição POST para a API de verificação do 2FA
  const res = await fetch("https://api-web-mobile.accesssystemfatec.workers.dev/api/verificar-2fa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_email, code }) // envia email e código no corpo da requisição
  });

  // Verifica se a resposta da API foi OK (status 200)
  if (res.ok) {
    // Redireciona o usuário para a página principal (home.html ou index.html)
    window.location.href = "home.html"; 
  } else {
    // Se houve algum erro, pega a mensagem da resposta
    const txt = await res.text();
    console.error("Erro ao verificar 2FA:", txt);

    // Exibe alerta para o usuário informando que o código é inválido ou expirou
    alert("Código inválido ou expirado.");
  }
});
