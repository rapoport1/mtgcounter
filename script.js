// Player colors for visual distinction
const PLAYER_COLORS = [
  ['bg-accent-1', 'border-accent-6'],
  ['bg-accent-secondary-1', 'border-accent-secondary-6'],
  ['bg-green-100', 'border-green-600'],
  ['bg-red-100', 'border-red-600'],
  ['bg-purple-100', 'border-purple-600'],
  ['bg-yellow-100', 'border-yellow-600']
];

// Initialize game state
let players = Array(6).fill().map(() => ({
  life: 40,
  commanderDamage: {}
}));

// Create player card HTML
function createPlayerCard(index, playerCount) {
  const colorClasses = PLAYER_COLORS[index].join(' ');
  
  const card = document.createElement('div');
  card.className = `player-card ${colorClasses} p-4 rounded-lg border`;
  
  const header = document.createElement('div');
  header.className = 'flex justify-between items-center mb-4';
  header.innerHTML = `
    <h2 class="text-xl font-bold">Player ${index + 1}</h2>
    <div class="flex items-center gap-2">
      <button class="life-minus px-2 py-1 bg-neutral-3 hover:bg-neutral-4 rounded">-</button>
      <span class="life-total text-2xl font-bold w-12 text-center">${players[index].life}</span>
      <button class="life-plus px-2 py-1 bg-neutral-3 hover:bg-neutral-4 rounded">+</button>
    </div>
  `;

  const commanderSection = document.createElement('div');
  commanderSection.className = 'commander-section';
  
  const toggleButton = document.createElement('button');
  toggleButton.className = 'w-full mb-2 px-4 py-2 bg-neutral-3 hover:bg-neutral-4 rounded';
  toggleButton.textContent = 'Commander Damage';
  
  const damageContainer = document.createElement('div');
  damageContainer.className = 'commander-damage hidden space-y-2 bg-white bg-opacity-50 p-3 rounded-lg';
  
  // Create commander damage trackers for other players
  for (let i = 0; i < playerCount; i++) {
    if (i === index) continue;
    
    const damageTracker = document.createElement('div');
    damageTracker.className = 'flex items-center gap-2';
    damageTracker.innerHTML = `
      <span class="text-sm text-fg-secondary">From P${i + 1}:</span>
      <button class="damage-minus px-2 py-1 bg-neutral-3 hover:bg-neutral-4 rounded">-</button>
      <span class="damage-total w-8 text-center">${players[index].commanderDamage[i] || 0}</span>
      <button class="damage-plus px-2 py-1 bg-neutral-3 hover:bg-neutral-4 rounded">+</button>
    `;
    
    // Add event listeners for commander damage buttons
    const minusBtn = damageTracker.querySelector('.damage-minus');
    const plusBtn = damageTracker.querySelector('.damage-plus');
    const damageTotal = damageTracker.querySelector('.damage-total');
    
    minusBtn.addEventListener('click', () => {
      const currentDamage = players[index].commanderDamage[i] || 0;
      if (currentDamage > 0) {
        players[index].commanderDamage[i] = currentDamage - 1;
        damageTotal.textContent = players[index].commanderDamage[i];
        saveGameState();
      }
    });
    
    plusBtn.addEventListener('click', () => {
      const currentDamage = players[index].commanderDamage[i] || 0;
      players[index].commanderDamage[i] = currentDamage + 1;
      damageTotal.textContent = players[index].commanderDamage[i];
      saveGameState();
    });
    
    damageContainer.appendChild(damageTracker);
  }
  
  toggleButton.addEventListener('click', () => {
    damageContainer.classList.toggle('hidden');
  });
  
  commanderSection.appendChild(toggleButton);
  commanderSection.appendChild(damageContainer);
  
  // Add event listeners for life total buttons
  const lifeMinus = header.querySelector('.life-minus');
  const lifePlus = header.querySelector('.life-plus');
  const lifeTotal = header.querySelector('.life-total');
  
  lifeMinus.addEventListener('click', () => {
    players[index].life--;
    lifeTotal.textContent = players[index].life;
    saveGameState();
  });
  
  lifePlus.addEventListener('click', () => {
    players[index].life++;
    lifeTotal.textContent = players[index].life;
    saveGameState();
  });
  
  card.appendChild(header);
  card.appendChild(commanderSection);
  
  return card;
}

// Update the display
function updateDisplay() {
  const container = document.getElementById('players-container');
  container.innerHTML = '';
  
  const playerCount = parseInt(document.getElementById('player-count').value);
  
  for (let i = 0; i < playerCount; i++) {
    container.appendChild(createPlayerCard(i, playerCount));
  }
}

// Save game state to localStorage
function saveGameState() {
  localStorage.setItem('mtgLifeCounter', JSON.stringify({
    players,
    playerCount: document.getElementById('player-count').value
  }));
}

// Load game state from localStorage
function loadGameState() {
  const savedState = localStorage.getItem('mtgLifeCounter');
  if (savedState) {
    const state = JSON.parse(savedState);
    players = state.players;
    document.getElementById('player-count').value = state.playerCount;
  }
  updateDisplay();
}

// Reset game state
function resetGame() {
  players = Array(6).fill().map(() => ({
    life: 40,
    commanderDamage: {}
  }));
  saveGameState();
  updateDisplay();
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
  // Load saved state
  loadGameState();
  
  // Add event listeners
  document.getElementById('player-count').addEventListener('change', () => {
    saveGameState();
    updateDisplay();
  });
  
  document.getElementById('reset-game').addEventListener('click', resetGame);
});
