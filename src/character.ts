import { CharacterStats } from './types';

export class Character implements CharacterStats {
  name: string;
  health: number;
  attack: number[]; // at target, at neibours, at others
  speed: number;

  constructor(name: string, health: number, attack: number[], speed: number) {
    this.name = name;
    this.health = health;
    this.attack = attack;
    this.speed = speed;
  }

  hasAoE(): boolean {
    return !!(this.attack[1] || this.attack[2]);
  }

  attackEnemy(enemy: Character, damage: number): void {
    enemy.takeDamage(damage);
  }

  takeDamage(damage: number): void {
    this.health -= damage;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  calcActionPoint(): number {
    return Math.floor(1000 / (this.speed / 100));
  }
}
