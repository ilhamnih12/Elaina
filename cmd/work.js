const econ = require('../lib/economy');
const UI = require('../lib/ui');

module.exports = {
  name: 'work',
  aliases: ['w'],
  version: '0.9.1-bt',
  description: 'Bekerja untuk mendapatkan uang',
  role: 0,
  category: 'Economy',
  cooldown: 5,
  
  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const jobKey = (args || '').trim().toLowerCase();

    if (!jobKey || jobKey === 'list') {
      const jobs = econ.jobs;
      let reply = 'Daftar pekerjaan yang tersedia:\n\n';
      for (const k of Object.keys(jobs)) {
        const j = jobs[k];
        reply += `• [${k.toUpperCase()}] ${j.title}\n`;
        reply += `  Gaji: $${j.payMin} - $${j.payMax}\n`;
        reply += `  Syarat: EXP ${j.req.exp}\n`;
      }
      reply += '\nGunakan: /work <jobKey>'; 
      api.sendMessage(UI.box('Job Board', reply), threadId);
      return;
    }

    // Attempt work
    const res = econ.applyWork(userId, jobKey);
    if (!res.success) {
      if (res.reason === 'Cooldown') {
        const mins = Math.ceil((res.timeLeft || 0) / 1000 / 60);
        return api.sendMessage(UI.error(`Kamu masih lelah. Coba lagi dalam ${mins} menit.`), threadId);
      } else {
        return api.sendMessage(UI.error(`Gagal bekerja: ${res.reason}`), threadId);
      }
    }

    const user = econ.getUser(userId);
    const content = [
      UI.success(`Berhasil bekerja sebagai ${econ.jobs[jobKey].title}`),
      UI.item('Gaji', `$${res.pay.toLocaleString('id-ID')}`),
      UI.item('EXP', `+${res.expGain}`),
      UI.item('Saldo Sekarang', `$${user.balance.toLocaleString('id-ID')}`)
    ].join('\n');

    api.sendMessage(UI.box('Work Results', content), threadId);
  }
};
