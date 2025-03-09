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
        this.currentSkill = null;
        this.heroes = heroes;
        this.enemies = enemies;
        this.timeline = new Timeline([...this.heroes, ...this.enemies]);
    }
    isHero(character) {
        if (!character) {
            return false;
        }
        return this.heroes.includes(character);
    }
    isCurrentCharacter(character) {
        return this.currentCharacter === character;
    }
    hasDeadSide() {
        return this.heroes.every(character => !character.isAlive())
            || this.enemies.every(enemy => !enemy.isAlive());
    }
    getCharacterSide(character) {
        return this.heroes.includes(character) ? this.heroes : this.enemies;
    }
    getOpponentSide(character) {
        return this.heroes.includes(character) ? this.enemies : this.heroes;
    }
    getAliveOpponents(character) {
        return this.getOpponentSide(character).filter(c => c.isAlive());
    }
    getTargetSide(character) {
        return this.heroes.includes(character) ? this.heroes : this.enemies;
    }
    getAliveTargets(character) {
        return this.getTargetSide(character).filter(c => c.isAlive());
    }
    getRandomEnemy(attacker) {
        const aliveEnemies = this.getAliveOpponents(attacker);
        if (aliveEnemies.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * aliveEnemies.length);
        return aliveEnemies[randomIndex];
    }
    selectTarget(target) {
        if (!this.currentCharacter || !this.currentSkill) {
            return;
        }
        const skill = this.currentSkill;
        const side = this.getCharacterSide(target);
        if (skill.heal && !side.includes(this.currentCharacter)) {
            return;
        }
        if (skill.damage && side.includes(this.currentCharacter)) {
            return;
        }
        this.targetCharacter = target;
    }
    selectSkill(skill) {
        this.currentSkill = skill;
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
    prepareTurn() {
        const timeline = this.timeline.getNextTimelineCharacter();
        const character = timeline.character;
        this.currentCharacter = character;
        this.targetCharacter = null;
        this.log.push('');
        this.log.push(`Индекс действия <b>${timeline.actionPoint}</b>`);
        this.currentSkill = character.skills[0];
        if (!this.isHero(character)) {
            this.targetCharacter = this.getRandomEnemy(character);
        }
        this.emit('redraw');
    }
    executeTurn() {
        return __awaiter(this, void 0, void 0, function* () {
            const character = this.currentCharacter;
            const target = this.targetCharacter;
            const skill = this.currentSkill;
            if (!character || !target || !skill) {
                return;
            }
            if (this.currentSkill) {
                skill.use(this);
            }
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
