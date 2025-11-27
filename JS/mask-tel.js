// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function () {
  const inputUserPhone = document.getElementById("userphone"); // seleciona o input de telefone

  if (inputUserPhone) {
    // Adiciona listener para quando o usuário digitar algo
    inputUserPhone.addEventListener("input", function (e) {
      // Remove todos os caracteres que não são números
      let valor = e.target.value.replace(/\D/g, "");

      // Se não houver números, limpa o input e retorna
      if (valor.length === 0) {
        e.target.value = "";
        return;
      }

      // Limita a 11 dígitos
      if (valor.length > 11) valor = valor.slice(0, 11);

      // Formata conforme a quantidade de dígitos
      if (valor.length <= 2) {
        valor = `(${valor}`;
      } else if (valor.length <= 6) {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
      } else if (valor.length <= 10) {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6)}`;
      } else {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7, 11)}`;
      }

      // Atualiza o valor do input com a máscara
      e.target.value = valor;

      // Mantém o cursor no final do input
      e.target.setSelectionRange(valor.length, valor.length);
    });
  }
});
