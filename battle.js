var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Timeline } from './timeline.js';
import { updateBattlefield } from './main.js'; // импортируем функцию обновления интерфейса
export class Battle {
    constructor(heroes, enemies) {
        this.log = [];
        this.currentCharacter = null;
        this.heroes = heroes;
        this.enemies = enemies;
        this.timeline = new Timeline([...this.heroes, ...this.enemies]);
    }
    hasDeadSide() {
        return this.heroes.every(character => !character.isAlive())
            || this.enemies.every(enemy => !enemy.isAlive());
    }
    getTargetSide(character) {
        return this.heroes.includes(character) ? this.enemies : this.heroes;
    }
    getAllySide(character) {
        return this.heroes.includes(character) ? this.heroes : this.enemies;
    }
    getNeibours(character) {
        const allySide = this.getAllySide(character).filter(c => c.isAlive());
        const characterIndex = allySide.indexOf(character);
        return [
            allySide[characterIndex - 1],
            allySide[characterIndex + 1]
        ].filter(Boolean);
    }
    runBattle() {
        return __awaiter(this, void 0, void 0, function* () {
            while (!this.hasDeadSide()) {
                yield this.executeTurn();
            }
            this.endBattle();
        });
    }
    getAliveTargets(character) {
        return this.getTargetSide(character).filter(c => c.isAlive());
    }
    getAliveAllies(character) {
        return this.getAllySide(character).filter(c => c.isAlive());
    }
    getRandomEnemy(attacker) {
        const aliveEnemies = this.getAliveTargets(attacker);
        if (aliveEnemies.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * aliveEnemies.length);
        return aliveEnemies[randomIndex];
    }
    getLowHPEnemy(attacker) {
        const aliveEnemies = this.getAliveTargets(attacker);
        if (aliveEnemies.length === 0) {
            return null;
        }
        return aliveEnemies.sort((a, b) => a.health - b.health)[0];
    }
    getMaxNeiborsEnemy(attacker) {
        const aliveEnemies = this.getAliveTargets(attacker);
        if (aliveEnemies.length === 0) {
            return null;
        }
        return aliveEnemies
            .sort((a, b) => b.health - a.health)
            .sort((a, b) => this.getNeibours(b).length - this.getNeibours(a).length)[0];
    }
    logBattleStatus(character, full = false) {
        const heroes = full ? this.heroes : this.heroes.filter(c => c.isAlive());
        const enemies = full ? this.enemies : this.enemies.filter(c => c.isAlive());
        console.table(heroes
            .map(c => (Object.assign(Object.assign({}, c), { name: (c == character ? `*` : '') + c.name }))));
        console.table(enemies);
    }
    attackTarget(attacker, target, damage) {
        const attackerIsHero = this.heroes.includes(attacker);
        const targetIsHero = this.heroes.includes(target);
        const logMessage = [
            attackerIsHero ? attacker.name : attacker.name,
            `атакует`,
            targetIsHero ? target.name : target.name,
            `с ${damage} урона.`
        ].join(' ');
        this.log.push(logMessage);
        attacker.attackEnemy(target, damage);
    }
    attackManyTargets(attacker, target, damage) {
        // Получаем список живых целей
        const targetSide = this.getAliveTargets(attacker);
        const targetIndex = targetSide.indexOf(target);
        // Атакуем основную цель, если урон для нее задан
        if (damage[0]) {
            this.attackTarget(attacker, target, damage[0]);
        }
        // Атакуем соседей основной цели, если урон для них задан
        let neighbors = [];
        if (damage[1]) {
            neighbors = [
                targetSide[targetIndex - 1],
                targetSide[targetIndex + 1]
            ].filter(Boolean);
            neighbors.forEach(t => this.attackTarget(attacker, t, damage[1]));
        }
        // Атакуем остальных врагов, если урон для них задан
        if (damage[2]) {
            const others = targetSide.filter(c => c !== target && !neighbors.includes(c));
            others.forEach(o => this.attackTarget(attacker, o, damage[2]));
        }
    }
    selectTargetFromUI(character) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const targetButtons = document.querySelectorAll('.enemy');
                targetButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const target = this.getAliveTargets(character).find(c => c.id === button.id);
                        resolve(target || null);
                    });
                });
            });
        });
    }
    isCurrentCharacter(character) {
        return this.currentCharacter === character;
    }
    executeTurn() {
        return __awaiter(this, void 0, void 0, function* () {
            const timeline = this.timeline.getNextTimelineCharacter();
            const character = timeline.character;
            this.currentCharacter = character;
            this.log.push('');
            this.log.push(`Индекс действия <b>${timeline.actionPoint}</b>`);
            updateBattlefield();
            if (character.isAlive()) {
                let target = null;
                const isHero = this.heroes.includes(character);
                if (isHero) {
                    while (!target) {
                        target = yield this.selectTargetFromUI(character);
                    }
                }
                else {
                    target = this.getRandomEnemy(character);
                }
                // const target = this.enemies.includes(character)
                //   ? this.getRandomEnemy(character)
                //   : character.hasAoE()
                //     ? this.getMaxNeiborsEnemy(character)
                //     : this.getLowHPEnemy(character);
                if (target) {
                    this.attackManyTargets(character, target, character.attack);
                }
            }
            this.timeline.finishTurn();
            this.currentCharacter = null;
            updateBattlefield(); // обновляем интерфейс после завершения хода
        });
    }
    endBattle() {
        this.logBattleStatus(this.heroes[0], true);
    }
    getLog() {
        return [...this.log].reverse().join('<br>');
    }
}
