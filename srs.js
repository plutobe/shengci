(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.WordTrainerCore = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const INTERVALS = [1, 3, 7, 14, 30];
  const TOTAL_WORDS = 414;
  const TOTAL_ROUNDS = 10;
  const DAILY_OPTIONS = [5, 10, 15, 20];
  const DEFAULT_SETTINGS = {
    dailyNew: 10,
    examDate: "",
    accent: "en-US",
    rate: 0.9,
    voiceURI: "",
    autoPlay: true,
  };

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function toDateKey(date) {
    const value = date instanceof Date ? date : new Date(date);
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  }

  function todayKey(now) {
    return toDateKey(now || new Date());
  }

  function parseDateKey(key) {
    if (typeof key !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
    const [year, month, day] = key.split("-").map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0, 0);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }
    return date;
  }

  function addDays(key, count) {
    const date = parseDateKey(key);
    if (!date) return key;
    date.setDate(date.getDate() + count);
    return toDateKey(date);
  }

  function daysBetween(fromKey, toKey) {
    const from = parseDateKey(fromKey);
    const to = parseDateKey(toKey);
    if (!from || !to) return null;
    return Math.round((to.getTime() - from.getTime()) / 86400000);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function shuffle(items, random) {
    const result = items.slice();
    const rng = random || Math.random;
    for (let index = result.length - 1; index > 0; index -= 1) {
      const next = Math.floor(rng() * (index + 1));
      [result[index], result[next]] = [result[next], result[index]];
    }
    return result;
  }

  function uniqueIds(items, totalWords) {
    if (!Array.isArray(items)) return [];
    return [...new Set(items.map(Number))]
      .filter((id) => Number.isInteger(id) && id >= 1 && id <= (totalWords || TOTAL_WORDS));
  }

  function createInitialState(now) {
    const date = now || todayKey();
    return {
      version: 1,
      startedAt: date,
      settings: { ...DEFAULT_SETTINGS },
      course: {
        round: 1,
        cursor: 0,
        completedDays: 0,
        planComplete: false,
      },
      cards: {},
      activeSession: null,
      lastSummary: null,
      history: [],
      stats: {
        completedSessions: 0,
        lastStudyDate: "",
        lastNewSessionDate: "",
        streak: 0,
        totalAnswers: 0,
        correctAnswers: 0,
      },
    };
  }

  function normalizeCard(card) {
    if (!card || typeof card !== "object") return null;
    const stage = clamp(Number.isFinite(Number(card.stage)) ? Math.round(Number(card.stage)) : 0, 0, 5);
    return {
      stage,
      due: parseDateKey(card.due) ? card.due : null,
      lastReviewed: parseDateKey(card.lastReviewed) ? card.lastReviewed : null,
      lastStageUpdate: parseDateKey(card.lastStageUpdate) ? card.lastStageUpdate : null,
      lastResult: typeof card.lastResult === "boolean" ? card.lastResult : null,
      streak: Math.max(0, Math.round(Number(card.streak) || 0)),
      lapses: Math.max(0, Math.round(Number(card.lapses) || 0)),
      attempts: Math.max(0, Math.round(Number(card.attempts) || 0)),
      correctAttempts: Math.max(0, Math.round(Number(card.correctAttempts) || 0)),
    };
  }

  function normalizeSession(session, totalWords) {
    if (!session || typeof session !== "object" || !parseDateKey(session.date)) return null;
    const phases = ["review", "learn", "quiz", "summary"];
    const phase = phases.includes(session.phase) ? session.phase : "review";
    const quiz = Array.isArray(session.quiz)
      ? session.quiz
          .filter(
            (item) =>
              item &&
              Number.isInteger(Number(item.wordId)) &&
              Number(item.wordId) >= 1 &&
              Number(item.wordId) <= totalWords,
          )
          .map((item) => ({
            wordId: Number(item.wordId),
            type: ["meaning", "listening", "spelling"].includes(item.type)
              ? item.type
              : "meaning",
            options: uniqueIds(item.options, totalWords),
            selectedIndex: Number.isInteger(item.selectedIndex) ? item.selectedIndex : null,
            answered: Boolean(item.answered),
            correct: Boolean(item.correct),
          }))
      : [];
    const cardMode = ["intro", "spelling"].includes(session.cardMode)
      ? session.cardMode
      : phase === "review"
        ? "spelling"
        : "intro";
    const cardResult =
      session.cardResult &&
      Number.isInteger(Number(session.cardResult.wordId)) &&
      Number(session.cardResult.wordId) >= 1 &&
      Number(session.cardResult.wordId) <= totalWords
        ? {
            wordId: Number(session.cardResult.wordId),
            phase: ["review", "learn"].includes(session.cardResult.phase)
              ? session.cardResult.phase
              : phase,
            index: Math.max(0, Math.round(Number(session.cardResult.index) || 0)),
            correct: Boolean(session.cardResult.correct),
            answer: String(session.cardResult.answer || "").slice(0, 80),
          }
        : null;
    return {
      id: typeof session.id === "string" ? session.id : `session-${Date.now()}`,
      date: session.date,
      startedAt: Number(session.startedAt) || Date.now(),
      phase,
      reviewIds: uniqueIds(session.reviewIds, totalWords),
      newIds: uniqueIds(session.newIds, totalWords),
      reviewIndex: Math.max(0, Math.round(Number(session.reviewIndex) || 0)),
      learnIndex: Math.max(0, Math.round(Number(session.learnIndex) || 0)),
      quizIndex: Math.max(0, Math.round(Number(session.quizIndex) || 0)),
      quiz,
      cardMode,
      cardResult,
      answers: Array.isArray(session.answers)
        ? session.answers
            .filter((answer) => answer && Number.isInteger(Number(answer.wordId)))
            .map((answer) => ({
              wordId: Number(answer.wordId),
              correct: Boolean(answer.correct),
              phase: String(answer.phase || "quiz"),
              cardIndex: Number.isInteger(answer.cardIndex) ? answer.cardIndex : null,
            }))
        : [],
      reviewOnly: Boolean(session.reviewOnly),
    };
  }

  function normalizeSummary(summary, totalWords) {
    if (!summary || typeof summary !== "object") return null;
    const total = Math.max(0, Math.round(Number(summary.total) || 0));
    const correct = Math.min(total, Math.max(0, Math.round(Number(summary.correct) || 0)));
    return {
      date: parseDateKey(summary.date) ? summary.date : null,
      completedAt: Number(summary.completedAt) || 0,
      total,
      correct,
      accuracy: clamp(Math.round(Number(summary.accuracy) || 0), 0, 100),
      weakIds: uniqueIds(summary.weakIds, totalWords),
      newCount: Math.max(0, Math.round(Number(summary.newCount) || 0)),
      reviewCount: Math.max(0, Math.round(Number(summary.reviewCount) || 0)),
      nextDue: parseDateKey(summary.nextDue) ? summary.nextDue : null,
    };
  }

  function normalizeState(input, options) {
    const opts = options || {};
    const totalWords = opts.totalWords || TOTAL_WORDS;
    const totalRounds = opts.totalRounds || TOTAL_ROUNDS;
    const source = input && typeof input === "object" ? input : {};
    const base = createInitialState(opts.now || todayKey());
    const settings = source.settings && typeof source.settings === "object" ? source.settings : {};
    const course = source.course && typeof source.course === "object" ? source.course : {};
    const stats = source.stats && typeof source.stats === "object" ? source.stats : {};

    const normalized = {
      ...base,
      version: 1,
      startedAt: parseDateKey(source.startedAt) ? source.startedAt : base.startedAt,
      settings: {
        dailyNew: DAILY_OPTIONS.includes(Number(settings.dailyNew))
          ? Number(settings.dailyNew)
          : DEFAULT_SETTINGS.dailyNew,
        examDate: parseDateKey(settings.examDate) ? settings.examDate : "",
        accent: ["en-US", "en-GB"].includes(settings.accent)
          ? settings.accent
          : DEFAULT_SETTINGS.accent,
        rate: clamp(Number(settings.rate) || DEFAULT_SETTINGS.rate, 0.6, 1.2),
        voiceURI: typeof settings.voiceURI === "string" ? settings.voiceURI : "",
        autoPlay: settings.autoPlay !== false,
      },
      course: {
        round: clamp(
          Number.isInteger(Number(course.round)) ? Number(course.round) : 1,
          1,
          totalRounds,
        ),
        cursor: clamp(
          Number.isInteger(Number(course.cursor)) ? Number(course.cursor) : 0,
          0,
          totalWords,
        ),
        completedDays: Math.max(0, Math.round(Number(course.completedDays) || 0)),
        planComplete: Boolean(course.planComplete),
      },
      cards: {},
      activeSession: normalizeSession(source.activeSession, totalWords),
      lastSummary: normalizeSummary(source.lastSummary, totalWords),
      history: Array.isArray(source.history) ? source.history.slice(-120) : [],
      stats: {
        completedSessions: Math.max(0, Math.round(Number(stats.completedSessions) || 0)),
        lastStudyDate: parseDateKey(stats.lastStudyDate) ? stats.lastStudyDate : "",
        lastNewSessionDate: parseDateKey(stats.lastNewSessionDate)
          ? stats.lastNewSessionDate
          : "",
        streak: Math.max(0, Math.round(Number(stats.streak) || 0)),
        totalAnswers: Math.max(0, Math.round(Number(stats.totalAnswers) || 0)),
        correctAnswers: Math.max(0, Math.round(Number(stats.correctAnswers) || 0)),
      },
    };

    if (source.cards && typeof source.cards === "object") {
      for (const [rawId, rawCard] of Object.entries(source.cards)) {
        const id = Number(rawId);
        if (!Number.isInteger(id) || id < 1 || id > totalWords) continue;
        const card = normalizeCard(rawCard);
        if (card) normalized.cards[id] = card;
      }
    }

    if (normalized.course.round === totalRounds && normalized.course.cursor >= totalWords) {
      normalized.course.cursor = totalWords;
      normalized.course.planComplete = true;
    }
    return normalized;
  }

  function ensureCard(cards, id) {
    if (!cards[id]) {
      cards[id] = {
        stage: 0,
        due: null,
        lastReviewed: null,
        lastStageUpdate: null,
        lastResult: null,
        streak: 0,
        lapses: 0,
        attempts: 0,
        correctAttempts: 0,
      };
    }
    return cards[id];
  }

  function applyAnswer(cards, id, correct, dateKey) {
    const today = dateKey || todayKey();
    const card = ensureCard(cards, id);
    card.attempts += 1;
    card.lastReviewed = today;
    if (correct) card.correctAttempts += 1;

    if (card.lastStageUpdate === today) {
      const previousResult = card.lastResult;
      card.lastResult = correct;
      if (!correct && previousResult === true) {
        card.stage = Math.max(0, card.stage - 1);
        card.streak = 0;
        card.lapses += 1;
        card.due = addDays(today, 1);
        return { changed: true, card };
      }
      return { changed: false, card };
    }

    if (correct) {
      card.stage = clamp(card.stage + 1, 1, 5);
      card.streak += 1;
      card.due = addDays(today, INTERVALS[card.stage - 1]);
    } else {
      card.stage = Math.max(0, card.stage - 1);
      card.streak = 0;
      card.lapses += 1;
      card.due = addDays(today, 1);
    }

    card.lastStageUpdate = today;
    card.lastResult = correct;
    return { changed: true, card };
  }

  function getDueIds(cards, dateKey) {
    const today = dateKey || todayKey();
    return Object.entries(cards)
      .filter(([, card]) => card.stage > 0 && card.due && card.due <= today)
      .sort((a, b) => {
        if (a[1].due !== b[1].due) return a[1].due.localeCompare(b[1].due);
        return Number(a[0]) - Number(b[0]);
      })
      .map(([id]) => Number(id));
  }

  function getCardStats(cards, totalWords) {
    const values = Object.values(cards);
    return {
      learned: values.length,
      learning: values.filter((card) => card.stage <= 2).length,
      familiar: values.filter((card) => card.stage === 3).length,
      mastered: values.filter((card) => card.stage >= 4).length,
      unseen: Math.max(0, (totalWords || TOTAL_WORDS) - values.length),
    };
  }

  function getForecast(cards, dateKey, days) {
    const today = dateKey || todayKey();
    const count = Math.max(1, days || 7);
    const result = [];
    for (let offset = 0; offset < count; offset += 1) {
      const upper = addDays(today, offset);
      const lower = offset === 0 ? null : addDays(today, offset - 1);
      const due = Object.values(cards).filter(
        (card) => card.stage > 0 && card.due && card.due <= upper && (!lower || card.due > lower),
      ).length;
      result.push({ date: upper, count: due });
    }
    return result;
  }

  function getNewWordIds(course, totalWords, count) {
    if (course.planComplete) return [];
    const total = totalWords || TOTAL_WORDS;
    const start = course.cursor;
    const end = Math.min(total, start + Math.max(0, count));
    return Array.from({ length: end - start }, (_, index) => start + index + 1);
  }

  function advanceCourse(course, newCount, totalWords, totalRounds) {
    if (course.planComplete || newCount <= 0) return course;
    const total = totalWords || TOTAL_WORDS;
    const rounds = totalRounds || TOTAL_ROUNDS;
    let cursor = course.cursor + newCount;
    let round = course.round;

    while (cursor >= total && round < rounds) {
      cursor -= total;
      round += 1;
    }

    course.round = round;
    course.cursor = cursor;
    course.completedDays += 1;
    if (round === rounds && cursor >= total) {
      course.cursor = total;
      course.planComplete = true;
    }
    return course;
  }

  function masteryLabel(stage) {
    if (stage >= 5) return "稳定掌握";
    if (stage === 4) return "已掌握";
    if (stage === 3) return "逐渐熟悉";
    if (stage >= 1) return "学习中";
    return "需要加强";
  }

  return {
    INTERVALS,
    TOTAL_WORDS,
    TOTAL_ROUNDS,
    DAILY_OPTIONS,
    DEFAULT_SETTINGS,
    toDateKey,
    todayKey,
    parseDateKey,
    addDays,
    daysBetween,
    clamp,
    shuffle,
    createInitialState,
    normalizeState,
    ensureCard,
    applyAnswer,
    getDueIds,
    getCardStats,
    getForecast,
    getNewWordIds,
    advanceCourse,
    masteryLabel,
    normalizeSummary,
  };
});
