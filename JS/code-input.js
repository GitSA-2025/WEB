// Aguarda o carregamento completo do DOM antes de executar
document.addEventListener('DOMContentLoaded', function () {
  // Seleciona todos os inputs dentro do container .code-input
  const inputs = document.querySelectorAll('.code-input input');

  // Para cada input, adiciona listeners
  inputs.forEach(function (input, index) {

    // Evento input: dispara sempre que o valor do input muda
    input.addEventListener('input', function () {
      // Remove qualquer caractere que não seja número
      const value = input.value.replace(/\D/g, '');
      input.value = value;

      // Se o input não estiver vazio e não for o último, foca no próximo input
      if (value !== '' && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    // Evento keydown: captura quando o usuário pressiona uma tecla
    input.addEventListener('keydown', function (e) {
      // Se a tecla for Backspace e o input estiver vazio, foca no input anterior
      if (e.key === 'Backspace' && input.value === '' && index > 0) {
        inputs[index - 1].focus();
      }
    });

  });
});
