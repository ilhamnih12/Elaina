const econ = require('../lib/economy');
const UI = require('../lib/ui');

module.exports = {
  name: 'rps',
  aliases: ['poker', 'suit'],
  version: '0.9.1-bt',
  description: 'Gunting Batu Kertas melawan bot (taruhan)',
  role: 0,
  category: 'Games',
  cooldown: 5,

  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const parts = (args || '').trim().split(' ');
    const userChoice = parts[0] ? parts[0].toLowerCase() : null;
    const bet = parseInt(parts[1]);

    const choices = ['batu', 'gunting', 'kertas'];
    const validChoices = {
      'batu': '💎',
      'gunting': '✂️',
      'kertas': '📄'
    };

    if (!userChoice || !validChoices[userChoice] || isNaN(bet) || bet < 10) {
      return api.sendMessage(UI.error('Gunakan: /rps <batu/gunting/kertas> <taruhan>\nContoh: /rps batu 100'), threadId);
    }

    const user = econ.getUser(userId);
    if (user.balance < bet) {
      return api.sendMessage(UI.error('Saldo tidak cukup!'), threadId);
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    const userEmoji = validChoices[userChoice];
    const botEmoji = validChoices[botChoice];

    let result = ''; // win, lose, draw
    if (userChoice === botChoice) result = 'draw';
    else if (
      (userChoice === 'batu' && botChoice === 'gunting') ||
      (userChoice === 'gunting' && botChoice === 'kertas') ||
      (userChoice === 'kertas' && botChoice === 'batu')
    ) result = 'win';
    else result = 'lose';

    let msg = '';
    let finalReward = 0;

    if (result === 'win') {
      finalReward = bet;
      econ.addMoney(userId, finalReward);
      msg = UI.success(`Kamu MENANG! Hadiah: $${bet.toLocaleString('id-ID')}`);
    } else if (result === 'lose') {
      finalReward = -bet;
      econ.addMoney(userId, finalReward);
      msg = UI.error(`Kamu KALAH! Kehilangan: $${bet.toLocaleString('id-ID')}`);
    } else {
      msg = ' Seri! Saldo kamu tetap.';
    }

    const content = [
      `Kamu: ${userEmoji}  VS  Bot: ${botEmoji}`,
      '',
      msg,
      UI.item('Saldo Sekarang', `$${econ.getUser(userId).balance.toLocaleString('id-ID')}`)
    ].join('\n');

    api.sendMessage(UI.box('Rock Paper Scissors', content), threadId);
  }
};
