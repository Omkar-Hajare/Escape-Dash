import { useEffect, useRef, useState } from 'react';
import { initializeSprites } from '../utils/sprites';
import { DIFFICULTY_SETTINGS } from '../utils/gameConfig';

const GameCanvas = ({ difficulty, onScoreUpdate, onTimeUpdate, onCoinCollect, onGameOver }) => {
  const canvasRef = useRef(null);
 const gameStateRef = useRef({
  gameRunning: false,
  score: 0,
  coinsCollected: 0,  // ✅ ADD THIS
  gameSpeed: 2,
  roadOffset: 0,
  backgroundElements: [],
  player: {},
  obstacles: [],
  coins: [],
  particles: [],
  lanes: [],
  lastObstacleTime: 0,
  minObstacleGap: 100,
  lastObstacleLanes: [],
  keys: {},
  startTime: Date.now(),
  sprites: {}
});

  // Game Classes
  class BackgroundElement {
    constructor(type, side, canvas) {
      this.type = type;
      this.x = side === 'left' ? Math.random() * 200 : canvas.width - 250 + Math.random() * 150;
      this.y = -90;
      this.speed = gameStateRef.current.gameSpeed * 0.4;
    }

    update() {
      this.y += this.speed;
      this.speed = gameStateRef.current.gameSpeed * 0.4;
    }

    draw(ctx) {
      const sprites = gameStateRef.current.sprites;
      if (sprites[this.type]) {
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.drawImage(sprites[this.type], this.x, this.y, 60, 60);
        ctx.restore();
      }
    }
  }

  class Obstacle {
    constructor(forcedLane = -1) {
      const lanes = gameStateRef.current.lanes;
      if (forcedLane >= 0) {
        this.lane = forcedLane;
      } else {
        this.lane = Math.floor(Math.random() * 3);
      }
      this.x = lanes[this.lane] - 30;
      this.y = -75;
      this.width = 60;
      this.height = 60;
    }

    update() {
      this.y += gameStateRef.current.gameSpeed;
    }

    draw(ctx) {
      const sprites = gameStateRef.current.sprites;
      if (sprites['obstacle']) {
        ctx.drawImage(sprites['obstacle'], this.x, this.y, this.width, this.height);
      }
    }
  }

  class Coin {
    constructor() {
      const lanes = gameStateRef.current.lanes;
      this.lane = Math.floor(Math.random() * 3);
      this.x = lanes[this.lane] - 22;
      this.y = -45;
      this.width = 45;
      this.height = 45;
    }

    update() {
      this.y += gameStateRef.current.gameSpeed;
    }

    draw(ctx) {
      const sprites = gameStateRef.current.sprites;
      if (sprites['coin']) {
        ctx.drawImage(sprites['coin'], this.x, this.y, this.width, this.height);
      }
    }
  }

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 10;
      this.vy = (Math.random() - 0.5) * 10;
      this.life = 60;
      this.maxLife = 60;
      this.color = color;
      this.size = Math.random() * 6 + 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.life--;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.life / this.maxLife;
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.size, this.size);
      ctx.restore();
    }
  }

  // Game Functions
  const checkCollision = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y;
  };

  const handleInput = () => {
    const gameState = gameStateRef.current;
    if (!gameState.gameRunning) return;

    const keys = gameState.keys;
    const player = gameState.player;
    const lanes = gameState.lanes;

    if ((keys['ArrowLeft'] || keys['KeyA']) && player.lane > 0) {
      player.lane--;
      player.targetX = lanes[player.lane] - 25;
      keys['ArrowLeft'] = false;
      keys['KeyA'] = false;
    }

    if ((keys['ArrowRight'] || keys['KeyD']) && player.lane < 2) {
      player.lane++;
      player.targetX = lanes[player.lane] - 25;
      keys['ArrowRight'] = false;
      keys['KeyD'] = false;
    }
  };

  const updatePlayer = () => {
    const player = gameStateRef.current.player;
    const diff = player.targetX - player.x;
    if (Math.abs(diff) > 2) {
      player.x += diff * 0.25;
    } else {
      player.x = player.targetX;
    }
  };

  const spawnObstacle = () => {
    const gameState = gameStateRef.current;
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const currentTime = Date.now();

    if (currentTime - gameState.lastObstacleTime < gameState.minObstacleGap) {
      return;
    }

    if (Math.random() < settings.obstacleSpawnRate + gameState.score * 0.00002) {
      // Always spawn only 1 obstacle to ensure at least 2 lanes are free
      const availableLanes = [0, 1, 2];
      const selectedLane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
      gameState.obstacles.push(new Obstacle(selectedLane));
      gameState.lastObstacleLanes = [selectedLane];

      gameState.lastObstacleTime = currentTime;
    }
  };

  const spawnCoin = () => {
    const gameState = gameStateRef.current;
    const settings = DIFFICULTY_SETTINGS[difficulty];
    if (Math.random() < settings.coinSpawnRate) {
      gameState.coins.push(new Coin());
    }
  };

  const spawnBackgroundElement = () => {
    const gameState = gameStateRef.current;
    const canvas = canvasRef.current;
    if (Math.random() < 0.01) {
      const types = ['tree', 'building', 'car'];
      const type = types[Math.floor(Math.random() * types.length)];
      const side = Math.random() < 0.5 ? 'left' : 'right';
      gameState.backgroundElements.push(new BackgroundElement(type, side, canvas));
    }
  };

  const updateObstacles = () => {
    const gameState = gameStateRef.current;
    const canvas = canvasRef.current;

    for (let i = gameState.obstacles.length - 1; i >= 0; i--) {
      gameState.obstacles[i].update();

      if (gameState.obstacles[i].y > canvas.height) {
        gameState.obstacles.splice(i, 1);
        continue;
      }

      if (checkCollision(gameState.player, gameState.obstacles[i])) {
        for (let j = 0; j < 15; j++) {
          gameState.particles.push(new Particle(
            gameState.player.x + gameState.player.width / 2,
            gameState.player.y + gameState.player.height / 2,
            ['#FF4444', '#FF8800', '#FFAA00'][Math.floor(Math.random() * 3)]
          ));
        }
        handleGameOver();
        return;
      }
    }
  };

 const updateCoins = () => {
  const gameState = gameStateRef.current;
  const canvas = canvasRef.current;

  for (let i = gameState.coins.length - 1; i >= 0; i--) {
    gameState.coins[i].update();

    if (gameState.coins[i].y > canvas.height) {
      gameState.coins.splice(i, 1);
      continue;
    }

    if (checkCollision(gameState.player, gameState.coins[i])) {
      for (let j = 0; j < 12; j++) {
        gameState.particles.push(new Particle(
          gameState.coins[i].x + gameState.coins[i].width / 2,
          gameState.coins[i].y + gameState.coins[i].height / 2,
          ['#FFD700', '#FFA500', '#FFFF00'][Math.floor(Math.random() * 3)]
        ));
      }

      gameState.score += 10;
      gameState.coinsCollected++;  // ✅ INCREMENT COINS
      onScoreUpdate(gameState.score);
      if (onCoinCollect) onCoinCollect();  // Still call this for GamePage display
      gameState.coins.splice(i, 1);
    }
  }
};

  const updateBackgroundElements = () => {
    const gameState = gameStateRef.current;
    const canvas = canvasRef.current;

    for (let i = gameState.backgroundElements.length - 1; i >= 0; i--) {
      gameState.backgroundElements[i].update();
      if (gameState.backgroundElements[i].y > canvas.height) {
        gameState.backgroundElements.splice(i, 1);
      }
    }
  };

  const updateParticles = () => {
    const gameState = gameStateRef.current;

    for (let i = gameState.particles.length - 1; i >= 0; i--) {
      gameState.particles[i].update();
      if (gameState.particles[i].life <= 0) {
        gameState.particles.splice(i, 1);
      }
    }
  };

  const drawPlayer = (ctx) => {
    const gameState = gameStateRef.current;
    const sprites = gameState.sprites;
    const player = gameState.player;

    if (sprites['player']) {
      ctx.drawImage(sprites['player'], player.x, player.y, player.width, player.height);
    }
  };

  const drawRoad = (ctx) => {
    const gameState = gameStateRef.current;
    const canvas = canvasRef.current;
    const lanes = gameState.lanes;

    // Road base
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(lanes[0] - 90, 0, 480, canvas.height);

    // Sidewalks
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, lanes[0] - 90, canvas.height);
    ctx.fillRect(lanes[2] + 90, 0, canvas.width - (lanes[2] + 90), canvas.height);

    // Road lines
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 30]);

    gameState.roadOffset += gameState.gameSpeed;
    if (gameState.roadOffset > 60) gameState.roadOffset = 0;

    ctx.save();
    ctx.translate(0, gameState.roadOffset);

    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.moveTo(lanes[i] + 75, -60);
      ctx.lineTo(lanes[i] + 75, canvas.height + 60);
      ctx.stroke();
    }

    ctx.restore();
    ctx.setLineDash([]);

    // Road edges
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(lanes[0] - 90, 0);
    ctx.lineTo(lanes[0] - 90, canvas.height);
    ctx.moveTo(lanes[2] + 90, 0);
    ctx.lineTo(lanes[2] + 90, canvas.height);
    ctx.stroke();
  };

  const draw = (ctx) => {
    const gameState = gameStateRef.current;
    const canvas = canvasRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark space background
    ctx.fillStyle = '#0f3460';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawRoad(ctx);

    gameState.backgroundElements.forEach(element => element.draw(ctx));
    gameState.obstacles.forEach(obstacle => obstacle.draw(ctx));
    gameState.coins.forEach(coin => coin.draw(ctx));
    gameState.particles.forEach(particle => particle.draw(ctx));

    drawPlayer(ctx);
  };

  const updateGame = () => {
  const gameState = gameStateRef.current;
  if (!gameState.gameRunning) return;

  handleInput();
  updatePlayer();
  spawnObstacle();
  spawnCoin();
  spawnBackgroundElement();
  updateObstacles();
  updateCoins();
  updateBackgroundElements();
  updateParticles();

  const settings = DIFFICULTY_SETTINGS[difficulty];
  gameState.gameSpeed += settings.speedIncrement;
  
  // Score increases every 10 frames instead of every frame
  gameState.frameCount = (gameState.frameCount || 0) + 1;
  if (gameState.frameCount % 10 === 0) {
    gameState.score++;
    onScoreUpdate(gameState.score);
  }

  const currentTime = Math.floor((Date.now() - gameState.startTime) / 1000);
  onTimeUpdate(currentTime);
};

const handleGameOver = () => {
  const gameState = gameStateRef.current;
  gameState.gameRunning = false;
  
  const finalTime = Math.floor((Date.now() - gameState.startTime) / 1000);
  
  console.log('GameCanvas - Game Over:', {
    score: gameState.score,
    coins: gameState.coinsCollected,  // ✅ LOG COINS
    time: finalTime
  });
  
  // ✅ Pass score and time (coins are tracked in GamePage)
  onGameOver(gameState.score, gameState.coinsCollected, finalTime);
};
  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    updateGame();
    draw(ctx);
    requestAnimationFrame(gameLoop);
  };

  // Initialize game
 useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const sprites = initializeSprites();
  const gameState = gameStateRef.current;
  const settings = DIFFICULTY_SETTINGS[difficulty];

  gameState.sprites = sprites;
  gameState.gameRunning = true;
  gameState.score = 0;
  gameState.coinsCollected = 0;  // ✅ RESET COINS
  gameState.gameSpeed = settings.initialSpeed;
  gameState.obstacles = [];
  gameState.coins = [];
  gameState.particles = [];
  gameState.backgroundElements = [];
  gameState.roadOffset = 0;
  gameState.lastObstacleTime = 0;
  gameState.lastObstacleLanes = [];
  gameState.minObstacleGap = difficulty === 'simple' ? 150 :
    difficulty === 'moderate' ? 120 : 100;
  gameState.startTime = Date.now();

  gameState.lanes = [canvas.width / 2 - 150, canvas.width / 2, canvas.width / 2 + 150];

  gameState.player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 120,
    targetX: canvas.width / 2 - 25,
    width: 50,
    height: 50,
    lane: 1,
    color: settings.color
  };

    // Event listeners
     const handleKeyDown = (e) => {
    gameState.keys[e.code] = true;
    if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
      e.preventDefault();
    }
  };

   const handleKeyUp = (e) => {
    gameState.keys[e.code] = false;
  };
  
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);


    // Start game loop
     const loopId = requestAnimationFrame(gameLoop);

    // Cleanup
   return () => {
    gameState.gameRunning = false;
    cancelAnimationFrame(loopId);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  };
}, [difficulty]); // Re-run when difficulty changes or component remounts

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={600}
      className="game-canvas"
    />
  );
};

export default GameCanvas;