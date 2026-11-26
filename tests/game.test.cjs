// Bez pakietów: uruchom `node --test tests/game.test.cjs`.
// Prawdziwe skrypty gry, z atrapą DOM/Canvas i kontrolowanym zegarem.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');

function loadGame() {
  const art = new Proxy({}, { get: (target, key) => target[key] ?? (() => {}) });
  art.createLinearGradient = art.createRadialGradient = () => ({ addColorStop() {} });
  function element() {
    return {
      textContent: '', hidden: false, disabled: false, children: [], listeners: {},
      width: 640, height: 384, clientWidth: 640, clientHeight: 384, clientLeft: 0,
      getContext: () => art, getBoundingClientRect: () => ({ left: 0, top: 0 }),
      setAttribute(key, value) { this[key] = value; },
      querySelector() { return element(); },
      addEventListener(name, callback) { this.listeners[name] = callback; },
      append(...children) { this.children.push(...children); },
      replaceChildren() { this.children = []; }, blur() {},
    };
  }
  const elements = new Map();
  const skins = ['wolf', 'duck', 'bear', 'dinosaur', 'portos'].map(skin => ({ ...element(), dataset: { skin } }));
  const document = {
    hidden: false, listeners: {},
    querySelector(selector) {
      if (selector.startsWith('.skin-option')) return skins[0];
      if (!elements.has(selector)) elements.set(selector, element());
      return elements.get(selector);
    },
    querySelectorAll: () => skins, createElement: element,
    addEventListener(name, callback) { this.listeners[name] = callback; },
  };
  const window = { listeners: {}, addEventListener(name, callback) { this.listeners[name] = callback; } };
  // Stałe ziarno daje odtwarzalne miejsca pojawiania się zombie.
  let seed = 2026;
  const math = Object.create(Math);
  math.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 2 ** 32);
  const sandbox = vm.createContext({ document, window, Math: math,
    Path2D: class { constructor() { return new Proxy({}, { get: () => () => {} }); } }, requestAnimationFrame() {} });
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const match of html.matchAll(/<script src="([^"]+)"/g)) {
    vm.runInContext(fs.readFileSync(path.join(root, match[1]), 'utf8'), sandbox, { filename: match[1] });
  }
  return {
    run: code => vm.runInContext(code, sandbox),
    value: code => JSON.parse(JSON.stringify(vm.runInContext(code, sandbox))),
    elements, skins, window, document,
  };
}

test('local scripts load in HTML order; all skins render, rotate and expose their mouth', () => {
  const app = loadGame();
  assert.equal(app.value('game.stage'), 'ready');
  for (const skin of app.skins) {
    skin.listeners.click();
    for (const angle of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
      app.run(`player.angle = ${angle}; narysujMape()`);
      const mouth = app.value('mouthPosition()');
      const center = app.value('playerCenter()');
      assert.ok(Math.hypot(mouth.x - center.x, mouth.y - center.y) <= 10);
    }
  }
});

test('every wave spawns its exact population in reachable, clear places away from the player', () => {
  const app = loadGame();
  for (let wave = 0; wave < 5; wave++) {
    app.run(`zombies.length = 0; spawnZombies(waveSettings[${wave}])`);
    assert.equal(app.value('zombies.length'), [6, 8, 10, 12, 14][wave]);
    assert.equal(app.value(`zombies.every(z => canStand(z.x,z.y) && z.health === ${wave + 3}
      && !isInsideCabin(z.x+14,z.y+14) && Math.hypot(z.x+14-playerCenter().x,z.y+14-playerCenter().y)>=200)`), true);
  }
});

test('zombies navigate around obstacles and through the cabin door without crossing walls', () => {
  const app = loadGame();
  for (const position of [[146, 370], [940, 90], [620, 600], [327, 347]]) {
    app.run(`resetGame(); player.x=${position[0]}; player.y=${position[1]}; spawnZombies(waveSettings[4]);
      game.stage='wave'; game.invulnerable=999;`);
    // Każdy przeciwnik ma dość czasu na dotarcie z dowolnej części mapy.
    app.run(`for(let step=0; step<2400; step++) {
      updateZombies(0.05);
      if (!zombies.every(z=>canStand(z.x,z.y))) throw new Error('Zombie w przeszkodzie');
    }`);
    const far = app.value('zombies.filter(z=>Math.hypot(z.x-player.x,z.y-player.y)>40).map(z=>({x:z.x,y:z.y}))');
    assert.equal(far.length, 0, `Nie dotarły do gracza ${position}: ${JSON.stringify(far)}`);
  }
});

test('swept projectiles stop at walls and the nearest zombie, dropping exactly one coin', () => {
  const app = loadGame();
  app.run(`game.stage='wave'; zombies.push(
    {x:200,y:370,size:28,health:1,maxHealth:1},
    {x:250,y:370,size:28,health:1,maxHealth:1});
    bullets.push({x:170,y:384,angle:0,damage:1,weapon:0,life:2}); updateCombat(0.3);`);
  assert.equal(app.value('zombies.length'), 1);
  assert.equal(app.value('zombies[0].x'), 250);
  assert.equal(app.value('coins.length'), 1);
  assert.equal(app.value('bullets.length'), 0);
  app.run(`zombies.length=0; coins.length=0;
    zombies.push({x:315,y:347,size:28,health:3,maxHealth:3});
    bullets.push({x:410,y:355,angle:Math.PI,damage:3,weapon:2,life:2}); updateCombat(0.3);`);
  assert.equal(app.value('zombies[0].health'), 3, 'Kamień x=355 musi zatrzymać pocisk');
  assert.equal(app.value('bullets.length'), 0);
  assert.equal(app.value('coins.length'), 0);
});

test('holding fire respects cooldown; stronger weapons deal their configured damage', () => {
  const app = loadGame();
  app.run(`let shotsFired=0; const originalPush=bullets.push.bind(bullets);
    bullets.push=(...shots)=>{shotsFired+=shots.length;return originalPush(...shots)};
    pointer.down=true; for(let i=0;i<60;i++) updateCombat(1/60)`);
  assert.equal(app.value('shotsFired'), 4);
  for (let weapon = 0; weapon < 3; weapon++) {
    app.run(`bullets.length=0; zombies.length=0; game.weapon=${weapon}; game.shotCooldown=0;
      player.angle=0; zombies.push({x:190,y:370,size:28,health:10,maxHealth:10});
      updateCombat(0.1);`);
    assert.equal(app.value('zombies[0].health'), 10 - (weapon + 1));
  }
});

test('E collects nearby coins once each, sequentially, and flight tracks the moving mouth after release', () => {
  const app = loadGame();
  app.run(`game.stage='break'; coins.push({x:180,y:384,flight:null},{x:185,y:384,flight:null},
    {x:500,y:384,flight:null}); updateLoot(0.05);`);
  assert.equal(app.value('game.coins'), 0);
  app.run(`pressedKeys.add('e'); updateLoot(0.05); pressedKeys.clear();
    player.x+=10; player.angle=1; updateLoot(0.05);`);
  assert.equal(app.value('coins.filter(c=>c.flight).length'), 1);
  app.run('for(let i=0;i<4;i++) updateLoot(0.05)');
  assert.equal(app.value('game.coins'), 1);
  assert.equal(app.value('floatingTexts.length'), 1);
  app.run(`pressedKeys.add('e'); for(let i=0;i<40;i++) updateLoot(0.05);`);
  assert.equal(app.value('game.coins'), 2);
  assert.equal(app.value('coins.length'), 1);
});

test('pickup flight finishes at victory, walls block pickup, and health never exceeds five', () => {
  const app = loadGame();
  app.run(`game.stage='break'; player.x=327; player.y=347;
    coins.push({x:388,y:360,flight:null}); pressedKeys.add('e'); updateLoot(0.05);`);
  assert.equal(app.value('coins[0].flight'), null);
  app.run(`coins.length=0; coins.push({x:338,y:360,flight:null}); updateLoot(0.05);
    game.stage='wave';game.wave=5;game.health=5;completeWave();
    for(let i=0;i<10;i++)updateGame(0.05);`);
  assert.equal(app.value('game.stage'), 'won');
  assert.equal(app.value('game.health'), 5);
  assert.equal(app.value('coins.length'), 0);
  assert.equal(app.value('game.coins'), 1);
});

test('contact removes one heart per second, death ends play, restart clears the previous run', () => {
  const app = loadGame();
  app.run(`startWave(); zombies.length=0; zombies.push({x:player.x,y:player.y,size:28,
    health:999,maxHealth:999,speed:0,waypoint:null,flash:0});
    updateGame(0.05); for(let i=0;i<10;i++) updateGame(0.05);`);
  assert.equal(app.value('game.health'), 4);
  app.run('for(let i=0;i<100;i++) updateGame(0.05)');
  assert.equal(app.value('game.stage'), 'lost');
  app.run(`game.weapon=2;game.owned.add(2); game.coins=12;
    coins.push({x:1,y:1}); floatingTexts.push({x:1,y:1,life:1});resetGame();startWave();`);
  assert.deepEqual(app.value('[game.health,game.coins,game.weapon,game.wave,coins.length,floatingTexts.length,bullets.length]'), [5, 0, 0, 1, 0, 0, 0]);
  assert.deepEqual(app.value('Array.from(game.owned)'), [0]);
});

test('blur and hidden document pause movement, attacks, damage, loot and timers; resume releases inputs', () => {
  const app = loadGame();
  app.run(`startWave(); pressedKeys.add('d'); pressedKeys.add('e'); pointer.down=true;`);
  app.window.listeners.blur();
  const snapshot = app.value('[player.x,player.y,game.health,game.elapsed,zombies,coins,bullets]');
  app.run('for(let i=0;i<50;i++) updateGame(0.05)');
  assert.deepEqual(app.value('[player.x,player.y,game.health,game.elapsed,zombies,coins,bullets]'), snapshot);
  assert.equal(app.value('pressedKeys.size'), 0);
  assert.equal(app.value('pointer.down'), false);
  app.elements.get('#main-action').listeners.click();
  assert.equal(app.value('game.paused'), false);
  app.document.hidden = true;
  app.document.listeners.visibilitychange();
  assert.equal(app.value('game.paused'), true);
});

test('five waves, collection and cabin purchases allow both upgrades before the finale', () => {
  const app = loadGame();
  app.run('startWave();');
  const log = [];
  for (let wave = 1; wave <= 5; wave++) {
    assert.equal(app.value('game.stage'), 'wave');
    assert.equal(app.value('zombies.length'), [6, 8, 10, 12, 14][wave - 1]);
    // Walka używa prawdziwych trafień i prawdziwych nagród, bez dopisywania pieniędzy.
    app.run(`for(const zombie of [...zombies]) {
      while(zombies.includes(zombie)) {
        bullets.push({x:zombie.x+14,y:zombie.y+14,angle:0,damage:weapons[game.weapon].damage,weapon:game.weapon,life:1});
        updateCombat(0);
      }
    }
    game.health=3; updateGame(0.01);`);
    assert.equal(app.value('game.health'), 4);
    if (wave === 5) break;
    assert.equal(app.value('game.stage'), 'break');
    app.run(`for(const coin of [...coins]) {
      player.x=coin.x-14; player.y=coin.y-14; pressedKeys.add('e');
      for(let tick=0;tick<12;tick++) updateLoot(0.05);
    } pressedKeys.clear();`);
    const before = app.value('game.coins');
    app.run('buyWeapon(1)');
    assert.equal(app.value('game.coins'), before, 'Brak zakupów poza chatką');
    app.run('player.x=940;player.y=90;updateInterface()');
    assert.equal(app.elements.get('#shop').hidden, false);
    if (wave === 1) {
      app.run('buyWeapon(2)');
      assert.equal(app.value('game.weapon'), 0, 'Nie stać na złotą wyrzutnię');
      app.run('buyWeapon(1);buyWeapon(1)');
      assert.equal(app.value('game.coins'), 0, 'Tylko jeden zakup za 6 monet');
      assert.equal(app.value('game.weapon'), 1);
    }
    if (wave === 3) {
      app.run('buyWeapon(2)');
      assert.equal(app.value('game.weapon'), 2);
      assert.equal(app.value('game.coins'), 4);
    }
    log.push(app.value('[game.wave,game.coins,game.weapon]'));
    app.elements.get('#next-wave').listeners.click();
  }
  assert.equal(app.value('game.stage'), 'won');
  assert.deepEqual(log, [[1, 0, 1], [2, 8, 1], [3, 4, 2], [4, 16, 2]]);
  app.elements.get('#main-action').listeners.click();
  assert.equal(app.value('game.wave'), 1);
  assert.equal(app.value('game.coins'), 0);
});
