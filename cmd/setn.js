const econ = require('../lib/economy');

module.exports = {
  name: 'setn',
  aliases: ['setname'],
  version: '1.0.0',
  description: 'Set display name (berbayar).',
  role: 0,

  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const name = (args || '').trim();
    if (!name) {
      api.sendMessage('❌ Gunakan: /setn <nama_baru>\nContoh: /setn IlhamBot', threadId);
      return;
    }

    if (name.length > 32) {
      api.sendMessage('❌ Nama terlalu panjang (maks 32 karakter)', threadId);
      return;
    }

    // simple sanitize: remove newlines
    const clean = name.replace(/\n|\r/g, ' ').trim();
    const cost = 500;
    const res = econ.setName(userId, clean, cost);
    if (!res.success) {
      api.sendMessage(`❌ Gagal set nama: ${res.reason} (butuh $${res.cost})`, threadId);
      return;
    }

    const user = econ.getUser(userId);
    api.sendMessage(`✅ Nama berhasil diubah menjadi: ${user.name}\n💸 Biaya: $${res.cost}\n💰 Sisa saldo: $${user.balance.toLocaleString('id-ID')}`, threadId);
  }
};
