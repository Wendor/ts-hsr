import { Character } from './character.js';
import { Battle } from './battle.js';
import { BaseAttack } from './skills/base-attack.js';
import { Heal } from './skills/heal.js';
const hero1 = new Character('Hero 1', 100, 160, [new BaseAttack([15])]);
const hero2 = new Character('Hero 2', 100, 115, [
    new BaseAttack([3, 1]),
    new Heal([30, 10]),
]);
const enemy1 = new Character('Monster 1', 80, 113, [new BaseAttack([9, 2, 1])]);
const enemy2 = new Character('Monster 2', 80, 80, [new BaseAttack([9])]);
const enemy3 = new Character('Monster 3', 80, 82, [new BaseAttack([6])]);
const enemy4 = new Character('Monster 4', 80, 82, [new BaseAttack([3, 2, 1])]);
const enemy5 = new Character('Monster 5', 80, 75, [new BaseAttack([4, 2])]);
const heroes = [hero1, hero2];
const enemies = [enemy1, enemy2, enemy3, enemy4, enemy5];
const battle = new Battle(heroes, enemies);
battle.on('redraw', updateBattlefield);
function getStatusDiv(character) {
    const statusDiv = document.createElement('div');
    statusDiv.classList.add('status');
    statusDiv.innerHTML = `
    <span>HP ${character.health}</span>
    <span>Мана ${character.mana}</span>
    <span>Скорость ${character.speed}</span>
  `;
    return statusDiv;
}
function getSkillSelector(character) {
    const select = document.createElement('select');
    select.setAttribute('data-character', character.id);
    character.skills.forEach(skill => {
        const option = document.createElement('option');
        option.value = skill.id;
        option.text = skill.name;
        if (character.mana < skill.cost) {
            option.disabled = true;
        }
        select.appendChild(option);
    });
    return select;
}
function getCharacterDiv(character) {
    const div = document.createElement('div');
    div.classList.add('character');
    div.classList.add(battle.isHero(character) ? 'hero' : 'enemy');
    if (!character.isAlive())
        div.classList.add('dead');
    if (battle.isCurrentCharacter(character))
        div.classList.add('current');
    if (character.isAttacked())
        div.classList.add('attack-effect');
    div.innerHTML = `<b>${character.name}</b>`;
    div.id = character.id;
    div.appendChild(getStatusDiv(character));
    div.onclick = () => {
        const cc = battle.currentCharacter;
        const selector = `[data-character="${cc === null || cc === void 0 ? void 0 : cc.id}"]`;
        const skillSelector = document.querySelectorAll(selector)[0];
        const skill = cc === null || cc === void 0 ? void 0 : cc.skills.find(s => s.id == (skillSelector === null || skillSelector === void 0 ? void 0 : skillSelector.value));
        if (skill) {
            battle.selectSkill(skill);
        }
        battle.selectTarget(character);
    };
    return div;
}
export function updateBattlefield() {
    const heroesDiv = document.getElementById('heroes');
    const enemiesDiv = document.getElementById('enemies');
    const logDiv = document.getElementById('log');
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
        if (battle.isHero(hero)) {
            heroesDiv.appendChild(getSkillSelector(hero));
        }
    });
    sortedEnemies.forEach(enemy => {
        enemiesDiv.appendChild(getCharacterDiv(enemy));
    });
}
battle.runBattle();
