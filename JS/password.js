// Seleciona elementos do DOM relacionados à senha e ao tooltip
const passInput = document.getElementById("userpass");
const tooltip = document.getElementById("password-tooltip");

// Seleciona os indicadores de requisitos da senha
const lengthEl = document.getElementById("length");
const upperEl = document.getElementById("uppercase");
const lowerEl = document.getElementById("lowercase");
const numberEl = document.getElementById("number");

// Seleciona o botão/ícone para mostrar/ocultar a senha
const togglePass = document.getElementById("toggleSenha");

// Exibe o tooltip quando o campo de senha recebe foco
passInput.addEventListener("focus", () => {
  tooltip.style.display = "block";
});

// Oculta o tooltip quando o campo de senha perde foco
passInput.addEventListener("blur", () => {
  tooltip.style.display = "none";
});

// Atualiza os indicadores do tooltip enquanto o usuário digita
passInput.addEventListener("input", () => {
  const pass = passInput.value;

  // Marca cada requisito como válido ou inválido
  toggleClass(lengthEl, pass.length >= 8);
  toggleClass(upperEl, /[A-Z]/.test(pass));
  toggleClass(lowerEl, /[a-z]/.test(pass));
  toggleClass(numberEl, /[0-9]/.test(pass));
});

// Função que adiciona/remover classes 'valid' ou 'invalid' baseado na condição
function toggleClass(element, condition) {
  element.classList.toggle("valid", condition);
  element.classList.toggle("invalid", !condition);
}

// Alterna entre mostrar e esconder a senha ao clicar no ícone
togglePass.addEventListener("click", () => {
  if (passInput.type === "password") {
    passInput.type = "text";
    togglePass.textContent = "visibility"; // ícone de visibilidade ativada
  } else {
    passInput.type = "password";
    togglePass.textContent = "visibility_off"; // ícone de visibilidade desativada
  }
});
