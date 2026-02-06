const UI = require('../lib/ui');

module.exports = {
  name: 'unit',
  aliases: ['konversi'],
  version: '0.9.1-bt',
  description: 'Konversi satuan sederhana (cm/inch, kg/lbs, c/f)',
  role: 0,
  category: 'Utility',
  cooldown: 2,

  execute(api, args, threadId, userInfo) {
    const parts = (args || '').trim().split(' ');
    if (parts.length < 3) {
      const help = [
        'Gunakan: /unit <nilai> <dari> <ke>',
        '',
        'Contoh:',
        '• /unit 10 cm inch',
        '• /unit 5 kg lbs',
        '• /unit 30 c f'
      ].join('\n');
      return api.sendMessage(UI.box('Unit Converter', help), threadId);
    }

    const value = parseFloat(parts[0]);
    const from = parts[1].toLowerCase();
    const to = parts[2].toLowerCase();

    if (isNaN(value)) return api.sendMessage(UI.error('Nilai harus berupa angka!'), threadId);

    let result;
    let unitLabel = to;

    if (from === 'cm' && to === 'inch') result = value / 2.54;
    else if (from === 'inch' && to === 'cm') result = value * 2.54;
    else if (from === 'kg' && to === 'lbs') result = value * 2.20462;
    else if (from === 'lbs' && to === 'kg') result = value / 2.20462;
    else if (from === 'c' && to === 'f') result = (value * 9/5) + 32;
    else if (from === 'f' && to === 'c') result = (value - 32) * 5/9;
    else return api.sendMessage(UI.error(`Konversi dari ${from} ke ${to} tidak didukung.`), threadId);

    const content = [
      UI.item('Input', `${value} ${from}`),
      UI.item('Hasil', `${result.toFixed(2)} ${to}`)
    ].join('\n');

    api.sendMessage(UI.box('Conversion Result', content), threadId);
  }
};
