document.addEventListener('DOMContentLoaded', function () {
  const inputs = document.querySelectorAll('.code-input input');

  inputs.forEach(function (input, index) {
    input.addEventListener('input', function () {
      const value = input.value.replace(/\D/g, '');
      input.value = value;

      if (value !== '' && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' && input.value === '' && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });
});
