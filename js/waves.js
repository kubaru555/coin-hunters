const hud = document.querySelector('#hud');
const statusMessage = document.querySelector('#game-status');
const overlay = document.querySelector('#game-overlay');
const overlayTitle = document.querySelector('#overlay-title');
const overlayDescription = document.querySelector('#overlay-description');
const mainAction = document.querySelector('#main-action');
const shop = document.querySelector('#shop');
const shopItems = document.querySelector('#shop-items');
const nextWaveButton = document.querySelector('#next-wave');
let lastHud = '';
let lastShop = '';
let lastOverlay = '';

function resetGame() {
  Object.assign(game, { stage: 'ready', paused: false, wave: 0, health: 5, coins: 0,
    weapon: 0, owned: new Set([0]), invulnerable: 0, shotCooldown: 0,
    pickupCooldown: 0, elapsed: 0 });
  player.x = 146;
  player.y = 370;
  player.angle = Math.PI / 2;
  zombies.length = bullets.length = coins.length = floatingTexts.length = 0;
  releaseControls();
  pointer.aiming = false;
  navigation.target = -1;
  navigation.cooldown = 0;
  updateInterface();
}

function startWave() {
  if (game.paused || (game.stage !== 'ready' && game.stage !== 'break')) return;
  game.wave++;
  game.stage = 'wave';
  bullets.length = 0;
  game.shotCooldown = 0;
  releaseControls();
  spawnZombies(waveSettings[game.wave - 1]);
  statusMessage.textContent = `Fala ${game.wave}! Celuj myszą i przytrzymaj lewy przycisk, żeby strzelać.`;
  updateInterface();
}

function finishGame(stage) {
  game.stage = stage;
  bullets.length = 0;
  releaseControls();
  statusMessage.textContent = stage === 'won' ? 'Zwycięstwo! Wszystkie pięć fal pokonane.' : 'Koniec gry. Spróbuj ponownie!';
  updateInterface();
}

function completeWave() {
  game.health = Math.min(5, game.health + 1);
  bullets.length = 0;
  releaseControls();
  if (game.wave === waveSettings.length) {
    finishGame('won');
  } else {
    game.stage = 'break';
    statusMessage.textContent = 'Fala pokonana! +1 serce (maks. 5). Zbierz monety klawiszem E i wróć do chatki na północnym wschodzie. Drogę wskazuje strzałka.';
    updateInterface();
  }
}

function buyWeapon(index) {
  const center = playerCenter();
  if (game.stage !== 'break' || game.paused || !isInsideCabin(center.x, center.y)
    || !weapons[index] || game.owned.has(index) || index <= game.weapon
    || game.coins < weapons[index].price) return;
  game.coins -= weapons[index].price;
  game.owned.add(index);
  game.weapon = index;
  statusMessage.textContent = `Kupiono: ${weapons[index].name}. Obrażenia: ${weapons[index].damage}.`;
  updateInterface();
}

function updateInterface() {
  const hudText = `${'♥'.repeat(game.health)}${'♡'.repeat(5 - game.health)} | Monety: ${game.coins} | ${weapons[game.weapon].name} | Fala ${game.wave}/5 | Zombie: ${zombies.length}`;
  if (hudText !== lastHud) {
    hud.textContent = hudText;
    lastHud = hudText;
  }
  const center = playerCenter();
  const showShop = game.stage === 'break' && !game.paused && isInsideCabin(center.x, center.y);
  shop.hidden = !showShop;
  const shopKey = `${game.weapon}:${game.coins}:${Array.from(game.owned)}:${game.wave}`;
  if (showShop && shopKey !== lastShop) {
    shopItems.replaceChildren();
    weapons.forEach((weapon, index) => {
      const item = document.createElement('div');
      item.className = 'shop-item';
      const text = document.createElement('p');
      text.textContent = `${weapon.name} · ${weapon.price} monet · Obrażenia: ${weapon.damage}`;
      const button = document.createElement('button');
      button.type = 'button';
      const missing = Math.max(0, weapon.price - game.coins);
      const owned = game.owned.has(index);
      button.textContent = game.weapon === index ? 'W użyciu' : owned ? 'Kupiona'
        : index < game.weapon ? 'Masz mocniejszą broń' : missing ? `Brakuje ${missing} monet` : 'Kup i wyposaż';
      button.disabled = owned || index < game.weapon || missing > 0;
      button.addEventListener('click', () => buyWeapon(index));
      item.append(text, button);
      shopItems.append(item);
    });
    nextWaveButton.textContent = `Rozpocznij falę ${game.wave + 1}`;
    lastShop = shopKey;
  }
  const overlayKey = game.paused ? 'paused' : game.stage;
  overlay.hidden = !['paused', 'ready', 'won', 'lost'].includes(overlayKey);
  if (overlayKey !== lastOverlay) {
    const content = {
      ready: ['Obroń park przed zombie!', 'Przetrwaj 5 fal. WASD lub strzałki: ruch. Mysz: celowanie. Przytrzymaj lewy przycisk: strzał. Przytrzymaj E przy monetach: zbieranie pyskiem. Między falami odwiedź sklep w chatce.', 'Rozpocznij grę'],
      paused: ['Gra wstrzymana', 'Twoja rozgrywka czeka. Wznów, gdy będziesz gotowy.', 'Wznów grę'],
      won: ['Park uratowany!', `Pokonano wszystkie 5 fal. Pozostałe serca: ${game.health}/5. Zagraj ponownie innym zwierzakiem!`, 'Zagraj ponownie'],
      lost: ['Zombie wygrały tę rundę', `Dotarłeś do fali ${game.wave}/5. Nowa gra zaczyna się z pięcioma sercami i miotaczem groszku.`, 'Spróbuj ponownie'],
    }[overlayKey];
    if (content) {
      [overlayTitle.textContent, overlayDescription.textContent, mainAction.textContent] = content;
    }
    lastOverlay = overlayKey;
  }
  document.querySelector('#pause-game').disabled = !['wave', 'break'].includes(game.stage) || game.paused;
}

mainAction.addEventListener('click', () => {
  if (game.paused) {
    game.paused = false;
    releaseControls();
  } else {
    if (game.stage === 'won' || game.stage === 'lost') resetGame();
    startWave();
  }
  mainAction.blur();
  updateInterface();
});
nextWaveButton.addEventListener('click', () => {
  const center = playerCenter();
  if (isInsideCabin(center.x, center.y)) startWave();
});
document.querySelector('#pause-game').addEventListener('click', pauseGame);
