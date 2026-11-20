(function () {
  "use strict";

  const DATA = window.WORD_TRAINER_DATA;
  const Core = window.WordTrainerCore;
  const WORDS = DATA.words;
  const WORD_BY_ID = new Map(WORDS.map((word) => [word.id, word]));
  const STORAGE_KEY = "shengci:v1";
  const LEGACY_STORAGE_KEY = "degree-english-word-trainer:v1";
  const LIBRARY_PAGE_SIZE = 30;
  const VIEWS = ["today", "review", "library", "settings", "session", "summary"];
  const ROUTE_LABELS = {
    today: "今日学习",
    review: "复习",
    library: "全部词汇",
    settings: "设置",
    session: "学习会话",
    summary: "本次小结",
  };

  const ICONS = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    "book-open": '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    "volume-2": '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    pause: '<rect width="4" height="16" x="6" y="4" rx="1"/><rect width="4" height="16" x="14" y="4" rx="1"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    "rotate-ccw": '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c2.5 0 4.5-2.03 4.5-4.5 0-1.5-.5-2.5-1.5-4-1 1-1.5 2-1.5 3C12.5 8 11 5 7 2c.5 2-1 4-2 6a7.5 7.5 0 0 0 3.5 10"/>',
    headphones: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a9 9 0 0 1 18 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    "spell-check": '<path d="m6 16 6-12 6 12"/><path d="M8 12h8"/><path d="m16 20 2 2 4-4"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "corner-down-left": '<path d="M20 4v7a4 4 0 0 1-4 4H4"/><path d="m9 10-5 5 5 5"/>',
    keyboard: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M7 16h10"/>',
    "arrow-up": '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    "arrow-down": '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    "bar-chart": '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
    "list-checks": '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    "circle-check": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    "triangle-alert": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  };

  const PREFIXES = [
    ["auto", "自己"],
    ["inter", "在……之间"],
    ["trans", "横跨、穿过"],
    ["super", "在上、超过"],
    ["under", "在下、不足"],
    ["multi", "多个"],
    ["semi", "一半"],
    ["anti", "反对"],
    ["post", "在后"],
    ["pre", "在前"],
    ["sub", "在下"],
    ["over", "过度"],
    ["mis", "错误"],
    ["dis", "分开或不"],
    ["non", "不"],
    ["re", "再次或返回"],
    ["un", "否定"],
  ];

  const ROOTS = [
    ["spect", "看"],
    ["script", "写"],
    ["scrib", "写"],
    ["struct", "建造"],
    ["tract", "拉、引"],
    ["port", "携带"],
    ["form", "形状"],
    ["dict", "说"],
    ["duct", "引导"],
    ["miss", "送出"],
    ["mit", "送出"],
    ["vis", "看"],
    ["vid", "看"],
    ["aud", "听"],
    ["phon", "声音"],
    ["graph", "写、记录"],
    ["cred", "相信"],
    ["ject", "投掷"],
    ["chron", "时间"],
    ["therm", "热"],
    ["memor", "记忆"],
    ["sign", "标记"],
    ["mot", "移动"],
    ["mov", "移动"],
    ["vert", "转"],
    ["vers", "转"],
  ];

  const SUFFIXES = [
    ["tion", "名词后缀"],
    ["sion", "名词后缀"],
    ["ment", "名词后缀"],
    ["ness", "名词后缀"],
    ["ity", "名词后缀"],
    ["ous", "形容词后缀"],
    ["ive", "形容词后缀"],
    ["able", "形容词后缀，表示能够"],
    ["ible", "形容词后缀，表示能够"],
    ["ful", "形容词后缀，表示充满"],
    ["less", "形容词后缀，表示没有"],
    ["ize", "动词后缀，表示使……"],
    ["ly", "副词后缀"],
  ];

  const viewRoot = document.getElementById("view-root");
  const wordDialog = document.getElementById("word-dialog");
  const wordDialogContent = document.getElementById("word-dialog-content");
  const confirmDialog = document.getElementById("confirm-dialog");
  const confirmMessage = document.getElementById("confirm-message");
  const toastRegion = document.getElementById("toast-region");

  let state = loadState();
  let currentRoute = normalizeRoute(location.hash.replace(/^#/, ""));
  let libraryFilter = "all";
  let libraryQuery = "";
  let libraryPage = 1;
  let confirmCallback = null;
  let lastFocusedElement = null;
  let confirmFocusedElement = null;
  let currentDialogWordId = null;
  let feedbackAudioContext = null;
  let lastSpellingFeedbackKey = "";
  let lastAutoSpeakKey = "";
  let speechVoices = [];
  let storageAvailable = true;

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function icon(name, size) {
    const paths = ICONS[name] || ICONS.info;
    const dimension = size || 20;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${dimension}" height="${dimension}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  }

  function hydrateStaticIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach((element) => {
      element.innerHTML = icon(element.dataset.icon, 20);
    });
  }

  function enterKeyHint() {
    return `<span class="enter-key" aria-hidden="true">${icon("corner-down-left", 14)}<kbd>Enter</kbd></span>`;
  }

  function quizKeyboardHints() {
    return `<div class="quiz-keyboard-hints" aria-label="选项键盘操作">
      <span class="shortcut-hint"><span class="shortcut-key">${icon("arrow-up", 13)}<kbd>↑</kbd></span><span class="shortcut-key">${icon("arrow-down", 13)}<kbd>↓</kbd></span><span>切换选项</span></span>
      <span class="shortcut-hint">${enterKeyHint()}<span>选择</span></span>
    </div>`;
  }

  function shortcutKey(iconName, keys) {
    return `<span class="shortcut-key" aria-hidden="true">${icon(iconName, 13)}<kbd>${keys}</kbd></span>`;
  }

  function renderSoundBars(kind) {
    return `<span class="sound-bars sound-bars-${kind}" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></span>`;
  }

  function getWord(id) {
    return WORD_BY_ID.get(Number(id));
  }

  function wordTitleClass(word) {
    if (word.length >= 13) return "word-title word-title-xlong";
    if (word.length >= 10) return "word-title word-title-long";
    return "word-title";
  }

  function renderPhonetic(phonetic) {
    return escapeHTML(phonetic)
      .replace(/ˈ/g, '<span class="stress-mark">ˈ</span>')
      .replace(/ˌ/g, '<span class="stress-mark stress-secondary">ˌ</span>');
  }

  function formatDateHuman(key) {
    const date = Core.parseDateKey(key);
    if (!date) return "尚未设置";
    return new Intl.DateTimeFormat("zh-CN", {
      month: "long",
      day: "numeric",
      weekday: "short",
    }).format(date);
  }

  function formatShortDate(key) {
    const date = Core.parseDateKey(key);
    if (!date) return "";
    return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(date);
  }

  function formatDueLabel(due) {
    if (!due) return "尚未安排";
    const today = Core.todayKey();
    const days = Core.daysBetween(today, due);
    if (days === null) return due;
    if (days <= 0) return "今天到期";
    if (days === 1) return "明天";
    return `${formatShortDate(due)} 到期`;
  }

  function normalizeRoute(route) {
    if (!VIEWS.includes(route)) return "today";
    if (route === "session" && !state.activeSession) return "today";
    if (route === "summary" && !state.lastSummary) return "today";
    return route;
  }

  function loadState() {
    const initial = Core.createInitialState(Core.todayKey());
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      const normalized = Core.normalizeState(JSON.parse(saved), {
        now: Core.todayKey(),
        totalWords: WORDS.length,
        totalRounds: DATA.planRounds,
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return normalized;
    } catch (error) {
      storageAvailable = false;
      return initial;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      storageAvailable = true;
    } catch (error) {
      storageAvailable = false;
    }
    refreshChrome();
  }

  function totalDue() {
    return Core.getDueIds(state.cards, Core.todayKey()).length;
  }

  function examInfo() {
    if (!state.settings.examDate) return null;
    const today = Core.todayKey();
    const days = Core.daysBetween(today, state.settings.examDate);
    const stats = Core.getCardStats(state.cards, WORDS.length);
    const needed = days > 0 ? Math.ceil(stats.unseen / days) : stats.unseen;
    return {
      date: state.settings.examDate,
      days: days || 0,
      past: days !== null && days < 0,
      needed,
      unseen: stats.unseen,
    };
  }

  function refreshChrome() {
    const routeForNav = currentRoute === "session" || currentRoute === "summary" ? "today" : currentRoute;
    document.querySelectorAll("[data-view-link]").forEach((link) => {
      const active = link.dataset.viewLink === routeForNav;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    const due = totalDue();
    const navCount = document.getElementById("due-nav-count");
    const dueDot = document.getElementById("mobile-due-dot");
    if (navCount) {
      navCount.hidden = due === 0;
      navCount.textContent = due > 99 ? "99+" : String(due);
    }
    if (dueDot) dueDot.hidden = due === 0;

    const info = examInfo();
    const sidebar = document.getElementById("sidebar-countdown");
    const mobile = document.getElementById("mobile-countdown");
    if (sidebar) {
      sidebar.innerHTML = info
        ? `<strong>${info.past ? "已到" : Math.max(0, info.days)}</strong><span>${info.past ? "考试日期已过" : "天后考试"}</span><a href="#settings">调整目标</a>`
        : `<span>考试日期</span><a href="#settings">现在设置目标</a>`;
    }
    if (mobile) {
      mobile.innerHTML = info
        ? `<strong>${info.past ? "已到" : Math.max(0, info.days)}</strong> 天`
        : `<a href="#settings">设置考试日期</a>`;
    }
  }

  function showToast(message, options) {
    const toast = document.createElement("div");
    toast.className = `toast${options && options.error ? " is-error" : ""}`;
    toast.textContent = message;
    toastRegion.appendChild(toast);
    window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(6px)";
      window.setTimeout(() => toast.remove(), 180);
    }, options && options.duration ? options.duration : 2600);
  }

  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices() || [];
    speechVoices = voices.filter((voice) => /^en(-|_)/i.test(voice.lang));
  }

  function chooseVoice(lang) {
    if (!speechVoices.length) loadVoices();
    const exact = speechVoices.find((voice) => voice.voiceURI === state.settings.voiceURI);
    if (exact) return exact;
    const language = lang || state.settings.accent;
    const prefix = language === "en-GB" ? "en-GB" : "en-US";
    const matched = speechVoices.filter((voice) => voice.lang.toLowerCase().startsWith(prefix.toLowerCase()));
    const preferred = matched.find((voice) => /samantha|daniel|serena|kate|google|natural|enhanced/i.test(voice.name));
    return preferred || matched[0] || speechVoices[0] || null;
  }

  function clearSpeakingState() {
    document.body.classList.remove("is-speaking");
    delete document.body.dataset.speaking;
    document.querySelectorAll(".is-playing").forEach((button) => {
      button.classList.remove("is-playing");
    });
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    clearSpeakingState();
  }

  function speakText(text, lang, rate, kind, sourceButton) {
    if (!text) return;
    if (!("speechSynthesis" in window)) {
      showToast("当前浏览器不支持语音朗读，请改用 Safari、Chrome 或 Edge。", { error: true });
      return;
    }
    loadVoices();
    window.speechSynthesis.cancel();
    clearSpeakingState();
    if (sourceButton) sourceButton.classList.add("is-playing");
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = chooseVoice(lang);
    utterance.lang = lang || state.settings.accent;
    utterance.rate = rate || state.settings.rate;
    utterance.pitch = 1;
    if (voice) utterance.voice = voice;
    utterance.onstart = () => {
      document.body.classList.add("is-speaking");
      if (kind) document.body.dataset.speaking = kind;
    };
    utterance.onend = clearSpeakingState;
    utterance.onerror = clearSpeakingState;
    window.speechSynthesis.speak(utterance);
  }

  function speakWordById(id, type, slow, sourceButton) {
    const word = getWord(id);
    if (!word) return;
    const sentence = type === "sentence";
    const kind = sentence ? "sentence" : "word";
    const button =
      sourceButton ||
      viewRoot.querySelector(
        `[data-action="speak-word"][data-audio-kind="${kind}"]`,
      );
    speakText(
      sentence ? word.sentence : word.word,
      state.settings.accent,
      slow ? 0.72 : state.settings.rate,
      kind,
      button,
    );
  }

  function maybeAutoSpeak(key, wordId, type) {
    if (!state.settings.autoPlay || lastAutoSpeakKey === key) return;
    lastAutoSpeakKey = key;
    speakWordById(wordId, type);
  }

  function playFeedbackTone(context, frequency, offset, duration, volume, type) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + offset;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  function playSpellingSound(correct) {
    if (!state.settings.soundEffects) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      feedbackAudioContext ||= new AudioContextClass();
      const play = () => {
        if (correct) {
          playFeedbackTone(feedbackAudioContext, 523.25, 0, 0.12, 0.035, "sine");
          playFeedbackTone(feedbackAudioContext, 659.25, 0.09, 0.12, 0.032, "sine");
          playFeedbackTone(feedbackAudioContext, 783.99, 0.18, 0.2, 0.03, "sine");
        } else {
          playFeedbackTone(feedbackAudioContext, 220, 0, 0.15, 0.024, "triangle");
          playFeedbackTone(feedbackAudioContext, 174.61, 0.12, 0.2, 0.022, "triangle");
        }
      };
      if (feedbackAudioContext.state === "suspended") {
        feedbackAudioContext.resume().then(play).catch(() => {});
      } else {
        play();
      }
    } catch (error) {
      // Audio feedback is optional; spelling results remain usable without Web Audio support.
    }
  }

  function triggerSpellingFeedback(correct, key) {
    if (lastSpellingFeedbackKey === key) return;
    lastSpellingFeedbackKey = key;
    playSpellingSound(correct);
  }

  function getMemoryHints(word) {
    const lower = word.word.toLowerCase();
    const result = [];
    for (const [token, meaning] of PREFIXES) {
      if (lower.startsWith(token) && lower.length > token.length + 3) {
        result.push(`词头 ${token}- 常见含义是“${meaning}”`);
        break;
      }
    }
    for (const [token, meaning] of ROOTS) {
      if (lower.includes(token) && lower.length > token.length + 2) {
        result.push(`词根 ${token} 与“${meaning}”有关`);
        break;
      }
    }
    for (const [token, meaning] of SUFFIXES) {
      if (lower.endsWith(token) && lower.length > token.length + 3) {
        result.push(`${token} 往往是${meaning}`);
        break;
      }
    }
    if (!result.length) {
      result.push("先观察词形变化，再把它放回例句里理解");
    }
    return result.slice(0, 2);
  }

  function highlightSentence(word, sentence) {
    const forms = getWordVariants(word);
    const escaped = escapeHTML(sentence);
    const pattern = new RegExp(`\\b(${forms.map(escapeRegExp).join("|")})\\b`, "gi");
    return escaped.replace(pattern, '<span class="highlight-word">$1</span>');
  }

  function redactSentence(word, sentence) {
    const forms = getWordVariants(word);
    const escaped = escapeHTML(sentence);
    const pattern = new RegExp(`\\b(${forms.map(escapeRegExp).join("|")})\\b`, "gi");
    return escaped.replace(
      pattern,
      '<span class="word-redaction"><span class="sr-only" lang="zh-CN">待拼写单词</span></span>',
    );
  }

  function getWordVariants(word) {
    const formTokens = String(word.forms || "")
      .split(/[^A-Za-z]+/)
      .map((token) => token.toLowerCase())
      .filter((token) => token.length >= 1 && !["more", "most"].includes(token));
    return [...new Set([word.word.toLowerCase(), ...formTokens])].sort(
      (a, b) => b.length - a.length,
    );
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function progressPercent(value, total) {
    if (!total) return 0;
    return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
  }

  function navigate(route, replace) {
    const normalized = normalizeRoute(route);
    if (replace) history.replaceState(null, "", `#${normalized}`);
    else if (location.hash !== `#${normalized}`) location.hash = normalized;
    else renderRoute();
  }

  function focusMainContent() {
    const primary = viewRoot.querySelector(
      '[data-action="start-session"], [data-action="start-review"], [data-action="start-card-spelling"], [data-action="next-card"], .quiz-option, #card-spelling-answer, .text-input, [data-action="set-daily"], .summary-actions a',
    );
    const target = primary || viewRoot.querySelector("button, a[href], input, select") || viewRoot;
    target.focus({ preventScroll: true });
  }

  function renderRoute(options) {
    currentRoute = normalizeRoute(location.hash.replace(/^#/, ""));
    if (location.hash !== `#${currentRoute}`) history.replaceState(null, "", `#${currentRoute}`);
    document.body.dataset.route = currentRoute;
    stopSpeaking();
    refreshChrome();
    const renderers = {
      today: renderToday,
      review: renderReview,
      library: renderLibrary,
      settings: renderSettings,
      session: renderSession,
      summary: renderSummary,
    };
    (renderers[currentRoute] || renderToday)();
    if (options && options.focus) focusMainContent();
    else window.scrollTo({ top: 0, behavior: "auto" });
  }

  window.addEventListener("hashchange", () => renderRoute());
  window.addEventListener("beforeunload", stopSpeaking);
  if ("speechSynthesis" in window) {
    loadVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", () => {
      loadVoices();
      if (currentRoute === "settings") refreshVoiceSelect();
    });
  }

  hydrateStaticIcons();
  refreshChrome();
  renderRoute();

  function renderToday() {
    const today = Core.todayKey();
    const dueIds = Core.getDueIds(state.cards, today);
    const completedNewToday = state.stats.lastNewSessionDate === today;
    const session = state.activeSession;
    const plannedNewIds = session
      ? session.newIds
      : completedNewToday
        ? []
        : Core.getNewWordIds(state.course, WORDS.length, state.settings.dailyNew);
    const displayNewCount = plannedNewIds.length;
    const displayReviewCount = session ? session.reviewIds.length : dueIds.length;
    const stats = Core.getCardStats(state.cards, WORDS.length);
    const info = examInfo();
    const courseDay = state.course.completedDays + 1;
    const cursor = state.course.cursor;
    const plannedEnd = Math.min(WORDS.length, cursor + state.settings.dailyNew);
    const rangeText =
      displayNewCount > 0 && plannedNewIds.length
        ? `第 ${plannedNewIds[0]}–${plannedNewIds[plannedNewIds.length - 1]} 个`
        : plannedEnd > cursor
          ? `第 ${cursor + 1}–${plannedEnd} 个`
          : "查看复习队列";

    let heroTitle = `今天先复习 ${displayReviewCount} 个到期词，再学 ${displayNewCount} 个新词。`;
    if (!displayReviewCount && displayNewCount) heroTitle = `今天学习 ${displayNewCount} 个新词，再做一次混合自测。`;
    if (session) heroTitle = "今天的会话还没结束，接着学下去。";
    if (completedNewToday && !session) heroTitle = "今天的学习已经完成。";
    if (!displayReviewCount && !displayNewCount && !session) heroTitle = "今天没有新任务，保持轻松复习即可。";

    const reviewDone = session && ["learn", "quiz"].includes(session.phase);
    const learnDone = session && session.phase === "quiz";
    const allDone = completedNewToday && !session;
    const reviewClass = allDone || reviewDone ? "is-done" : session?.phase === "review" ? "is-current" : "";
    const learnClass = allDone || learnDone ? "is-done" : session?.phase === "learn" ? "is-current" : "";
    const quizClass = allDone ? "is-done" : session?.phase === "quiz" ? "is-current" : "";
    const countdownValue = info ? (info.past ? "0" : Math.max(0, info.days)) : "待设置";
    const countdownLabel = info
      ? info.past
        ? "考试日期已过，仍可继续复习"
        : `${formatDateHuman(info.date)} · 还剩 ${info.days} 天`
      : "设置考试日期后显示倒计时";
    const countdownWarning =
      info && !info.past && info.unseen > 0 && info.needed > state.settings.dailyNew
        ? `首轮还差 ${info.unseen} 个词，按当前速度每天需要 ${info.needed} 个。`
        : "";

    const roundCells = Array.from({ length: DATA.planRounds }, (_, index) => {
      const round = index + 1;
      const className =
        round < state.course.round || state.course.planComplete
          ? "round-cell is-complete"
          : round === state.course.round
            ? "round-cell is-current"
            : "round-cell";
      return `<span class="${className}">${round}</span>`;
    }).join("");

    const primaryAction = session
      ? `<button class="button button-primary" type="button" data-action="resume-session">
          ${icon("play", 18)} 继续会话
        </button>`
      : completedNewToday
        ? `<button class="button button-secondary" type="button" data-action="open-summary">
            ${icon("circle-check", 18)} 查看本次小结
          </button>`
        : `<button class="button button-primary" type="button" data-action="start-session" ${displayNewCount || dueIds.length ? "" : "disabled"}>
            ${icon("play", 18)} 开始今日会话
          </button>`;

    const completionPanel =
      completedNewToday && !session
        ? `<div class="completion-panel">
            <h2>今日会话已完成</h2>
            <p>${state.lastSummary ? `正确率 ${state.lastSummary.accuracy}% · 下一次复习按记忆阶段自动安排。` : "新词和混合自测都已记录。"}</p>
            <div class="completion-actions">
              <button class="button button-primary button-sm" type="button" data-action="open-summary">查看小结</button>
              <a class="button button-quiet button-sm" href="#library">浏览词汇</a>
            </div>
          </div>`
        : "";

    viewRoot.innerHTML = `
      <section class="view dashboard-view" aria-labelledby="today-title">
        <div class="dashboard-hero">
          <div class="hero-copy">
            <p class="page-date">${formatDateHuman(today)} · 第 ${courseDay} 学习日</p>
            <h1 class="hero-title" id="today-title">${escapeHTML(heroTitle)}</h1>
            <p class="hero-description">复习到期词优先，新词紧随其后；每轮学习日只在前一个会话完成后推进。</p>
          </div>
          <aside class="exam-countdown" aria-label="考试倒计时">
            <div class="countdown-main">
              <span class="countdown-value ${info ? "" : "countdown-value-empty"}">${countdownValue}</span>
              ${info && !info.past ? '<span class="countdown-unit">天</span>' : ""}
            </div>
            <span class="countdown-label">${escapeHTML(countdownLabel)}</span>
            ${info ? '<a class="countdown-link" href="#settings">调整考试目标</a>' : '<a class="countdown-link" href="#settings">设置考试日期</a>'}
            ${countdownWarning ? `<p class="countdown-warning">${escapeHTML(countdownWarning)}</p>` : ""}
          </aside>
        </div>

        <div class="metric-strip" aria-label="学习概览">
          <div class="metric-item">
            <span class="metric-label">现在到期</span>
            <strong class="metric-value">${totalDue()}</strong>
            <span class="metric-note">优先复习</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">首轮已学</span>
            <strong class="metric-value">${stats.learned}<span class="metric-note"> / ${WORDS.length}</span></strong>
            <span class="metric-note">${progressPercent(stats.learned, WORDS.length)}% 完成</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">稳定记忆</span>
            <strong class="metric-value">${stats.mastered}</strong>
            <span class="metric-note">记忆阶段 4–5</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">连续学习</span>
            <strong class="metric-value">${state.stats.streak}</strong>
            <span class="metric-note">天</span>
          </div>
        </div>

        <div class="dashboard-grid">
          <section class="today-panel" aria-labelledby="today-session-title">
            <div class="panel-header">
              <div>
                <h2 class="panel-title" id="today-session-title">今日会话</h2>
                <p class="panel-subtitle">第 ${state.course.round} 轮 · ${rangeText}</p>
              </div>
              <span class="plan-chip">每日 ${state.settings.dailyNew} 词</span>
            </div>
            <div class="session-outline">
              <div class="outline-item ${reviewClass}">
                <span class="outline-marker">1</span>
                <div class="outline-copy"><strong>到期复习</strong><span>先唤醒已有记忆</span></div>
                <span class="outline-count">${displayReviewCount} 词</span>
              </div>
              <div class="outline-item ${learnClass}">
                <span class="outline-marker">2</span>
                <div class="outline-copy"><strong>新词学习</strong><span>词卡、音标与例句</span></div>
                <span class="outline-count">${displayNewCount} 词</span>
              </div>
              <div class="outline-item ${quizClass}">
                <span class="outline-marker">3</span>
                <div class="outline-copy"><strong>混合自测</strong><span>词义、听音与拼写</span></div>
                <span class="outline-count">约 ${Math.max(1, displayNewCount + Math.min(5, displayReviewCount))} 题</span>
              </div>
            </div>
            ${completionPanel}
            <div class="start-block">
              <span class="start-copy">${allDone ? `下一次新词从第 ${Math.min(WORDS.length, cursor + 1)} 个开始。` : "会话中的答案会立即更新复习时间。"}</span>
              ${primaryAction}
            </div>
            <div class="streak-line">
              ${icon("flame", 17)}
              <span>连续 <strong>${state.stats.streak}</strong> 天完成学习</span>
            </div>
          </section>

          <aside class="plan-panel">
            <section class="round-map-card" aria-labelledby="round-map-title">
              <h2 class="panel-title" id="round-map-title">十轮学习路线</h2>
              <div class="round-grid" aria-label="十轮进度">${roundCells}</div>
              <p class="round-caption">${state.course.planComplete ? "十轮已完成，接下来专注到期复习。" : `当前第 ${state.course.round} 轮，已完成 ${state.course.completedDays} 个学习日。`}</p>
            </section>
            <section class="progress-summary" aria-labelledby="progress-title">
              <div class="progress-label-row">
                <strong id="progress-title">首轮词汇进度</strong>
                <span>${stats.learned} / ${WORDS.length}</span>
              </div>
              <div class="progress-line" aria-hidden="true"><div class="progress-fill" style="width:${progressPercent(stats.learned, WORDS.length)}%"></div></div>
              <div class="mastery-rows">
                <div class="mastery-row"><span>稳定</span><div class="mastery-track"><span style="width:${progressPercent(stats.mastered, WORDS.length)}%"></span></div><span class="mastery-row-value">${stats.mastered}</span></div>
                <div class="mastery-row"><span>熟悉</span><div class="mastery-track"><span style="width:${progressPercent(stats.familiar, WORDS.length)}%"></span></div><span class="mastery-row-value">${stats.familiar}</span></div>
                <div class="mastery-row"><span>学习中</span><div class="mastery-track"><span style="width:${progressPercent(stats.learning, WORDS.length)}%"></span></div><span class="mastery-row-value">${stats.learning}</span></div>
              </div>
            </section>
          </aside>
        </div>
      </section>`;
  }

  function renderReview() {
    const today = Core.todayKey();
    const dueIds = Core.getDueIds(state.cards, today);
    const stats = Core.getCardStats(state.cards, WORDS.length);
    const forecast = Core.getForecast(state.cards, today, 7);
    const maxForecast = Math.max(1, ...forecast.map((day) => day.count));
    const forecastRows = forecast
      .map((day, index) => {
        const height = day.count ? Math.max(5, Math.round((day.count / maxForecast) * 100)) : 3;
        const label = index === 0 ? "今天" : index === 1 ? "明天" : formatShortDate(day.date);
        return `<div class="forecast-day">
          <div class="forecast-bar-wrap"><span class="forecast-bar" style="height:${height}%"></span></div>
          <span class="forecast-count">${day.count}</span>
          <span class="forecast-label">${label}</span>
        </div>`;
      })
      .join("");
    const learningWidth = stats.learned ? Math.round((stats.learning / stats.learned) * 100) : 0;
    const familiarWidth = stats.learned ? Math.round((stats.familiar / stats.learned) * 100) : 0;
    const masteredWidth = stats.learned ? Math.max(0, 100 - learningWidth - familiarWidth) : 0;
    const dueRows = dueIds
      .slice(0, 40)
      .map((id) => {
        const word = getWord(id);
        const card = state.cards[id];
        return `<div class="due-row">
          <button class="due-word-button" type="button" data-action="open-word" data-word-id="${id}">
            <strong lang="en">${escapeHTML(word.word)}</strong>
            <span class="ipa">${renderPhonetic(word.phonetic)}</span>
          </button>
          <span class="meaning">${escapeHTML(word.meaning)}</span>
          <span class="due-due">${escapeHTML(formatDueLabel(card?.due))}</span>
          <button class="sound-button compact-sound-button" type="button" data-action="speak-word" data-word-id="${id}" data-audio-kind="word" aria-label="朗读 ${escapeHTML(word.word)}" title="朗读单词">
            ${icon("volume-2", 17)}${renderSoundBars("word")}
          </button>
        </div>`;
      })
      .join("");
    const nextDue = Object.values(state.cards)
      .map((card) => card.due)
      .filter((due) => due && due > today)
      .sort()[0];
    const canStartNewToday = state.stats.lastNewSessionDate !== today && !state.course.planComplete;
    const action = state.activeSession
      ? `<button class="button button-primary" type="button" data-action="resume-session">${icon("play", 18)} 继续当前会话</button>`
      : dueIds.length
        ? `<button class="button button-primary" type="button" data-action="start-review">${icon("refresh", 18)} 开始专题复习</button>`
        : canStartNewToday
          ? `<button class="button button-secondary" type="button" data-action="start-session">${icon("play", 18)} 开始今日会话</button>`
          : `<a class="button button-secondary" href="#library">${icon("book-open", 18)} 浏览全部词汇</a>`;

    viewRoot.innerHTML = `
      <section class="view" aria-labelledby="review-title">
        <div class="view-header">
          <div>
            <p class="page-date">${formatDateHuman(today)}</p>
            <h1 class="view-title" id="review-title">复习节奏</h1>
            <p class="view-description">${dueIds.length ? `现在有 ${dueIds.length} 个词到期。答错会降一级，并在明天再次出现。` : "当前没有到期词，仍可提前查看未来复习量。"}</p>
          </div>
          <div class="header-actions">${action}</div>
        </div>

        <div class="review-layout">
          <section class="forecast-panel" aria-labelledby="forecast-title">
            <div class="panel-header">
              <div>
                <h2 class="panel-title" id="forecast-title">未来七天到期量</h2>
                <p class="panel-subtitle">复习间隔：1、3、7、14、30 天</p>
              </div>
              <span class="plan-chip">今天 ${dueIds.length} 词</span>
            </div>
            <div class="forecast-grid">${forecastRows}</div>
            <div class="due-list">
              ${dueRows || `<div class="lines-empty">${nextDue ? `下一次到期在 ${formatDateHuman(nextDue)}` : "完成新词学习后，这里会出现复习安排。"}</div>`}
            </div>
            ${dueIds.length > 40 ? `<p class="result-count">列表显示前 40 个，开始会话后会依次完成全部 ${dueIds.length} 个。</p>` : ""}
          </section>

          <aside class="settings-section" aria-labelledby="distribution-title">
            <h2 id="distribution-title">记忆分布</h2>
            <p>已学 ${stats.learned} 个，未学 ${stats.unseen} 个。</p>
            <div class="distribution-bar" aria-label="记忆阶段分布">
              <span class="distribution-learned" style="width:${learningWidth}%"></span>
              <span class="distribution-familiar" style="width:${familiarWidth}%"></span>
              <span class="distribution-mastered" style="width:${masteredWidth}%"></span>
            </div>
            <ul class="legend-list">
              <li class="legend-item"><span class="legend-name"><span class="legend-dot" style="background:var(--teal)"></span>学习中</span><span class="legend-value">${stats.learning}</span></li>
              <li class="legend-item"><span class="legend-name"><span class="legend-dot" style="background:var(--blue)"></span>熟悉</span><span class="legend-value">${stats.familiar}</span></li>
              <li class="legend-item"><span class="legend-name"><span class="legend-dot" style="background:var(--mustard)"></span>稳定</span><span class="legend-value">${stats.mastered}</span></li>
              <li class="legend-item"><span class="legend-name"><span class="legend-dot" style="background:var(--surface-deep)"></span>未学</span><span class="legend-value">${stats.unseen}</span></li>
            </ul>
            <p class="data-note">${state.activeSession ? "当前会话尚未结束，继续后会从上次进度开始。" : "复习完成情况会同步到今日会话与词汇列表。"}</p>
          </aside>
        </div>
      </section>`;
  }

  function renderLibrary() {
    const stats = Core.getCardStats(state.cards, WORDS.length);
    viewRoot.innerHTML = `
      <section class="view" aria-labelledby="library-title">
        <div class="view-header">
          <div>
            <p class="page-date">完整词表</p>
            <h1 class="view-title" id="library-title">全部词汇</h1>
            <p class="view-description">共 ${WORDS.length} 个单词。搜索英文、中文释义或例句，点开可听单词与整句。</p>
          </div>
          <div class="header-actions">
            <span class="plan-chip">已学 ${stats.learned} / ${WORDS.length}</span>
          </div>
        </div>
        <div class="list-toolbar">
          <label class="search-field">
            <span class="icon">${icon("search", 18)}</span>
            <span class="sr-only">搜索词汇</span>
            <input class="text-input" id="library-search" type="search" placeholder="搜索英文、中文或例句" autocomplete="off" value="${escapeHTML(libraryQuery)}" />
          </label>
          <div class="filters" aria-label="词汇筛选">
            ${renderLibraryFilter("all", "全部", WORDS.length)}
            ${renderLibraryFilter("unseen", "未学", stats.unseen)}
            ${renderLibraryFilter("learning", "学习中", stats.learning)}
            ${renderLibraryFilter("familiar", "熟悉", stats.familiar)}
            ${renderLibraryFilter("mastered", "已掌握", stats.mastered)}
          </div>
        </div>
        <p class="result-count" id="library-result-count"></p>
        <div class="library-head" aria-hidden="true">
          <span>单词与音标</span><span>释义</span><span>词性</span><span>状态</span><span>发音</span>
        </div>
        <div class="library-list" id="library-rows"></div>
        <div class="library-pagination" id="library-pagination"></div>
      </section>`;
    updateLibraryRows();
  }

  function renderLibraryFilter(filter, label, count) {
    return `<button class="filter-button ${libraryFilter === filter ? "is-active" : ""}" type="button" data-action="set-library-filter" data-filter="${filter}">${label} ${count}</button>`;
  }

  function updateLibraryRows() {
    const container = document.getElementById("library-rows");
    const countLabel = document.getElementById("library-result-count");
    const pagination = document.getElementById("library-pagination");
    if (!container || !countLabel) return;
    const query = libraryQuery.trim().toLowerCase();
    const filtered = WORDS.filter((word) => {
      const card = state.cards[word.id];
      const stage = card?.stage;
      const matchesFilter =
        libraryFilter === "all" ||
        (libraryFilter === "unseen" && !card) ||
        (libraryFilter === "learning" && card && stage <= 2) ||
        (libraryFilter === "familiar" && stage === 3) ||
        (libraryFilter === "mastered" && stage >= 4);
      const matchesQuery =
        !query ||
        [word.word, word.meaning, word.sentence, word.translation].some((value) =>
          String(value).toLowerCase().includes(query),
        );
      return matchesFilter && matchesQuery;
    });
    const pageCount = Math.max(1, Math.ceil(filtered.length / LIBRARY_PAGE_SIZE));
    libraryPage = Core.clamp(libraryPage, 1, pageCount);
    const start = (libraryPage - 1) * LIBRARY_PAGE_SIZE;
    const pageItems = filtered.slice(start, start + LIBRARY_PAGE_SIZE);
    countLabel.textContent = filtered.length
      ? `第 ${start + 1}–${start + pageItems.length} 个，共 ${filtered.length} 个`
      : "显示 0 个词";
    if (!filtered.length) {
      container.innerHTML = `<div class="empty-state"><span class="icon">${icon("search", 34)}</span><h2>没有找到匹配词汇</h2><p>换一个英文或中文关键词试试。</p></div>`;
      if (pagination) pagination.hidden = true;
      return;
    }
    container.innerHTML = pageItems
      .map((word) => {
        const card = state.cards[word.id];
        const status = getLibraryStatus(card);
        return `<div class="library-row" data-word-id="${word.id}">
          <button class="word-row-word" type="button" data-action="open-word" data-word-id="${word.id}" aria-label="查看 ${escapeHTML(word.word)} 的详情"><strong lang="en">${escapeHTML(word.word)}</strong><span class="ipa">${renderPhonetic(word.phonetic)}</span></button>
          <span class="meaning">${escapeHTML(word.meaning)}</span>
          <span class="pos-tag">${escapeHTML(word.pos)}</span>
          <span class="status-pill ${status.className}">${status.label}</span>
          <button class="sound-button" type="button" data-action="speak-word" data-word-id="${word.id}" data-audio-kind="word" aria-label="朗读 ${escapeHTML(word.word)}" title="朗读单词">
            <span class="icon">${icon("volume-2", 17)}</span>${renderSoundBars("word")}<span class="sound-label">听</span>
          </button>
        </div>`;
      })
      .join("");
    if (pagination) {
      pagination.hidden = pageCount <= 1;
      pagination.innerHTML = `<button class="button button-quiet button-sm" type="button" data-action="library-page" data-page="${libraryPage - 1}" ${libraryPage === 1 ? "disabled" : ""}>${icon("chevron-left", 16)} 上一页</button>
        <span>第 ${libraryPage} / ${pageCount} 页</span>
        <button class="button button-quiet button-sm" type="button" data-action="library-page" data-page="${libraryPage + 1}" ${libraryPage === pageCount ? "disabled" : ""}>下一页 ${icon("chevron-right", 16)}</button>`;
    }
  }

  function getLibraryStatus(card) {
    if (!card) return { label: "未学", className: "status-unseen" };
    if (card.stage <= 0) return { label: "需加强", className: "status-weak" };
    if (card.stage <= 2) return { label: "学习中", className: "status-learning" };
    if (card.stage === 3) return { label: "熟悉", className: "status-familiar" };
    return { label: "已掌握", className: "status-mastered" };
  }

  function voiceOptionsMarkup() {
    return speechVoices.length
      ? speechVoices
          .map((voice) => `<option value="${escapeHTML(voice.voiceURI)}" ${voice.voiceURI === state.settings.voiceURI ? "selected" : ""}>${escapeHTML(voice.name)} · ${escapeHTML(voice.lang)}</option>`)
          .join("")
      : '<option value="">浏览器英语语音加载中</option>';
  }

  function refreshVoiceSelect() {
    const select = document.querySelector('[data-setting="voiceURI"]');
    if (!select) return;
    select.innerHTML = voiceOptionsMarkup();
    if (state.settings.voiceURI) select.value = state.settings.voiceURI;
  }

  function renderSettings() {
    const info = examInfo();
    const stats = Core.getCardStats(state.cards, WORDS.length);
    const voiceOptions = voiceOptionsMarkup();
    const voiceWarning = "speechSynthesis" in window
      ? ""
      : `<p class="speech-warning">当前浏览器不支持系统语音朗读。请使用 Safari、Chrome 或 Edge 打开页面。</p>`;

    viewRoot.innerHTML = `
      <section class="view" aria-labelledby="settings-title">
        <div class="view-header">
          <div>
            <p class="page-date">学习设置</p>
            <h1 class="view-title" id="settings-title">设置</h1>
            <p class="view-description">调整每日负荷、考试目标和发音偏好。进度只保存在当前浏览器。</p>
          </div>
        </div>
        <div class="settings-grid">
          <section class="settings-section" aria-labelledby="plan-settings-title">
            <h2 id="plan-settings-title">学习计划</h2>
            <p>第一次使用日期：${formatDateHuman(state.startedAt)} · 第 ${state.course.round} 轮 · 已完成 ${state.course.completedDays} 个学习日。</p>
            <div class="setting-row">
              <div class="setting-copy"><span class="setting-label">每日新词</span><span class="setting-help">默认 10 个，新词完成后才推进到下一组</span></div>
              <div class="setting-control">
                <div class="segmented" role="group" aria-label="每日新词数量">
                  ${Core.DAILY_OPTIONS.map((value) => `<button class="segment-button ${state.settings.dailyNew === value ? "is-active" : ""}" type="button" data-action="set-daily" data-daily="${value}" aria-pressed="${state.settings.dailyNew === value}">${value}</button>`).join("")}
                </div>
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-copy"><span class="setting-label">记忆间隔</span><span class="setting-help">答对升一级，答错降一级并在明天重现</span></div>
              <div class="setting-control"><span class="plan-chip">1 · 3 · 7 · 14 · 30 天</span></div>
            </div>
          </section>

          <section class="settings-section" aria-labelledby="exam-settings-title">
            <h2 id="exam-settings-title">考试目标</h2>
            <p id="exam-settings-summary">${info ? (info.past ? "考试日期已过，可以继续使用复习系统。" : `距考试 ${info.days} 天，首轮还剩 ${info.unseen} 个词。`) : "设置日期后，首页显示倒计时与每日所需进度。"}</p>
            <div class="setting-row">
              <div class="setting-copy"><span class="setting-label">考试日期</span><span class="setting-help">可选，不会自动改变每日新词数量</span></div>
              <div class="setting-control"><input class="date-input" type="date" data-setting="examDate" aria-label="考试日期" value="${escapeHTML(state.settings.examDate)}" /></div>
            </div>
            <div class="setting-row">
              <div class="setting-copy"><span class="setting-label">首轮剩余</span><span class="setting-help" id="daily-estimate">按当前每日 ${state.settings.dailyNew} 词估算</span></div>
              <div class="setting-control"><span class="plan-chip">${stats.unseen} 词</span></div>
            </div>
          </section>

          <section class="settings-section" aria-labelledby="voice-settings-title">
            <h2 id="voice-settings-title">发音</h2>
            <p>朗读使用浏览器自带英语语音，不调用外部音频服务。</p>
            ${voiceWarning}
            <div class="setting-row">
              <div class="setting-copy"><span class="setting-label">口音</span><span class="setting-help">不同设备可用的声音会略有差异</span></div>
              <div class="setting-control">
                <div class="segmented" role="group" aria-label="英语口音">
                  <button class="segment-button ${state.settings.accent === "en-US" ? "is-active" : ""}" type="button" data-action="set-accent" data-accent="en-US" aria-pressed="${state.settings.accent === "en-US"}">美音</button>
                  <button class="segment-button ${state.settings.accent === "en-GB" ? "is-active" : ""}" type="button" data-action="set-accent" data-accent="en-GB" aria-pressed="${state.settings.accent === "en-GB"}">英音</button>
                </div>
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-copy"><span class="setting-label">语速</span><span class="setting-help">可在单词与例句朗读时立即生效</span></div>
              <div class="setting-control"><div class="range-wrap"><input type="range" min="0.6" max="1.2" step="0.05" value="${state.settings.rate}" data-setting="rate" aria-label="朗读语速" /><span class="range-value" id="rate-value">${state.settings.rate.toFixed(2)}×</span></div></div>
            </div>
            <div class="setting-row">
              <div class="setting-copy"><span class="setting-label">语音</span><span class="setting-help">优先选择设备中的自然英语声音</span></div>
              <div class="setting-control"><select class="select-input" data-setting="voiceURI" aria-label="英语语音">${voiceOptions}</select></div>
            </div>
            <div class="setting-row">
              <div class="setting-copy"><span class="setting-label">自动朗读</span><span class="setting-help">进入新词卡和听音题时自动播放</span></div>
              <div class="setting-control"><button class="toggle ${state.settings.autoPlay ? "is-on" : ""}" type="button" data-action="toggle-autoplay" aria-label="自动朗读" aria-pressed="${state.settings.autoPlay}"></button></div>
            </div>
            <div class="setting-row">
              <div class="setting-copy"><span class="setting-label">答题音效</span><span class="setting-help">拼写正确或错误时播放简短提示音</span></div>
              <div class="setting-control"><button class="toggle ${state.settings.soundEffects ? "is-on" : ""}" type="button" data-action="toggle-sound-effects" aria-label="答题音效" aria-pressed="${state.settings.soundEffects}"></button></div>
            </div>
            <div class="backup-actions"><button class="button button-secondary button-sm sound-button settings-audio-button" type="button" data-action="test-voice" data-audio-kind="sentence" aria-keyshortcuts="Shift+Space">${icon("volume-2", 16)} 试听 ${renderSoundBars("sentence")}</button></div>
          </section>

          <section class="settings-section" aria-labelledby="data-settings-title">
            <h2 id="data-settings-title">进度与备份</h2>
            <p>手机和电脑不会自动同步，可导出 JSON 文件后在其他设备导入。</p>
            <p class="data-note">${storageAvailable ? "浏览器本地存储可用。" : "浏览器禁止本地存储，本次学习进度不会在刷新后保留。"}</p>
            <div class="backup-actions">
              <button class="button button-secondary" type="button" data-action="export-backup">${icon("download", 17)} 导出备份</button>
              <button class="button button-quiet" type="button" data-action="import-backup">${icon("upload", 17)} 导入备份</button>
              <input id="backup-file" type="file" accept="application/json,.json" hidden />
            </div>
            <div class="danger-zone">
              <h3>清空学习进度</h3>
              <p>会删除学习日、掌握度和所有复习记录，词表本身不会删除。</p>
              <button class="button button-danger button-sm" type="button" data-action="reset-progress">${icon("rotate-ccw", 16)} 重置全部进度</button>
            </div>
          </section>
        </div>
      </section>`;
  }

  function renderSession() {
    const session = state.activeSession;
    if (!session) {
      navigate("today", true);
      return;
    }
    ensureSessionPhase();
    if (!state.activeSession) return;

    const active = state.activeSession;
    const phaseLabel = active.phase === "review" ? "到期复习" : active.phase === "learn" ? "新词学习" : "混合自测";
    const answeredQuiz = active.quiz.filter((item) => item.answered).length;
    const answeredCard = active.cardResult ? 1 : 0;
    const completed =
      Math.min(active.reviewIndex, active.reviewIds.length) +
      Math.min(active.learnIndex, active.newIds.length) +
      answeredCard +
      answeredQuiz;
    const total = active.reviewIds.length + active.newIds.length + active.quiz.length;
    const progress = progressPercent(completed, total);

    let body = "";
    if (active.phase === "review" || active.phase === "learn") {
      const ids = active.phase === "review" ? active.reviewIds : active.newIds;
      const index = active.phase === "review" ? active.reviewIndex : active.learnIndex;
      const wordId = ids[index];
      if (!wordId) {
        ensureSessionPhase();
        if (state.activeSession) renderSession();
        return;
      }
      body = renderWordCard(wordId, active.phase, index, ids.length, active);
    } else if (active.phase === "quiz") {
      const item = active.quiz[active.quizIndex];
      if (!item) {
        finishSession();
        return;
      }
      body = renderQuizQuestion(active, item);
    }

    viewRoot.innerHTML = `
      <section class="view session-view" aria-labelledby="session-title">
        <div class="session-topbar">
          <button class="button button-quiet button-sm session-exit" type="button" data-action="exit-session">
            ${icon("chevron-left", 16)} 退出
          </button>
          <div class="session-meta">
            <span class="session-stage">${phaseLabel}</span>
            <div class="session-progress-row">
              <strong id="session-title">${active.phase === "quiz" ? `第 ${active.quizIndex + 1} 题` : `第 ${(active.phase === "review" ? active.reviewIndex : active.learnIndex) + 1} 个词`}</strong>
              <span>${completed} / ${Math.max(total, 1)}</span>
            </div>
            <div class="session-progress" role="progressbar" aria-label="会话进度" aria-valuemin="0" aria-valuemax="${Math.max(total, 1)}" aria-valuenow="${completed}"><div class="session-progress-fill" style="width:${progress}%"></div></div>
          </div>
          <div class="session-spacer"></div>
        </div>
        <div class="session-content">${body}</div>
      </section>`;

    if (active.phase === "review" || active.phase === "learn") {
      const ids = active.phase === "review" ? active.reviewIds : active.newIds;
      const index = active.phase === "review" ? active.reviewIndex : active.learnIndex;
      const wordId = ids[index];
      if (!active.cardResult) {
        maybeAutoSpeak(
          `${active.id}:${active.phase}:${index}:${active.cardMode}`,
          wordId,
          "word",
        );
      }
    } else if (active.phase === "quiz") {
      const item = active.quiz[active.quizIndex];
      if (item && item.type === "listening") {
        maybeAutoSpeak(`${active.id}:quiz:${active.quizIndex}`, item.wordId, "word");
      }
    }
    focusSessionPrimaryControl(active);
  }

  function focusSessionPrimaryControl(session) {
    let selector = "";
    if (session.phase === "review" || session.phase === "learn") {
      if (session.cardResult) selector = '[data-action="next-card"]';
      else if (session.cardMode === "spelling") selector = "#card-spelling-answer";
      else selector = '[data-action="start-card-spelling"]';
    } else if (session.phase === "quiz") {
      const item = session.quiz[session.quizIndex];
      if (item?.answered) selector = '[data-action="quiz-next"]';
      else if (item?.type === "spelling") selector = "#spelling-answer";
      else selector = ".quiz-option";
    }
    const target = selector ? viewRoot.querySelector(selector) : null;
    if (target && !target.disabled) target.focus({ preventScroll: true });
  }

  function currentSessionWordId(session) {
    if (!session) return null;
    if (session.phase === "review" || session.phase === "learn") {
      const ids = session.phase === "review" ? session.reviewIds : session.newIds;
      const index = session.phase === "review" ? session.reviewIndex : session.learnIndex;
      return ids[index] || null;
    }
    if (session.phase === "quiz") return session.quiz[session.quizIndex]?.wordId || null;
    return null;
  }

  function ensureSessionPhase() {
    const session = state.activeSession;
    if (!session) return;
    if (session.phase === "review" && session.reviewIndex >= session.reviewIds.length) {
      session.phase = session.newIds.length ? "learn" : "quiz";
      session.cardMode = session.phase === "learn" ? "intro" : "spelling";
      session.cardResult = null;
    }
    if (session.phase === "learn" && session.learnIndex >= session.newIds.length) {
      session.phase = "quiz";
      session.cardMode = "intro";
      session.cardResult = null;
    }
    if (session.phase === "quiz" && !session.quiz.length) prepareQuiz(session);
    if (session.phase === "quiz" && !session.quiz.length) finishSession();
    else saveState();
  }

  function prepareQuiz(session) {
    const reviewSample = Core.shuffle(session.reviewIds).slice(0, 5);
    const quizSource = session.newIds.length
      ? [...session.newIds, ...reviewSample]
      : Core.shuffle(session.reviewIds).slice(0, 10);
    const uniqueSource = [...new Set(quizSource)];
    const types = Core.shuffle(["meaning", "listening", "spelling"]);
    session.quiz = Core.shuffle(uniqueSource).map((wordId, index) => {
      const type = types[index % types.length];
      return {
        wordId,
        type,
        options: type === "spelling" ? [] : buildQuizOptions(wordId),
        selectedIndex: null,
        answered: false,
        correct: false,
      };
    });
  }

  function buildQuizOptions(wordId) {
    const word = getWord(wordId);
    const usedMeanings = new Set([word.meaning]);
    const distractors = [];
    for (const candidate of Core.shuffle(WORDS)) {
      if (candidate.id === wordId) continue;
      if (usedMeanings.has(candidate.meaning)) continue;
      usedMeanings.add(candidate.meaning);
      distractors.push(candidate.id);
      if (distractors.length === 3) break;
    }
    return Core.shuffle([wordId, ...distractors]);
  }

  function renderWordCard(wordId, phase, index, total, session) {
    const word = getWord(wordId);
    const resultMatches =
      session.cardResult?.wordId === wordId &&
      session.cardResult.phase === phase &&
      session.cardResult.index === index;
    if (resultMatches) return renderCardResult(wordId, phase, index, total, session);
    if (session.cardMode === "spelling") {
      return renderSpellingCard(wordId, phase, index, total);
    }
    return renderCardIntro(wordId, phase, index, total);
  }

  function renderCardIntro(wordId, phase, index, total) {
    const word = getWord(wordId);
    const card = state.cards[wordId];
    const phaseName = phase === "review" ? "复习准备" : "新词学习";
    const stageNote = card
      ? `记忆阶段 ${card.stage} / 5 · ${formatDueLabel(card.due)}`
      : "首次学习 · 拼写后进入第 1 阶段";
    return `<article class="word-card" aria-label="${phaseName}词卡">
      <div class="word-card-head">
        <span class="word-card-index">${phaseName} ${index + 1} / ${total} · 第 ${wordId} 个</span>
        <div class="word-card-audio">
          <button class="sound-button" type="button" data-action="speak-word" data-word-id="${wordId}" data-audio-kind="word" aria-label="朗读 ${escapeHTML(word.word)}" aria-keyshortcuts="Space" title="朗读单词（空格）">
            <span class="icon">${icon("volume-2", 18)}</span>
            ${renderSoundBars("word")}
            <span class="sound-label">单词</span>
            ${shortcutKey("keyboard", "Space")}
          </button>
          <button class="sound-button" type="button" data-action="speak-word" data-word-id="${wordId}" data-sentence="true" data-audio-kind="sentence" aria-label="朗读例句" aria-keyshortcuts="Shift+Space" title="朗读例句（Shift + 空格）">
            <span class="icon">${icon("headphones", 18)}</span>
            ${renderSoundBars("sentence")}
            <span class="sound-label">例句</span>
            ${shortcutKey("arrow-up", "Shift+Space")}
          </button>
        </div>
      </div>
      <h2 class="${wordTitleClass(word.word)}" lang="en">${escapeHTML(word.word)}</h2>
      <div class="phonetic-display">${renderPhonetic(word.phonetic)}</div>
      <div><span class="word-pos-large">${escapeHTML(word.pos)}</span></div>
      ${renderLearningDetails(word, card, stageNote)}
      <button class="button button-secondary spelling-start-button keyboard-action" type="button" data-action="start-card-spelling" aria-keyshortcuts="Enter">${icon("spell-check", 18)} 开始拼写 ${enterKeyHint()}</button>
    </article>`;
  }

  function renderLearningDetails(word, card, stageNote) {
    const hints = getMemoryHints(word);
    return `<div class="answer-panel">
      <p class="meaning-large">${escapeHTML(word.meaning)}</p>
      <div class="memory-grid">
        <div class="memory-block">
          <span class="memory-label">词形线索</span>
          <p class="memory-text">${hints.map(escapeHTML).join("；")}</p>
        </div>
        <div class="memory-block">
          <span class="memory-label">发音记忆</span>
          <p class="memory-text">ˈ 后的音节重读，ˌ 后有次重音。先听一遍，再跟读两遍。</p>
        </div>
      </div>
      <div class="example-block">
        <span class="memory-label">例句</span>
        <p class="example-sentence" lang="en">${highlightSentence(word, word.sentence)}</p>
        <p class="example-translation">${escapeHTML(word.translation)}</p>
      </div>
      <div class="forms-block">
        <span class="memory-label">词形变化</span>
        <p class="forms-text">${escapeHTML(word.forms)}</p>
      </div>
      <p class="stage-note">${escapeHTML(stageNote)}</p>
    </div>`;
  }

  function renderSpellingCard(wordId, phase, index, total) {
    const word = getWord(wordId);
    const phaseName = phase === "review" ? "复习" : "新词";
    return `<article class="word-card spelling-card" aria-label="${phaseName}拼写检查">
      <div class="word-card-head">
        <span class="word-card-index">${phaseName} ${index + 1} / ${total} · 听音拼写</span>
        <div class="word-card-audio">
          <button class="sound-button" type="button" data-action="speak-word" data-word-id="${wordId}" data-audio-kind="word" aria-label="播放发音" aria-keyshortcuts="Space" title="播放发音（空格）">
            <span class="icon">${icon("volume-2", 18)}</span>
            ${renderSoundBars("word")}
            <span class="sound-label">单词</span>
            ${shortcutKey("keyboard", "Space")}
          </button>
          <button class="sound-button" type="button" data-action="speak-word" data-word-id="${wordId}" data-sentence="true" data-audio-kind="sentence" aria-label="播放例句" aria-keyshortcuts="Shift+Space" title="播放例句（Shift + 空格）">
            <span class="icon">${icon("headphones", 18)}</span>
            ${renderSoundBars("sentence")}
            <span class="sound-label">例句</span>
            ${shortcutKey("arrow-up", "Shift+Space")}
          </button>
        </div>
      </div>
      <div class="spelling-context">
        <span class="quiz-kicker">拼写检查</span>
        <h2 class="spelling-title">根据发音和中文意思拼写</h2>
        <p class="meaning-large">${escapeHTML(word.meaning)}</p>
        <div class="spelling-meta">
          <span class="pos-tag">${escapeHTML(word.pos)}</span>
        </div>
        <div class="spelling-example">
          <span class="memory-label">例句</span>
          <p class="example-sentence" lang="en">${redactSentence(word, word.sentence)}</p>
          <p class="example-translation">${escapeHTML(word.translation)}</p>
        </div>
      </div>
      <label class="letter-entry" for="card-spelling-answer">
        <span class="sr-only">输入 ${word.word.length} 个字母的英文拼写</span>
        ${renderLetterSlots(word.word)}
        <input class="sr-only" id="card-spelling-answer" name="answer" type="text" maxlength="${word.word.length}" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="输入英文拼写" />
      </label>
    </article>`;
  }

  function renderLetterSlots(word, answer, evaluated) {
    const densityClass =
      word.length >= 13
        ? "letter-slots-extra-dense"
        : word.length >= 10
          ? "letter-slots-dense"
          : "";
    return `<span class="letter-slots ${densityClass} ${evaluated ? "letter-slots-evaluated" : ""}" aria-hidden="true">${Array.from(
      { length: word.length },
      (_, index) => {
        const typed = answer?.[index] || "";
        const state = evaluated
          ? typed.toLowerCase() === word[index].toLowerCase()
            ? "is-correct"
            : "is-wrong"
          : "";
        const current = !evaluated && !answer && index === 0 ? "is-current" : "";
        return `<span class="letter-slot ${typed ? "is-filled" : "is-empty"} ${state} ${current}" data-slot-index="${index}" style="--slot-index:${index}"><span class="letter-char">${escapeHTML(typed)}</span><span class="letter-rule"></span></span>`;
      },
    ).join("")}</span>`;
  }

  function renderCardResult(wordId, phase, index, total, session) {
    const word = getWord(wordId);
    const result = session.cardResult;
    const card = state.cards[wordId];
    const phaseName = phase === "review" ? "复习" : "新词";
    const stageNote = card
      ? `记忆阶段 ${card.stage} / 5 · ${formatDueLabel(card.due)}`
      : "本轮答案已记录";
    const isLastReview = phase === "review" && index >= session.reviewIds.length - 1;
    const isLastLearn = phase === "learn" && index >= session.newIds.length - 1;
    const nextLabel = isLastReview
      ? session.newIds.length
        ? "开始新词学习"
        : "进入混合自测"
      : isLastLearn
        ? "进入混合自测"
        : "下一个词";

    return `<article class="word-card card-result-card" aria-label="${phaseName}拼写结果">
      <div class="word-card-head">
        <span class="word-card-index">${phaseName} ${index + 1} / ${total} · 拼写结果</span>
        <div class="word-card-audio">
          <button class="sound-button" type="button" data-action="speak-word" data-word-id="${wordId}" data-audio-kind="word" aria-label="朗读 ${escapeHTML(word.word)}" aria-keyshortcuts="Space" title="朗读单词（空格）">
            <span class="icon">${icon("volume-2", 18)}</span>
            ${renderSoundBars("word")}
            <span class="sound-label">单词</span>
            ${shortcutKey("keyboard", "Space")}
          </button>
          <button class="sound-button" type="button" data-action="speak-word" data-word-id="${wordId}" data-sentence="true" data-audio-kind="sentence" aria-label="朗读例句" aria-keyshortcuts="Shift+Space" title="朗读例句（Shift + 空格）">
            <span class="icon">${icon("headphones", 18)}</span>
            ${renderSoundBars("sentence")}
            <span class="sound-label">例句</span>
            ${shortcutKey("arrow-up", "Shift+Space")}
          </button>
        </div>
      </div>
      <div class="card-result-banner ${result.correct ? "is-correct" : "is-wrong"}" role="status" aria-live="polite">
        <span class="card-result-icon">${icon(result.correct ? "check" : "x", 20)}</span>
        <div>
          <strong>${result.correct ? "拼写正确" : "拼写有误"}</strong>
          <span class="card-result-message">${result.correct ? `你拼写的是 ${escapeHTML(result.answer)}` : `你输入了 ${escapeHTML(result.answer)}，正确拼写是 ${escapeHTML(word.word)}`}</span>
        </div>
        <div class="answer-spelling">
          <span class="answer-spelling-label">你的拼写</span>
          ${renderLetterSlots(word.word, result.answer, true)}
        </div>
      </div>
      <h2 class="${wordTitleClass(word.word)}" lang="en">${escapeHTML(word.word)}</h2>
      <div class="phonetic-display">${renderPhonetic(word.phonetic)}</div>
      <div><span class="word-pos-large">${escapeHTML(word.pos)}</span></div>
      ${renderLearningDetails(word, card, stageNote)}
      <div class="quiz-footer">
        <button class="button button-primary keyboard-action" type="button" data-action="next-card" aria-keyshortcuts="Enter">${nextLabel} ${enterKeyHint()}</button>
      </div>
    </article>`;
  }

  function renderQuizQuestion(session, item) {
    const word = getWord(item.wordId);
    const promptMap = {
      meaning: "选择正确的中文释义",
      listening: "听发音，选择对应单词",
      spelling: "根据释义和发音拼写单词",
    };
    const typeLabel = item.type === "meaning" ? "词义选择" : item.type === "listening" ? "听音辨词" : "拼写填空";
    const progressText = `${session.quizIndex + 1} / ${session.quiz.length}`;
    let questionBody = "";
    const quizWordClass =
      word.word.length >= 13
        ? "quiz-word quiz-word-xlong"
        : word.word.length >= 10
          ? "quiz-word quiz-word-long"
          : "quiz-word";

    if (item.type === "meaning") {
      questionBody = `<h2 class="${quizWordClass}" lang="en">${escapeHTML(word.word)}</h2><div class="phonetic-display">${renderPhonetic(word.phonetic)}</div>`;
    } else if (item.type === "listening") {
      questionBody = `<button class="quiz-listen-button" type="button" data-action="speak-word" data-word-id="${item.wordId}" data-audio-kind="word" aria-label="播放发音" aria-keyshortcuts="Space">
        <span class="quiz-listen-icon">${icon("volume-2", 28)}</span>
        <span class="quiz-listen-label">播放单词发音 ${renderSoundBars("word")}</span>
        <span class="quiz-listen-key">${shortcutKey("keyboard", "Space")}</span>
      </button>`;
    } else {
      questionBody = `<p class="meaning-large">${escapeHTML(word.meaning)}</p>
        <div class="backup-actions"><button class="button button-secondary button-sm sound-button quiz-audio-button" type="button" data-action="speak-word" data-word-id="${item.wordId}" data-audio-kind="word" aria-keyshortcuts="Space">${icon("volume-2", 16)} 听发音 ${renderSoundBars("word")} ${shortcutKey("keyboard", "Space")}</button></div>`;
    }

    let interaction = "";
    if (item.type === "meaning" || item.type === "listening") {
      interaction = `${item.answered ? "" : quizKeyboardHints()}<div class="quiz-options">
        ${item.options
          .map((optionId, index) => {
            const optionWord = getWord(optionId);
            const isCorrect = item.answered && optionId === item.wordId;
            const isWrong = item.answered && item.selectedIndex === index && optionId !== item.wordId;
            const optionText = item.type === "meaning" ? optionWord.meaning : optionWord.word;
            return `<button class="quiz-option ${isCorrect ? "is-correct" : ""} ${isWrong ? "is-wrong" : ""} ${item.selectedIndex === index ? "is-selected" : ""}" type="button" data-action="quiz-option" data-option-index="${index}" aria-keyshortcuts="ArrowUp ArrowDown Enter" ${item.answered ? "disabled" : ""}>
              <span class="option-key">${String.fromCharCode(65 + index)}</span>
              <span class="option-copy" ${item.type === "listening" ? 'lang="en"' : ""}>${escapeHTML(optionText)}</span>
              ${isCorrect ? `<span class="icon">${icon("check", 18)}</span>` : isWrong ? `<span class="icon">${icon("x", 18)}</span>` : "<span></span>"}
            </button>`;
          })
          .join("")}
      </div>`;
    } else if (!item.answered) {
      interaction = `<label class="letter-entry quiz-letter-entry" for="spelling-answer">
        <span class="sr-only">输入 ${word.word.length} 个字母的英文拼写</span>
        ${renderLetterSlots(word.word)}
        <input class="sr-only" id="spelling-answer" name="answer" type="text" maxlength="${word.word.length}" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="输入英文拼写" />
      </label>`;
    }

    const feedback = item.answered
      ? `<div class="quiz-feedback ${item.correct ? "is-correct" : "is-wrong"}" role="status" aria-live="polite">
          <strong>${item.correct ? "回答正确" : "需要再记一次"}</strong>
          <span>${escapeHTML(word.word)} · ${escapeHTML(word.meaning)}</span>
          ${item.type === "spelling" ? `<div class="quiz-answer-slots">${renderLetterSlots(word.word, item.answer, true)}</div>` : ""}
        </div>
        <div class="quiz-footer"><button class="button button-primary keyboard-action" type="button" data-action="quiz-next" aria-keyshortcuts="Enter">${session.quizIndex === session.quiz.length - 1 ? "查看本次小结" : "下一题"} ${enterKeyHint()}</button></div>`
      : "";

    return `<article class="quiz-card" aria-label="${typeLabel}">
      <span class="quiz-kicker">${typeLabel} · ${progressText}</span>
      <p class="quiz-prompt">${promptMap[item.type]}</p>
      ${questionBody}
      ${interaction}
      ${feedback}
    </article>`;
  }

  function updateAnswerStats(correct) {
    state.stats.totalAnswers += 1;
    if (correct) state.stats.correctAnswers += 1;
  }

  function renderSummary() {
    const summary = state.lastSummary;
    if (!summary) {
      navigate("today", true);
      return;
    }
    const weakWords = (summary.weakIds || []).map(getWord).filter(Boolean);
    const weakRows = weakWords.length
      ? weakWords
          .map((word) => `<div class="summary-word-row">
            <span class="summary-word-copy"><strong lang="en">${escapeHTML(word.word)}</strong><span>${escapeHTML(word.meaning)}</span></span>
            <button class="sound-button compact-sound-button" type="button" data-action="speak-word" data-word-id="${word.id}" data-audio-kind="word" aria-label="朗读 ${escapeHTML(word.word)}" title="朗读单词">${icon("volume-2", 17)}${renderSoundBars("word")}</button>
          </div>`)
          .join("")
      : `<div class="lines-empty">本次没有答错的词。</div>`;
    viewRoot.innerHTML = `
      <section class="view session-view" aria-labelledby="summary-title">
        <article class="summary-view">
          <span class="summary-mark">${icon("check", 30)}</span>
          <h1 class="summary-title" id="summary-title">${summary.newCount ? "今日会话完成" : "本次复习完成"}</h1>
          <p class="summary-copy">${summary.nextDue ? `下一次复习最早安排在 ${formatDateHuman(summary.nextDue)}。` : "答案已经记录，首页的复习队列会按记忆阶段更新。"}</p>
          <div class="summary-stat-grid">
            <div class="summary-stat"><strong>${summary.accuracy}%</strong><span>正确率</span></div>
            <div class="summary-stat"><strong>${summary.newCount}</strong><span>新词</span></div>
            <div class="summary-stat"><strong>${summary.reviewCount}</strong><span>复习词</span></div>
          </div>
          <div class="summary-word-list">
            ${weakRows}
          </div>
          <div class="summary-actions">
            <a class="button button-primary" href="#today">${icon("home", 17)} 返回首页</a>
            <a class="button button-secondary" href="#library">${icon("book-open", 17)} 查看全部词汇</a>
            ${totalDue() ? `<button class="button button-quiet" type="button" data-action="start-review">${icon("refresh", 17)} 继续复习 ${totalDue()} 词</button>` : ""}
          </div>
        </article>
      </section>`;
    window.requestAnimationFrame(() => {
      viewRoot.querySelector(".summary-actions .button-primary")?.focus({ preventScroll: true });
    });
  }

  function createSessionId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function startSession(reviewOnly) {
    if (state.activeSession) {
      navigate("session");
      return;
    }
    const today = Core.todayKey();
    const dueIds = Core.getDueIds(state.cards, today);
    const completedNewToday = state.stats.lastNewSessionDate === today;
    const newIds =
      reviewOnly || completedNewToday
        ? []
        : Core.getNewWordIds(state.course, WORDS.length, state.settings.dailyNew);
    if (!dueIds.length && !newIds.length) {
      showToast(reviewOnly ? "当前没有到期复习词。" : "今天没有可开始的新任务。");
      return;
    }
    const noNewSession = !newIds.length;
    state.activeSession = {
      id: createSessionId(),
      date: today,
      startedAt: Date.now(),
      phase: dueIds.length ? "review" : newIds.length ? "learn" : "quiz",
      reviewIds: dueIds,
      newIds,
      reviewIndex: 0,
      learnIndex: 0,
      quizIndex: 0,
      quiz: [],
      cardMode: "intro",
      cardResult: null,
      answers: [],
      reviewOnly: reviewOnly || noNewSession,
    };
    lastAutoSpeakKey = "";
    saveState();
    navigate("session");
  }

  function advanceCard() {
    const session = state.activeSession;
    if (!session) return;
    if (session.phase === "review") {
      session.reviewIndex += 1;
      if (session.reviewIndex >= session.reviewIds.length) {
        session.phase = session.newIds.length ? "learn" : "quiz";
      }
    } else if (session.phase === "learn") {
      session.learnIndex += 1;
      if (session.learnIndex >= session.newIds.length) session.phase = "quiz";
    }
    session.cardMode = "intro";
    session.cardResult = null;
    ensureSessionPhase();
    if (state.activeSession) renderSession();
  }

  function startCardSpelling() {
    const session = state.activeSession;
    if (!session || !["review", "learn"].includes(session.phase)) return;
    session.cardMode = "spelling";
    session.cardResult = null;
    saveState();
    renderSession();
  }

  function handleCardSpellingInput(input) {
    const session = state.activeSession;
    if (!session || !["review", "learn"].includes(session.phase) || session.cardResult) return;
    const ids = session.phase === "review" ? session.reviewIds : session.newIds;
    const index = session.phase === "review" ? session.reviewIndex : session.learnIndex;
    const word = getWord(ids[index]);
    if (!word) return;
    const value = input.value.replace(/[^A-Za-z]/g, "").slice(0, word.word.length);
    if (input.value !== value) input.value = value;
    updateLetterEntry(input, value, word.word.length);
    if (value.length === word.word.length) submitCardSpelling(value);
  }

  function updateLetterEntry(input, value, letterCount) {
    const slots = input.closest(".letter-entry")?.querySelectorAll(".letter-slot") || [];
    slots.forEach((slot, slotIndex) => {
      const character = value[slotIndex] || "";
      const characterElement = slot.querySelector(".letter-char");
      if (characterElement) characterElement.textContent = character;
      slot.classList.toggle("is-empty", !character);
      slot.classList.toggle("is-filled", Boolean(character));
      slot.classList.toggle("is-current", slotIndex === value.length && value.length < letterCount);
    });
  }

  function handleQuizSpellingInput(input) {
    const session = state.activeSession;
    if (!session || session.phase !== "quiz") return;
    const item = session.quiz[session.quizIndex];
    if (!item || item.type !== "spelling" || item.answered) return;
    const word = getWord(item.wordId);
    const value = input.value.replace(/[^A-Za-z]/g, "").slice(0, word.word.length);
    if (input.value !== value) input.value = value;
    updateLetterEntry(input, value, word.word.length);
    if (value.length === word.word.length) answerSpelling(value);
  }

  function submitCardSpelling(rawAnswer) {
    const session = state.activeSession;
    if (!session || !["review", "learn"].includes(session.phase) || session.cardResult) return;
    const ids = session.phase === "review" ? session.reviewIds : session.newIds;
    const index = session.phase === "review" ? session.reviewIndex : session.learnIndex;
    const wordId = ids[index];
    if (!wordId) return;
    const word = getWord(wordId);
    const answer = String(rawAnswer || "").replace(/[^A-Za-z]/g, "").trim();
    if (answer.length !== word.word.length) return;
    const correct = answer.toLowerCase() === word.word.toLowerCase();
    Core.applyAnswer(state.cards, wordId, correct, Core.todayKey());
    session.answers.push({ wordId, correct, phase: session.phase, cardIndex: index });
    session.cardResult = {
      wordId,
      phase: session.phase,
      index,
      correct,
      answer,
    };
    updateAnswerStats(correct);
    triggerSpellingFeedback(
      correct,
      `${session.id}:card:${session.phase}:${index}:${wordId}`,
    );
    saveState();
    renderSession();
  }

  function nextCard() {
    const session = state.activeSession;
    if (!session?.cardResult) return;
    advanceCard();
  }

  function answerQuizOption(optionIndex) {
    const session = state.activeSession;
    if (!session || session.phase !== "quiz") return;
    const item = session.quiz[session.quizIndex];
    if (!item || item.answered) return;
    const selectedWordId = item.options[optionIndex];
    if (!selectedWordId) return;
    item.selectedIndex = optionIndex;
    item.answered = true;
    item.correct = selectedWordId === item.wordId;
    Core.applyAnswer(state.cards, item.wordId, item.correct, Core.todayKey());
    session.answers.push({ wordId: item.wordId, correct: item.correct, phase: "quiz" });
    updateAnswerStats(item.correct);
    saveState();
    renderSession();
  }

  function answerSpelling(rawAnswer) {
    const session = state.activeSession;
    if (!session || session.phase !== "quiz") return;
    const item = session.quiz[session.quizIndex];
    if (!item || item.answered) return;
    const word = getWord(item.wordId);
    const answer = String(rawAnswer || "").replace(/[^A-Za-z]/g, "").slice(0, word.word.length);
    if (answer.length !== word.word.length) return;
    item.answered = true;
    item.answer = answer;
    item.correct = answer === word.word.toLowerCase();
    Core.applyAnswer(state.cards, item.wordId, item.correct, Core.todayKey());
    session.answers.push({ wordId: item.wordId, correct: item.correct, phase: "quiz" });
    updateAnswerStats(item.correct);
    triggerSpellingFeedback(
      item.correct,
      `${session.id}:quiz:${session.quizIndex}:${item.wordId}`,
    );
    saveState();
    renderSession();
  }

  function nextQuizQuestion() {
    const session = state.activeSession;
    if (!session || session.phase !== "quiz") return;
    const item = session.quiz[session.quizIndex];
    if (!item?.answered) return;
    if (session.quizIndex >= session.quiz.length - 1) {
      finishSession();
      return;
    }
    session.quizIndex += 1;
    saveState();
    renderSession();
  }

  function finishSession() {
    const session = state.activeSession;
    if (!session) return;
    const today = Core.todayKey();
    const answers = session.answers;
    const correct = answers.filter((answer) => answer.correct).length;
    const total = answers.length;
    const weakIds = [...new Set(answers.filter((answer) => !answer.correct).map((answer) => answer.wordId))];
    const allIds = [...new Set([...session.newIds, ...session.reviewIds])];
    const nextDue = allIds
      .map((id) => state.cards[id]?.due)
      .filter((due) => due && due > today)
      .sort()[0];
    const previousStudyDate = state.stats.lastStudyDate;
    const yesterday = Core.addDays(today, -1);

    if (session.newIds.length) {
      Core.advanceCourse(state.course, session.newIds.length, WORDS.length, DATA.planRounds);
      state.stats.lastNewSessionDate = today;
    }
    state.stats.completedSessions += 1;
    if (previousStudyDate !== today) {
      state.stats.streak = previousStudyDate === yesterday ? state.stats.streak + 1 : 1;
    }
    state.stats.lastStudyDate = today;
    const summary = {
      date: today,
      completedAt: Date.now(),
      total,
      correct,
      accuracy: total ? Math.round((correct / total) * 100) : 0,
      weakIds,
      newCount: session.newIds.length,
      reviewCount: session.reviewIds.length,
      nextDue: nextDue || null,
    };
    state.lastSummary = summary;
    state.history.push({
      date: today,
      newCount: summary.newCount,
      reviewCount: summary.reviewCount,
      accuracy: summary.accuracy,
      answers: total,
    });
    state.history = state.history.slice(-120);
    state.activeSession = null;
    saveState();
    navigate("summary");
  }

  function openWordDialog(wordId) {
    const word = getWord(wordId);
    if (!word) return;
    const card = state.cards[wordId];
    const status = getLibraryStatus(card);
    currentDialogWordId = wordId;
    lastFocusedElement = document.activeElement;
    wordDialogContent.innerHTML = `
      <div class="dialog-word-row">
        <div>
          <h2 class="dialog-word" id="word-dialog-title" lang="en">${escapeHTML(word.word)}</h2>
          <div class="phonetic-display">${renderPhonetic(word.phonetic)}</div>
          <span class="word-pos-large">${escapeHTML(word.pos)}</span>
        </div>
        <div class="word-card-audio">
          <button class="sound-button" type="button" data-action="speak-word" data-word-id="${wordId}" data-audio-kind="word" aria-label="朗读 ${escapeHTML(word.word)}" aria-keyshortcuts="Space" title="朗读单词">
            <span class="icon">${icon("volume-2", 18)}</span>${renderSoundBars("word")}<span class="sound-label">单词</span>${shortcutKey("keyboard", "Space")}
          </button>
          <button class="sound-button" type="button" data-action="speak-word" data-word-id="${wordId}" data-sentence="true" data-audio-kind="sentence" aria-label="朗读例句" aria-keyshortcuts="Shift+Space" title="朗读例句">
            <span class="icon">${icon("headphones", 18)}</span>${renderSoundBars("sentence")}<span class="sound-label">例句</span>${shortcutKey("arrow-up", "Shift+Space")}
          </button>
        </div>
      </div>
      <p class="dialog-meaning">${escapeHTML(word.meaning)}</p>
      <div class="detail-grid">
        <div class="detail-item"><span class="detail-label">记忆状态</span><p class="detail-value"><span class="status-pill ${status.className}">${status.label}</span></p></div>
        <div class="detail-item"><span class="detail-label">复习安排</span><p class="detail-value">${card ? `${formatDueLabel(card.due)} · 阶段 ${card.stage}/5` : "首次学习后自动安排"}</p></div>
        <div class="detail-item"><span class="detail-label">词形变化</span><p class="detail-value">${escapeHTML(word.forms)}</p></div>
        <div class="detail-item"><span class="detail-label">记忆线索</span><p class="detail-value">${getMemoryHints(word).map(escapeHTML).join("；")}</p></div>
      </div>
      <div class="dialog-example">
        <p class="example-sentence" lang="en">${highlightSentence(word, word.sentence)}</p>
        <p class="example-translation">${escapeHTML(word.translation)}</p>
      </div>`;
    if (typeof wordDialog.showModal === "function") wordDialog.showModal();
    else wordDialog.setAttribute("open", "");
    wordDialog.querySelector('[data-action="close-word-dialog"]')?.focus({ preventScroll: true });
  }

  function closeWordDialog() {
    if (wordDialog.open && typeof wordDialog.close === "function") wordDialog.close();
    else wordDialog.removeAttribute("open");
    currentDialogWordId = null;
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
  }

  function openConfirm(message, callback) {
    confirmMessage.textContent = message;
    confirmCallback = callback;
    confirmFocusedElement = document.activeElement;
    if (typeof confirmDialog.showModal === "function") confirmDialog.showModal();
    else confirmDialog.setAttribute("open", "");
    window.requestAnimationFrame(() => {
      confirmDialog.querySelector('[data-action="cancel-confirm"]')?.focus({ preventScroll: true });
    });
  }

  function closeConfirm() {
    if (confirmDialog.open && typeof confirmDialog.close === "function") confirmDialog.close();
    else confirmDialog.removeAttribute("open");
    confirmCallback = null;
    window.requestAnimationFrame(restoreConfirmFocus);
  }

  function restoreConfirmFocus() {
    if (confirmFocusedElement && typeof confirmFocusedElement.focus === "function") {
      confirmFocusedElement.focus({ preventScroll: true });
    }
    confirmFocusedElement = null;
  }

  function setDailyNew(value) {
    const daily = Number(value);
    if (!Core.DAILY_OPTIONS.includes(daily)) return;
    state.settings.dailyNew = daily;
    saveState();
    document.querySelectorAll('[data-action="set-daily"]').forEach((button) => {
      const selected = button.dataset.daily === String(daily);
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    const estimate = document.getElementById("daily-estimate");
    if (estimate) estimate.textContent = `按当前每日 ${daily} 词估算`;
  }

  function setAccent(accent) {
    if (!["en-US", "en-GB"].includes(accent)) return;
    state.settings.accent = accent;
    const matching = speechVoices.find((voice) =>
      voice.lang.toLowerCase().startsWith(accent.toLowerCase()),
    );
    state.settings.voiceURI = matching?.voiceURI || "";
    saveState();
    document.querySelectorAll('[data-action="set-accent"]').forEach((button) => {
      const selected = button.dataset.accent === accent;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    const voiceSelect = document.querySelector('[data-setting="voiceURI"]');
    if (voiceSelect) voiceSelect.value = state.settings.voiceURI;
  }

  function updateExamSettingsSummary() {
    const target = document.getElementById("exam-settings-summary");
    if (!target) return;
    const info = examInfo();
    target.textContent = info
      ? info.past
        ? "考试日期已过，可以继续使用复习系统。"
        : `距考试 ${info.days} 天，首轮还剩 ${info.unseen} 个词。`
      : "设置日期后，首页显示倒计时与每日所需进度。";
  }

  function updateSetting(name, value) {
    if (name === "examDate") state.settings.examDate = Core.parseDateKey(value) ? value : "";
    if (name === "rate") state.settings.rate = Core.clamp(Number(value) || 0.9, 0.6, 1.2);
    if (name === "voiceURI") state.settings.voiceURI = String(value || "");
    saveState();
  }

  function exportBackup() {
    const payload = {
      app: "声词",
      dataVersion: DATA.total,
      exportedAt: new Date().toISOString(),
      state,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `声词学习进度-${Core.todayKey()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("学习进度已导出。");
  }

  async function importBackup(file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("备份文件过大，无法导入。", { error: true });
      return;
    }
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const importedState = payload.state || payload;
      if (!importedState || typeof importedState !== "object" || !importedState.cards || !importedState.course) {
        throw new Error("Not a word-trainer backup");
      }
      openConfirm("导入备份会覆盖当前浏览器中的全部学习进度。是否继续？", () => {
        state = Core.normalizeState(importedState, {
          now: Core.todayKey(),
          totalWords: WORDS.length,
          totalRounds: DATA.planRounds,
        });
        saveState();
        navigate("today", true);
        renderRoute({ focus: true });
        showToast("学习进度已导入。");
      });
    } catch (error) {
      showToast("无法读取这个备份文件。", { error: true });
    }
  }

  function resetProgress() {
    openConfirm("会删除全部学习日、掌握度和复习记录。词表不会受影响。确定重置吗？", () => {
      state = Core.createInitialState(Core.todayKey());
      lastAutoSpeakKey = "";
      saveState();
      navigate("today", true);
      renderRoute({ focus: true });
      showToast("学习进度已重置。");
    });
  }

  function handleAction(element, event) {
    const action = element.dataset.action;
    if (!action) return;
    if (action === "start-session") startSession(false);
    if (action === "start-review") startSession(true);
    if (action === "focus-main") focusMainContent();
    if (action === "resume-session") navigate("session");
    if (action === "exit-session") navigate("today");
    if (action === "open-summary") navigate(state.lastSummary ? "summary" : "today");
    if (action === "speak-word") {
      speakWordById(
        element.dataset.wordId,
        element.dataset.sentence === "true" ? "sentence" : "word",
        false,
        element,
      );
    }
    if (action === "start-card-spelling") startCardSpelling();
    if (action === "next-card") nextCard();
    if (action === "quiz-option") answerQuizOption(Number(element.dataset.optionIndex));
    if (action === "quiz-next") nextQuizQuestion();
    if (action === "set-library-filter") {
      libraryFilter = element.dataset.filter || "all";
      libraryPage = 1;
      document.querySelectorAll('[data-action="set-library-filter"]').forEach((button) => {
        button.classList.toggle("is-active", button.dataset.filter === libraryFilter);
      });
      updateLibraryRows();
    }
    if (action === "library-page") {
      const keyboardActivated = event?.detail === 0;
      libraryPage = Math.max(1, Number(element.dataset.page) || 1);
      updateLibraryRows();
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.querySelector(".list-toolbar")?.scrollIntoView({
        block: "start",
        behavior: reducedMotion ? "auto" : "smooth",
      });
      if (keyboardActivated) {
        window.requestAnimationFrame(() => document.querySelector(".word-row-word")?.focus());
      }
    }
    if (action === "open-word") openWordDialog(element.dataset.wordId);
    if (action === "close-word-dialog") closeWordDialog();
    if (action === "cancel-confirm") closeConfirm();
    if (action === "accept-confirm") {
      const callback = confirmCallback;
      closeConfirm();
      if (callback) callback();
    }
    if (action === "set-daily") setDailyNew(element.dataset.daily);
    if (action === "set-accent") setAccent(element.dataset.accent);
    if (action === "toggle-autoplay") {
      state.settings.autoPlay = !state.settings.autoPlay;
      saveState();
      element.classList.toggle("is-on", state.settings.autoPlay);
      element.setAttribute("aria-pressed", String(state.settings.autoPlay));
    }
    if (action === "toggle-sound-effects") {
      state.settings.soundEffects = !state.settings.soundEffects;
      saveState();
      element.classList.toggle("is-on", state.settings.soundEffects);
      element.setAttribute("aria-pressed", String(state.settings.soundEffects));
      if (state.settings.soundEffects) playSpellingSound(true);
    }
    if (action === "test-voice") {
      speakText(
        "Language learning takes consistent practice.",
        state.settings.accent,
        null,
        "sentence",
        element,
      );
    }
    if (action === "export-backup") exportBackup();
    if (action === "import-backup") document.getElementById("backup-file")?.click();
    if (action === "reset-progress") resetProgress();
  }

  document.addEventListener("click", (event) => {
    const actionElement = event.target.closest("[data-action]");
    if (actionElement) handleAction(actionElement, event);
    if (event.target === wordDialog) closeWordDialog();
    if (event.target === confirmDialog) closeConfirm();
  });

  viewRoot.addEventListener("click", (event) => {
    const actionElement = event.target.closest("[data-action]");
    if (actionElement) return;
    const row = event.target.closest(".library-row[data-word-id]");
    if (row) openWordDialog(row.dataset.wordId);
  });

  viewRoot.addEventListener("input", (event) => {
    if (event.target.id === "card-spelling-answer") {
      handleCardSpellingInput(event.target);
      return;
    }
    if (event.target.id === "spelling-answer") {
      handleQuizSpellingInput(event.target);
      return;
    }
    if (event.target.id === "library-search") {
      libraryQuery = event.target.value;
      libraryPage = 1;
      updateLibraryRows();
    }
    if (event.target.dataset.setting === "rate") {
      const value = Core.clamp(Number(event.target.value) || 0.9, 0.6, 1.2);
      state.settings.rate = value;
      const label = document.getElementById("rate-value");
      if (label) label.textContent = `${value.toFixed(2)}×`;
    }
  });

  viewRoot.addEventListener("change", (event) => {
    const setting = event.target.dataset.setting;
    if (setting === "examDate") {
      updateSetting(setting, event.target.value);
      updateExamSettingsSummary();
    }
    if (setting === "rate") updateSetting(setting, event.target.value);
    if (setting === "voiceURI") updateSetting(setting, event.target.value);
    if (event.target.id === "backup-file") {
      const file = event.target.files?.[0];
      event.target.value = "";
      importBackup(file);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (wordDialog.open && event.code === "Space" && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      if (event.repeat || !currentDialogWordId) return;
      const kind = event.shiftKey ? "sentence" : "word";
      const button = wordDialog.querySelector(`[data-audio-kind="${kind}"]`);
      speakWordById(currentDialogWordId, kind, false, button);
      return;
    }
    if (currentRoute !== "session" || !state.activeSession) return;
    const session = state.activeSession;
    const quizItem = session.phase === "quiz" ? session.quiz[session.quizIndex] : null;
    const options = [...viewRoot.querySelectorAll(".quiz-option:not(:disabled)")];
    const isQuizArrow = ["ArrowUp", "ArrowDown"].includes(event.key);
    const isQuizBoundary =
      options.length > 0 && ["Home", "End"].includes(event.key);
    if (session.phase === "quiz" && (isQuizArrow || isQuizBoundary)) {
      event.preventDefault();
      if (!options.length) return;
      const focusedOption = document.activeElement?.closest?.(".quiz-option");
      const current = focusedOption ? options.indexOf(focusedOption) : -1;
      let next = ["ArrowUp", "End"].includes(event.key) ? options.length - 1 : 0;
      if (current >= 0) {
        if (event.key === "ArrowDown") next = (current + 1) % options.length;
        if (event.key === "ArrowUp") next = (current - 1 + options.length) % options.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = options.length - 1;
      }
      options[next].focus({ preventScroll: false });
      return;
    }
    if (event.code === "Space" && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      if (event.repeat) return;
      const wordId = currentSessionWordId(session);
      if (wordId) speakWordById(wordId, event.shiftKey ? "sentence" : "word");
      return;
    }
    if (event.key !== "Enter" || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const focused = document.activeElement;
    if (focused?.matches("button, a, input, select, textarea")) return;
    if (session.phase === "quiz") {
      if (quizItem?.answered) {
        event.preventDefault();
        nextQuizQuestion();
      } else if (options.length) {
        event.preventDefault();
        options[0].focus();
      } else if (quizItem?.type === "spelling") {
        event.preventDefault();
        document.getElementById("spelling-answer")?.focus();
      }
      return;
    }
    if (["review", "learn"].includes(session.phase)) {
      if (session.cardResult) {
        event.preventDefault();
        nextCard();
      } else if (session.cardMode === "intro") {
        event.preventDefault();
        startCardSpelling();
      }
    } else if (session.phase === "quiz" && session.quiz[session.quizIndex]?.answered) {
      event.preventDefault();
      nextQuizQuestion();
    }
  });

  function clearPressedButtons() {
    document.querySelectorAll("button.is-pressed, a.button.is-pressed").forEach((button) => {
      button.classList.remove("is-pressed");
    });
  }

  let keyboardPressedButton = null;

  document.addEventListener("pointerdown", (event) => {
    const button = event.target.closest("button, a.button");
    if (!button || button.disabled) return;
    button.classList.add("is-pressed");
  });

  window.addEventListener("pointerup", clearPressedButtons);
  window.addEventListener("pointercancel", clearPressedButtons);
  window.addEventListener("blur", () => {
    keyboardPressedButton = null;
    clearPressedButtons();
  });

  document.addEventListener("keydown", (event) => {
    if (event.repeat || (event.key !== "Enter" && event.code !== "Space")) return;
    const button = event.target.closest("button, a.button");
    if (!button || button.disabled) return;
    if (event.defaultPrevented) {
      if (button.dataset.audioKind) button.classList.add("is-pressed");
      return;
    }
    event.preventDefault();
    button.classList.add("is-pressed");
    keyboardPressedButton = button;
  });

  document.addEventListener("keyup", (event) => {
    if (event.key !== "Enter" && event.code !== "Space") return;
    const button = keyboardPressedButton;
    keyboardPressedButton = null;
    clearPressedButtons();
    if (button && button.isConnected && !button.disabled) button.click();
  });
  document.addEventListener("focusout", (event) => {
    event.target.closest?.("button, a.button")?.classList.remove("is-pressed");
  });

  wordDialog.addEventListener("close", () => {
    currentDialogWordId = null;
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
  });
  confirmDialog.addEventListener("cancel", () => {
    confirmCallback = null;
    window.setTimeout(restoreConfirmFocus, 0);
  });
  confirmDialog.addEventListener("close", () => {
    confirmCallback = null;
    restoreConfirmFocus();
  });
})();
