import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyPageMaterial, materialDamage, materialDurability, materialStageLabel } from "./materials.mjs";

test("page element materials follow their visible content role", () => {
  assert.equal(classifyPageMaterial("IMG"), "glass");
  assert.equal(classifyPageMaterial("VIDEO"), "glass");
  assert.equal(classifyPageMaterial("P"), "paper");
  assert.equal(classifyPageMaterial("ARTICLE"), "stone");
  assert.equal(classifyPageMaterial("DIV"), "digital");
});

test("sandbox uploads inherit media or digital material behavior", () => {
  assert.equal(classifyPageMaterial("IMG", true), "glass");
  assert.equal(classifyPageMaterial("VIDEO", true), "glass");
  assert.equal(classifyPageMaterial("DIV", true), "digital");
});

test("fragile media breaks faster and sturdy panels resist more damage", () => {
  const base = 6;
  assert.ok(materialDamage(2, "glass") > materialDamage(2, "paper"));
  assert.ok(materialDurability(base, "glass") < materialDurability(base, "digital"));
  assert.ok(materialDurability(base, "stone") > materialDurability(base, "digital"));
});

test("material damage stages read differently for each target material", () => {
  assert.equal(materialStageLabel("glass", 1), "CHIPPED");
  assert.equal(materialStageLabel("paper", 2), "TEARING");
  assert.equal(materialStageLabel("stone", 3), "FRACTURING");
});
