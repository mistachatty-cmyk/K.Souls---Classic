/** Only local creator videos enter the match timeline; frames and file bytes stay in the browser. */
const videos = targets => targets.filter(target => target.dynamic && target.element?.tagName === "VIDEO");

export function captureVideoTimes(targets) {
  return videos(targets).filter(target => Number.isSafeInteger(target.id) && target.id > 0
    && Number.isFinite(target.element.currentTime) && target.element.currentTime >= 0)
    .slice(0, 16).map(target => ({ targetId: target.id, time: target.element.currentTime }));
}

export function pauseVideos(targets) {
  for (const target of videos(targets)) target.element.pause();
}

export function resumeVideos(targets) {
  for (const target of videos(targets)) {
    if (target.element.ended) continue;
    try { Promise.resolve(target.element.play()).catch(() => {}); }
    catch { /* Playback may require a fresh user gesture in this browser. */ }
  }
}

export function seekVideos(targets, samples) {
  const times = new Map(samples.filter(sample => Number.isSafeInteger(sample.targetId) && sample.targetId > 0
    && Number.isFinite(sample.time) && sample.time >= 0).slice(0, 16).map(sample => [sample.targetId, sample.time]));
  for (const target of videos(targets)) {
    const time = times.get(target.id);
    if (time === undefined) continue;
    target.element.pause();
    const duration = target.element.duration;
    try { target.element.currentTime = Number.isFinite(duration) && duration >= 0 ? Math.min(time, duration) : time; }
    catch { /* A frame may not have metadata yet. */ }
  }
}
