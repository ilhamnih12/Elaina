const fs = require('fs-extra');
const path = require('path');

const economyPath = path.join(__dirname, '..', 'economy.json');

const jobs = {
  intern: {
    title: 'Intern',
    req: { exp: 0, skills: {} },
    payMin: 50,
    payMax: 100,
    expGain: 5,
    cooldownMs: 10 * 60 * 1000,
    description: 'Pekerjaan entry-level, cocok untuk pemula.'
  },
  junior_dev: {
    title: 'Junior Developer',
    req: { exp: 50, skills: { programming: 1 } },
    payMin: 150,
    payMax: 300,
    expGain: 15,
    cooldownMs: 10 * 60 * 1000,
    description: 'Tugas coding dasar dan bug fix.'
  },
  designer: {
    title: 'Designer',
    req: { exp: 30, skills: { design: 1 } },
    payMin: 120,
    payMax: 250,
    expGain: 12,
    cooldownMs: 10 * 60 * 1000,
    description: 'Mendesain aset grafis dan UI.'
  },
  manager: {
    title: 'Manager',
    req: { exp: 200, skills: { management: 2 } },
    payMin: 400,
    payMax: 800,
    expGain: 40,
    cooldownMs: 10 * 60 * 1000,
    description: 'Mengatur tim dan proyek.'
  }
};

function loadEconomy() {
  if (!fs.existsSync(economyPath)) {
    fs.writeJsonSync(economyPath, { users: {}, nextId: 1 }, { spaces: 2 });
  }
  try {
    return fs.readJsonSync(economyPath);
  } catch (err) {
    console.error('❌ Gagal membaca economy.json, merestore default');
    return { users: {}, nextId: 1 };
  }
}

function saveEconomy(data) {
  fs.writeJsonSync(economyPath, data, { spaces: 2 });
}

function ensureUser(userId, data) {
  let saveNeeded = false;
  if (!data) {
    data = loadEconomy();
    saveNeeded = true;
  }

  if (!data.users[userId]) {
    data.users[userId] = {
      balance: 1000,
      last_daily: 0,
      exp: 0,
      skills: {},
      last_work: {},
      name: null,
      id: data.nextId || 1
    };
    data.nextId = (data.nextId || 1) + 1;
    if (saveNeeded) saveEconomy(data);
  } else {
    // Ensure all required fields exist
    const user = data.users[userId];
    let changed = false;

    if (user.balance === undefined) { user.balance = 1000; changed = true; }
    if (user.last_daily === undefined) { user.last_daily = 0; changed = true; }
    if (user.exp === undefined) { user.exp = 0; changed = true; }
    if (!user.skills) { user.skills = {}; changed = true; }
    if (!user.last_work) { user.last_work = {}; changed = true; }
    if (user.name === undefined) { user.name = null; changed = true; }

    if (!user.id) {
      user.id = data.nextId || 1;
      data.nextId = (data.nextId || 1) + 1;
      changed = true;
    }

    if (changed && saveNeeded) {
      saveEconomy(data);
    }
  }
  return data.users[userId];
}

function getUser(userId) {
  const data = loadEconomy();
  const user = ensureUser(userId, data);
  // ensureUser might have modified data (if id was missing), so we should save if it changed
  // but for simplicity, we'll just return the user and assume ensureUser handles internal consistency
  return user;
}

function addMoney(userId, amount) {
  const data = loadEconomy();
  ensureUser(userId, data);
  data.users[userId].balance += amount;
  saveEconomy(data);
  return data.users[userId].balance;
}

function addExp(userId, amount) {
  const data = loadEconomy();
  ensureUser(userId, data);
  data.users[userId].exp += amount;
  saveEconomy(data);
  return data.users[userId].exp;
}

function setLastDaily(userId, ts) {
  const data = loadEconomy();
  ensureUser(userId, data);
  data.users[userId].last_daily = ts;
  saveEconomy(data);
}

function canWork(userId, jobKey) {
  const user = getUser(userId);
  const job = jobs[jobKey];
  if (!job) return { ok: false, reason: 'Job tidak ditemukan' };

  // Check exp
  if ((user.exp || 0) < (job.req.exp || 0)) return { ok: false, reason: 'Kamu belum memiliki EXP yang cukup' };

  // Check skills
  const reqSkills = job.req.skills || {};
  for (const s of Object.keys(reqSkills)) {
    const lvl = user.skills[s] || 0;
    if (lvl < reqSkills[s]) return { ok: false, reason: `Skill ${s} minimal level ${reqSkills[s]}` };
  }

  // Check cooldown
  const last = user.last_work && user.last_work[jobKey] ? user.last_work[jobKey] : 0;
  const now = Date.now();
  if (now - last < job.cooldownMs) {
    return { ok: false, reason: 'Cooldown' , timeLeft: job.cooldownMs - (now - last)};
  }

  return { ok: true };
}

function applyWork(userId, jobKey) {
  const data = loadEconomy();
  ensureUser(userId, data);
  const user = data.users[userId];
  const job = jobs[jobKey];
  if (!job) return { success: false, reason: 'Job tidak ditemukan' };

  // Inline canWork logic to avoid reloading economy
  // Check exp
  if ((user.exp || 0) < (job.req.exp || 0)) return { success: false, reason: 'Kamu belum memiliki EXP yang cukup' };

  // Check skills
  const reqSkills = job.req.skills || {};
  for (const s of Object.keys(reqSkills)) {
    const lvl = (user.skills && user.skills[s]) || 0;
    if (lvl < reqSkills[s]) return { success: false, reason: `Skill ${s} minimal level ${reqSkills[s]}` };
  }

  // Check cooldown
  const last = user.last_work && user.last_work[jobKey] ? user.last_work[jobKey] : 0;
  const now = Date.now();
  if (now - last < job.cooldownMs) {
    return { success: false, reason: 'Cooldown' , timeLeft: job.cooldownMs - (now - last)};
  }

  // compute pay
  const base = Math.floor(Math.random() * (job.payMax - job.payMin + 1)) + job.payMin;
  // skill multiplier: each required skill level adds small multiplier
  let multiplier = 1;
  for (const s of Object.keys(job.req.skills || {})) {
    const lvl = user.skills[s] || 0;
    multiplier += Math.min(lvl / 10, 0.5);
  }
  // apply job difficulty multiplier (higher difficulty -> higher pay)
  const difficulty = job.difficulty || 1;
  multiplier = multiplier * difficulty;
  const pay = Math.floor(base * multiplier);

  // apply rewards
  user.balance += pay;
  user.exp = (user.exp || 0) + job.expGain;
  user.last_work = user.last_work || {};
  user.last_work[jobKey] = Date.now();

  saveEconomy(data);
  return { success: true, pay, expGain: job.expGain };
}

function trainSkill(userId, skill, cost = 200) {
  const data = loadEconomy();
  ensureUser(userId, data);
  const user = data.users[userId];

  // cost scales with current level: next level costs base*(currentLevel+1)
  const currentLevel = (user.skills && user.skills[skill]) || 0;
  const actualCost = cost * (currentLevel + 1);
  if (user.balance < actualCost) return { success: false, reason: 'Saldo tidak cukup', cost: actualCost };

  user.balance -= actualCost;
  if (!user.skills) user.skills = {};
  user.skills[skill] = currentLevel + 1;

  // small exp reward scales a bit
  const expGain = 10 + Math.floor(currentLevel / 2);
  user.exp = (user.exp || 0) + expGain;

  saveEconomy(data);
  return { success: true, newLevel: user.skills[skill], cost: actualCost, expGain };
}

function setName(userId, name, cost = 500) {
  const data = loadEconomy();
  ensureUser(userId, data);
  const user = data.users[userId];

  const actualCost = cost;
  if (user.balance < actualCost) return { success: false, reason: 'Saldo tidak cukup', cost: actualCost };

  user.balance -= actualCost;
  user.name = name;
  saveEconomy(data);
  return { success: true, name, cost: actualCost };
}

function getLeaderboard(limit = 10) {
  const data = loadEconomy();
  const arr = Object.entries(data.users).map(([fbId, u]) => ({
    fbId,
    internalId: u.id || null,
    name: u.name || fbId,
    balance: u.balance || 0
  }));
  arr.sort((a, b) => b.balance - a.balance);
  return arr.slice(0, limit);
}

function findByInternalId(internalId) {
  const data = loadEconomy();
  for (const [fbId, u] of Object.entries(data.users)) {
    if (u && u.id === internalId) return fbId;
  }
  return null;
}

function getDisplayName(userId, facebookName = null) {
  const data = loadEconomy();
  const user = data.users[userId];
  
  if (user && user.name) {
    return user.name;
  }
  
  if (facebookName) {
    return facebookName;
  }
  
  return userId;
}

module.exports = {
  loadEconomy,
  saveEconomy,
  ensureUser,
  getUser,
  addMoney,
  addExp,
  setLastDaily,
  canWork,
  applyWork,
  trainSkill,
  setName,
  getLeaderboard,
  findByInternalId,
  getDisplayName,
  jobs
};
