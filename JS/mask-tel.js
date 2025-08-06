document.addEventListener('DOMContentLoaded', function () {
  const inputUserPhone = document.getElementById("userphone");

  if (inputUserPhone) {
    inputUserPhone.addEventListener("input", function (e) {
      let valor = e.target.value.replace(/\D/g, "");

      if (valor.length === 0) {
        e.target.value = "";
        return;
      }

      if (valor.length > 11) valor = valor.slice(0, 11);

      if (valor.length <= 2) {
        valor = `(${valor}`;
      } else if (valor.length <= 6) {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
      } else if (valor.length <= 10) {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6)}`;
      } else {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7, 11)}`;
      }

      e.target.value = valor;
      e.target.setSelectionRange(valor.length, valor.length);
    });
  }
});
