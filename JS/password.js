const passInput = document.getElementById("userpass");
const tooltip = document.getElementById("password-tooltip");

const lengthEl = document.getElementById("length");
const upperEl = document.getElementById("uppercase");
const lowerEl = document.getElementById("lowercase");
const numberEl = document.getElementById("number");

const togglePass = document.getElementById("toggleSenha");

passInput.addEventListener("focus", () => {
  tooltip.style.display = "block";
});

passInput.addEventListener("blur", () => {
  tooltip.style.display = "none";
});

passInput.addEventListener("input", () => {
  const pass = passInput.value;
  toggleClass(lengthEl, pass.length >= 8);
  toggleClass(upperEl, /[A-Z]/.test(pass));
  toggleClass(lowerEl, /[a-z]/.test(pass));
  toggleClass(numberEl, /[0-9]/.test(pass));
});

function toggleClass(element, condition) {
  element.classList.toggle("valid", condition);
  element.classList.toggle("invalid", !condition);
}

togglePass.addEventListener("click", () => {
  if (passInput.type === "password") {
    passInput.type = "text";
    togglePass.textContent = "visibility";
  } else {
    passInput.type = "password";
    togglePass.textContent = "visibility_off";
  }
});
