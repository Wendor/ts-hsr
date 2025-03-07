export class Character {
    constructor(name, health, speed, skills) {
        this.skills = [];
        this.mana = 100;
        this.maxMana = 100;
        this.attacked = false;
        this.id = crypto.randomUUID();
        this.name = name;
        this.health = health;
        this.maxHealth = health;
        this.speed = speed;
        this.skills = skills;
    }
    attackEnemy(enemy, damage) {
        enemy.takeDamage(damage);
    }
    healTarget(target, heal) {
        target.takeHeal(heal);
    }
    takeDamage(damage) {
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
        }
        this.attacked = true;
        setTimeout(() => this.attacked = false, 500);
    }
    takeHeal(heal) {
        this.health += heal;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
    }
    useMana(mana) {
        this.mana -= mana;
        if (this.mana > this.maxMana) {
            this.mana = this.maxMana;
        }
    }
    isAttacked() {
        return this.attacked;
    }
    isAlive() {
        return this.health > 0;
    }
    calcActionPoint() {
        return Math.floor(1000 / (this.speed / 100));
    }
}
