const profiles = {
  glass: { damage: 1.4, durability: 0.78, stages: ["CHIPPED", "CRACKING", "SHATTERING"] },
  paper: { damage: 1.2, durability: 0.82, stages: ["CREASED", "TEARING", "RIPPING"] },
  stone: { damage: 0.78, durability: 1.28, stages: ["CHIPPED", "CRUMBLING", "FRACTURING"] },
  digital: { damage: 1, durability: 1, stages: ["GLITCHED", "CORRUPTED", "FRAGMENTING"] },
};

export function classifyPageMaterial(tagName, sandbox = false) {
  if (sandbox) return tagName === "IMG" || tagName === "VIDEO" ? "glass" : "digital";
  if (tagName === "IMG" || tagName === "VIDEO" || tagName === "SVG" || tagName === "CANVAS") return "glass";
  if (["P", "H1", "H2", "H3", "LI", "BLOCKQUOTE", "FIGCAPTION"].includes(tagName)) return "paper";
  if (["ARTICLE", "SECTION", "ASIDE", "NAV"].includes(tagName)) return "stone";
  return "digital";
}

export function materialDamage(amount, material) {
  return Math.max(0, amount * (profiles[material] || profiles.digital).damage);
}

export function materialDurability(base, material) {
  return base * (profiles[material] || profiles.digital).durability;
}

export function materialStageLabel(material, stage) {
  return (profiles[material] || profiles.digital).stages[Math.max(0, Math.min(2, stage - 1))] || "DAMAGED";
}
