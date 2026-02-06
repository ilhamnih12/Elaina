const UI = require('../lib/ui');

module.exports = {
  name: 'binary',
  aliases: ['biner'],
  version: '0.9.1-bt',
  description: 'Konversi teks ke biner atau sebaliknya',
  role: 0,
  category: 'Utility',
  cooldown: 2,

  execute(api, args, threadId, userInfo) {
    if (!args) {
      return api.sendMessage(UI.error('Gunakan: /binary <teks> atau /binary decode <biner>'), threadId);
    }

    const parts = args.split(' ');
    if (parts[0].toLowerCase() === 'decode') {
      const biner = parts.slice(1).join(' ');
      try {
        const text = biner.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
        return api.sendMessage(UI.box('Binary Decode', `📄 Teks: ${text}`), threadId);
      } catch (e) {
        return api.sendMessage(UI.error('Gagal decode biner. Pastikan format benar (010101).'), threadId);
      }
    } else {
      const text = args;
      const biner = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      return api.sendMessage(UI.box('Binary Encode', `🔢 Biner:\n${biner}`), threadId);
    }
  }
};
