document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("username").value;
  const cpf = document.getElementById("usercpf").value;
  const email = document.getElementById("useremail").value;
  const telefoneRaw = document.getElementById("userphone").value;
  const telefone = telefoneRaw.replace(/\D/g, ''); 
  const senha = document.getElementById("userpass").value;
  const senha2 = document.getElementById("userpassrep").value;
  const tipo = "visitante"; 

  if (senha !== senha2) return alert("As senhas não coincidem!");

  const res = await fetch("https://apiwebmobile-production.up.railway.app/api/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, cpf, email, telefone, senha, tipo })
  });

  if (res.ok) {
    localStorage.setItem("user_email", email);
    window.location.href = "2FA.html";
  } else {
    const erro = await res.json();
    alert("Erro: " + erro.error);
  }
});
