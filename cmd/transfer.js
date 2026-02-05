const econ = require('../lib/economy');

module.exports = {
  name: 'transfer',
  aliases: ['tf', 't'],
  version: '1.0.0',
  description: 'Transfer uang ke user lain',
  role: 0,
  
  execute(api, args, threadId, userInfo) {
    const fbSender = userInfo.userId;
    const argsSplit = (args || '').split(' ').filter(Boolean);
    let target = argsSplit[0];
    const amount = parseInt(argsSplit[1]);
    
    if (!target || isNaN(amount)) {
      const response = '❌ Gunakan: /transfer <user_id> <amount>\nContoh: /transfer 1234567890 500\nAtau gunakan internal ID: /transfer #1 500';
      api.sendMessage(response, threadId, (err) => {
        if (err) console.error('❌ Error:', err);
      });
      return;
    }
    
    if (amount <= 0) {
      api.sendMessage('❌ Jumlah transfer harus lebih dari 0', threadId, (err) => {
        if (err) console.error('❌ Error:', err);
      });
      return;
    }
    
    // allow target to be internal id like '#3' or '3'
    let fbTarget = target;
    if (/^#?\d+$/.test(target)) {
      const num = parseInt(target.replace('#',''));
      const fb = econ.findByInternalId(num);
      if (!fb) {
        api.sendMessage(`❌ Internal ID #${num} tidak ditemukan`, threadId);
        return;
      }
      fbTarget = fb;
    }

    if (fbSender === fbTarget) {
      api.sendMessage('❌ Tidak bisa transfer ke diri sendiri', threadId);
      return;
    }

    const sender = econ.getUser(fbSender);
    if (sender.balance < amount) {
      const response = `❌ Saldo tidak cukup! Saldo kamu: $${sender.balance.toLocaleString('id-ID')}`;
      api.sendMessage(response, threadId, (err) => {
        if (err) console.error('❌ Error:', err);
      });
      return;
    }

    // perform transfer
    const data = econ.loadEconomy();
    econ.ensureUser(fbSender, data);
    econ.ensureUser(fbTarget, data);
    data.users[fbSender].balance -= amount;
    data.users[fbTarget].balance += amount;
    econ.saveEconomy(data);

    const displayTarget = econ.getDisplayName(fbTarget);
    const response = `✅ Transfer berhasil!\n📤 Mengirim: $${amount.toLocaleString('id-ID')}\n📥 Ke: ${displayTarget} (fb: ${fbTarget})\n💰 Saldo kamu: $${data.users[fbSender].balance.toLocaleString('id-ID')}`;
    
    api.sendMessage(response, threadId, (err) => {
      if (err) console.error('❌ Error:', err);
      else console.log('✓ Transfer message sent');
    });
  }
};
