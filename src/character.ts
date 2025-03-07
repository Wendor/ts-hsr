import { Skill } from './skills/_skill';
import { CharacterStats } from './types';

export class Character implements CharacterStats {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  speed: number;
  skills: Skill[] = [];
  mana: number = 100;
  maxMana: number = 100;
  attacked: boolean = false;

  constructor(name: string, health: number, speed: number, skills: Skill[]) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.health = health;
    this.maxHealth = health;
    this.speed = speed;
    this.skills = skills;
  }

  attackEnemy(enemy: Character, damage: number): void {
    enemy.takeDamage(damage);
  }

  healTarget(target: Character, heal: number): void {
    target.takeHeal(heal);
  }

  takeDamage(damage: number): void {
    this.health -= damage;
    if (this.health < 0) {
      this.health = 0;
    }
    this.attacked = true;
    setTimeout(() => this.attacked = false, 500);
  }

  takeHeal(heal: number): void {
    this.health += heal;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }

  useMana(mana: number): void {
    this.mana -= mana;
    if (this.mana > this.maxMana) {
      this.mana = this.maxMana;
    }
  }

  isAttacked(): boolean {
    return this.attacked;
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  calcActionPoint(): number {
    return Math.floor(1000 / (this.speed / 100));
  }
}
