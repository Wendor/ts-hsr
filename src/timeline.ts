import { Character } from './character';
import { TimelineCharacter } from './types';

export class Timeline {
  private timeline: TimelineCharacter[];
  private currentActionPoint = 0;

  constructor(characters: Character[]) {
    this.timeline = characters
      .map(character => ({ character, actionPoint: character.calcActionPoint() }))
      .sort((a, b) => a.actionPoint - b.actionPoint);
  }

  public getNextTimelineCharacter(): TimelineCharacter {
    this.currentActionPoint = this.timeline[0].actionPoint;
    return this.timeline[0];
  }

  public finishTurn(): void {
    this.timeline = this.timeline.filter(t => t.character.isAlive());
    this.moveToEnd(this.timeline[0].character);
    this.timeline = this.timeline.sort((a, b) => a.actionPoint - b.actionPoint);
  }

  public moveToEnd(character: Character): void {
    const index = this.timeline.findIndex(t => t.character === character);
    this.timeline.splice(index, 1);

    const timeline = {
      character,
      actionPoint: character.calcActionPoint() + this.currentActionPoint,
    };
    this.timeline.push(timeline);
  }

  public getCurrentActionPoint(): number {
    return this.currentActionPoint;
  }
}
