import { Character } from './character';
import { Battle } from './battle';
import { BaseAttack } from './skills/base-attack';
import { Heal } from './skills/heal';
import { Skill } from './skills/skill';

const hero1 = new Character('Hero 1', 100, 160, [new BaseAttack([15])]);
const hero2 = new Character('Hero 2', 100, 115, [
  new BaseAttack([3, 1]),
  new Heal([30,10]),
]);
const enemy1 = new Character('Monster 1', 80, 113, [new BaseAttack([9, 2, 1])]);
const enemy2 = new Character('Monster 2', 80, 80, [new BaseAttack([9])]);
const enemy3 = new Character('Monster 3', 80, 82, [new BaseAttack([6])]);
const enemy4 = new Character('Monster 4', 80, 82, [new BaseAttack([3,2,1])]);
const enemy5 = new Character('Monster 5', 80, 75, [new BaseAttack([4,2])]);

const heroes = [hero1, hero2];
const enemies = [enemy1, enemy2, enemy3, enemy4, enemy5];
const battle = new Battle(heroes, enemies);

battle.on('redraw', updateBattlefield);

function getStatusDiv(character: Character) {
  const statusDiv = document.createElement('div');
  statusDiv.classList.add('status');
  statusDiv.innerHTML = `
    <span>HP: ${character.health} / MP: ${character.mana} / SPD: ${character.speed}</span>
  `;
  return statusDiv;
}

function getCharacterSkillsDiv(character: Character) {
  const div = document.createElement('div');
  div.classList.add('character-skills');
  div.innerHTML = character.skills.map(skill => {
    if (skill.damage) {
      return `<span>${skill.name}: урон ${JSON.stringify(skill.damage)}</span>`;
    }
    if (skill.heal) {
      return `<span>${skill.name}: лечение ${JSON.stringify(skill.heal)}</span>`;
    }
  }).join('<br />');
  return div;
}

function getSkillDiv(skill: Skill) {
  const skillsDiv = document.getElementById('skills') as HTMLElement;
  const div = document.createElement('div');
  div.innerHTML = skill.name;
  div.classList.add('skill');

  let disabled = false;

  const cc = battle.currentCharacter;
  if (!cc || cc.mana < skill.cost) {
    disabled = true;
    div.classList.add('disabled');
  }

  div.onclick = () => {
    if (disabled) {
      return;
    }
    document.querySelectorAll('.skill').forEach(s => s.classList.remove('current'))
    skillsDiv.setAttribute('data-selected', skill.id);
    div.classList.add('current');
  };

  if (!skillsDiv.getAttribute('data-selected')) {
    skillsDiv.setAttribute('data-selected', skill.id);
    div.classList.add('current');
  }

  return div;
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
  div.appendChild(getCharacterSkillsDiv(character));
  div.onclick = () => {
    const cc = battle.currentCharacter;
    const skillsDiv = document.getElementById('skills') as HTMLElement;
    const skill = cc?.skills.find(s => s.id == skillsDiv.getAttribute('data-selected'));
    if (skill) {
      battle.selectSkill(skill);
    }
    battle.selectTarget(character);
  }
  return div;
}

export function updateBattlefield() {
  const heroesDiv = document.getElementById('heroes') as HTMLElement;
  const enemiesDiv = document.getElementById('enemies') as HTMLElement;
  const skillsDiv = document.getElementById('skills') as HTMLElement;
  const logDiv = document.getElementById('log') as HTMLElement;
  heroesDiv.innerHTML = '';
  enemiesDiv.innerHTML = '';
  skillsDiv.innerHTML = '';
  skillsDiv.removeAttribute('data-selected');
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

  const skills = battle.currentCharacter?.skills || [];
  skills.forEach(skill => {
    skillsDiv.appendChild(getSkillDiv(skill));
  });
}

battle.runBattle();
