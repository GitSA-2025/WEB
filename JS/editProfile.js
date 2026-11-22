document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("username").value;
  const cpf = document.getElementById("usercpf").value;
  const telefoneRaw = document.getElementById("userphone").value;
  const telefone = telefoneRaw.replace(/\D/g, "");
  const placa = document.getElementById("placa").value;
  const user_email = localStorage.getItem("user_email");

  if (!user_email) {
    alert("Usuário não identificado. Faça login novamente.");
    return;
  }

  try {
    const res = await fetch("https://api-web-mobile.accesssystemfatec.workers.dev/api/editar-perfil", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        nome,
        cpf,
        telefone,
        placa,
        user_email,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user_email", user_email);
      const tipo = (
        data.usuario?.type_user ||
        localStorage.getItem("user_type") ||
        ""
      ).toLowerCase();

      localStorage.setItem("user_type", tipo);
      window.location.href = tipo === "colaborador" ? "home_colaborador.html" : "home.html";
    } else {
      alert("Erro: " + data.error);
    }
  } catch (error) {
    alert("Erro ao conectar com o servidor.");
    console.error(error);
  }
});