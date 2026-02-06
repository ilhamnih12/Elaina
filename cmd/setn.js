const econ = require('../lib/economy');
const UI = require('../lib/ui');

module.exports = {
  name: 'setn',
  aliases: ['setname'],
  version: '0.9.0-bt',
  description: 'Ganti nama tampilan kamu (biaya $500)',
  role: 0,
  category: 'Economy',
  cooldown: 10,

  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const newName = (args || '').trim();

    if (!newName) {
      return api.sendMessage(UI.error('Gunakan: /setn <nama_baru>'), threadId);
    }

    if (newName.length > 20) {
      return api.sendMessage(UI.error('Nama maksimal 20 karakter!'), threadId);
    }

    const res = econ.setName(userId, newName, 500);
    if (!res.success) {
      return api.sendMessage(UI.error(res.reason), threadId);
    }

    api.sendMessage(UI.success(`Nama tampilan kamu diganti menjadi: ${res.name} (Biaya: $500)`), threadId);
  }
};
