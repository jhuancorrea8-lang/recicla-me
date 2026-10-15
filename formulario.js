(function () {
  var formulario = document.querySelector('.form-cadastro');
  if (!formulario) return;

  var mensagemSucesso = document.getElementById('mensagem-sucesso');
  var campos = [
    {
      campo: document.getElementById('nome'),
      mensagem: document.getElementById('erro-nome'),
      validar: function (valor) {
        return valor.trim().split(/\s+/).filter(Boolean).length >= 2 ? '' : 'Informe nome e sobrenome.';
      }
    },
    {
      campo: document.getElementById('whatsapp'),
      mensagem: document.getElementById('erro-whatsapp'),
      validar: function (valor) {
        var digitos = valor.replace(/\D/g, '');
        return digitos.length === 10 || digitos.length === 11 ? '' : 'Informe o WhatsApp com DDD, como (47) 99999-9999.';
      }
    },
    {
      campo: document.getElementById('bairro'),
      mensagem: document.getElementById('erro-bairro'),
      validar: function (valor) { return valor.trim() ? '' : 'Informe seu bairro.'; }
    },
    {
      campo: document.getElementById('autorizo'),
      mensagem: document.getElementById('erro-autorizo'),
      validar: function (valor, campo) {
        return campo.checked ? '' : 'É necessário autorizar o envio de avisos por WhatsApp.';
      }
    }
  ];

  function formatarWhatsapp(valor) {
    var digitos = valor.replace(/\D/g, '').slice(0, 11);
    if (digitos.length < 3) return digitos ? '(' + digitos : '';

    var ddd = digitos.slice(0, 2);
    var numero = digitos.slice(2);
    if (numero.length <= 4) return '(' + ddd + ') ' + numero;

    var tamanhoPrefixo = digitos.length === 11 ? 5 : 4;
    return '(' + ddd + ') ' + numero.slice(0, tamanhoPrefixo) + '-' + numero.slice(tamanhoPrefixo);
  }

  function validarCampo(item) {
    var valor = item.campo.type === 'checkbox' ? '' : item.campo.value;
    var erro = item.validar(valor, item.campo);
    item.mensagem.textContent = erro;
    item.campo.classList.toggle('campo-invalido', Boolean(erro));
    item.campo.setAttribute('aria-invalid', erro ? 'true' : 'false');
    return !erro;
  }

  function limparMensagemSucesso() {
    mensagemSucesso.textContent = '';
    mensagemSucesso.className = 'mensagem';
  }

  campos.forEach(function (item) {
    if (item.campo.type === 'checkbox') {
      item.campo.addEventListener('change', function () {
        validarCampo(item);
        limparMensagemSucesso();
      });
      return;
    }

    item.campo.addEventListener('blur', function () {
      validarCampo(item);
    });
    item.campo.addEventListener('input', function () {
      if (item.campo.id === 'whatsapp') {
        item.campo.value = formatarWhatsapp(item.campo.value);
      }
      if (item.campo.getAttribute('aria-invalid') === 'true') {
        validarCampo(item);
      }
      limparMensagemSucesso();
    });
  });

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    var formularioValido = campos.reduce(function (valido, item) {
      return validarCampo(item) && valido;
    }, true);
    mensagemSucesso.textContent = '';
    mensagemSucesso.className = 'mensagem';
    if (!formularioValido) {
      mensagemSucesso.textContent = 'Revise os campos indicados para ativar os alertas.';
      mensagemSucesso.classList.add('erro');
      var primeiroInvalido = formulario.querySelector('.campo-invalido');
      if (primeiroInvalido) primeiroInvalido.focus();
      return;
    }
    // O formulário não envia dados a um serviço; esta confirmação é simulada.
    mensagemSucesso.textContent = 'Cadastro simulado com sucesso! Você receberá avisos antes da coleta.';
    mensagemSucesso.classList.add('sucesso');
    formulario.reset();
    campos.forEach(function (item) {
      item.mensagem.textContent = '';
      item.campo.classList.remove('campo-invalido');
      item.campo.removeAttribute('aria-invalid');
    });
  });
})();