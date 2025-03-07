import { Character } from "src/character";

export interface CharacterStats {
  id: string;
  name: string;
  health: number;
  attack: number[];
  speed: number;
}

export interface BattleResult {
  winner: string;
  turnCount: number;
}

export interface Action {
  type: string;
  target: string;
  damage: number;
  specialAbility?: string;
}

export interface TimelineCharacter {
  character: Character;
  actionPoint: number;
}
