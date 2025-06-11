document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const items = Array.from(document.querySelectorAll('.carousel-item'));
  const btnPrev = document.querySelector('.carousel-btn.prev');
  const btnNext = document.querySelector('.carousel-btn.next');
  const indicatorsContainer = document.querySelector('.carousel-indicators');

  let currentIndex = 0;
  const itemWidth = items[0].offsetWidth + 20;

  
  items.forEach((_, idx) => {
    const btn = document.createElement('button');
    if (idx === 0) btn.classList.add('active');
    btn.addEventListener('click', () => {
      currentIndex = idx;
      updateCarousel();
      resetAutoplay();
    });
    indicatorsContainer.appendChild(btn);
  });

  const indicators = Array.from(indicatorsContainer.children);

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    indicators.forEach(btn => btn.classList.remove('active'));
    indicators[currentIndex].classList.add('active');
  }

  btnNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
    resetAutoplay();
  });

  btnPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
    resetAutoplay();
  });

  
  let autoplayInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  }, 4000);

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % items.length;
      updateCarousel();
    }, 4000);
  }

  
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      
      faqItems.forEach(i => {
        i.classList.remove("active");
        i.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        i.querySelector(".faq-answer").setAttribute("hidden", "");
      });

      if (!isActive) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
        answer.removeAttribute("hidden");
      }
    });
  });
});
let produtos = []; 

async function carregarProdutos() {
  try {
    const response = await fetch('produtos.json'); 
    if (!response.ok) throw new Error('Erro ao carregar produtos.json');
    produtos = await response.json();
    mostrarProdutos();
  } catch (error) {
    alert('Erro ao carregar produtos: ' + error.message);
  }
}

function mostrarProdutos() {
  const container = document.getElementById('produtos-container');
  container.innerHTML = '';

  produtos.forEach(produto => {
    const produtoDiv = document.createElement('div');
    produtoDiv.classList.add('produto');

    produtoDiv.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" />
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
      <button class="btn-add" data-id="${produto.id}">Adicionar ao carrinho</button>
    `;

    container.appendChild(produtoDiv);
  });

  const botoesAdd = document.querySelectorAll('.btn-add');
  botoesAdd.forEach(btn => {
    btn.addEventListener('click', () => {
      const idProduto = Number(btn.getAttribute('data-id'));
      adicionarAoCarrinho(idProduto);
    });
  });
}

function pegarCarrinho() {
  const carrinhoJSON = localStorage.getItem('carrinho');
  return carrinhoJSON ? JSON.parse(carrinhoJSON) : [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function adicionarAoCarrinho(produtoId) {
  let carrinho = pegarCarrinho();

  const item = carrinho.find(i => i.id === produtoId);
  if (item) {
    item.quantidade++;
  } else {
    carrinho.push({ id: produtoId, quantidade: 1 });
  }

  salvarCarrinho(carrinho);
  alert('Produto adicionado ao carrinho!');
}

window.onload = carregarProdutos;


