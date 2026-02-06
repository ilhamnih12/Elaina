const econ = require('../lib/economy');
const UI = require('../lib/ui');

module.exports = {
  name: 'transfer',
  aliases: ['tf', 'pay'],
  version: '1.1.0',
  description: 'Transfer uang ke user lain',
  role: 0,
  cooldown: 5,
  
  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const parts = (args || '').trim().split(' ');
    const targetId = parts[0];
    const amount = parseInt(parts[1]);
    
    if (!targetId || isNaN(amount) || amount <= 0) {
      return api.sendMessage(UI.error('Gunakan: /transfer <target_id> <jumlah>'), threadId);
    }
    
    // Check sender balance
    const sender = econ.getUser(userId);
    if (sender.balance < amount) {
      return api.sendMessage(UI.error('Saldo tidak cukup!'), threadId);
    }
    
    // Find target
    const targetInternalId = parseInt(targetId);
    const targetFbId = isNaN(targetInternalId) ? targetId : econ.findByInternalId(targetInternalId);

    if (!targetFbId) {
      return api.sendMessage(UI.error(`User ID '${targetId}' tidak ditemukan.`), threadId);
    }

    if (targetFbId === userId) {
      return api.sendMessage(UI.error('Tidak bisa transfer ke diri sendiri!'), threadId);
    }
    
    // Process transfer
    econ.addMoney(userId, -amount);
    econ.addMoney(targetFbId, amount);

    const targetName = econ.getDisplayName(targetFbId);

    const content = [
      UI.success('Transfer Berhasil!'),
      UI.item('Penerima', targetName),
      UI.item('Jumlah', `$${amount.toLocaleString('id-ID')}`),
      UI.item('Sisa Saldo', `$${econ.getUser(userId).balance.toLocaleString('id-ID')}`)
    ].join('\n');

    api.sendMessage(UI.box('Money Transfer', content), threadId);

    // Notify target
    const senderName = econ.getDisplayName(userId, userInfo.name);
    api.sendMessage(UI.box('Transfer Masuk', `Kamu menerima $${amount.toLocaleString('id-ID')} dari ${senderName}`), targetFbId);
  }
};
