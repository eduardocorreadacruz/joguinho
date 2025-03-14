// Selecionando o canvas e obtendo o contexto  
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
    x: 50,  
    y: 50,  
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
    back: 2,  // Andando para cima (linha 1)  
    left: 1,  // Andando para a esquerda (linha 2)  
    right: 3  // Andando para a direita (linha 3)  
};  

// Função para desenhar uma parede
function drawWall(x, y, width, height) {
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, width, height);
}

// Desenhar paredes ao redor do canvas
function drawWalls() {
    // Parede superior
    drawWall(0, 0, canvas.width, 10);
    // Parede inferior
    drawWall(0, canvas.height - 10, canvas.width, 10);
    // Parede esquerda
    drawWall(0, 0, 10, canvas.height);
    // Parede direita
    drawWall(canvas.width - 10, 0, 10, canvas.height);
}

// Função para desenhar a grade
function drawGrid() {
    const gridSize = 16; // Tamanho de cada célula da grade
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
function drawPlayer() {  
    const frameX = directionMap[player.direction] * spriteWidth; // Linha  
    const frameY = player.frameIndex * spriteHeight; // Coluna  

    ctx.drawImage(spriteSheet, frameX, frameY, spriteWidth, spriteHeight, player.x, player.y, player.width, player.height);  
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
                if (player.y + player.height + speed <= canvas.height - 10) {
                    player.y += speed;  
                }
                break;  
            case 'back':  
                if (player.y - speed >= 10) {
                    player.y -= speed;  
                }
                break;  
            case 'left':  
                if (player.x - speed >= 10) {
                    player.x -= speed;  
                }
                break;  
            case 'right':  
                if (player.x + player.width + speed <= canvas.width - 10) {
                    player.x += speed;  
                }
                break;  
        }  
    }  
}  

// Função principal do jogo  
function gameLoop() {  
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas  

    // Cor de fundo  
    ctx.fillStyle = "lightgray";  
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Preenche o fundo  

    drawGrid(); // Desenha a grade
    drawWalls(); // Desenha as paredes
    updatePosition(); // Atualiza a posição do jogador  
    updateAnimation(); // Atualiza a animação  
    drawPlayer(); // Desenha o jogador  

    requestAnimationFrame(gameLoop); // Repete o loop  
}  

// Inicia o jogo quando a sprite sheet é carregada  
spriteSheet.onload = () => {  
    console.log("Sprite sheet carregada com sucesso!");  
    gameLoop(); // Inicia a animação  
};  

// Controles de teclado para mudar a direção e movimento do jogador  
document.addEventListener('keydown', (e) => {  
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {  
        player.isMoving = true; // O jogador está se movendo  

        switch (e.key) {  
            case 'ArrowUp':  
                player.direction = 'back'; // Mover para cima  
                break;  
            case 'ArrowDown':  
                player.direction = 'front'; // Mover para baixo  
                break;  
            case 'ArrowLeft':  
                player.direction = 'left'; // Mover para a esquerda  
                break;  
            case 'ArrowRight':  
                player.direction = 'right'; // Mover para a direita  
                break;  
        }  
    }  
});  

// Para a animação quando nenhuma tecla de movimento está pressionada  
document.addEventListener('keyup', (e) => {  
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {  
        player.isMoving = false; // Para o movimento  
        player.frameIndex = 0; // Reseta para o primeiro frame quando parado  
    }  
});  

// Funções de movimento para botões do D-Pad  
function movePlayer(direction) {  
    player.isMoving = true; // O jogador está se movendo  
    player.direction = direction;  

    updatePosition();  
    updateAnimation();  
    drawPlayer();  
}  

// Função para parar o movimento do jogador
function stopPlayer() {
    player.isMoving = false; // Para o movimento
    player.frameIndex = 0; // Reseta para o primeiro frame quando parado
}

// Adicionando eventos de clique para os botões do D-Pad
document.querySelector('.up').addEventListener('mousedown', () => movePlayer('back'));
document.querySelector('.down').addEventListener('mousedown', () => movePlayer('front'));
document.querySelector('.left').addEventListener('mousedown', () => movePlayer('left'));
document.querySelector('.right').addEventListener('mousedown', () => movePlayer('right'));

// Adicionando eventos de soltar para os botões do D-Pad
document.querySelector('.up').addEventListener('mouseup', stopPlayer);
document.querySelector('.down').addEventListener('mouseup', stopPlayer);
document.querySelector('.left').addEventListener('mouseup', stopPlayer);
document.querySelector('.right').addEventListener('mouseup', stopPlayer);

// Adicionando eventos de toque para dispositivos móveis
document.querySelector('.up').addEventListener('touchstart', () => movePlayer('back'));
document.querySelector('.down').addEventListener('touchstart', () => movePlayer('front'));
document.querySelector('.left').addEventListener('touchstart', () => movePlayer('left'));
document.querySelector('.right').addEventListener('touchstart', () => movePlayer('right'));

document.querySelector('.up').addEventListener('touchend', stopPlayer);
document.querySelector('.down').addEventListener('touchend', stopPlayer);
document.querySelector('.left').addEventListener('touchend', stopPlayer);
document.querySelector('.right').addEventListener('touchend', stopPlayer);