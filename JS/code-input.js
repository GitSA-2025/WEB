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

    input.addEventListener('paste', function (e) {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData)
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, inputs.length);

      pasted.split('').forEach((char, i) => {
        if (inputs[i]) inputs[i].value = char;
      });

      const nextIndex = Math.min(pasted.length, inputs.length - 1);
      if (inputs[nextIndex]) inputs[nextIndex].focus();
    });
  });
});