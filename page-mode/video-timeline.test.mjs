import test from "node:test";
import assert from "node:assert/strict";
import { captureVideoTimes, pauseVideos, resumeVideos, seekVideos } from "./video-timeline.mjs";

const makeVideo = (id, time = 1.5, duration = 8) => {
  const element = { tagName: "VIDEO", currentTime: time, duration, paused: false, played: 0,
    pause() { this.paused = true; }, play() { this.paused = false; this.played++; return Promise.resolve(); } };
  return { id, dynamic: true, element };
};

test("owned video times are copied and bounded without media data", () => {
  const targets = Array.from({ length: 20 }, (_, index) => makeVideo(index + 1, index + 0.5));
  const times = captureVideoTimes(targets);
  targets[0].element.currentTime = 7;
  assert.equal(times.length, 16);
  assert.deepEqual(times[0], { targetId: 1, time: 0.5 });
  assert.equal(JSON.stringify(times).includes("tagName"), false);
});

test("pause, replay seek, and resume keep the source video in match time", () => {
  const video = makeVideo(7, 5, 8), targets = [video, { id: 9, dynamic: true, element: { tagName: "IMG" } }];
  pauseVideos(targets);
  assert.equal(video.element.paused, true);
  seekVideos(targets, [{ targetId: 7, time: 2.25 }]);
  assert.equal(video.element.currentTime, 2.25);
  seekVideos(targets, [{ targetId: 7, time: 90 }]);
  assert.equal(video.element.currentTime, 8);
  resumeVideos(targets);
  assert.equal(video.element.paused, false);
  assert.equal(video.element.played, 1);
});
