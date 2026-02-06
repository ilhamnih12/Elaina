const econ = require('../lib/economy');
const UI = require('../lib/ui');

module.exports = {
  name: 'slots',
  aliases: ['slot'],
  version: '0.9.1-bt',
  description: 'Main mesin slot (taruhan)',
  role: 0,
  category: 'Games',
  cooldown: 5,

  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const bet = parseInt(args);

    if (isNaN(bet) || bet < 50) {
      return api.sendMessage(UI.error('Minimal taruhan adalah $50! Contoh: /slots 100'), threadId);
    }

    const user = econ.getUser(userId);
    if (user.balance < bet) {
      return api.sendMessage(UI.error('Saldo tidak cukup untuk bertaruh!'), threadId);
    }

    const items = ['🍎', '🍋', '🍒', '🍇', '💎', '⭐'];
    const s1 = items[Math.floor(Math.random() * items.length)];
    const s2 = items[Math.floor(Math.random() * items.length)];
    const s3 = items[Math.floor(Math.random() * items.length)];

    let win = 0;
    let message = '';

    if (s1 === s2 && s2 === s3) {
      // Jackpot
      const mult = s1 === '💎' ? 10 : (s1 === '⭐' ? 5 : 3);
      win = bet * mult;
      message = `JACKPOT!!! Kamu menang ${mult}x lipat!`;
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
      // 2 same
      win = Math.floor(bet * 1.5);
      message = 'Lumayan! Ada dua yang sama.';
    } else {
      win = 0;
      message = 'Yah, belum beruntung. Coba lagi!';
    }

    if (win > 0) {
      econ.addMoney(userId, win - bet);
      const content = [
        `[ ${s1} | ${s2} | ${s3} ]`,
        '',
        UI.success(message),
        UI.item('Hadiah', `$${win.toLocaleString('id-ID')}`),
        UI.item('Saldo Sekarang', `$${econ.getUser(userId).balance.toLocaleString('id-ID')}`)
      ].join('\n');
      api.sendMessage(UI.box('Slot Machine', content), threadId);
    } else {
      econ.addMoney(userId, -bet);
      const content = [
        `[ ${s1} | ${s2} | ${s3} ]`,
        '',
        UI.error(message),
        UI.item('Kehilangan', `$${bet.toLocaleString('id-ID')}`),
        UI.item('Saldo Sekarang', `$${econ.getUser(userId).balance.toLocaleString('id-ID')}`)
      ].join('\n');
      api.sendMessage(UI.box('Slot Machine', content), threadId);
    }
  }
};
