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

// Função para desenhar uma parede
function drawWall(x, y, width, height) {
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, width, height);
}

// Desenhar paredes ao redor do canvas
function drawWalls() {
    // Parede superior
    drawWall(0, 0, canvas.width, 1);
    // Parede inferior
    drawWall(0, canvas.height - 1, canvas.width, 1);
    // Parede esquerda
    drawWall(0, 0, 10, canvas.height);
    // Parede direita
    drawWall(canvas.width - 10, 0, 10, canvas.height);
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

    if (gameState === 'menu') {
        drawMenu(); // Desenha o menu
    } else if (gameState === 'instructions') {
        drawInstructions(); // Desenha as instruções
    } else if (gameState === 'playing') {
        // Lógica do jogo principal
        ctx.fillStyle = "lightgray";  
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Preenche o fundo  

        drawGrid(); // Desenha a grade
        drawWalls(); // Desenha as paredes
        updatePosition(); // Atualiza a posição do jogador  
        updateAnimation(); // Atualiza a animação  
        drawPlayer(); // Desenha o jogador  
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
    if (gameState === 'playing' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {  
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

// Função para navegar no menu com as setas do D-Pad
function navigateMenu(direction) {
    if (gameState === 'menu') {
        if (direction === 'up') {
            selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
        } else if (direction === 'down') {
            selectedOption = (selectedOption + 1) % menuOptions.length;
        }
    }
}

// Adicionando eventos de clique para os botões do D-Pad
document.querySelector('.up').addEventListener('mousedown', () => {
    if (gameState === 'menu') {
        navigateMenu('up'); // Navega para cima no menu
    } else if (gameState === 'playing') {
        movePlayer('back'); // Move o jogador para cima no jogo
    }
});

document.querySelector('.down').addEventListener('mousedown', () => {
    if (gameState === 'menu') {
        navigateMenu('down'); // Navega para baixo no menu
    } else if (gameState === 'playing') {
        movePlayer('front'); // Move o jogador para baixo no jogo
    }
});

document.querySelector('.left').addEventListener('mousedown', () => {
    if (gameState === 'playing') {
        movePlayer('left'); // Move o jogador para a esquerda no jogo
    }
});

document.querySelector('.right').addEventListener('mousedown', () => {
    if (gameState === 'playing') {
        movePlayer('right'); // Move o jogador para a direita no jogo
    }
});

// Adicionando eventos de soltar para os botões do D-Pad
document.querySelector('.up').addEventListener('mouseup', stopPlayer);
document.querySelector('.down').addEventListener('mouseup', stopPlayer);
document.querySelector('.left').addEventListener('mouseup', stopPlayer);
document.querySelector('.right').addEventListener('mouseup', stopPlayer);

// Adicionando eventos de toque para dispositivos móveis
document.querySelector('.up').addEventListener('touchstart', () => {
    if (gameState === 'menu') {
        navigateMenu('up'); // Navega para cima no menu
    } else if (gameState === 'playing') {
        movePlayer('back'); // Move o jogador para cima no jogo
    }
});

document.querySelector('.down').addEventListener('touchstart', () => {
    if (gameState === 'menu') {
        navigateMenu('down'); // Navega para baixo no menu
    } else if (gameState === 'playing') {
        movePlayer('front'); // Move o jogador para baixo no jogo
    }
});

document.querySelector('.left').addEventListener('touchstart', () => {
    if (gameState === 'playing') {
        movePlayer('left'); // Move o jogador para a esquerda no jogo
    }
});

document.querySelector('.right').addEventListener('touchstart', () => {
    if (gameState === 'playing') {
        movePlayer('right'); // Move o jogador para a direita no jogo
    }
});

document.querySelector('.up').addEventListener('touchend', stopPlayer);
document.querySelector('.down').addEventListener('touchend', stopPlayer);
document.querySelector('.left').addEventListener('touchend', stopPlayer);
document.querySelector('.right').addEventListener('touchend', stopPlayer);