// Adiciona listener para submissão do formulário de registro
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevê o comportamento padrão do form

  // Pega os valores dos campos do formulário
  const nome = document.getElementById("username").value;
  const cpf = document.getElementById("usercpf").value;
  const email = document.getElementById("useremail").value;
  const telefoneRaw = document.getElementById("userphone").value;
  const telefone = telefoneRaw.replace(/\D/g, ''); // Remove caracteres não numéricos
  const placa = document.getElementById("placa").value;
  const senha = document.getElementById("userpass").value;
  const senha2 = document.getElementById("userpassrep").value;
  const tipo = "visitante"; // Define tipo fixo de usuário

  // Valida aceite dos termos
  const checkboxTermos = document.getElementById("aceitarTermos");
  const termosErro = document.getElementById("termosErro");

  if (!checkboxTermos.checked) {
    termosErro.style.display = "block"; // Mostra erro se não aceitou
    return;
  } else {
    termosErro.style.display = "none"; // Esconde mensagem se aceitou
  }

  // Verifica se as senhas conferem
  if (senha !== senha2) {
    return alert("As senhas não coincidem!");
  }

  try {
    // Chamada à API para cadastrar o usuário
    const res = await fetch("https://api-web-mobile.accesssystemfatec.workers.dev/api/cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, cpf, email, telefone, senha, tipo, placa })
    });

    if (res.ok) {
      // Salva email no localStorage e redireciona para 2FA
      localStorage.setItem("user_email", email);
      window.location.href = "2FA.html";
    } else {
      const erro = await res.json();
      alert("Erro: " + erro.error); // Mostra erro retornado pela API
    }

  } catch (error) {
    alert("Erro ao conectar com o servidor."); // Trata erro de rede
    console.error(error);
  }
});
