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

    /* ---------- Modo escuro ---------- */
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

    /* ---------- Menu mobile ---------- */
    if (botaoMenu && menuPrincipal) {
      function fecharMenu() {
        menuPrincipal.classList.remove('aberto');
        botaoMenu.setAttribute('aria-expanded', 'false');
      }

      botaoMenu.addEventListener('click', function () {
        var aberto = menuPrincipal.classList.toggle('aberto');
        botaoMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
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

      window.matchMedia('(min-width: 768px)').addEventListener('change', function (evento) {
        if (evento.matches) fecharMenu();
      });
    }

    /* ---------- Ver mais informações ---------- */
    if (botaoMaisInfo && blocoInfo) {
      botaoMaisInfo.addEventListener('click', function () {
        var escondido = blocoInfo.classList.toggle('escondido');
        botaoMaisInfo.setAttribute('aria-expanded', escondido ? 'false' : 'true');
      });
    }

    /* ---------- Troca de imagem (página Coleta) ---------- */
    [
      { id: 'imagem-card', src: 'imagens/lixo_comum.png' },
      { id: 'imagem-reciclavel', src: 'imagens/lixo_reciclavel.png' },
      { id: 'imagem-entulho', src: 'imagens/entulho.jpg' }
    ].forEach(function (configuracao) {
      var imagem = document.getElementById(configuracao.id);
      if (!imagem) return;

      var srcOriginal = imagem.getAttribute('src');
      var alternativaCarregou = true;

      function mostrarImagemAlternativa() {
        if (alternativaCarregou) imagem.setAttribute('src', configuracao.src);
      }
      function restaurarImagemOriginal() {
        imagem.setAttribute('src', srcOriginal);
      }

      imagem.addEventListener('error', function () {
        if (imagem.getAttribute('src') === configuracao.src) {
          alternativaCarregou = false;
          imagem.setAttribute('src', srcOriginal);
        }
      });

      imagem.addEventListener('mouseenter', mostrarImagemAlternativa);
      imagem.addEventListener('mouseleave', restaurarImagemOriginal);
      imagem.addEventListener('focus', mostrarImagemAlternativa);
      imagem.addEventListener('blur', restaurarImagemOriginal);
    });

    /* ---------- Vídeos: carrega só ao clicar (página Sobre) ---------- */
    document.querySelectorAll('.video-embed[data-video-id]').forEach(function (caixa) {
      var botao = caixa.querySelector('.video-botao');
      if (!botao) return;
      botao.addEventListener('click', function () {
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + caixa.getAttribute('data-video-id') + '?autoplay=1';
        iframe.title = caixa.getAttribute('data-titulo');
        iframe.allow = 'autoplay; encrypted-media; fullscreen';
        iframe.allowFullscreen = true;
        caixa.replaceChildren(iframe);
        iframe.focus();
      });
    });
  });
})();