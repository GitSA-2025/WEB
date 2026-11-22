window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const user_email = localStorage.getItem("user_email");

  if (!token || !user_email) {
    return (window.location.href = "index.html");
  }

  const btnCancelar = document.getElementById("btnCancelarVoltar");
  const definirDestinoVoltar = (tipoUsuario) => {
    const destino = tipoUsuario === "colaborador" ? "home_colaborador.html" : "home.html";
    if (btnCancelar) {
      btnCancelar.href = destino;
    }
  };

  definirDestinoVoltar((localStorage.getItem("user_type") || "").toLowerCase());

  try {
    const res = await fetch("https://api-web-mobile.accesssystemfatec.workers.dev/api/conta", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_email }),
    });

    if (!res.ok) {
      alert("Erro ao carregar dados. Faça login novamente.");
      return (window.location.href = "index.html");
    }

    const user = await res.json();
    const tipo = (user.type_user || user.tipo || "").toLowerCase();

    localStorage.setItem("user_type", tipo);
    definirDestinoVoltar(tipo);

    document.getElementById("username").value = user.name || user.nome || "";
    document.getElementById("usercpf").value = user.cpf || "";
    document.getElementById("userphone").value = user.phone || user.telefone || "";

    if (user.plate || user.placa) {
      document.getElementById("temVeiculo").checked = true;
      document.getElementById("placaGroup").style.display = "block";
      document.getElementById("placa").value = user.plate || user.placa;
    }
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    alert("Erro ao carregar dados.");
  }
});