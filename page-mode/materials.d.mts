export type PageMaterial = "glass" | "paper" | "stone" | "digital";
export function classifyPageMaterial(tagName: string, sandbox?: boolean): PageMaterial;
export function materialDamage(amount: number, material: PageMaterial): number;
export function materialDurability(base: number, material: PageMaterial): number;
export function materialStageLabel(material: PageMaterial, stage: number): string;
