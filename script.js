// Initialize game state
let lifeTotal = 40;
let commanderDamage = [0, 0, 0, 0];

// Load saved state from localStorage if it exists
window.onload = function() {
  const savedLife = localStorage.getItem('lifeTotal');
  const savedDamage = localStorage.getItem('commanderDamage');
  const savedNames = localStorage.getItem('commanderNames');
  
  if (savedLife) {
    lifeTotal = parseInt(savedLife);
    document.getElementById('life-total').textContent = lifeTotal;
  }
  
  if (savedDamage) {
    commanderDamage = JSON.parse(savedDamage);
    updateDamageDisplays();
  }
  
  if (savedNames) {
    const names = JSON.parse(savedNames);
    const inputs = document.getElementsByClassName('commander-name');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = names[i] || '';
    }
  }

  // Add input event listeners for commander names
  const nameInputs = document.getElementsByClassName('commander-name');
  for (let input of nameInputs) {
    input.addEventListener('input', saveCommanderNames);
  }
};

function adjustLife(amount) {
  lifeTotal = Math.max(0, lifeTotal + amount);
  document.getElementById('life-total').textContent = lifeTotal;
  localStorage.setItem('lifeTotal', lifeTotal);
}

function adjustDamage(commanderIndex, amount) {
  commanderDamage[commanderIndex] = Math.max(0, commanderDamage[commanderIndex] + amount);
  updateDamageDisplays();
  localStorage.setItem('commanderDamage', JSON.stringify(commanderDamage));
}

function updateDamageDisplays() {
  const counters = document.getElementsByClassName('damage-counter');
  for (let i = 0; i < counters.length; i++) {
    counters[i].textContent = commanderDamage[i];
  }
}

function saveCommanderNames() {
  const inputs = document.getElementsByClassName('commander-name');
  const names = Array.from(inputs).map(input => input.value);
  localStorage.setItem('commanderNames', JSON.stringify(names));
}

function resetGame() {
  lifeTotal = 40;
  commanderDamage = [0, 0, 0, 0];
  document.getElementById('life-total').textContent = lifeTotal;
  updateDamageDisplays();
  localStorage.setItem('lifeTotal', lifeTotal);
  localStorage.setItem('commanderDamage', JSON.stringify(commanderDamage));
}
