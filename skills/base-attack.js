import { Skill } from "./_skill.js";
export class BaseAttack extends Skill {
    constructor(damage) {
        super({
            name: 'Base Attack',
            damage: damage,
            cost: -10,
        });
    }
}
