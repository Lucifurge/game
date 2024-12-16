// Connect to WebSocket server
const socket = new WebSocket('ws://localhost:8080');

// Create a canvas and get context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define player object
const player = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  speed: 5,
  color: "blue",
  health: 100,
};

// Define enemies (sample)
const enemies = [
  { x: 500, y: 100, width: 50, height: 50, color: "red", health: 100 },
  { x: 600, y: 200, width: 50, height: 50, color: "red", health: 100 },
];

// Load assets
const assets = {
  sword: new Image(),
  enemy: new Image(),
};
assets.sword.src = "assets/sword.png";
assets.enemy.src = "assets/enemy.png";

// Event listener for key movements
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') player.y -= player.speed;
  if (e.key === 'ArrowDown') player.y += player.speed;
  if (e.key === 'ArrowLeft') player.x -= player.speed;
  if (e.key === 'ArrowRight') player.x += player.speed;
  sendPlayerData();
});

// Send player data to server
function sendPlayerData() {
  const data = {
    x: player.x,
    y: player.y,
    health: player.health,
  };
  socket.send(JSON.stringify(data));
}

// Handle WebSocket messages (receive data from other players)
socket.onmessage = function(event) {
  const otherPlayer = JSON.parse(event.data);
  drawOtherPlayer(otherPlayer);
};

// Draw the player on the canvas
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw enemies
function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// Draw other players
function drawOtherPlayer(otherPlayer) {
  ctx.fillStyle = "green";
  ctx.fillRect(otherPlayer.x, otherPlayer.y, player.width, player.height);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawPlayer();
  drawEnemies();

  requestAnimationFrame(gameLoop); // Call the game loop again
}

// Start the game loop
gameLoop();
