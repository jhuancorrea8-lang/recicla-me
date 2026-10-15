(function () {
  var html = document.documentElement;
  var temaSalvo = null;

  try {
    temaSalvo = localStorage.getItem('tema');
  } catch (erro) {}

  if (!temaSalvo) {
    temaSalvo = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  html.setAttribute('data-theme', temaSalvo);

  document.addEventListener('DOMContentLoaded', function () {
    var botaoTema = document.getElementById('tema-btn');
    var botaoMenu = document.getElementById('menu-btn');
    var menuPrincipal = document.getElementById('menu-principal');
    var botaoMaisInfo = document.getElementById('botao-mais-info');
    var blocoInfo = document.getElementById('bloco-info');

    if (botaoTema) {
      function atualizarBotaoTema() {
        var escuro = html.getAttribute('data-theme') === 'dark';
        botaoTema.setAttribute('aria-pressed', escuro ? 'true' : 'false');
      }
      botaoTema.addEventListener('click', function () {
        var novoTema = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', novoTema);
        try { localStorage.setItem('tema', novoTema); } catch (erro) {}
        atualizarBotaoTema();
      });
      atualizarBotaoTema();
    }

    if (botaoMenu && menuPrincipal) {
      function fecharMenu() {
        menuPrincipal.classList.remove('aberto');
        botaoMenu.setAttribute('aria-expanded', 'false');
        botaoMenu.setAttribute('aria-label', 'Abrir menu');
      }

      botaoMenu.addEventListener('click', function () {
        var aberto = menuPrincipal.classList.toggle('aberto');
        botaoMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
        botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      });

      menuPrincipal.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', fecharMenu);
      });

      document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape' && menuPrincipal.classList.contains('aberto')) {
          fecharMenu();
          botaoMenu.focus();
        }
      });
    }

    if (botaoMaisInfo && blocoInfo) {
      botaoMaisInfo.addEventListener('click', function () {
        var escondido = blocoInfo.classList.toggle('escondido');
        botaoMaisInfo.setAttribute('aria-expanded', escondido ? 'false' : 'true');
      });
    }

    [
      { id: 'imagem-card', src: 'imagens/saco-lixo-comum.webp' },
      { id: 'imagem-reciclavel', src: 'imagens/lixoreciclavel.jpg' },
      { id: 'imagem-entulho', src: 'imagens/entulho.jpg' }
    ].forEach(function (configuracao) {
      new Image().src = configuracao.src;
      var imagem = document.getElementById(configuracao.id);
      if (!imagem) return;
      var srcOriginal = imagem.getAttribute('src');
      function mostrarImagemAlternativa() {
        imagem.setAttribute('src', configuracao.src);
      }
      function restaurarImagemOriginal() {
        imagem.setAttribute('src', srcOriginal);
      }
      imagem.addEventListener('mouseenter', mostrarImagemAlternativa);
      imagem.addEventListener('mouseleave', restaurarImagemOriginal);
      imagem.addEventListener('focus', mostrarImagemAlternativa);
      imagem.addEventListener('blur', restaurarImagemOriginal);
    });
  });
})();