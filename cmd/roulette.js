const econ = require('../lib/economy');
const UI = require('../lib/ui');

module.exports = {
  name: 'roulette',
  aliases: ['judiputar'],
  version: '0.9.1-bt',
  description: 'Taruhan Roulette (Red/Black/Green)',
  role: 0,
  category: 'Games',
  cooldown: 5,

  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const parts = (args || '').trim().split(' ');
    const choice = parts[0] ? parts[0].toLowerCase() : null;
    const bet = parseInt(parts[1]);

    const validColors = ['red', 'black', 'green'];
    if (!validColors.includes(choice) || isNaN(bet) || bet < 50) {
      return api.sendMessage(UI.error('Gunakan: /roulette <red/black/green> <taruhan>\n\nMultiplier:\n🔴 Red: 2x\n⚫ Black: 2x\n🟢 Green: 14x (Langka!)'), threadId);
    }

    const user = econ.getUser(userId);
    if (user.balance < bet) {
      return api.sendMessage(UI.error('Saldo tidak cukup!'), threadId);
    }

    // 0 = Green, 1-18 = Red, 19-36 = Black
    const roll = Math.floor(Math.random() * 37);
    let resultColor = '';
    let emoji = '';

    if (roll === 0) {
      resultColor = 'green';
      emoji = '🟢';
    } else if (roll <= 18) {
      resultColor = 'red';
      emoji = '🔴';
    } else {
      resultColor = 'black';
      emoji = '⚫';
    }

    if (choice === resultColor) {
      const multiplier = choice === 'green' ? 14 : 2;
      const win = bet * multiplier;
      econ.addMoney(userId, win - bet);

      const content = [
        `${emoji} Hasil: ${resultColor.toUpperCase()} (${roll})`,
        '',
        UI.success(`MENANG! Kamu dapat ${multiplier}x hadiah.`),
        UI.item('Hadiah', `$${win.toLocaleString('id-ID')}`),
        UI.item('Saldo Sekarang', `$${econ.getUser(userId).balance.toLocaleString('id-ID')}`)
      ].join('\n');
      api.sendMessage(UI.box('Roulette', content), threadId);
    } else {
      econ.addMoney(userId, -bet);
      const content = [
        `${emoji} Hasil: ${resultColor.toUpperCase()} (${roll})`,
        '',
        UI.error(`KALAH! Bola jatuh di ${resultColor}.`),
        UI.item('Kehilangan', `$${bet.toLocaleString('id-ID')}`),
        UI.item('Saldo Sekarang', `$${econ.getUser(userId).balance.toLocaleString('id-ID')}`)
      ].join('\n');
      api.sendMessage(UI.box('Roulette', content), threadId);
    }
  }
};
