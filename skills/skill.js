export class Skill {
    constructor(props) {
        this.id = crypto.randomUUID();
        this.name = props.name;
        this.damage = props.damage;
        this.heal = props.heal;
        this.cost = props.cost;
    }
    use(battle) {
        var _a, _b;
        const target = battle.targetCharacter;
        const character = battle.currentCharacter;
        if (!target || !character) {
            return;
        }
        character.useMana(this.cost);
        if ((_a = this.damage) === null || _a === void 0 ? void 0 : _a.length) {
            this.attackManyTargets(character, target, battle);
        }
        if ((_b = this.heal) === null || _b === void 0 ? void 0 : _b.length) {
            this.healManyTargets(character, target, battle);
        }
    }
    healTarget(healer, target, heal, battle) {
        healer.healTarget(target, heal);
        const logMessage = [
            healer.name,
            `исцеляет`,
            target.name,
            `на ${heal} здоровья.`,
        ].join(' ');
        battle.log.push(logMessage);
    }
    healManyTargets(healer, target, battle) {
        if (!this.heal) {
            return;
        }
        // Получаем список живых целей
        const targetSide = battle.getAliveTargets(target);
        const targetIndex = targetSide.indexOf(target);
        // Исцеляем основную цель, если хил для нее задан
        if (this.heal[0]) {
            this.healTarget(healer, target, this.heal[0], battle);
        }
        // Исцеляем соседей основной цели, если хил для них задан
        let neighbors = [];
        if (this.heal[1]) {
            neighbors = [
                targetSide[targetIndex - 1],
                targetSide[targetIndex + 1]
            ].filter(Boolean);
            for (const enemy of neighbors) {
                this.healTarget(healer, enemy, this.heal[1], battle);
            }
        }
        // Bcwtkztv остальных союзников, если хил для них задан
        if (this.heal[2]) {
            const others = targetSide.filter(c => c !== target && !neighbors.includes(c));
            for (const enemy of others) {
                this.attackTarget(healer, enemy, this.heal[2], battle);
            }
        }
    }
    attackTarget(attacker, target, damage, battle) {
        attacker.attackEnemy(target, damage);
        const logMessage = [
            attacker.name,
            `атакует`,
            target.name,
            `с ${damage} урона.`
        ].join(' ');
        battle.log.push(logMessage);
    }
    attackManyTargets(attacker, target, battle) {
        if (!this.damage) {
            return;
        }
        // Получаем список живых целей
        const targetSide = battle.getAliveTargets(target);
        const targetIndex = targetSide.indexOf(target);
        // Атакуем основную цель, если урон для нее задан
        if (this.damage[0]) {
            this.attackTarget(attacker, target, this.damage[0], battle);
        }
        // Атакуем соседей основной цели, если урон для них задан
        let neighbors = [];
        if (this.damage[1]) {
            neighbors = [
                targetSide[targetIndex - 1],
                targetSide[targetIndex + 1]
            ].filter(Boolean);
            for (const enemy of neighbors) {
                this.attackTarget(attacker, enemy, this.damage[1], battle);
            }
        }
        // Атакуем остальных врагов, если урон для них задан
        if (this.damage[2]) {
            const others = targetSide.filter(c => c !== target && !neighbors.includes(c));
            for (const enemy of others) {
                this.attackTarget(attacker, enemy, this.damage[2], battle);
            }
        }
    }
}
