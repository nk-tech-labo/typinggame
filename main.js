const sentences = [
  { jp: '今日はいい天気ですね。', rom: 'kyou wa ii tenki desu ne.' },
  { jp: '明日また会いましょう。', rom: 'ashita mata aimashou.' },
  { jp: 'プログラミングは楽しい。', rom: 'puroguramingu wa tanoshii.' },
  { jp: '猫が好きです。', rom: 'neko ga suki desu.' },
];

let romanFull = '';
let romanClean = '';
let mapTypedToFull = [];
let mapFullToTyped = [];
let current = '';
let mode = 'full';
let index = 0;
let startTime = 0;
let timerInterval = null;
let correct = 0;
let total = 0;

const japaneseEl = document.getElementById('japanese');
const romanEl = document.getElementById('roman');
const inputEl = document.getElementById('input');
const timerEl = document.getElementById('timer');
const counterEl = document.getElementById('counter');
const displayEl = document.getElementById('display');
const resultEl = document.getElementById('result');
const scoreEl = document.getElementById('score');
const modeEl = document.getElementById('mode');

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateDisplay() {
  const typed = inputEl.value.replace(/\s+/g, '');
  let html = '';
  for (let i = 0; i < romanFull.length; i++) {
    const ch = romanFull[i];
    const tIdx = mapFullToTyped[i];
    if (tIdx !== -1 && tIdx < typed.length) {
      html += `<span class="${typed[tIdx] === romanClean[tIdx] ? 'correct' : 'incorrect'}">${ch}</span>`;
  let html = '';
  for (let i = 0; i < current.length; i++) {
    const ch = current[i];
    if (i < index) {
      html += `<span class="${inputEl.value[i] === ch ? 'correct' : 'incorrect'}">${ch}</span>`;
    } else {
      html += `<span>${ch}</span>`;
    }
  }
  romanEl.innerHTML = html;
  counterEl.textContent = `${index}/${romanClean.length}`;
}

function beep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  osc.frequency.value = 440;
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

function finish() {
  clearInterval(timerInterval);
  inputEl.disabled = true;
  displayEl.classList.add('hidden');
  resultEl.classList.remove('hidden');
  const elapsed = Date.now() - startTime;
  const accuracy = correct / total * 100;
  const minutes = elapsed / 60000;
  const cpm = correct / minutes;
  const wpm = cpm / 5;
  scoreEl.textContent = `時間: ${formatTime(elapsed)}\n正確率: ${accuracy.toFixed(1)}%\nWPM: ${wpm.toFixed(1)}`;
}

function checkTime() {
  const elapsed = Date.now() - startTime;
  timerEl.textContent = formatTime(elapsed);
  if (mode === 'time' && elapsed >= 30000) {
    finish();
  }
}

function start() {
  mode = modeEl.value;
  const s = sentences[Math.floor(Math.random() * sentences.length)];
  romanFull = s.rom;
  romanClean = romanFull.replace(/\s+/g, '');
  mapTypedToFull = [];
  mapFullToTyped = [];
  let t = 0;
  for (let i = 0; i < romanFull.length; i++) {
    if (romanFull[i] !== ' ') {
      mapTypedToFull.push(i);
      mapFullToTyped[i] = t++;
    } else {
      mapFullToTyped[i] = -1;
    }
  }
  japaneseEl.textContent = s.jp;
  index = 0;
  correct = 0;
  total = romanClean.length;
  current = s.rom;
  japaneseEl.textContent = s.jp;
  index = 0;
  correct = 0;
  total = current.length;
  inputEl.value = '';
  inputEl.disabled = false;
  displayEl.classList.remove('hidden');
  resultEl.classList.add('hidden');
  updateDisplay();
  startTime = Date.now();
  timerEl.textContent = '00:00';
  timerInterval = setInterval(checkTime, 100);
  inputEl.focus();
}

inputEl.addEventListener('input', e => {
  const typed = e.target.value.replace(/\s+/g, '');
  while (index < typed.length) {
    const char = typed[index];
    if (char === romanClean[index]) {
      correct++;
    } else {
      beep();
    }
    index++;
  }
  updateDisplay();
  if (index >= romanClean.length && mode === 'full') {
  const val = e.target.value;
  const char = val[index];
  if (!char) return;
  if (char === current[index]) {
    correct++;
  } else {
    beep();
  }
  index++;
  updateDisplay();
  if (index >= current.length && mode === 'full') {
    finish();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start').addEventListener('click', start);
  document.getElementById('restart').addEventListener('click', start);
});
document.getElementById('start').addEventListener('click', start);
document.getElementById('restart').addEventListener('click', start);
