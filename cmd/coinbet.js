const econ = require('../lib/economy');
const UI = require('../lib/ui');

module.exports = {
  name: 'coinbet',
  aliases: ['judikoin'],
  version: '0.9.1-bt',
  description: 'Taruhan koin (Heads/Tails)',
  role: 0,
  category: 'Games',
  cooldown: 5,

  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const parts = (args || '').trim().split(' ');
    let choice = parts[0] ? parts[0].toLowerCase() : null;
    const bet = parseInt(parts[1]);

    if (choice === 'h' || choice === 'gambar') choice = 'heads';
    if (choice === 't' || choice === 'angka') choice = 'tails';

    if (!['heads', 'tails'].includes(choice) || isNaN(bet) || bet < 10) {
      return api.sendMessage(UI.error('Gunakan: /coinbet <heads/tails> <taruhan>\nContoh: /coinbet heads 100'), threadId);
    }

    const user = econ.getUser(userId);
    if (user.balance < bet) {
      return api.sendMessage(UI.error('Saldo tidak cukup!'), threadId);
    }

    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const resultLabel = result === 'heads' ? 'Heads (Gambar)' : 'Tails (Angka)';

    if (choice === result) {
      econ.addMoney(userId, bet);
      const content = [
        `🪙 Hasil koin: ${resultLabel}`,
        '',
        UI.success(`MENANG! Tebakan kamu benar.`),
        UI.item('Hadiah', `$${bet.toLocaleString('id-ID')}`),
        UI.item('Saldo Sekarang', `$${econ.getUser(userId).balance.toLocaleString('id-ID')}`)
      ].join('\n');
      api.sendMessage(UI.box('Coin Bet', content), threadId);
    } else {
      econ.addMoney(userId, -bet);
      const content = [
        `🪙 Hasil koin: ${resultLabel}`,
        '',
        UI.error(`KALAH! Ternyata hasilnya ${result}.`),
        UI.item('Kehilangan', `$${bet.toLocaleString('id-ID')}`),
        UI.item('Saldo Sekarang', `$${econ.getUser(userId).balance.toLocaleString('id-ID')}`)
      ].join('\n');
      api.sendMessage(UI.box('Coin Bet', content), threadId);
    }
  }
};
