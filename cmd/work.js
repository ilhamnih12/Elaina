const econ = require('../lib/economy');

module.exports = {
  name: 'work',
  aliases: ['w'],
  version: '1.1.0',
  description: 'Bekerja untuk mendapatkan uang (gunakan /work <jobKey>)',
  role: 0,
  
  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const jobKey = (args || '').trim().toLowerCase();

    if (!jobKey || jobKey === 'list') {
      const jobs = econ.jobs;
      let reply = '📋 Daftar pekerjaan:\n';
      for (const k of Object.keys(jobs)) {
        const j = jobs[k];
        reply += `- ${k}: ${j.title} (EXP req: ${j.req.exp}, Skills: ${Object.keys(j.req.skills||{}).map(s=>s+':'+j.req.skills[s]).join(', ') || '—'})\n  Gaji: $${j.payMin} - $${j.payMax}\n`;
      }
      reply += '\nGunakan: /work <jobKey>'; 
      api.sendMessage(reply, threadId);
      return;
    }

    // Attempt work
    const res = econ.applyWork(userId, jobKey);
    if (!res.success) {
      if (res.reason === 'Cooldown') {
        const mins = Math.ceil((res.timeLeft || 0) / 1000 / 60);
        api.sendMessage(`⏳ Masih cooldown. Coba lagi dalam ${mins} menit`, threadId);
      } else {
        api.sendMessage(`❌ Gagal: ${res.reason}`, threadId);
      }
      return;
    }

    const user = econ.getUser(userId);
    const response = `✅ Bekerja sebagai ${econ.jobs[jobKey].title}\n💸 Gaji: $${res.pay.toLocaleString('id-ID')}\n⭐ EXP +${res.expGain}\n💰 Saldo: $${user.balance.toLocaleString('id-ID')}`;
    api.sendMessage(response, threadId);
  }
};
