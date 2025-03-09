import { Character } from './character';
import { EventEmitter } from './components/event-emitter';
import { Skill } from './skills/skill';
import { Timeline } from './timeline';

export class Battle extends EventEmitter {
  public heroes: Character[];
  public enemies: Character[];
  public timeline: Timeline;
  public log: string[] = [];
  public currentCharacter: Character | null = null;
  public targetCharacter: Character | null = null;
  public currentSkill: Skill | null = null;

  constructor(heroes: Character[], enemies: Character[]) {
    super();
    this.heroes = heroes;
    this.enemies = enemies;
    this.timeline = new Timeline([...this.heroes, ...this.enemies]);
  }

  public isHero(character?: Character|null): boolean {
    if (!character) {
      return false;
    }
    return this.heroes.includes(character);
  }

  public isCurrentCharacter(character: Character): boolean {
    return this.currentCharacter === character;
  }

  public hasDeadSide(): boolean {
    return this.heroes.every(character => !character.isAlive())
      || this.enemies.every(enemy => !enemy.isAlive());
  }

  private getCharacterSide(character: Character) {
    return this.heroes.includes(character) ? this.heroes : this.enemies;
  }

  private getOpponentSide(character: Character) {
    return this.heroes.includes(character) ? this.enemies : this.heroes;
  }

  private getAliveOpponents(character: Character) {
    return this.getOpponentSide(character).filter(c => c.isAlive());
  }

  private getTargetSide(character: Character): Character[] {
    return this.heroes.includes(character) ? this.heroes : this.enemies;
  }

  public getAliveTargets(character: Character): Character[] {
    return this.getTargetSide(character).filter(c => c.isAlive());
  }

  private getRandomEnemy(attacker: Character): Character | null {
    const aliveEnemies = this.getAliveOpponents(attacker);
    if (aliveEnemies.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * aliveEnemies.length);
    return aliveEnemies[randomIndex];
  }

  public selectTarget(target: Character): void {
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

  public selectSkill(skill: Skill): void {
    this.currentSkill = skill;
  }

  public async runBattle(): Promise<void> {
    while (!this.hasDeadSide()) {
      this.prepareTurn();
      while (!this.targetCharacter) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      this.executeTurn();
      this.finishTurn();
    }
    this.endBattle();
  }

  public prepareTurn(): void {
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

  public async executeTurn(): Promise<void> {
    const character = this.currentCharacter;
    const target = this.targetCharacter;
    const skill = this.currentSkill;

    if (!character || !target || !skill) {
      return;
    }

    if (this.currentSkill) {
      skill.use(this);
    }
  }

  public finishTurn(): void {
    this.timeline.finishTurn();
    this.currentCharacter = null;
    this.emit('redraw');
  }

  public endBattle(): void {
    this.log.push('Бой окончен');
    this.emit('redraw');
  }

  public getLog(): string {
    return [...this.log].reverse().join('<br>');
  }
}
