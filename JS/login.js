document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("useremail").value;
  const senha = document.getElementById("userpass").value;

  const res = await fetch("https://api-web-mobile.accesssystemfatec.workers.dev/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  if (!res.ok) {
    return alert("Login inválido ou 2FA não verificado.");
  }

  const data = await res.json();

  localStorage.setItem("token", data.token);
  localStorage.setItem("user_email", email);

  // Agora vamos descobrir o tipo do usuário
  const userRes = await fetch(
    "https://api-web-mobile.accesssystemfatec.workers.dev/api/conta",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${data.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_email: email })
    }
  );

  if (!userRes.ok) {
    return alert("Erro ao identificar tipo de usuário.");
  }

  const userData = await userRes.json();
  const tipo = (userData.type_user || userData.tipo || "").toLowerCase();

  //Redirecionamento correto:
  if (tipo === "colaborador") {
    window.location.href = "home_colaborador.html";
  } else {
    window.location.href = "home.html";
  }

});
