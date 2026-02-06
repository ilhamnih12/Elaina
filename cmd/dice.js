const UI = require('../lib/ui');

module.exports = {
  name: 'dice',
  aliases: ['dadu'],
  version: '0.9.1-bt',
  description: 'Lempar dadu',
  role: 0,
  category: 'Utility',
  cooldown: 2,

  execute(api, args, threadId, userInfo) {
    const sides = parseInt(args) || 6;
    if (sides < 2) return api.sendMessage(UI.error('Minimal 2 sisi!'), threadId);

    const result = Math.floor(Math.random() * sides) + 1;

    api.sendMessage(UI.box('Dice Roll', `🎲 Kamu mendapatkan angka: ${result} (D${sides})`), threadId);
  }
};
