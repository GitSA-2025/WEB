document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.input-group input').forEach(input => {

    // preenche o label se já tiver valor
    if (input.value.trim() !== '') {
      input.parentElement.classList.add('filled');
    }

    input.addEventListener('blur', function () {
      if (this.value.trim() !== '') {
        this.parentElement.classList.add('filled');
      } else {
        this.parentElement.classList.remove('filled');
      }
      validarCampo(this);
    });

    input.addEventListener('input', function () {
      const tipo = this.dataset.type;

      if (tipo === 'cpf') {
        this.value = maskCPF(this.value);
      }

      if (tipo === 'telefone') {
        this.value = maskTelefone(this.value);
      }

      if (tipo === 'placa') {
        this.value = maskPlaca(this.value);
      }

      validarCampo(this);
    });

  });
});

/* ===== MÁSCARAS ===== */

function maskCPF(valor) {
  valor = valor.replace(/\D/g, '').slice(0, 11);

  if (valor.length >= 3)
    valor = valor.replace(/^(\d{3})(\d)/, '$1.$2');
  if (valor.length >= 6)
    valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  if (valor.length >= 9)
    valor = valor.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{0,2})$/, '$1.$2.$3-$4');

  return valor;
}

function maskTelefone(valor) {
  valor = valor.replace(/\D/g, '').slice(0, 11);

  if (valor.length >= 11) {
    return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (valor.length >= 6) {
    return valor.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
  } else if (valor.length >= 3) {
    return valor.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
  } else {
    return valor;
  }
}

function maskPlaca(valor) {
  valor = valor.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);

  if (valor.length > 3) {
    return `${valor.slice(0, 3)}-${valor.slice(3)}`;
  }

  return valor;
}

/* ===== VALIDAÇÕES ===== */

function validarCampo(input) {
  const tipo = input.dataset.type;
  const valor = input.value;

  let valido = true;
  let mensagem = '';

  if (tipo === 'cpf') {
    válido = validarCPF(valor);
    if (!valido) mensagem = 'CPF inválido';
  }

  if (tipo === 'telefone') {
    valido = validarTelefone(valor);
    if (!valido) mensagem = 'Telefone inválido';
  }

  if (tipo === 'placa') {
    valido = validarPlaca(valor);
    if (!valido) mensagem = 'Placa inválida';
  }

  mostrarErro(input, valido, mensagem);
}

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;

  return resto === parseInt(cpf.charAt(10));
}

function validarTelefone(tel) {
  tel = tel.replace(/\D/g, '');
  return tel.length === 10 || tel.length === 11;
}

function validarPlaca(placa) {
  placa = placa.replace(/[^A-Z0-9]/g, '').toUpperCase();

  const padraoAntigo = /^[A-Z]{3}[0-9]{4}$/;
  const padraoMercosul = /^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/;

  return padraoAntigo.test(placa) || padraoMercosul.test(placa);
}

/* ===== ERRO VISUAL ===== */

function mostrarErro(input, valido, mensagem) {
  let error = input.parentElement.querySelector('.error-text');

  if (!valido) {
    if (!error) {
      error = document.createElement('small');
      error.classList.add('error-text');
      input.parentElement.appendChild(error);
    }
    error.innerText = mensagem;
    input.style.borderColor = 'red';
  } else {
    if (error) error.remove();
    input.style.borderColor = '#27445B';
  }
}

const checkboxVeiculo = document.getElementById('temVeiculo');
const placaGroup = document.getElementById('placaGroup');

if (checkboxVeiculo && placaGroup) {
  checkboxVeiculo.addEventListener('change', function () {
    if (this.checked) {
      placaGroup.style.display = 'block';
    } else {
      placaGroup.style.display = 'none';

      // limpa o campo ao desmarcar
      const inputPlaca = placaGroup.querySelector('input');
      if (inputPlaca) {
        inputPlaca.value = '';
        placaGroup.classList.remove('filled');
      }
    }
  });
}
