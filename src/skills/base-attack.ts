import { Skill } from "./skill";

export class BaseAttack extends Skill {
  constructor(damage: number[]) {
    super({
      name: 'Base Attack',
      damage: damage,
      cost: -10,
    });
  }
}
