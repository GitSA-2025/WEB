document.getElementById("verificationForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const inputs = document.querySelectorAll(".code-input input");
  const code = Array.from(inputs).map(input => input.value).join("");
  const user_email = localStorage.getItem("user_email"); // nome correto

  const res = await fetch("https://apiwebmobile-production.up.railway.app/api/verificar-2fa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_email, code })
  });

  if (res.ok) {
    window.location.href = "home.html"; // pode ser index.html se preferir
  } else {
    const txt = await res.text();
    console.error("Erro ao verificar 2FA:", txt);
    alert("Código inválido ou expirado.");
  }
});