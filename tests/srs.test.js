const test = require("node:test");
const assert = require("node:assert/strict");
const Core = require("../srs.js");

test("five review intervals advance in order and stop at stage five", () => {
  const cards = {};
  let date = "2026-11-18";
  for (const interval of Core.INTERVALS) {
    Core.applyAnswer(cards, 1, true, date);
    assert.equal(cards[1].due, Core.addDays(date, interval));
    date = Core.addDays(date, interval);
  }
  assert.equal(cards[1].stage, 5);
  assert.equal(cards[1].due, date);
});

test("a wrong answer demotes one level and returns tomorrow", () => {
  const cards = {};
  Core.applyAnswer(cards, 1, true, "2026-11-18");
  Core.applyAnswer(cards, 1, true, "2026-11-19");
  assert.equal(cards[1].stage, 2);
  Core.applyAnswer(cards, 1, false, "2026-11-22");
  assert.equal(cards[1].stage, 1);
  assert.equal(cards[1].due, "2026-11-23");
  assert.equal(cards[1].lapses, 1);
});

test("same-day quiz failure overrides a positive card self-rating", () => {
  const cards = {};
  Core.applyAnswer(cards, 2, true, "2026-11-18");
  assert.equal(cards[2].stage, 1);
  Core.applyAnswer(cards, 2, false, "2026-11-18");
  assert.equal(cards[2].stage, 0);
  assert.equal(cards[2].due, "2026-11-19");
  Core.applyAnswer(cards, 2, false, "2026-11-18");
  assert.equal(cards[2].stage, 0);
  assert.equal(cards[2].lapses, 1);
});

test("due words include overdue cards and sort by due date", () => {
  const cards = {
    1: { stage: 2, due: "2026-11-17" },
    2: { stage: 1, due: "2026-11-16" },
    3: { stage: 2, due: "2026-11-19" },
    4: { stage: 0, due: "2026-11-16" },
  };
  assert.deepEqual(Core.getDueIds(cards, "2026-11-18"), [2, 1]);
});

test("course advances only after completed new-word work and wraps rounds", () => {
  const course = { round: 1, cursor: 408, completedDays: 0, planComplete: false };
  Core.advanceCourse(course, 6, 414, 10);
  assert.equal(course.round, 2);
  assert.equal(course.cursor, 0);
  assert.equal(course.completedDays, 1);

  const reviewOnly = { round: 2, cursor: 10, completedDays: 1, planComplete: false };
  Core.advanceCourse(reviewOnly, 0, 414, 10);
  assert.deepEqual(reviewOnly, { round: 2, cursor: 10, completedDays: 1, planComplete: false });
});

test("ten-round course marks the plan complete at the final word", () => {
  const course = { round: 10, cursor: 410, completedDays: 99, planComplete: false };
  Core.advanceCourse(course, 4, 414, 10);
  assert.equal(course.cursor, 414);
  assert.equal(course.planComplete, true);
});

test("forecast places overdue reviews in today's bucket", () => {
  const cards = {
    1: { stage: 1, due: "2026-11-16" },
    2: { stage: 1, due: "2026-11-18" },
    3: { stage: 1, due: "2026-11-19" },
  };
  const forecast = Core.getForecast(cards, "2026-11-18", 3);
  assert.deepEqual(
    forecast.map((day) => day.count),
    [2, 1, 0],
  );
});

test("imported state is normalized to supported settings and word ids", () => {
  const normalized = Core.normalizeState(
    {
      startedAt: "2026-11-01",
      settings: { dailyNew: 99, examDate: "2027-05-15", accent: "fr-FR", rate: 4 },
      course: { round: 20, cursor: 999, completedDays: 4 },
      cards: { 1: { stage: 7, due: "2026-11-20" }, 999: { stage: 1 } },
      lastSummary: { accuracy: 200, weakIds: [1, 999], newCount: "bad", reviewCount: -2 },
    },
    { now: "2026-11-18", totalWords: 414, totalRounds: 10 },
  );
  assert.equal(normalized.settings.dailyNew, 10);
  assert.equal(normalized.settings.accent, "en-US");
  assert.equal(normalized.settings.rate, 1.2);
  assert.equal(normalized.course.round, 10);
  assert.equal(normalized.course.cursor, 414);
  assert.equal(normalized.cards[1].stage, 5);
  assert.equal(normalized.cards[999], undefined);
  assert.equal(normalized.lastSummary.accuracy, 100);
  assert.deepEqual(normalized.lastSummary.weakIds, [1]);
  assert.equal(normalized.lastSummary.newCount, 0);
  assert.equal(normalized.lastSummary.reviewCount, 0);
});
