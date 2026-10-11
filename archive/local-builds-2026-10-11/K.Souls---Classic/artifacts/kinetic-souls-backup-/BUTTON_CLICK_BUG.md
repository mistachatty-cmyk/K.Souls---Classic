# Buttons Not Clickable Bug - Root Cause & Fix

## Problem
All buttons in the game UI became unclickable - including menu buttons, toggles, and game controls.

## Root Cause

### Primary Issue: Flex Container Width Collapse
The **TIGHT ARENA WRAPPER** container had conflicting CSS properties:

```jsx
// BEFORE (broken)
<div style={{
  display: "flex",
  maxHeight: "100vh",
  maxWidth: "100vw",
  // MISSING: width declaration!
}}>
```

When using `display: flex` without explicit width, the container's intrinsic size calculation failed, causing child elements to have undefined stacking context which blocked pointer events.

### Secondary Issue: Conditional Border Styling
The Live Menu sidebar had complex conditional styling that could result in `pointerEvents` being inherited incorrectly:

```jsx
// BEFORE (fragile)
borderLeft: (stateRef.current as any).lokMenuPosition === "right" ? "2px solid #ffd700" : "none"
```

This conditional logic during render could cause momentary pointerEvents gaps.

## Solution Applied

### Fix 1: Wrapper Width
```jsx
// AFTER (fixed)
<div style={{
  display: "flex",
  width: "fit-content",        // ADDED
  maxWidth: "100vw",
  maxHeight: "100vh",
  position: "relative",         // ADDED
}}>
```

### Fix 2: Simplified Sidebar Styling
```jsx
// AFTER (fixed)
pointerEvents: "auto",          // ADDED - explicit
borderLeft: "2px solid #ffd700",
borderRight: "none",
```

## Prevention

1. Always specify explicit `width` when using `display: flex` on containers
2. Use `pointerEvents: "auto"` explicitly on interactive containers
3. Avoid complex conditional styling that could cause render timing issues
4. Test with DevTools → Elements → Check computed pointer-events property

## Files Modified
- `src/pages/KineticSouls.tsx` - Fixed TIGHT_ARENA_WRAPPER and Live Menu styling