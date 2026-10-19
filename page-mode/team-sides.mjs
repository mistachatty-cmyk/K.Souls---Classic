/** Return the physical side assigned to Player 1 for a page match. */
export function playerOneSide(npcSide) {
  return npcSide === 1 ? 2 : 1;
}

/** Convert physical-side KO counts into the stable run-record player order. */
export function mapPageTeamScores(teamKOs, npcSide) {
  return {
    player1: teamKOs[playerOneSide(npcSide)],
    player2: teamKOs[npcSide],
  };
}
