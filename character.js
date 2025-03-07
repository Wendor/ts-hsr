export class Character {
    constructor(name, health, attack, speed) {
        this.attacked = false;
        this.name = name;
        this.health = health;
        this.attack = attack;
        this.speed = speed;
        this.id = crypto.randomUUID();
    }
    hasAoE() {
        return !!(this.attack[1] || this.attack[2]);
    }
    attackEnemy(enemy, damage) {
        enemy.takeDamage(damage);
    }
    takeDamage(damage) {
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
        }
        this.attacked = true;
        setTimeout(() => this.attacked = false, 500);
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
