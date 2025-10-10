export const initializeSprites = () => {
  const sprites = {};
  
  const createSprite = (id, drawFunction) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 60;
    canvas.height = 60;
    ctx.imageSmoothingEnabled = false;
    drawFunction(ctx, 60, 60);
    sprites[id] = canvas;
  };

  // Player Sprite - Runner Character
  createSprite('player', (ctx, w, h) => {
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(15, 25, 30, 25);
    ctx.fillStyle = '#FFE4C4';
    ctx.fillRect(18, 8, 24, 20);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(18, 6, 24, 8);
    ctx.fillStyle = '#000';
    ctx.fillRect(22, 14, 3, 3);
    ctx.fillRect(35, 14, 3, 3);
    ctx.fillStyle = '#000';
    ctx.fillRect(28, 18, 2, 2);
    ctx.fillStyle = '#000';
    ctx.fillRect(26, 21, 6, 1);
    ctx.fillStyle = '#FFE4C4';
    ctx.fillRect(8, 26, 10, 18);
    ctx.fillRect(42, 26, 10, 18);
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(18, 44, 24, 8);
    ctx.fillStyle = '#FFE4C4';
    ctx.fillRect(20, 48, 8, 10);
    ctx.fillRect(32, 48, 8, 10);
    ctx.fillStyle = '#000';
    ctx.fillRect(18, 54, 12, 4);
    ctx.fillRect(30, 54, 12, 4);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(20, 55, 6, 1);
    ctx.fillRect(32, 55, 6, 1);
  });

  // Obstacle Sprite - Traffic Cone
  createSprite('obstacle', (ctx, w, h) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(6, 52, 48, 8);
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(12, 20, 36, 32);
    ctx.fillRect(18, 12, 24, 8);
    ctx.fillRect(22, 8, 16, 4);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(12, 25, 36, 3);
    ctx.fillRect(12, 35, 36, 3);
    ctx.fillRect(12, 45, 36, 3);
    ctx.fillStyle = '#FF4500';
    ctx.fillRect(24, 4, 12, 4);
    ctx.fillStyle = '#000';
    ctx.fillRect(20, 30, 2, 2);
    ctx.fillRect(24, 30, 2, 2);
    ctx.fillRect(28, 30, 2, 2);
    ctx.fillRect(32, 30, 2, 2);
    ctx.fillRect(36, 30, 2, 2);
  });

  // Coin Sprite - Round Golden Coin
  createSprite('coin', (ctx, w, h) => {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(30, 30, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#DAA520';
    ctx.beginPath();
    ctx.arc(30, 30, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(28, 20, 4, 20);
    ctx.fillRect(24, 24, 12, 3);
    ctx.fillRect(24, 33, 12, 3);
    ctx.fillStyle = '#FFFF99';
    ctx.beginPath();
    ctx.arc(26, 26, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(30, 30, 17, 0, Math.PI * 2);
    ctx.stroke();
  });

  // City Building Background
  createSprite('building', (ctx, w, h) => {
    ctx.fillStyle = '#696969';
    ctx.fillRect(10, 6, 40, 54);
    ctx.fillStyle = '#87CEEB';
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 3; col++) {
        ctx.fillRect(14 + col * 10, 10 + row * 8, 6, 5);
      }
    }
    ctx.fillStyle = '#2F4F4F';
    ctx.fillRect(8, 2, 44, 6);
    ctx.fillStyle = '#A9A9A9';
    ctx.fillRect(8, 8, 2, 52);
    ctx.fillRect(50, 8, 2, 52);
  });

  // Urban Tree
  createSprite('tree', (ctx, w, h) => {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(26, 35, 8, 25);
    ctx.fillStyle = '#228B22';
    ctx.fillRect(10, 10, 40, 35);
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(15, 15, 30, 15);
    ctx.fillStyle = '#006400';
    ctx.fillRect(12, 20, 36, 1);
    ctx.fillRect(14, 30, 32, 1);
    ctx.fillStyle = '#654321';
    ctx.fillRect(27, 40, 1, 15);
    ctx.fillRect(29, 35, 1, 20);
    ctx.fillRect(31, 42, 1, 13);
  });

  // Sports Car (background traffic)
  createSprite('car', (ctx, w, h) => {
    ctx.fillStyle = '#DC143C';
    ctx.fillRect(8, 20, 44, 20);
    ctx.fillStyle = '#B22222';
    ctx.fillRect(16, 12, 28, 12);
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(18, 14, 24, 8);
    ctx.fillStyle = '#000';
    ctx.fillRect(12, 38, 10, 6);
    ctx.fillRect(38, 38, 10, 6);
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(14, 40, 6, 2);
    ctx.fillRect(40, 40, 6, 2);
    ctx.fillStyle = '#FFFF99';
    ctx.fillRect(6, 24, 4, 6);
    ctx.fillRect(6, 30, 4, 6);
    ctx.fillStyle = '#000';
    ctx.fillRect(6, 26, 2, 8);
  });

  // Power-up Star (optional bonus item)
  createSprite('powerup', (ctx, w, h) => {
    ctx.fillStyle = '#FF69B4';
    ctx.fillRect(28, 8, 4, 44);
    ctx.fillRect(8, 28, 44, 4);
    ctx.fillRect(14, 14, 32, 32);
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(24, 24, 12, 12);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(29, 29, 2, 2);
  });

  // Street Lamp (background decoration)
  createSprite('lamp', (ctx, w, h) => {
    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(28, 20, 4, 40);
    ctx.fillStyle = '#2F2F2F';
    ctx.fillRect(24, 56, 12, 4);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(20, 14, 20, 8);
    ctx.fillStyle = '#FFFF99';
    ctx.fillRect(24, 16, 12, 4);
  });

  // Traffic Light (background decoration)
  createSprite('trafficlight', (ctx, w, h) => {
    ctx.fillStyle = '#2F2F2F';
    ctx.fillRect(24, 8, 12, 36);
    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(28, 40, 4, 20);
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(26, 12, 8, 8);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(26, 22, 8, 8);
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(26, 32, 8, 8);
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.fillRect(24, 30, 12, 12);
  });

  // Trash Can (obstacle variation)
  createSprite('trashcan', (ctx, w, h) => {
    ctx.fillStyle = '#2F4F4F';
    ctx.fillRect(16, 20, 28, 32);
    ctx.fillStyle = '#1C1C1C';
    ctx.fillRect(14, 16, 32, 6);
    ctx.fillStyle = '#696969';
    ctx.fillRect(24, 12, 12, 4);
    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(18, 26, 24, 2);
    ctx.fillRect(18, 36, 24, 2);
    ctx.fillRect(18, 46, 24, 2);
  });

  // Speed Boost Effect (visual effect)
  createSprite('speedboost', (ctx, w, h) => {
    ctx.fillStyle = '#00FFFF';
    for (let i = 0; i < 5; i++) {
      const y = 10 + i * 10;
      ctx.fillRect(10, y, 40 - i * 4, 3);
    }
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(20, 30, 20, 6);
    ctx.fillRect(35, 24, 6, 6);
    ctx.fillRect(35, 36, 6, 6);
  });

  // Cloud (background decoration)
  createSprite('cloud', (ctx, w, h) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(10, 20, 40, 16);
    ctx.fillRect(16, 14, 28, 12);
    ctx.fillRect(20, 18, 20, 8);
  });

  // Star (night background)
  createSprite('star', (ctx, w, h) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(28, 24, 4, 12);
    ctx.fillRect(24, 28, 12, 4);
    ctx.fillRect(26, 26, 8, 8);
  });

  return sprites;
};

// Export individual sprite creators if needed
export const createCustomSprite = (drawFunction, width = 60, height = 60) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  ctx.imageSmoothingEnabled = false;
  drawFunction(ctx, width, height);
  return canvas;
};

// Sprite animation helper
export const animateSprite = (spriteCanvas, frames, currentFrame) => {
  const frameWidth = spriteCanvas.width / frames;
  return {
    sx: currentFrame * frameWidth,
    sy: 0,
    sWidth: frameWidth,
    sHeight: spriteCanvas.height
  };
};

export default initializeSprites;