const UI = require('../lib/ui');

module.exports = {
  name: 'calc',
  aliases: ['hitung', 'kalkulator'],
  version: '0.9.1-bt',
  description: 'Kalkulator sederhana',
  role: 0,
  category: 'Utility',
  cooldown: 2,

  execute(api, args, threadId, userInfo) {
    if (!args) {
      return api.sendMessage(UI.error('Masukkan ekspresi matematika! Contoh: /calc 1 + 1'), threadId);
    }

    try {
      // Hanya izinkan angka dan operator matematika dasar
      const sanitized = args.replace(/[^-()\d/*+.]/g, '');
      if (!sanitized) throw new Error('Ekspresi tidak valid');

      const result = eval(sanitized);

      const content = [
        UI.item('Ekspresi', args),
        UI.item('Hasil', result)
      ].join('\n');

      api.sendMessage(UI.box('Calculator', content), threadId);
    } catch (err) {
      api.sendMessage(UI.error('Gagal menghitung. Pastikan ekspresi benar.'), threadId);
    }
  }
};
