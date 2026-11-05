import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";

const exclusionMargin = 1;
const evergreenExcludedRanges = [[8, 11], [24, 26], [32, 36]]
  .map(([start, end]) => [start - exclusionMargin, end + exclusionMargin]);

export function validateEvergreenSamples(samples) {
  for (const [start, end] of samples) {
    assert(Number.isFinite(start) && Number.isFinite(end) && start >= 0 && end > start,
      "Evergreen samples must have valid start/end times");
    for (const [excludedStart, excludedEnd] of evergreenExcludedRanges) {
      // FFmpeg trim excludes the end timestamp; forbidden boundary frames stay out.
      assert(end <= excludedStart || start > excludedEnd,
        `Evergreen sample ${start}–${end}s overlaps excluded ${excludedStart}–${excludedEnd}s`);
    }
  }
  return samples;
}

function renderHeroVideo(source, filter, name) {
  execFileSync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y", "-i", source,
    "-filter_complex", filter, "-map", "[v]", "-an",
    "-c:v", "libx264", "-preset", "medium", "-crf", "25",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    `public/media/${name}.mp4`,
  ], { stdio: "inherit" });
  execFileSync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", `public/media/${name}.mp4`, "-frames:v", "1", "-q:v", "3",
    `public/media/${name}-poster.jpg`,
  ], { stdio: "inherit" });
}

// Add a frame cushion after each expanded exclusion boundary.
export const evergreenSamples = [[0, 7], [12.1, 23], [27.1, 31]];

if (import.meta.main) {
  const samples = validateEvergreenSamples(evergreenSamples);
  renderHeroVideo(
    "attachemnts/diegos_attempts/Sequence 02_2.mp4",
    "[0:v]trim=start=0:end=19,setpts=PTS-STARTPTS,scale=720:1280,setsar=1,fps=30[v]",
    "jade-production-reel-v2",
  );

  // Stitch permitted footage together before serving it; excluded frames never ship.
  renderHeroVideo(
    "attachemnts/diegos_attempts/Watersource Water Filter_v6.mp4",
    [
      `[0:v]scale=720:1280,setsar=1,split=${samples.length}${samples.map((_, i) => `[part${i}]`).join("")}`,
      ...samples.map(([start, end], i) =>
        `[part${i}]trim=start=${start}:end=${end},setpts=PTS-STARTPTS[clip${i}]`),
      `${samples.map((_, i) => `[clip${i}]`).join("")}concat=n=${samples.length}:v=1:a=0,fps=30[v]`,
    ].join(";"),
    "watersource-marketing-reel-v2",
  );
}
