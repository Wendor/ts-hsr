import { Skill } from "./skill";

export class Heal extends Skill {
  constructor(heal: number[]) {
    super({
      name: 'Base Heal',
      cost: 50,
      heal: heal,
    });
  }
}
