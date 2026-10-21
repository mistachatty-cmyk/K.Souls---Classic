export type TimelineTarget = { id: number; dynamic?: boolean; element: Element };
export type VideoTime = { targetId: number; time: number };
export function captureVideoTimes(targets: TimelineTarget[]): VideoTime[];
export function pauseVideos(targets: TimelineTarget[]): void;
export function resumeVideos(targets: TimelineTarget[]): void;
export function seekVideos(targets: TimelineTarget[], samples: VideoTime[]): void;
