import { Character } from './character';
import { EventEmitter } from './components/event-emitter';
import { Timeline } from './timeline';

export class Battle extends EventEmitter {
  public heroes: Character[];
  public enemies: Character[];
  public timeline: Timeline;
  private log: string[] = [];
  private currentCharacter: Character | null = null;
  private targetCharacter: Character | null = null;

  constructor(heroes: Character[], enemies: Character[]) {
    super();
    this.heroes = heroes;
    this.enemies = enemies;
    this.timeline = new Timeline([...this.heroes, ...this.enemies]);
  }

  public hasDeadSide(): boolean {
    return this.heroes.every(character => !character.isAlive())
      || this.enemies.every(enemy => !enemy.isAlive());
  }

  private getTargetSide(character: Character): Character[] {
    return this.heroes.includes(character) ? this.enemies : this.heroes;
  }

  private getAllySide(character: Character): Character[] {
    return this.heroes.includes(character) ? this.heroes : this.enemies;
  }

  private getNeibours(character: Character): Character[] {
    const allySide = this.getAllySide(character).filter(c => c.isAlive());
    const characterIndex = allySide.indexOf(character);
    return [
      allySide[characterIndex - 1],
      allySide[characterIndex + 1]
    ].filter(Boolean);
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

  private getAliveTargets(character: Character): Character[] {
    return this.getTargetSide(character).filter(c => c.isAlive());
  }

  private getRandomEnemy(attacker: Character): Character | null {
    const aliveEnemies = this.getAliveTargets(attacker);
    if (aliveEnemies.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * aliveEnemies.length);
    return aliveEnemies[randomIndex];
  }

  private attackTarget(attacker: Character, target: Character, damage: number): void {
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

  private attackManyTargets(attacker: Character, target: Character, damage: number[]): void {
    // Получаем список живых целей
    const targetSide = this.getAliveTargets(attacker);
    const targetIndex = targetSide.indexOf(target);

    // Атакуем основную цель, если урон для нее задан
    if (damage[0]) {
      this.attackTarget(attacker, target, damage[0]);
    }

    // Атакуем соседей основной цели, если урон для них задан
    let neighbors: Character[] = [];
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

  public selectTarget(target: Character): void {
    this.targetCharacter = target;
  }

  public isCurrentCharacter(character: Character): boolean {
    return this.currentCharacter === character;
  }

  public prepareTurn(): void {
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

  public isHero(character?: Character|null): boolean {
    if (!character) {
      return false;
    }
    return this.heroes.includes(character);
  }

  public async executeTurn(): Promise<void> {
    const character = this.currentCharacter;
    const target = this.targetCharacter;
    if (!character || !target) {
      return;
    }
    this.attackManyTargets(character, target, character.attack);
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
