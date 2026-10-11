/**
 * HapticSystem
 * A modular, plug-and-play system for handling Gamepad API vibrations.
 * Safely fails if the browser or controller does not support the draft vibrationActuator standard.
 */
export const HapticSystem = {
  rumble: (
    duration: number = 200,
    weakMagnitude: number = 0.5,
    strongMagnitude: number = 0.5,
    controllerIndex?: number
  ) => {
    if (typeof navigator === "undefined" || !navigator.getGamepads) return;

    try {
      const gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (!gp) continue;
        if (controllerIndex !== undefined && i !== controllerIndex) continue;

        // Type assertion since vibrationActuator is a draft spec and might not be fully typed
        const actuator = (gp as any).vibrationActuator;
        if (actuator && actuator.playEffect) {
          actuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration: duration,
            weakMagnitude: Math.min(1.0, Math.max(0, weakMagnitude)),
            strongMagnitude: Math.min(1.0, Math.max(0, strongMagnitude)),
          }).catch(() => { /* Ignore playback constraint errors */ });
        }
      }
    } catch (err) {
      // Silently catch Gamepad API access errors
    }
  },
  
  lightHit: () => HapticSystem.rumble(50, 0.3, 0.1),
  mediumHit: () => HapticSystem.rumble(150, 0.6, 0.4),
  explosion: () => HapticSystem.rumble(300, 0.8, 0.9),
  massiveExplosion: () => HapticSystem.rumble(600, 1.0, 1.0),
};