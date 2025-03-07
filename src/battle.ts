import { Character } from './character';
import { Timeline } from './timeline';
import { updateBattlefield } from './main'; // импортируем функцию обновления интерфейса

export class Battle {
  public heroes: Character[];
  public enemies: Character[];
  public timeline: Timeline;
  private log: string[] = [];
  private currentCharacter: Character | null = null;

  constructor(heroes: Character[], enemies: Character[]) {
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
      await this.executeTurn();
    }
    this.endBattle();
  }

  private getAliveTargets(character: Character): Character[] {
    return this.getTargetSide(character).filter(c => c.isAlive());
  }

  private getAliveAllies(character: Character): Character[] {
    return this.getAllySide(character).filter(c => c.isAlive());
  }

  private getRandomEnemy(attacker: Character): Character | null {
    const aliveEnemies = this.getAliveTargets(attacker);
    if (aliveEnemies.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * aliveEnemies.length);
    return aliveEnemies[randomIndex];
  }

  private getLowHPEnemy(attacker: Character): Character | null {
    const aliveEnemies = this.getAliveTargets(attacker);
    if (aliveEnemies.length === 0) {
      return null;
    }
    return aliveEnemies.sort((a, b) => a.health - b.health)[0];
  }

  private getMaxNeiborsEnemy(attacker: Character): Character | null {
    const aliveEnemies = this.getAliveTargets(attacker);
    if (aliveEnemies.length === 0) {
      return null;
    }
    return aliveEnemies
      .sort((a, b) => b.health - a.health)
      .sort((a, b) => this.getNeibours(b).length - this.getNeibours(a).length)
      [0];
  }

  public logBattleStatus(character: Character, full = false): void {
    const heroes = full ? this.heroes : this.heroes.filter(c => c.isAlive());
    const enemies = full ? this.enemies : this.enemies.filter(c => c.isAlive());
    console.table(
      heroes
        .map(c => ({ ...c, name: (c == character ? `*` : '') + c.name }))
    );
    console.table(enemies);
  }

  private attackTarget(attacker: Character, target: Character, damage: number): void {
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

  private async selectTargetFromUI(character: Character): Promise<Character | null> {
    return new Promise((resolve) => {
      const targetButtons = document.querySelectorAll('.enemy');
      targetButtons.forEach(button => {
        button.addEventListener('click', () => {
          const target = this.getAliveTargets(character).find(c => c.id === button.id);
          resolve(target || null);
        });
      });
    });
  }

  public isCurrentCharacter(character: Character): boolean {
    return this.currentCharacter === character;
  }

  public async executeTurn(): Promise<void> {
    const timeline = this.timeline.getNextTimelineCharacter();
    const character = timeline.character;
    this.currentCharacter = character;
    this.log.push('');
    this.log.push(`Индекс действия <b>${timeline.actionPoint}</b>`);
    updateBattlefield();
    if (character.isAlive()) {
      let target: Character | null = null;
      const isHero = this.heroes.includes(character);
      if (isHero) {
        while (!target) {
          target = await this.selectTargetFromUI(character);
        }
      } else {
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
  }

  public endBattle(): void {
    this.logBattleStatus(this.heroes[0], true);
  }

  public getLog(): string {
    return [...this.log].reverse().join('<br>');
  }
}
