document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user_email = localStorage.getItem("user_email");

  if (!token || !user_email) {
    alert("Você precisa estar logado.");
    return (window.location.href = "index.html");
  }

  const API_BASE_URL = "https://api-web-mobile.accesssystemfatec.workers.dev/api";
  const btnSolicitarQR = document.querySelector(".btnSolicitarQR");
  const isWaitingPage = document.getElementById("waitingScreen") !== null;

  // ==============================
  // 1) TELA DE SOLICITAÇÃO (qrcode.html)
  // Só age quando o usuário clicar no botão!
  // ==============================
  if (btnSolicitarQR && !isWaitingPage) {
    // Limpa qualquer resquício de QR Code anterior ao abrir a tela de solicitação
    localStorage.removeItem("qrCodeUrl");
    localStorage.removeItem("qrMessage");
    localStorage.removeItem("qrGeneratedAt");
    localStorage.removeItem("qrExpiresAt");
    localStorage.removeItem("qrRequestId");

    btnSolicitarQR.addEventListener("click", async () => {
      btnSolicitarQR.disabled = true;
      const textoOriginal = btnSolicitarQR.innerHTML;
      btnSolicitarQR.innerHTML = `<span class="material-icons">hourglass_top</span> Enviando solicitação...`;

      try {
        const url = `${API_BASE_URL}/solicitar-qrcode/${encodeURIComponent(user_email)}`;

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          btnSolicitarQR.disabled = false;
          btnSolicitarQR.innerHTML = textoOriginal;
          return alert(`Erro (${res.status}): ${data.error || "Não foi possível solicitar o QR Code."}`);
        }

        if (data.request_id) {
          localStorage.setItem("qrRequestId", data.request_id);
        }

        window.location.href = "waiting.html";
      } catch (err) {
        console.error("Erro ao solicitar QR Code:", err);
        btnSolicitarQR.disabled = false;
        btnSolicitarQR.innerHTML = textoOriginal;
        alert("Erro de comunicação com o servidor.");
      }
    });
  }

  // ==============================
  // 2) TELA DE ESPERA (waiting.html)
  // ==============================
  if (isWaitingPage) {
    const statusDisplay = document.getElementById("waitingStatus");
    const requestId = localStorage.getItem("qrRequestId");
    let pollingInterval;

    async function verificarStatusQRCode() {
      try {
        const res = await fetch(`${API_BASE_URL}/gerar-qrcode`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_email,
            request_id: requestId,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          clearInterval(pollingInterval);
          if (statusDisplay) {
            statusDisplay.innerHTML = `
              <span style="color: #dc2626; font-weight: 600;">${data.error || "Solicitação expirada ou inválida."}</span><br><br>
              <a href="qrcode.html" class="inter-linktext">Fazer uma nova solicitação</a>
            `;
          }
          return;
        }

        if (data.status === "aprovado") {
          clearInterval(pollingInterval);
          if (statusDisplay) {
            statusDisplay.innerText = "Aprovado! Gerando seu crachá QR Code...";
          }

          const isVisitante = (data.userData?.type_user || "").toLowerCase() === "visitante";
          const qrId = data.qrId || crypto.randomUUID();
          const expiresAt =
            data.expiresAt ||
            (isVisitante ? new Date(Date.now() + 45 * 60000).toISOString() : null);

          const payload = {
            ...data.userData,
            qrId,
            expiresAt,
            singleUse: isVisitante,
          };

          // Garante persistência caso a API ainda não tenha salvo
          if (!data.qrId) {
            await fetch(`${API_BASE_URL}/salvar-qrcode`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({
                qrId,
                user_email: data.userData.user_email,
                expiresAt,
                singleUse: isVisitante,
              }),
            });
          }

          const qrUrl = await QRCode.toDataURL(JSON.stringify(payload), {
            width: 300,
            margin: 2,
          });

          localStorage.setItem("qrCodeUrl", qrUrl);
          localStorage.setItem("qrMessage", "Aproxime o QR Code do leitor na portaria.");
          if (expiresAt) {
            localStorage.setItem("qrExpiresAt", expiresAt);
          }
          localStorage.removeItem("qrRequestId");

          window.location.href = "viewqrcode.html";
        } else if (data.status === "negado") {
          clearInterval(pollingInterval);
          localStorage.removeItem("qrCodeUrl");
          localStorage.removeItem("qrRequestId");

          if (statusDisplay) {
            statusDisplay.innerHTML = `
              <span style="color: #dc2626; font-weight: 600;">Solicitação negada pela portaria.</span><br><br>
              <a href="qrcode.html" class="inter-linktext">Solicitar novamente</a>
            `;
          }
        } else if (data.status === "pendente") {
          if (statusDisplay) {
            statusDisplay.innerText = "Aguardando aprovação da portaria...";
          }
        }
      } catch (err) {
        console.error("Erro no polling:", err);
        if (statusDisplay) {
          statusDisplay.innerText = "Reconectando ao servidor...";
        }
      }
    }

    verificarStatusQRCode();
    pollingInterval = setInterval(verificarStatusQRCode, 4000);
  }
});