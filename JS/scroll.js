// Seleciona todos os inputs da página
const inputs = document.querySelectorAll('input');

// Para cada input, adiciona um listener de foco
inputs.forEach(input => {
  input.addEventListener('focus', () => {
    // Delay de 300ms antes de rolar a tela (útil para dispositivos móveis com teclado virtual)
    setTimeout(() => {
      // Rola suavemente o input para o centro da tela
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  });
});
