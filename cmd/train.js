const econ = require('../lib/economy');

module.exports = {
  name: 'train',
  aliases: ['tr'],
  version: '1.0.0',
  description: 'Latih skill tertentu (cost 200)',
  role: 0,

  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const param = (args || '').trim().toLowerCase();

    if (!param || param === 'list') {
      // build skill list from jobs
      const skillSet = new Set();
      Object.values(econ.jobs).forEach(j => {
        Object.keys(j.req.skills || {}).forEach(s => skillSet.add(s));
      });
      const skills = Array.from(skillSet);
      if (skills.length === 0) {
        api.sendMessage('ℹ️ Tidak ada skill yang terdaftar.', threadId);
        return;
      }
      const user = econ.getUser(userId);
      let reply = '📚 Skill tersedia dan level Anda:\n';
      skills.forEach(s => {
        const lvl = (user.skills && user.skills[s]) || 0;
        const nextCost = 200 * (lvl + 1);
        reply += `- ${s}: level ${lvl} (next cost $${nextCost})\n`;
      });
      api.sendMessage(reply, threadId);
      return;
    }

    const skill = param;
    const res = econ.trainSkill(userId, skill, 200);
    if (!res.success) {
      const costNeeded = res.cost ? ` (butuh $${res.cost})` : '';
      api.sendMessage(`❌ Gagal: ${res.reason}${costNeeded}`, threadId);
      return;
    }

    const user = econ.getUser(userId);
    api.sendMessage(`✅ Latihan berhasil! Skill ${skill} sekarang level ${res.newLevel}\n💸 Biaya: $${res.cost.toLocaleString('id-ID')}\n⭐ EXP +${res.expGain}\n💰 Saldo: $${user.balance.toLocaleString('id-ID')}\n⭐ EXP: ${user.exp}`, threadId);
  }
};
