import { Skill } from "./_skill.js";
export class Heal extends Skill {
    constructor(heal) {
        super({
            name: 'Base Heal',
            cost: 50,
            heal: heal,
        });
    }
}
