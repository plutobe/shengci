const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "words.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(source, context, { filename: "words.js" });
const data = context.window.WORD_TRAINER_DATA;

test("the bundled workbook contains all 414 words in id order", () => {
  assert.equal(data.total, 414);
  assert.equal(data.words.length, 414);
  assert.deepEqual(
    Array.from(data.words, (word) => word.id),
    Array.from({ length: 414 }, (_, index) => index + 1),
  );
});

test("every word has the complete learning and pronunciation data", () => {
  for (const word of data.words) {
    for (const field of ["word", "phonetic", "meaning", "pos", "sentence", "translation", "forms"]) {
      assert.equal(typeof word[field], "string", `${word.id} ${field}`);
      assert.ok(word[field].trim().length > 0, `${word.id} ${field}`);
    }
    assert.match(word.phonetic, /^\/.+\/$/);
  }
});

test("words are unique and preserve the ten-round plan metadata", () => {
  assert.equal(new Set(data.words.map((word) => word.word)).size, 414);
  assert.equal(data.planRounds, 10);
  assert.deepEqual(Array.from(data.newPerDayOptions), [5, 10, 15, 20]);
});
