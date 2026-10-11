import { CHAR_RADIUS } from "../game/constants";
import type { Character, ThemeMode, KineticType, WeaponType, LokModifier, Ghost, HpBarStyle } from "../game/types";

export function getTeamColor(
  team: number,
  theme: ThemeMode,
  kType: KineticType = "standard",
  ts: number = 0,
): string {
  if (kType === "bounty") return "#ffd700";
  if (kType === "null") return "#555555";
  if (kType === "zombie" || team === 5) return "#33ff33";
  if (kType === "necromancer") return "#aa00ff";
  if (kType === "volatile") return "#ff2222";
  if (kType === "gravity") return "#8800ff";
  if (kType === "vanguard") return "#aaddff";
  if (kType === "weaver") return "#00ff88";
  if (kType === "hivemind") return "#ff8800";
  if (kType === "glitch_chrono") return "#ff00ff";
  if (kType === "vampire_lord" || kType === "bat") return "#ff0044";
  if (kType === "angel" || kType === "cherub") return "#ffffaa";
  if (kType === "drone") return "#888888";
  if (kType === "wasp") return "#ffff00";
  if (kType === "fragment") return "#aa88ff";
  if (kType === "spore") return "#88ff88";

  if (theme === "rgb_cycle" || theme === "neon_overdrive")
    return `hsl(${(ts * 0.1 + team * 90) % 360}, 100%, 60%)`;
  if (theme === "wireframe_matrix")
    return team === 1 ? "#00ff00" : team === 2 ? "#00aa00" : "#aaffaa";
  if (theme === "glassmorphism")
    return team === 1
      ? "rgba(255, 80, 80, 0.7)"
      : team === 2
        ? "rgba(80, 150, 255, 0.7)"
        : "rgba(80, 255, 80, 0.7)";
  if (theme === "blood_moon")
    return team === 1 ? "#ff0000" : team === 2 ? "#cc0000" : "#880000";
  if (theme === "celestial_forge")
    return team === 1 ? "#00ffff" : team === 2 ? "#ffcc00" : "#ffffff";
  if (theme === "paper_sketch") return "#000000";
  if (theme === "gameboy") return team === 1 ? "#306230" : "#0f380f";
  if (theme === "runesite" || theme === "runesite_ultimate")
    return team === 1
      ? "#b12a2a"
      : team === 2
        ? "#2a52b1"
        : team === 3
          ? "#2ab144"
          : "#b1a82a";
  if (theme === "gsix")
    return team === 1
      ? "#00f0ff"
      : team === 2
        ? "#cccccc"
        : team === 3
          ? "#ffffff"
          : "#444444";
  if (theme === "gilded")
    return team === 1
      ? "#ffd700"
      : team === 2
        ? "#b8860b"
        : team === 3
          ? "#e5e4e2"
          : "#8b0000";
  if (theme === "lokmod")
    return team === 1
      ? "#ffd700"
      : team === 2
        ? "#ccaaff"
        : team === 3
          ? "#ffffff"
          : "#444444";
  if (theme === "glitch")
    return team === 1
      ? "#00ffff"
      : team === 2
        ? "#ff00ff"
        : team === 3
          ? "#ffff00"
          : "#ffffff";
  if (theme === "monochrome" || theme === "comic")
    return team === 1
      ? "#ffffff"
      : team === 2
        ? "#888888"
        : team === 3
          ? "#dddddd"
          : "#444444";
  if (theme === "celestial")
    return team === 1
      ? "#ffffff"
      : team === 2
        ? "#ffd700"
        : team === 3
          ? "#aaccff"
          : "#eeeeee";
  if (theme === "overdrive")
    return team === 1
      ? "#ff2200"
      : team === 2
        ? "#ffaa00"
        : team === 3
          ? "#ff0000"
          : "#880000";
  if (theme === "hacker")
    return team === 1
      ? "#00ff00"
      : team === 2
        ? "#008800"
        : team === 3
          ? "#ccffcc"
          : "#004400";
  if (theme === "synthwave" || theme === "neon_abyss")
    return team === 1
      ? "#ff00ff"
      : team === 2
        ? "#00ffff"
        : team === 3
          ? "#ffff00"
          : "#ff8800";
  if (theme === "vampire")
    return team === 1
      ? "#dd0000"
      : team === 2
        ? "#550000"
        : team === 3
          ? "#ffffff"
          : "#880000";
  if (theme === "oceanic")
    return team === 1
      ? "#00aaff"
      : team === 2
        ? "#0055ff"
        : team === 3
          ? "#00ffcc"
          : "#002288";
  if (theme === "infernal")
    return team === 1
      ? "#ff4400"
      : team === 2
        ? "#ff8800"
        : team === 3
          ? "#ffaa00"
          : "#882200";
  if (theme === "abyss")
    return team === 1
      ? "#ffffff"
      : team === 2
        ? "#aaaaaa"
        : team === 3
          ? "#dddddd"
          : "#555555";
  if (theme === "solaris")
    return team === 1 ? "#ffaa00" : team === 2 ? "#ff4400" : "#ffff00";
  if (theme === "deepsea")
    return team === 1 ? "#00ffff" : team === 2 ? "#0088ff" : "#aaffff";
  if (theme === "liminal")
    return team === 1 ? "#ff0000" : team === 2 ? "#555555" : "#000000";
  if (theme === "nebula")
    return team === 1 ? "#ff00ff" : team === 2 ? "#00ffff" : "#aa00ff";

  return team === 1
    ? "#ff6655"
    : team === 2
      ? "#5599ff"
      : team === 3
        ? "#55ff55"
        : "#ffff55";
}

export function drawSkin(
  ctx: CanvasRenderingContext2D,
  c: Character,
  color: string,
  skin: string,
  scale: number,
  flash: boolean = false,
  theme: ThemeMode = "classic",
  devMode: boolean = false
): boolean {
  const isWire = devMode || theme === "wireframe_matrix" || theme === "paper_sketch";
  const isGlass = theme === "glassmorphism";
  const isAbyss = theme === "abyss" || theme === "hacker" || theme === "glitch" || theme === "neon_abyss" || theme === "rgb_cycle" || theme === "neon_overdrive";

  const applyColor = (cBase: string) => {
    if (flash) return "white";
    if (isGlass) return "rgba(255,255,255,0.2)";
    if (isAbyss && cBase !== "#000" && cBase !== "#fff" && cBase !== "#000000" && cBase !== "#ffffff" && cBase !== "rgba(0,0,0,0.3)") return color;
    return cBase;
  };

  const fill = () => {
    if (isWire) ctx.stroke();
    else ctx.fill();
  };

  const fillRect = (x: number, y: number, w: number, h: number) => {
    if (isWire) ctx.strokeRect(x, y, w, h);
    else ctx.fillRect(x, y, w, h);
  };

  if (skin === "pacman") {
    ctx.fillStyle = "#ffff00";
    ctx.fillStyle = applyColor("#ffff00");
    ctx.strokeStyle = applyColor("#ffff00");
    ctx.beginPath();
    const mouthOpen = Math.abs(Math.sin(Date.now() / 100)) * 0.5;
    ctx.arc(0, 0, 15 * scale, mouthOpen, Math.PI * 2 - mouthOpen);
    ctx.lineTo(0, 0);
    ctx.fill();
    fill();
    return true;
  }
  if (skin === "tea") {
    ctx.fillStyle = "#fff";
    ctx.fillRect(-12 * scale, -10 * scale, 24 * scale, 20 * scale);
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = applyColor("#fff");
    ctx.strokeStyle = applyColor("#fff");
    fillRect(-12 * scale, -10 * scale, 24 * scale, 20 * scale);
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.arc(12 * scale, 0, 8 * scale, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fillRect(-10 * scale, -8 * scale, 20 * scale, 10 * scale);
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    fillRect(-10 * scale, -8 * scale, 20 * scale, 10 * scale);
    return true;
  }
  if (skin === "ballman") {
    ctx.fillStyle = color;
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    ctx.beginPath();
    ctx.arc(0, 0, 14 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    fill();
    ctx.fillStyle = applyColor("#fff");
    ctx.strokeStyle = applyColor("#fff");
    ctx.beginPath();
    ctx.arc(-5 * scale, -5 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.arc(5 * scale, -5 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    fill();
    ctx.fillStyle = applyColor("#000");
    ctx.strokeStyle = applyColor("#000");
    ctx.beginPath();
    ctx.arc(-5 * scale, -5 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.arc(5 * scale, -5 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
    fill();
    return true;
  }
  if (skin === "fallguys") {
    ctx.fillStyle = color;
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    ctx.beginPath();
    ctx.roundRect(-10 * scale, -15 * scale, 20 * scale, 30 * scale, 10 * scale);
    ctx.fill();
    ctx.fillStyle = "#fff";
    fill();
    ctx.fillStyle = applyColor("#fff");
    ctx.strokeStyle = applyColor("#fff");
    ctx.beginPath();
    ctx.roundRect(-6 * scale, -10 * scale, 12 * scale, 8 * scale, 4 * scale);
    ctx.fill();
    fill();
    return true;
  }
  if (skin === "food") {
    ctx.fillStyle = "#e8b878";
    ctx.fillStyle = applyColor("#e8b878");
    ctx.strokeStyle = applyColor("#e8b878");
    ctx.beginPath();
    ctx.arc(0, -5 * scale, 12 * scale, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#552200";
    ctx.fillRect(-12 * scale, -5 * scale, 24 * scale, 6 * scale);
    ctx.fillStyle = "#22aa22";
    ctx.fillRect(-13 * scale, 1 * scale, 26 * scale, 3 * scale);
    ctx.fillStyle = "#e8b878";
    ctx.fillRect(-11 * scale, 4 * scale, 22 * scale, 6 * scale);
    fill();
    ctx.fillStyle = applyColor("#552200");
    ctx.strokeStyle = applyColor("#552200");
    fillRect(-12 * scale, -5 * scale, 24 * scale, 6 * scale);
    ctx.fillStyle = applyColor("#22aa22");
    ctx.strokeStyle = applyColor("#22aa22");
    fillRect(-13 * scale, 1 * scale, 26 * scale, 3 * scale);
    ctx.fillStyle = applyColor("#e8b878");
    ctx.strokeStyle = applyColor("#e8b878");
    fillRect(-11 * scale, 4 * scale, 22 * scale, 6 * scale);
    return true;
  }
  if (skin === "voxel") {
    ctx.fillStyle = color;
    ctx.fillRect(-10 * scale, -10 * scale, 20 * scale, 20 * scale);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(-10 * scale, 0, 20 * scale, 10 * scale);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-6 * scale, -6 * scale, 4 * scale, 4 * scale);
    ctx.fillRect(2 * scale, -6 * scale, 4 * scale, 4 * scale);
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    fillRect(-10 * scale, -10 * scale, 20 * scale, 20 * scale);
    ctx.fillStyle = applyColor("rgba(0,0,0,0.3)");
    ctx.strokeStyle = applyColor("rgba(0,0,0,0.3)");
    fillRect(-10 * scale, 0, 20 * scale, 10 * scale);
    ctx.fillStyle = applyColor("#fff");
    ctx.strokeStyle = applyColor("#fff");
    fillRect(-6 * scale, -6 * scale, 4 * scale, 4 * scale);
    fillRect(2 * scale, -6 * scale, 4 * scale, 4 * scale);
    return true;
  }
  if (skin === "mecha") {
    ctx.fillStyle = "#888";
    ctx.fillRect(-12 * scale, -15 * scale, 24 * scale, 30 * scale);
    ctx.fillStyle = color;
    ctx.fillRect(-10 * scale, -12 * scale, 20 * scale, 10 * scale);
    ctx.fillStyle = "#0ff";
    ctx.fillRect(-6 * scale, -20 * scale, 12 * scale, 5 * scale);
    ctx.fillStyle = applyColor("#888");
    ctx.strokeStyle = applyColor("#888");
    fillRect(-12 * scale, -15 * scale, 24 * scale, 30 * scale);
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    fillRect(-10 * scale, -12 * scale, 20 * scale, 10 * scale);
    ctx.fillStyle = applyColor("#0ff");
    ctx.strokeStyle = applyColor("#0ff");
    fillRect(-6 * scale, -20 * scale, 12 * scale, 5 * scale);
    return true;
  }
  if (skin === "diamond") {
    ctx.fillStyle = color;
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    ctx.beginPath();
    ctx.moveTo(0, -18 * scale);
    ctx.lineTo(14 * scale, 0);
    ctx.lineTo(0, 18 * scale);
    ctx.lineTo(-14 * scale, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    fill();
    ctx.fillStyle = applyColor("rgba(255,255,255,0.5)");
    ctx.strokeStyle = applyColor("rgba(255,255,255,0.5)");
    ctx.beginPath();
    ctx.moveTo(0, -18 * scale);
    ctx.lineTo(7 * scale, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    fill();
    return true;
  }
  if (skin === "skull") {
    ctx.fillStyle = "#eee";
    ctx.fillStyle = applyColor("#eee");
    ctx.strokeStyle = applyColor("#eee");
    ctx.beginPath();
    ctx.arc(0, -5 * scale, 12 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-10 * scale, -5 * scale, 20 * scale, 10 * scale);
    ctx.fillStyle = "#000";
    fill();
    fillRect(-10 * scale, -5 * scale, 20 * scale, 10 * scale);
    ctx.fillStyle = applyColor("#000");
    ctx.strokeStyle = applyColor("#000");
    ctx.beginPath();
    ctx.arc(-4 * scale, -7 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.arc(4 * scale, -7 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-6 * scale, 1 * scale, 3 * scale, 5 * scale);
    ctx.fillRect(-1 * scale, 1 * scale, 3 * scale, 5 * scale);
    ctx.fillRect(4 * scale, 1 * scale, 3 * scale, 5 * scale);
    fill();
    fillRect(-6 * scale, 1 * scale, 3 * scale, 5 * scale);
    fillRect(-1 * scale, 1 * scale, 3 * scale, 5 * scale);
    fillRect(4 * scale, 1 * scale, 3 * scale, 5 * scale);
    return true;
  }
  if (skin === "robot") {
    ctx.fillStyle = "#555";
    ctx.fillRect(-11 * scale, -16 * scale, 22 * scale, 14 * scale);
    ctx.fillStyle = color;
    ctx.fillRect(-11 * scale, -2 * scale, 22 * scale, 14 * scale);
    ctx.fillStyle = "#0f0";
    ctx.fillRect(-8 * scale, -13 * scale, 5 * scale, 4 * scale);
    ctx.fillRect(3 * scale, -13 * scale, 5 * scale, 4 * scale);
    ctx.fillStyle = "#888";
    ctx.fillRect(-11 * scale, -16 * scale, 22 * scale, 3 * scale);
    ctx.fillStyle = applyColor("#555");
    ctx.strokeStyle = applyColor("#555");
    fillRect(-11 * scale, -16 * scale, 22 * scale, 14 * scale);
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    fillRect(-11 * scale, -2 * scale, 22 * scale, 14 * scale);
    ctx.fillStyle = applyColor("#0f0");
    ctx.strokeStyle = applyColor("#0f0");
    fillRect(-8 * scale, -13 * scale, 5 * scale, 4 * scale);
    fillRect(3 * scale, -13 * scale, 5 * scale, 4 * scale);
    ctx.fillStyle = applyColor("#888");
    ctx.strokeStyle = applyColor("#888");
    fillRect(-11 * scale, -16 * scale, 22 * scale, 3 * scale);
    return true;
  }
  if (skin === "ghost") {
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = color;
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    ctx.beginPath();
    ctx.arc(0, -5 * scale, 10 * scale, Math.PI, 0);
    ctx.lineTo(10 * scale, 10 * scale);
    ctx.lineTo(5 * scale, 5 * scale);
    ctx.lineTo(0, 10 * scale);
    ctx.lineTo(-5 * scale, 5 * scale);
    ctx.lineTo(-10 * scale, 10 * scale);
    ctx.closePath();
    ctx.fill();
    fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.fillStyle = applyColor("white");
    ctx.strokeStyle = applyColor("white");
    ctx.beginPath();
    ctx.arc(-4 * scale, -7 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.arc(4 * scale, -7 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
    fill();
    return true;
  }
  void c;
  return false;
}

export function drawRawChar(
  ctx: CanvasRenderingContext2D,
  c: Character,
  flash: boolean,
  theme: ThemeMode,
  devMode: boolean,
  timestamp: number,
) {
  const scale = c.scale;
  const team = c.team;
  if (flash) {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
  }

  if (devMode || theme === "wireframe_matrix" || theme === "paper_sketch") {
    ctx.strokeStyle = flash
      ? "white"
      : theme === "paper_sketch"
        ? "#000"
        : getTeamColor(team, theme, c.kineticType, timestamp);
    ctx.lineWidth = theme === "wireframe_matrix" ? 2 * scale : 1.5;

    if (
      c.skin !== "default" &&
      drawSkin(ctx, c, "transparent", c.skin, scale, flash, theme, devMode)
    ) {
      ctx.stroke();
    } else {
      for (const p of c.parts) {
        ctx.beginPath();
        ctx.arc(p.ox, p.oy, p.r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (c.weapon !== "none") {
      let wR = 6;
      if (
        c.weapon === "dagger" ||
        c.weapon === "katana" ||
        c.weapon === "rapier"
      )
        wR = 4;
      else if (
        c.weapon === "hammer" ||
        c.weapon === "axe" ||
        c.weapon === "mace"
      )
        wR = 10;
      const reach =
        c.weapon === "spear"
          ? 45
          : c.weapon === "dagger"
            ? 18
            : c.weapon === "scythe"
              ? 40
              : c.weapon === "katana"
                ? 35
                : c.weapon === "axe"
                  ? 25
                  : c.weapon === "mace"
                    ? 28
                    : c.weapon === "rapier"
                      ? 42
                      : c.weapon === "whip"
                        ? 38
                        : c.weapon === "blaster" || c.weapon === "fireball"
                          ? 20
                          : 30;
      ctx.strokeStyle = flash
        ? "white"
        : theme === "wireframe_matrix"
          ? "#fff"
          : theme === "paper_sketch"
            ? "#000"
            : "#00ff00";
      ctx.beginPath();
      ctx.arc(0, -reach * scale, wR * scale, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (theme === "glassmorphism") {
    const color = getTeamColor(team, theme, c.kineticType, timestamp);
    ctx.fillStyle = flash ? "white" : color;
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 1.5 * scale;
    if (!drawSkin(ctx, c, color, c.skin, scale, flash, theme, devMode)) {
      for (const p of c.parts) {
        ctx.beginPath();
        if (p.type === "body") ctx.roundRect(p.ox - p.r, p.oy - p.r * 1.2, p.r * 2, p.r * 2.4, p.r * 0.4);
        else if (p.type === "head") ctx.arc(p.ox, p.oy, p.r, 0, Math.PI * 2);
        else ctx.roundRect(p.ox - p.r, p.oy - p.r, p.r * 2, p.r * 2, p.r * 0.5);
        ctx.fill();
        ctx.stroke();
      }
    }
    if (c.weapon !== "none")
      drawWeapon(
        ctx,
        c.weapon,
        scale,
        "rgba(255,255,255,0.8)",
        "rgba(200,200,200,0.4)",
        theme,
        timestamp,
      );
  } else if (
    theme === "abyss" ||
    theme === "hacker" ||
    theme === "glitch" ||
    theme === "neon_abyss" ||
    theme === "rgb_cycle" ||
    theme === "neon_overdrive"
  ) {
    let glowColor = getTeamColor(team, theme, c.kineticType, timestamp);
    if (theme === "neon_abyss")
      glowColor = team === 1 ? "#ff00ff" : team === 2 ? "#00ffff" : "#00ff00";
    if (c.kineticType === "ghost" || c.skin === "ghost") ctx.globalAlpha = 0.4;

    if (!drawSkin(ctx, c, glowColor, c.skin, scale, flash, theme, devMode)) {
      for (const p of c.parts) {
        if (theme === "neon_abyss") {
          ctx.strokeStyle = flash ? "white" : glowColor;
          ctx.lineWidth = 2 * scale;
          ctx.strokeRect(p.ox - p.r, p.oy - p.r, p.r * 2, p.r * 2);
        } else {
          ctx.beginPath();
          if (p.type === "body") ctx.roundRect(p.ox - p.r, p.oy - p.r * 1.2, p.r * 2, p.r * 2.4, p.r * 0.4);
          else if (p.type === "head") ctx.arc(p.ox, p.oy, p.r, 0, Math.PI * 2);
          else ctx.roundRect(p.ox - p.r, p.oy - p.r, p.r * 2, p.r * 2, p.r * 0.5);

          ctx.fillStyle = "#050505";
          ctx.fill();

          ctx.lineWidth = 1.5 * scale;
          ctx.strokeStyle = flash ? "white" : p.type === "head" ? glowColor : "rgba(255,255,255,0.15)";

          if (p.type === "head") {
            ctx.shadowBlur = 12;
            ctx.shadowColor = glowColor;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.stroke();
        }
      }
    }
    if (c.weapon !== "none")
      drawWeapon(
        ctx,
        c.weapon,
        scale,
        flash
          ? "white"
          : theme === "hacker"
            ? "#00ff00"
            : theme === "glitch"
              ? "#fff"
              : "#ffff00",
        flash
          ? "white"
          : theme === "hacker"
            ? "#005500"
            : "#ffff00",
        theme,
        timestamp,
      );
    ctx.globalAlpha = 1;
  } else if (c.kineticType === "drone") {
    const color = getTeamColor(team, theme, c.kineticType, timestamp);
    ctx.fillStyle = flash ? "#fff" : "#333";
    ctx.fillRect(-10 * scale, -10 * scale, 20 * scale, 20 * scale);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(-10 * scale, -10 * scale, 20 * scale, 20 * scale);
    ctx.fillStyle = "#ff0000";
    ctx.beginPath(); ctx.arc(0, -4 * scale, 3 * scale, 0, Math.PI * 2); ctx.fill();
  } else if (c.kineticType === "wasp") {
    const color = getTeamColor(team, theme, c.kineticType, timestamp);
    ctx.fillStyle = "#222";
    ctx.beginPath(); ctx.ellipse(0, 0, 8 * scale, 12 * scale, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(-8 * scale, -4 * scale, 16 * scale, 4 * scale);
    ctx.fillRect(-8 * scale, 4 * scale, 16 * scale, 4 * scale);
    // Blurred wings
    const wingSweep = Math.sin(timestamp * 0.05) * 20;
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath(); ctx.ellipse(-10 * scale, -5 * scale, 15 * scale, 5 * scale, wingSweep * 0.01, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(10 * scale, -5 * scale, 15 * scale, 5 * scale, -wingSweep * 0.01, 0, Math.PI * 2); ctx.fill();
  } else if (c.kineticType === "fragment") {
    const color = getTeamColor(team, theme, c.kineticType, timestamp);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -15 * scale);
    ctx.lineTo(12 * scale, 5 * scale);
    ctx.lineTo(-5 * scale, 12 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.stroke();
  } else if (c.kineticType === "spore") {
    const color = getTeamColor(team, theme, c.kineticType, timestamp);
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(0, 0, 12 * scale, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(-4 * scale, -4 * scale, 4 * scale, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1.0;
  } else {
    // Cast to string so TypeScript's control-flow narrowing (which already eliminated
    // many ThemeMode members in the above branches) doesn't flag valid comparisons as impossible.
    const th = theme as string;
    let skin = "#ffcc99",
      dark = "#aa2211";
    if (c.kineticType === "bounty") {
      skin = "#ffffff";
      dark = "#ffd700";
    } else if (c.kineticType === "zombie" || team === 5) {
      skin = "#ccffcc";
      dark = "#004400";
    } else if (c.kineticType === "null") {
      skin = "#aaaaaa";
      dark = "#555555";
    } else if (theme === "gameboy") {
      skin = "#8bac0f";
      dark = team === 1 ? "#0f380f" : "#306230";
    } else if (theme === "runesite" || theme === "runesite_ultimate") {
      skin = "#dca878";
      dark = team === 1 ? "#5e1515" : "#152c5e";
    } else if (theme === "gsix") {
      skin = "#080808";
      dark = "#cccccc";
    } else if (theme === "gilded" || theme === "lokmod") {
      skin = "#fff";
      dark = "#1a0f00";
    } else if (theme === "synthwave") {
      skin = "#ffccff";
      dark = "#220044";
    } else if (theme === "vampire" || theme === "blood_moon") {
      skin = "#ffffff";
      dark = "#222222";
    } else if (theme === "oceanic") {
      skin = "#ccffff";
      dark = "#002244";
    } else if (theme === "infernal" || theme === "overdrive") {
      skin = "#ffaaaa";
      dark = "#440000";
    } else if (theme === "monochrome" || theme === "comic") {
      skin = "#ffffff";
      dark = "#000000";
    } else if (theme === "celestial" || theme === "celestial_forge") {
      skin = "#ffffff";
      dark = "#aa8800";
    } else {
      dark =
        team === 1
          ? "#aa2211"
          : team === 2
            ? "#2244aa"
            : team === 3
              ? "#22aa22"
              : "#aaaa22";
    }
    const color = getTeamColor(team, theme, c.kineticType, timestamp);

    if (c.kineticType === "ghost" || c.skin === "ghost") ctx.globalAlpha = 0.4;

    if (!drawSkin(ctx, c, color, c.skin, scale, flash, theme, devMode)) {
      if (theme === "neon") {
        ctx.fillStyle = "#050505";
        ctx.strokeStyle = flash ? "white" : color;
        ctx.lineWidth = 2 * scale;
        ctx.shadowBlur = flash ? 15 : 8;
        ctx.shadowColor = flash ? "white" : color;
        for (const p of c.parts) {
          ctx.fillRect(p.ox - p.r, p.oy - p.r, p.r * 2, p.r * 2);
          ctx.strokeRect(p.ox - p.r, p.oy - p.r, p.r * 2, p.r * 2);
        }
      } else {
        for (const p of c.parts) {
          const partColor = flash
            ? "white"
            : p.type === "head"
              ? skin
              : p.type === "body"
                ? color
                : p.type === "arm"
                  ? dark
                  : color;
          
          ctx.fillStyle = partColor;
          
          if (!flash && th !== "comic" && th !== "paper_sketch") {
             ctx.shadowBlur = 4;
             ctx.shadowColor = "rgba(0,0,0,0.4)";
          }
          
          ctx.beginPath();
          if (p.type === "body") ctx.roundRect(p.ox - p.r, p.oy - p.r * 1.2, p.r * 2, p.r * 2.4, p.r * 0.4);
          else if (p.type === "head") ctx.arc(p.ox, p.oy, p.r, 0, Math.PI * 2);
          else ctx.roundRect(p.ox - p.r, p.oy - p.r, p.r * 2, p.r * 2, p.r * 0.5);
          ctx.fill();
          
          if (th === "comic" || th === "paper_sketch") {
            ctx.strokeStyle = th === "comic" ? "#000" : "rgba(0,0,0,0.6)";
            ctx.lineWidth = 1.5 * scale;
            ctx.stroke();
          } else if (!flash) {
            ctx.strokeStyle = "rgba(0,0,0,0.2)";
            ctx.lineWidth = 1 * scale;
            ctx.stroke();
          }
          
          ctx.shadowBlur = 0;

          if (!flash && p.type === "head") {
            const t = theme as string;
            const eyeColor =
              t === "gsix" || t === "lokmod" || t === "gilded" || t === "neon_abyss"
                ? "#00ffff"
                : t === "vampire" || t === "blood_moon" || t === "infernal"
                ? "#ff0000"
                : t === "gameboy"
                ? "#0f380f"
                : "rgba(255,255,255,0.9)";
            
            ctx.fillStyle = t === "comic" || t === "paper_sketch" ? "#000" : "#111";
            ctx.beginPath();
            ctx.roundRect(p.ox - 7 * scale, p.oy - 3 * scale, 14 * scale, 6 * scale, 3 * scale);
            ctx.fill();
            
            ctx.fillStyle = eyeColor;
            ctx.shadowBlur = (theme as string) === "gameboy" || theme === "comic" || (theme as string) === "paper_sketch" ? 0 : 8;
            ctx.shadowColor = eyeColor;
            ctx.beginPath();
            ctx.roundRect(p.ox - 5 * scale, p.oy - 1.5 * scale, 10 * scale, 3 * scale, 1.5 * scale);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }
    }

    if (c.shieldHp > 0) {
      ctx.strokeStyle = "rgba(0, 150, 255, 0.8)";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00aaff";
      ctx.beginPath();
      ctx.arc(0, 0, CHAR_RADIUS * scale * 1.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    if (c.weapon !== "none") {
      let wCol1 = flash ? "white" : "#ffee44";
      let wCol2 = flash ? "white" : "#aaaaaa";
      if (theme === "gameboy") {
        wCol1 = "#9bbc0f";
        wCol2 = "#306230";
      }
      if (theme === "runesite" || theme === "runesite_ultimate") {
        wCol1 = flash ? "white" : "#aaaaaa";
        wCol2 = flash ? "white" : "#555555";
      }
      if (theme === "gsix") {
        wCol1 = flash ? "white" : "#00f0ff";
        wCol2 = flash ? "white" : "#444";
      }
      if (
        theme === "gilded" ||
        theme === "lokmod" ||
        theme === "celestial" ||
        c.kineticType === "bounty" ||
        theme === "celestial_forge"
      ) {
        wCol1 = flash ? "white" : "#ffd700";
        wCol2 = flash ? "white" : "#cc9900";
      }
      if (
        theme === "vampire" ||
        theme === "monochrome" ||
        theme === "overdrive" ||
        theme === "comic" ||
        theme === "blood_moon"
      ) {
        wCol1 = flash ? "white" : "#ff0000";
        wCol2 = flash ? "white" : "#555555";
      }
      if (
        theme === "neon" ||
        theme === "synthwave" ||
        (theme as string) === "glitch" ||
        (theme as string) === "neon_overdrive"
      ) {
        wCol1 = flash ? "white" : "#ffff00";
        wCol2 = "transparent";
      }
      if ((theme as string) === "rgb_cycle") {
        wCol1 = color;
        wCol2 = "#fff";
      }
      drawWeapon(ctx, c.weapon, scale, wCol1, wCol2, theme, timestamp);
    }
    ctx.globalAlpha = 1;
  }

  if (c.isBoss && !c.dead) {
    ctx.save();
    ctx.fillStyle = "#ffd700";
    ctx.strokeStyle = "#aa8800";
    ctx.lineWidth = 1;
    const cy = -CHAR_RADIUS * scale * 2.2;
    ctx.beginPath();
    ctx.moveTo(-7 * scale, cy + 4 * scale);
    ctx.lineTo(-7 * scale, cy - 2 * scale);
    ctx.lineTo(-4 * scale, cy);
    ctx.lineTo(0, cy - 5 * scale);
    ctx.lineTo(4 * scale, cy);
    ctx.lineTo(7 * scale, cy - 2 * scale);
    ctx.lineTo(7 * scale, cy + 4 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

export function drawWeapon(
  ctx: CanvasRenderingContext2D,
  type: WeaponType,
  scale: number,
  c1: string,
  c2: string,
  theme: ThemeMode,
  ts: number,
) {
  if (type === "none") return;
  void ts;
  if (
    theme === "neon" ||
    theme === "synthwave" ||
    theme === "glitch" ||
    theme === "neon_abyss" ||
    theme === "neon_overdrive"
  ) {
    ctx.strokeStyle = c1;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    if (type === "dagger") {
      ctx.moveTo(0, -20 * scale);
      ctx.lineTo(0, -28 * scale);
    } else if (type === "spear") {
      ctx.moveTo(0, -26 * scale);
      ctx.lineTo(0, -58 * scale);
    } else if (type === "scythe") {
      ctx.moveTo(0, -26 * scale);
      ctx.lineTo(0, -40 * scale);
      ctx.quadraticCurveTo(-20 * scale, -35 * scale, -25 * scale, -20 * scale);
    } else if (type === "axe") {
      ctx.moveTo(0, -20 * scale);
      ctx.lineTo(0, -35 * scale);
      ctx.moveTo(-10 * scale, -30 * scale);
      ctx.lineTo(10 * scale, -30 * scale);
      ctx.lineTo(10 * scale, -40 * scale);
      ctx.lineTo(-10 * scale, -40 * scale);
      ctx.closePath();
    } else if (type === "katana") {
      ctx.moveTo(0, -20 * scale);
      ctx.quadraticCurveTo(5 * scale, -30 * scale, 0, -45 * scale);
    } else if (type === "mace") {
      ctx.moveTo(0, -20 * scale);
      ctx.lineTo(0, -35 * scale);
      ctx.arc(0, -35 * scale, 6 * scale, 0, Math.PI * 2);
    } else if (type === "rapier") {
      ctx.moveTo(0, -20 * scale);
      ctx.lineTo(0, -45 * scale);
      ctx.moveTo(-3 * scale, -25 * scale);
      ctx.lineTo(3 * scale, -25 * scale);
    } else if (type === "whip") {
      ctx.moveTo(0, -20 * scale);
      ctx.bezierCurveTo(
        -20 * scale,
        -30 * scale,
        20 * scale,
        -40 * scale,
        0,
        -50 * scale,
      );
    } else if (type === "blaster" || type === "fireball") {
      ctx.moveTo(-4 * scale, -20 * scale);
      ctx.lineTo(4 * scale, -20 * scale);
      ctx.lineTo(4 * scale, -26 * scale);
      ctx.lineTo(1 * scale, -26 * scale);
      ctx.lineTo(1 * scale, -30 * scale);
      ctx.lineTo(-1 * scale, -30 * scale);
      ctx.lineTo(-1 * scale, -26 * scale);
      ctx.lineTo(-4 * scale, -26 * scale);
      ctx.closePath();
    } else {
      ctx.moveTo(0, -26 * scale);
      ctx.lineTo(0, -46 * scale);
      if (type === "hammer") {
        ctx.moveTo(-6 * scale, -42 * scale);
        ctx.lineTo(6 * scale, -42 * scale);
      }
    }
    ctx.stroke();
    return;
  }
  ctx.fillStyle = c2;
  if (theme === "comic" || theme === "paper_sketch") {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
  }
  const drawPoly = (pts: number[]) => {
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.closePath();
    ctx.fill();
    if (theme === "comic" || theme === "paper_sketch") ctx.stroke();
  };

  if (type === "dagger") {
    ctx.fillRect(-2 * scale, -26 * scale, 4 * scale, 6 * scale);
    ctx.fillStyle = c1;
    ctx.fillRect(-2 * scale, -30 * scale, 4 * scale, 4 * scale);
  } else if (type === "spear") {
    ctx.fillRect(-2 * scale, -46 * scale, 4 * scale, 26 * scale);
    ctx.fillStyle = c1;
    ctx.fillRect(-3 * scale, -58 * scale, 6 * scale, 12 * scale);
  } else if (type === "hammer") {
    ctx.fillRect(-2 * scale, -38 * scale, 4 * scale, 18 * scale);
    ctx.fillStyle = c1;
    ctx.fillRect(-8 * scale, -44 * scale, 16 * scale, 10 * scale);
  } else if (type === "scythe") {
    ctx.fillRect(-2 * scale, -40 * scale, 4 * scale, 20 * scale);
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.moveTo(-2 * scale, -40 * scale);
    ctx.quadraticCurveTo(-20 * scale, -30 * scale, -25 * scale, -15 * scale);
    ctx.lineTo(-20 * scale, -15 * scale);
    ctx.quadraticCurveTo(-15 * scale, -25 * scale, -2 * scale, -35 * scale);
    ctx.fill();
    if (theme === "comic" || theme === "paper_sketch") ctx.stroke();
  } else if (type === "axe") {
    ctx.fillRect(-2 * scale, -35 * scale, 4 * scale, 15 * scale);
    ctx.fillStyle = c1;
    ctx.fillRect(-10 * scale, -40 * scale, 20 * scale, 10 * scale);
  } else if (type === "katana") {
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.moveTo(-2 * scale, -20 * scale);
    ctx.quadraticCurveTo(3 * scale, -35 * scale, -2 * scale, -45 * scale);
    ctx.lineTo(2 * scale, -45 * scale);
    ctx.quadraticCurveTo(7 * scale, -35 * scale, 2 * scale, -20 * scale);
    ctx.fill();
    if (theme === "comic" || theme === "paper_sketch") ctx.stroke();
  } else if (type === "mace") {
    ctx.fillRect(-2 * scale, -35 * scale, 4 * scale, 15 * scale);
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.arc(0, -35 * scale, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    if (theme === "comic" || theme === "paper_sketch") ctx.stroke();
  } else if (type === "rapier") {
    ctx.fillRect(-1 * scale, -45 * scale, 2 * scale, 25 * scale);
    ctx.fillStyle = c1;
    ctx.fillRect(-3 * scale, -25 * scale, 6 * scale, 3 * scale);
  } else if (type === "whip") {
    ctx.strokeStyle = c1;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(0, -20 * scale);
    ctx.bezierCurveTo(
      -20 * scale,
      -30 * scale,
      20 * scale,
      -40 * scale,
      0,
      -50 * scale,
    );
    ctx.stroke();
  } else if (type === "blaster" || type === "fireball") {
    drawPoly([
      -4 * scale,
      -20 * scale,
      4 * scale,
      -20 * scale,
      4 * scale,
      -26 * scale,
      1 * scale,
      -26 * scale,
      1 * scale,
      -30 * scale,
      -1 * scale,
      -30 * scale,
      -1 * scale,
      -26 * scale,
      -4 * scale,
      -26 * scale,
    ]);
    ctx.fillStyle = c1;
    ctx.fillRect(-1 * scale, -30 * scale, 2 * scale, 2 * scale);
  } else {
    ctx.fillRect(-3 * scale, -46 * scale, 6 * scale, 8 * scale);
    ctx.fillStyle = c1;
    ctx.fillRect(-2 * scale, -38 * scale, 4 * scale, 12 * scale);
  }
}

export const spriteCache: Record<string, HTMLCanvasElement> = {};
export function getCharSprite(
  c: Character,
  flash: boolean,
  theme: ThemeMode,
  devMode: boolean,
): HTMLCanvasElement {
  const key = `${c.team}-${c.scale}-${c.weapon}-${flash}-${theme}-${devMode}-${c.kineticType}-${c.skin}-${c.isBoss}`;
  if (spriteCache[key]) return spriteCache[key];
  const cvs = document.createElement("canvas");
  const size = 160 * Math.max(1, c.scale);
  cvs.width = size;
  cvs.height = size;
  const ctx = cvs.getContext("2d");
  if (!ctx) return cvs;
  ctx.translate(size / 2, size / 2);
  drawRawChar(ctx, c, flash, theme, devMode, 0);
  spriteCache[key] = cvs;
  return cvs;
}

export function renderChar(
  ctx: CanvasRenderingContext2D,
  c: Character,
  flash: boolean,
  alpha: number,
  theme: ThemeMode,
  devMode: boolean,
  useCache: boolean,
  timestamp: number,
) {
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.globalAlpha = alpha;
  if (
    useCache &&
    !flash &&
    !devMode &&
    alpha === 1 &&
    theme !== "glassmorphism"
  ) {
    const sprite = getCharSprite(c, flash, theme, devMode);
    ctx.rotate(c.angle);
    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
  } else {
    ctx.rotate(c.angle);
    drawRawChar(ctx, c, flash, theme, devMode, timestamp);
  }
  ctx.restore();
}

export function drawHpBar(
  ctx: CanvasRenderingContext2D,
  c: Character,
  modifier: LokModifier,
  devMode: boolean,
  _theme: ThemeMode,
  style: HpBarStyle = "standard"
) {
  if (style === "hidden") return;
  if (
    (modifier === "sudden_death" || modifier === "shrinking_arena") &&
    !devMode
  )
    return;
  const barW = 32 * c.scale;
  let barH = 5 * c.scale;
  if (style === "thick") barH = 10 * c.scale;
  
  const py = c.y - CHAR_RADIUS * c.scale - 18 * c.scale;

  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.beginPath();
  ctx.roundRect(c.x - barW / 2, py, barW, barH, 2 * c.scale);
  ctx.fill();

  const hpPct = Math.max(0, c.hp / c.maxHp);
  let hpColor = "#00ff00";
  if (hpPct <= 0.5 && hpPct > 0.2) hpColor = "#ffff00";
  else if (hpPct <= 0.2) hpColor = "#ff2222";

  if (hpPct > 0) {
    ctx.fillStyle = hpColor;
    ctx.shadowBlur = 6;
    ctx.shadowColor = hpColor;
    ctx.beginPath();
    ctx.roundRect(c.x - barW / 2, py, barW * hpPct, barH, 2 * c.scale);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  if (style === "segmented") {
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 1;
    const segments = Math.floor(c.maxHp / 5);
    for (let i = 1; i < segments; i++) {
       const sx = (c.x - barW / 2) + (barW * (i / segments));
       ctx.beginPath();
       ctx.moveTo(sx, py);
       ctx.lineTo(sx, py + barH);
       ctx.stroke();
    }
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(c.x - barW / 2, py, barW, barH, 2 * c.scale);
  ctx.stroke();

  if (c.isBoss) {
    ctx.fillStyle = "#ffd700";
    ctx.font = `bold ${9 * c.scale}px monospace`;
    ctx.textAlign = "center";
    ctx.shadowBlur = 4;
    ctx.shadowColor = "#ffaa00";
    ctx.fillText("BOSS", c.x, py - 4);
    ctx.shadowBlur = 0;
  }
}

export function drawGhost(
  ctx: CanvasRenderingContext2D,
  g: Ghost,
  _devMode: boolean,
  theme: ThemeMode,
) {
  ctx.save();
  ctx.translate(g.x, g.y);
  ctx.globalAlpha = Math.max(0, g.life / g.maxLife) * 0.6;
  ctx.fillStyle = getTeamColor(g.team, theme);
  ctx.beginPath();
  ctx.arc(0, -5, 10, Math.PI, 0);
  ctx.lineTo(10, 10);
  ctx.lineTo(5, 5);
  ctx.lineTo(0, 10);
  ctx.lineTo(-5, 5);
  ctx.lineTo(-10, 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(-4, -7, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4, -7, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}