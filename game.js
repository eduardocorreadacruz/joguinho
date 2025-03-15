const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// Configurações da sprite sheet
const spriteSheet = new Image();
spriteSheet.src = 'img/hero.png'; // Caminho para a sprite sheet
const spriteWidth = 48; // Largura de cada sprite
const spriteHeight = 48; // Altura de cada sprite
const totalFrames = 4; // Total de frames por animação
// Configurações do jogador
const player = {
  x: 0,
  y: 0,
  width: spriteWidth,
  height: spriteHeight,
  direction: 'front', // Direção inicial
  frameIndex: 0, // Frame atual da animação
  animationSpeed: 200, // Tempo entre cada frame (em milissegundos)
  lastUpdate: Date.now(),
  isMoving: false // Indica se o jogador está se movendo
};
// Mapeamento das direções para as colunas da sprite sheet
const directionMap = {
  front: 0, // Andando para baixo (linha 0)
  back: 2, // Andando para cima (linha 1)
  left: 3, // Andando para a esquerda (linha 2)
  right: 1 // Andando para a direita (linha 3)
};
// Estados do jogo
let gameState = 'menu'; // Pode ser 'menu', 'playing', ou 'instructions'
const menuOptions = ['Iniciar Jogo', 'Instruções'];
let selectedOption = 0; // Índice da opção selecionada
// Função para desenhar o menu
function drawMenu() {
  // Fundo do menu
  ctx.fillStyle = '#c0d5b9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Título do menu
  ctx.fillStyle = '#000';
  ctx.font = '16px "Press Start 2P", cursive';
  ctx.textAlign = 'center';
  ctx.fillText('Jogo Game Boy', canvas.width / 2, 50);
  // Opções do menu
  menuOptions.forEach((option, index) => {
    if (index === selectedOption) {
      ctx.fillStyle = '#FF3D8C'; // Cor da opção selecionada
    } else {
      ctx.fillStyle = '#000'; // Cor das outras opções
    }
    ctx.fillText(option, canvas.width / 2, 100 + index * 30);
  });
}
// Função para desenhar as instruções
function drawInstructions() {
  ctx.fillStyle = '#c0d5b9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';
  ctx.font = '12px "Press Start 2P", cursive';
  ctx.textAlign = 'center';
  ctx.fillText('Instruções', canvas.width / 2, 50);
  ctx.fillText('Use o D-Pad para mover', canvas.width / 2, 80);
  ctx.fillText('Botão A: Ação 1', canvas.width / 2, 110);
  ctx.fillText('Botão B: Ação 2', canvas.width / 2, 140);
  ctx.fillText('Pressione B para voltar', canvas.width / 2, 180);
}
// Função para desenhar a grade
function drawGrid() {
  const gridSize = 8; // Tamanho de cada célula da grade
  ctx.strokeStyle = '#ccc'; // Cor da grade
  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}
// Função para desenhar o jogador
function drawPlayer(x, y) {
  const frameX = directionMap[player.direction] * spriteWidth; // Linha
  const frameY = player.frameIndex * spriteHeight; // Coluna
  ctx.drawImage(spriteSheet, frameX, frameY, spriteWidth, spriteHeight, x, y, player.width, player.height);
}
// Função para atualizar a animação
function updateAnimation() {
  const now = Date.now();
  const delta = now - player.lastUpdate;
  if (player.isMoving && delta > player.animationSpeed) {
    player.frameIndex = (player.frameIndex + 1) % totalFrames;
    player.lastUpdate = now;
  } else if (!player.isMoving) {
    player.frameIndex = 0; // Reseta para o primeiro frame quando parado
  }
}
// Função para atualizar a posição do jogador
function updatePosition() {
  const speed = 3;
  if (player.isMoving) {
    switch (player.direction) {
      case 'front':
        player.y -= speed; // Invertido: 'front' move para cima
        break;
      case 'back':
        player.y += speed; // Invertido: 'back' move para baixo
        break;
      case 'left':
        player.x -= speed;
        break;
      case 'right':
        player.x += speed;
        break;
    }
  }
}
// Função principal do jogo
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
  if (gameState === 'menu') {
    drawMenu(); // Desenha o menu
  } else if (gameState === 'instructions') {
    drawInstructions(); // Desenha as instruções
  } else if (gameState === 'playing') {
    // Lógica do jogo principal
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Preenche o fundo
    drawGrid(); // Desenha a grade
    updatePosition(); // Atualiza a posição do jogador
    updateAnimation(); // Atualiza a animação
    // Ajuste a posição do jogador para centralizar a câmera
    const cameraX = player.x - canvas.width / 2;
    const cameraY = player.y - canvas.height / 2;
    // Limpe o canvas considerando a posição da câmera
    ctx.clearRect(cameraX, cameraY, canvas.width, canvas.height);
    // Desenhe o jogador na posição central da câmera
    drawPlayer(canvas.width / 2, canvas.height / 2);
  }
  requestAnimationFrame(gameLoop); // Repete o loop
}
// Inicia o jogo quando a sprite sheet é carregada
spriteSheet.onload = () => {
  console.log("Sprite sheet carregada com sucesso!");
  gameLoop(); // Inicia a animação
};
// Controles de teclado para navegar no menu
document.addEventListener('keydown', (e) => {
  if (gameState === 'menu') {
    if (e.key === 'ArrowUp') {
      selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
    } else if (e.key === 'ArrowDown') {
      selectedOption = (selectedOption + 1) % menuOptions.length;
    }
  }
});
// Eventos dos botões A e B
document.querySelector('.a').addEventListener('click', () => {
  if (gameState === 'menu') {
    if (selectedOption === 0) {
      gameState = 'playing'; // Iniciar jogo
    } else if (selectedOption === 1) {
      gameState = 'instructions'; // Mostrar instruções
    }
  }
});
document.querySelector('.b').addEventListener('click', () => {
  if (gameState === 'instructions') {
    gameState = 'menu'; // Voltar ao menu
  }
});
// Controles de teclado para mover o jogador
document.addEventListener('keydown', (e) => {
  if (gameState === 'playing' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    player.isMoving = true;
    switch (e.key) {
      case 'ArrowUp':
        player.direction = 'back'; // Invertido: Seta para cima = 'front'
        break;
      case 'ArrowDown':
        player.direction = 'front'; // Invertido: Seta para baixo = 'back'
        break;
      case 'ArrowLeft':
        player.direction = 'right';
        break;
      case 'ArrowRight':
        player.direction = 'left';
        break;
    }
  }
});
// Para a animação quando nenhuma tecla de movimento está pressionada
document.addEventListener('keyup', (e) => {
  if (gameState === 'playing' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    player.isMoving = false; // Para o movimento
    player.frameIndex = 0; // Reseta para o primeiro frame quando parado
  }
});
// Função para mover o jogador
function movePlayer(direction) {
  if (gameState === 'playing') {
    player.isMoving = true;
    player.direction = direction;
  } else if (gameState === 'menu') {
    if (direction === 'up') {
      selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
    } else if (direction === 'down') {
      selectedOption = (selectedOption + 1) % menuOptions.length;
    }
  }
}
// Função para parar o movimento do jogador
function stopPlayer() {
  if (gameState === 'playing') {
    player.isMoving = false;
    player.frameIndex = 0;
  }
}
// Adicionando eventos de clique para os botões do D-Pad
const dPadButtons = {
  up: document.querySelector('.up'),
  down: document.querySelector('.down'),
  left: document.querySelector('.right'),
  right: document.querySelector('.left')
};
dPadButtons.up.addEventListener('mousedown', () => movePlayer('back'));
dPadButtons.down.addEventListener('mousedown', () => movePlayer('front'));
dPadButtons.left.addEventListener('mousedown', () => movePlayer('left'));
dPadButtons.right.addEventListener('mousedown', () => movePlayer('right'));
dPadButtons.up.addEventListener('mouseup', stopPlayer);
dPadButtons.down.addEventListener('mouseup', stopPlayer);
dPadButtons.left.addEventListener('mouseup', stopPlayer);
dPadButtons.right.addEventListener('mouseup', stopPlayer);
// Adicionando eventos de toque para dispositivos móveis
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 30;
dPadButtons.up.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  movePlayer('back');
});
dPadButtons.down.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  movePlayer('front');
});
dPadButtons.left.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  movePlayer('left');
});
dPadButtons.right.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  movePlayer('right');
});
dPadButtons.up.addEventListener('touchmove', (e) => handleSwipe(e, 'back'));
dPadButtons.down.addEventListener('touchmove', (e) => handleSwipe(e, 'front'));
dPadButtons.left.addEventListener('touchmove', (e) => handleSwipe(e, 'left'));
dPadButtons.right.addEventListener('touchmove', (e) => handleSwipe(e, 'right'));

function handleSwipe(e, currentDirection) {
  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;
  const deltaX = touchX - touchStartX;
  const deltaY = touchY - touchStartY;
  if (Math.abs(deltaX) > SWIPE_THRESHOLD || Math.abs(deltaY) > SWIPE_THRESHOLD) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && currentDirection !== 'right') {
        movePlayer('right');
      } else if (deltaX < 0 && currentDirection !== 'left') {
        movePlayer('left');
      }
    } else {
      if (deltaY > 0 && currentDirection !== 'down') {
        movePlayer('front');
      } else if (deltaY < 0 && currentDirection !== 'up') {
        movePlayer('back');
      }
    }
    touchStartX = touchX;
    touchStartY = touchY;
  }
}
dPadButtons.up.addEventListener('touchend', stopPlayer);
dPadButtons.down.addEventListener('touchend', stopPlayer);
dPadButtons.left.addEventListener('touchend', stopPlayer);
dPadButtons.right.addEventListener('touchend', stopPlayer);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gameState === 'menu') {
    drawMenu();
  } else if (gameState === 'instructions') {
    drawInstructions();
  } else if (gameState === 'playing') {
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    updatePosition();
    updateAnimation();
    // Centraliza a câmera no jogador
    const cameraX = player.x - canvas.width / 2 + player.width / 2;
    const cameraY = player.y - canvas.height / 2 + player.height / 2;
    // Limpa o canvas considerando a posição da câmera
    ctx.clearRect(cameraX, cameraY, canvas.width, canvas.height);
    // Desenha o jogador no centro do canvas
    drawPlayer(canvas.width / 2, canvas.height / 2);
  }
  requestAnimationFrame(gameLoop);
}