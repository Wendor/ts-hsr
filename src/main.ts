import { Character } from './character';
import { Battle } from './battle';

const hero1 = new Character('Hero 1', 100, [15], 160);
const hero2 = new Character('Hero 2', 100, [10, 5], 115);
const enemy1 = new Character('Monster 1', 80, [9, 2, 1], 113);
const enemy2 = new Character('Monster 2', 80, [9], 80);
const enemy3 = new Character('Monster 3', 80, [6], 82);
const enemy4 = new Character('Monster 4', 80, [3,2,1], 82);
const enemy5 = new Character('Monster 5', 80, [4,2], 75);

const heroes = [hero1, hero2];
const enemies = [enemy1, enemy2, enemy3, enemy4, enemy5];
const battle = new Battle(heroes, enemies);

battle.on('redraw', updateBattlefield);

function getStatusDiv(character: Character) {
  const statusDiv = document.createElement('div');
  statusDiv.classList.add('status');
  statusDiv.innerHTML = `
    <span>HP ${character.health}</span>
    <span>Скорость ${character.speed}</span>
    <span>Атака ${character.attack.join(', ')}</span>
  `;
  return statusDiv;
}

function getCharacterDiv(character: Character) {
  const div = document.createElement('div');
  div.classList.add('character');
  div.classList.add(battle.isHero(character) ? 'hero' : 'enemy');
  if (!character.isAlive()) div.classList.add('dead');
  if (battle.isCurrentCharacter(character)) div.classList.add('current');
  if (character.isAttacked()) div.classList.add('attack-effect');
  div.innerHTML = `<b>${character.name}</b>`;
  div.id = character.id;
  div.appendChild(getStatusDiv(character));
  if (!battle.isHero(character)) {
    div.onclick = () => battle.selectTarget(character);
  }
  return div
}

export function updateBattlefield() {
  const heroesDiv = document.getElementById('heroes') as HTMLElement;
  const enemiesDiv = document.getElementById('enemies') as HTMLElement;
  const logDiv = document.getElementById('log') as HTMLElement;
  heroesDiv.innerHTML = '';
  enemiesDiv.innerHTML = '';
  logDiv.innerHTML = battle.getLog();

  const sortedHeroes = [
    ...battle.heroes.filter(c => c.isAlive()),
    ...battle.heroes.filter(c => !c.isAlive())
  ];
  const sortedEnemies = [
    ...battle.enemies.filter(c => c.isAlive()),
    ...battle.enemies.filter(c => !c.isAlive())
  ];

  sortedHeroes.forEach(hero => {
    heroesDiv.appendChild(getCharacterDiv(hero));
  });

  sortedEnemies.forEach(enemy => {
    enemiesDiv.appendChild(getCharacterDiv(enemy));
  });
}

battle.runBattle();
