document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("useremail").value;
  const senha = document.getElementById("userpass").value;

  const res = await fetch("https://apiwebmobile-production.up.railway.app/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user_email", email);
    window.location.href = "home.html";
  } else {
    alert("Login inválido ou 2FA não verificado.");
  }
});