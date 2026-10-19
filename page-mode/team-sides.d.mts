export type PageSide = 1 | 2;

export function playerOneSide(npcSide: PageSide): PageSide;
export function mapPageTeamScores(
  teamKOs: Record<PageSide, number>,
  npcSide: PageSide,
): { player1: number; player2: number };
