import { Character } from "../character";
import { Skill } from "../skills/skill";

export interface CharacterStats {
  id: string;
  name: string;
  health: number;
  speed: number;
  skills: Skill[];
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

export interface SkillProps {
  name: string;
  cost: number;
  damage?: number[];
  heal?: number[];
}
