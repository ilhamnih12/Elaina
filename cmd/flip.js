const UI = require('../lib/ui');

module.exports = {
  name: 'flip',
  aliases: ['koin', 'coinflip'],
  version: '0.9.0-bt',
  description: 'Lempar koin (Heads/Tails)',
  role: 0,
  category: 'Utility',
  cooldown: 2,

  execute(api, args, threadId, userInfo) {
    const result = Math.random() < 0.5 ? 'Heads (Gambar)' : 'Tails (Angka)';
    api.sendMessage(UI.box('Coin Flip', `🪙 Hasil: ${result}`), threadId);
  }
};
