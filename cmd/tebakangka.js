const econ = require('../lib/economy');
const UI = require('../lib/ui');

module.exports = {
  name: 'tebakangka',
  aliases: ['tebak', 'guess'],
  version: '0.9.1-bt',
  description: 'Menebak angka 1-10 dengan taruhan (Hadiah 8x)',
  role: 0,
  category: 'Games',
  cooldown: 5,

  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const parts = (args || '').trim().split(' ');
    const guess = parseInt(parts[0]);
    const bet = parseInt(parts[1]);

    if (isNaN(guess) || guess < 1 || guess > 10 || isNaN(bet) || bet < 10) {
      return api.sendMessage(UI.error('Gunakan: /tebakangka <1-10> <taruhan>\nContoh: /tebakangka 7 100'), threadId);
    }

    const user = econ.getUser(userId);
    if (user.balance < bet) {
      return api.sendMessage(UI.error('Saldo tidak cukup!'), threadId);
    }

    const target = Math.floor(Math.random() * 10) + 1;

    if (guess === target) {
      const win = bet * 8;
      econ.addMoney(userId, win - bet);
      const content = [
        `🎯 Angka yang benar: ${target}`,
        '',
        UI.success(`TEBAKAN BENAR! Kamu mendapatkan 8x lipat!`),
        UI.item('Hadiah', `$${win.toLocaleString('id-ID')}`),
        UI.item('Saldo Sekarang', `$${econ.getUser(userId).balance.toLocaleString('id-ID')}`)
      ].join('\n');
      api.sendMessage(UI.box('Guess The Number', content), threadId);
    } else {
      econ.addMoney(userId, -bet);
      const content = [
        `🎯 Angka yang benar: ${target}`,
        '',
        UI.error(`Salah! Tebakanmu adalah ${guess}.`),
        UI.item('Kehilangan', `$${bet.toLocaleString('id-ID')}`),
        UI.item('Saldo Sekarang', `$${econ.getUser(userId).balance.toLocaleString('id-ID')}`)
      ].join('\n');
      api.sendMessage(UI.box('Guess The Number', content), threadId);
    }
  }
};
