import { Character } from './character';
import { Battle } from './battle';

const hero1 = new Character('Hero 1', 100, [15], 160);
const hero2 = new Character('Hero 2', 100, [10, 5, 2], 115);
const enemy1 = new Character('Monster 1', 80, [9, 2, 1], 113);
const enemy2 = new Character('Monster 2', 80, [9], 80);
const enemy3 = new Character('Monster 3', 80, [6], 82);
const enemy4 = new Character('Monster 4', 80, [3,2,1], 82);
const enemy5 = new Character('Monster 5', 80, [4,2], 75);

const heroes = [hero1, hero2];
const enemies = [enemy1, enemy2, enemy3, enemy4, enemy5];
const battle = new Battle(heroes, enemies);

function getStatusDiv(character: Character) {
  const statusDiv = document.createElement('div');
  statusDiv.classList.add('status');
  statusDiv.innerHTML = `
    <span title="HP">❤️ ${character.health}</span>
    <span title="Скорость">⚡ ${character.speed}</span>
    <span title="Атака">💪 ${character.attack.join(', ')}</span>
  `;
  return statusDiv;
}

export function updateBattlefield() {
  const heroesDiv = document.getElementById('heroes') as HTMLElement;
  const enemiesDiv = document.getElementById('enemies') as HTMLElement;
  const logDiv = document.getElementById('log') as HTMLElement;
  heroesDiv.innerHTML = '';
  enemiesDiv.innerHTML = '';
  logDiv.innerHTML = battle.getLog();

  const sortedHeroes = [...battle.heroes].reverse().sort((a, b) => b.isAlive() ? 1 : -1);
  const sortedEnemies = [...battle.enemies].reverse().sort((a, b) => b.isAlive() ? 1 : -1);

  sortedHeroes.forEach(hero => {
    const heroDiv = document.createElement('div');
    heroDiv.classList.add('character', 'hero');
    if (!hero.isAlive()) heroDiv.classList.add('dead');
    if (battle.isCurrentCharacter(hero)) heroDiv.classList.add('current');
    if (hero.isAttacked()) heroDiv.classList.add('attack-effect');
    heroDiv.innerHTML = `<b>${hero.name}</b>`;
    heroDiv.title = `Урон: Основная цель: ${hero.attack[0] || 0}, Соседи: ${hero.attack[1] || 0}, Остальные: ${hero.attack[2] || 0}`;
    heroDiv.id = hero.id;
    heroDiv.appendChild(getStatusDiv(hero));
    heroesDiv.appendChild(heroDiv);
  });

  sortedEnemies.forEach(enemy => {
    const enemyDiv = document.createElement('div');
    enemyDiv.classList.add('character', 'enemy');
    if (!enemy.isAlive()) enemyDiv.classList.add('dead');
    if (battle.isCurrentCharacter(enemy)) enemyDiv.classList.add('current');
    if (enemy.isAttacked()) enemyDiv.classList.add('attack-effect');
    enemyDiv.innerHTML = `<b>${enemy.name}</b>`;
    enemyDiv.title = `Урон: Основная цель: ${enemy.attack[0] || 0}, Соседи: ${enemy.attack[1] || 0}, Остальные: ${enemy.attack[2] || 0}`;
    enemyDiv.id = enemy.id;
    enemyDiv.appendChild(getStatusDiv(enemy));
    enemiesDiv.appendChild(enemyDiv);
  });
}

async function runBattleAutomatically() {
  while (!battle.hasDeadSide()) {
    await battle.executeTurn();
    updateBattlefield(); // обновляем интерфейс после каждого хода
  }
}

updateBattlefield();
runBattleAutomatically();
