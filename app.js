const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  document.documentElement.style.setProperty('--bg', tg.themeParams.bg_color || '#0d0e14');
  document.documentElement.style.setProperty('--card', tg.themeParams.secondary_bg_color || '#161822');
  document.documentElement.style.setProperty('--text', tg.themeParams.text_color || '#ffffff');
  document.documentElement.style.setProperty('--muted', tg.themeParams.hint_color || '#8b8fa8');
  document.documentElement.style.setProperty('--primary', tg.themeParams.button_color || '#7b5cff');
}

// Data
let balance = 1000;
let staked = 0;

// Elements
const balanceEl = document.getElementById('balanceValue');
const stakedEl = document.getElementById('stakedValue');
const headerBalance = document.getElementById('headerBalance');
const stakeModal = document.getElementById('stakeModal');
const unstakeModal = document.getElementById('unstakeModal');
const stakeInput = document.getElementById('stakeAmount');
const unstakeInput = document.getElementById('unstakeAmount');

function updateUI() {
  balanceEl.textContent = balance.toLocaleString('ru-RU');
  stakedEl.textContent = staked.toLocaleString('ru-RU');
  headerBalance.textContent = balance.toLocaleString('ru-RU');
}

// Tabs
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// Stake / Unstake open
document.getElementById('stakeBtn').addEventListener('click', () => {
  stakeInput.value = '';
  stakeModal.classList.add('active');
});
document.getElementById('unstakeBtn').addEventListener('click', () => {
  unstakeInput.value = '';
  unstakeModal.classList.add('active');
});

// Close modals
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    stakeModal.classList.remove('active');
    unstakeModal.classList.remove('active');
  });
});
[stakeModal, unstakeModal].forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('active'); });
});

// Quick amounts
document.querySelectorAll('#stakeModal .quick').forEach(btn => {
  btn.addEventListener('click', () => {
    stakeInput.value = btn.dataset.amount === 'all' ? balance : btn.dataset.amount;
  });
});
document.querySelectorAll('#unstakeModal .quick').forEach(btn => {
  btn.addEventListener('click', () => {
    unstakeInput.value = btn.dataset.amount === 'all' ? staked : btn.dataset.amount;
  });
});

// Confirm stake
document.getElementById('confirmStake').addEventListener('click', () => {
  const amount = parseInt(stakeInput.value);
  if (!amount || amount <= 0) return showAlert('Введите число');
  if (amount > balance) return showAlert('Недостаточно средств');
  balance -= amount;
  staked += amount;
  updateUI();
  stakeModal.classList.remove('active');
  showAlert(`✅ Застейкано ${amount}`);
});

// Confirm unstake
document.getElementById('confirmUnstake').addEventListener('click', () => {
  const amount = parseInt(unstakeInput.value);
  if (!amount || amount <= 0) return showAlert('Введите число');
  if (amount > staked) return showAlert('Недостаточно в стейкинге');
  staked -= amount;
  balance += amount;
  updateUI();
  unstakeModal.classList.remove('active');
  showAlert(`✅ Забрано ${amount}`);
});

function showAlert(text) {
  if (tg) tg.showAlert(text);
  else alert(text);
}

updateUI();
