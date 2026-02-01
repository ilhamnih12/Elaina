module.exports = {
  name: 'status',
  aliases: ['st'],
  version: '1.0.0',
  description: 'Tampilkan status dan role Anda',
  
  execute(api, args, threadId, userInfo) {
    const econ = require('../lib/economy');
    const roleNames = ['👤 User', '👮 Admin Grup', '⭐ Admin'];
    const userRole = userInfo.userRole || 0;
    const user = econ.getUser(userInfo.userId);

    const skills = user.skills || {};
    const skillsText = Object.keys(skills).length === 0 ? '—' : Object.entries(skills).map(([k,v]) => `${k}:${v}`).join(', ');
    const userId = userInfo.userId;
    const displayName = econ.getDisplayName(userId, userInfo.name);

    const response = `📊 Status Anda:\nNama: ${displayName}\nID: #${user.id}\nRole: ${roleNames[userRole]}\n💰 Saldo: $${user.balance.toLocaleString('id-ID')}\n⭐ EXP: ${user.exp || 0}\n🛠 Skills: ${skillsText}`;

    api.sendMessage(response, threadId, (err) => {
      if (err) {
        console.error('❌ Gagal mengirim response:', err);
      } else {
        console.log('✓ Response terkirim');
      }
    });
  }
};
