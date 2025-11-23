document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const senha = document.getElementById("userpass").value;

  if (senha === "admin") {
    window.location.href = "registerColab.html"; 
  } else {
    alert("Senha incorreta!");
  }
});