import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mapPageTeamScores, playerOneSide } from './team-sides.mjs';

test('Player 1 always starts opposite the configured NPC side', () => {
  assert.equal(playerOneSide(2), 1);
  assert.equal(playerOneSide(1), 2);
});

test('physical KO totals map to stable Player 1 and Player 2 record fields', () => {
  assert.deepEqual(mapPageTeamScores({ 1: 4, 2: 7 }, 2), { player1: 4, player2: 7 });
  assert.deepEqual(mapPageTeamScores({ 1: 4, 2: 7 }, 1), { player1: 7, player2: 4 });
});
