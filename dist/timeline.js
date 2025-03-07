export class Timeline {
    constructor(characters) {
        this.currentActionPoint = 0;
        this.timeline = characters
            .map(character => ({ character, actionPoint: character.calcActionPoint() }))
            .sort((a, b) => a.actionPoint - b.actionPoint);
    }
    getNextTimelineCharacter() {
        this.currentActionPoint = this.timeline[0].actionPoint;
        return this.timeline[0];
    }
    finishTurn() {
        this.timeline = this.timeline.filter(t => t.character.isAlive());
        this.moveToEnd(this.timeline[0].character);
        this.timeline = this.timeline.sort((a, b) => a.actionPoint - b.actionPoint);
    }
    moveToEnd(character) {
        const index = this.timeline.findIndex(t => t.character === character);
        this.timeline.splice(index, 1);
        const timeline = {
            character,
            actionPoint: character.calcActionPoint() + this.currentActionPoint,
        };
        this.timeline.push(timeline);
    }
    getCurrentActionPoint() {
        return this.currentActionPoint;
    }
}
