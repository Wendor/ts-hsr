var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitter } from './components/event-emitter.js';
import { Timeline } from './timeline.js';
export class Battle extends EventEmitter {
    constructor(heroes, enemies) {
        super();
        this.log = [];
        this.currentCharacter = null;
        this.targetCharacter = null;
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
                this.prepareTurn();
                while (!this.targetCharacter) {
                    yield new Promise(resolve => setTimeout(resolve, 100));
                }
                this.executeTurn();
                this.finishTurn();
            }
            this.endBattle();
        });
    }
    getAliveTargets(character) {
        return this.getTargetSide(character).filter(c => c.isAlive());
    }
    getRandomEnemy(attacker) {
        const aliveEnemies = this.getAliveTargets(attacker);
        if (aliveEnemies.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * aliveEnemies.length);
        return aliveEnemies[randomIndex];
    }
    attackTarget(attacker, target, damage) {
        const attackerIsHero = this.heroes.includes(attacker);
        const targetIsHero = this.heroes.includes(target);
        attacker.attackEnemy(target, damage);
        const logMessage = [
            attackerIsHero ? attacker.name : attacker.name,
            `атакует`,
            targetIsHero ? target.name : target.name,
            `с ${damage} урона. Осталось ${target.health} HP`
        ].join(' ');
        this.log.push(logMessage);
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
    selectTarget(target) {
        this.targetCharacter = target;
    }
    isCurrentCharacter(character) {
        return this.currentCharacter === character;
    }
    prepareTurn() {
        const timeline = this.timeline.getNextTimelineCharacter();
        const character = timeline.character;
        this.currentCharacter = character;
        this.targetCharacter = null;
        this.log.push('');
        this.log.push(`Индекс действия <b>${timeline.actionPoint}</b>`);
        if (!this.isHero(character)) {
            this.targetCharacter = this.getRandomEnemy(character);
        }
        this.emit('redraw');
    }
    isHero(character) {
        if (!character) {
            return false;
        }
        return this.heroes.includes(character);
    }
    executeTurn() {
        return __awaiter(this, void 0, void 0, function* () {
            const character = this.currentCharacter;
            const target = this.targetCharacter;
            if (!character || !target) {
                return;
            }
            this.attackManyTargets(character, target, character.attack);
        });
    }
    finishTurn() {
        this.timeline.finishTurn();
        this.currentCharacter = null;
        this.emit('redraw');
    }
    endBattle() {
        this.log.push('Бой окончен');
        this.emit('redraw');
    }
    getLog() {
        return [...this.log].reverse().join('<br>');
    }
}
