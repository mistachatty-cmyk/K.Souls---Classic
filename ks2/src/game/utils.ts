import type { Character } from "./types";

export function rotatePoint(ox: number, oy: number, angle: number): [number, number] {
  return [
    ox * Math.cos(angle) - oy * Math.sin(angle),
    ox * Math.sin(angle) + oy * Math.cos(angle),
  ];
}

export function getWeaponTip(c: Character): [number, number] {
  let reach = 30;
  if (c.weapon === "dagger") reach = 18;
  else if (c.weapon === "spear") reach = 45;
  else if (c.weapon === "scythe") reach = 40;
  else if (c.weapon === "axe") reach = 25;
  else if (c.weapon === "katana") reach = 35;
  else if (c.weapon === "mace") reach = 28;
  else if (c.weapon === "rapier") reach = 42;
  else if (c.weapon === "whip") reach = 38;
  else if (c.weapon === "blaster" || c.weapon === "fireball") reach = 20;
  else if (c.weapon === "none") reach = 0;
  const [wx, wy] = rotatePoint(0, -reach * c.scale, c.angle);
  return [c.x + wx, c.y + wy];
}

export const ObjectPoolSystem = {
  acquire: <T extends { active: boolean }>(
    pool: T[],
    usePool: boolean,
    maxSize: number,
    create: () => T,
    init: (item: T) => void
  ) => {
    if (usePool) {
      const deadItem = pool.find((i) => !i.active);
      if (deadItem) {
        init(deadItem);
        deadItem.active = true;
        return;
      }
    }
    if (maxSize > 0 && pool.length >= maxSize) return;
    const newItem = create();
    init(newItem);
    newItem.active = true;
    pool.push(newItem);
  }
};
