document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.input-group input').forEach(input => {


    if (input.value.trim() !== '') {
      input.parentElement.classList.add('filled');
    }

    
    input.addEventListener('blur', function () {
      if (this.value.trim() !== '') {
        this.parentElement.classList.add('filled');
      } else {
        this.parentElement.classList.remove('filled');
      }
    });

  });
});
