document.getElementById("verificationForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputs = document.querySelectorAll(".code-input input");
  const code = Array.from(inputs).map(input => input.value).join("");
  const email = localStorage.getItem("userEmail");

  const res = await fetch("https://apiwebmobile-production.up.railway.app/api/verificar-2fa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, codigo: code })
  });

  if (res.ok) {
    window.location.href = "index.html";
  } else {
    alert("Código inválido ou expirado.");
  }
});