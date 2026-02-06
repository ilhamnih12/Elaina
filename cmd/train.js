const econ = require('../lib/economy');
const UI = require('../lib/ui');

module.exports = {
  name: 'train',
  aliases: ['t', 'skill'],
  version: '0.9.0-bt',
  description: 'Latih skill kamu (biaya meningkat per level)',
  role: 0,
  category: 'Economy',
  cooldown: 5,

  execute(api, args, threadId, userInfo) {
    const userId = userInfo.userId;
    const skill = (args || '').trim().toLowerCase();

    if (!skill) {
      const availableSkills = ['programming', 'design', 'management'];
      const content = [
        'Gunakan: /train <nama_skill>',
        '',
        'Skill yang tersedia:',
        ...availableSkills.map(s => `• ${s}`)
      ].join('\n');
      return api.sendMessage(UI.box('Training Center', content), threadId);
    }

    const res = econ.trainSkill(userId, skill);
    if (!res.success) {
      return api.sendMessage(UI.error(`${res.reason}. Membutuhkan $${res.cost.toLocaleString('id-ID')}`), threadId);
    }

    const content = [
      UI.success(`Berhasil melatih skill ${skill}!`),
      UI.item('Level Baru', res.newLevel),
      UI.item('Biaya', `$${res.cost.toLocaleString('id-ID')}`),
      UI.item('EXP', `+${res.expGain}`)
    ].join('\n');

    api.sendMessage(UI.box('Skill Upgraded', content), threadId);
  }
};
