const UI = require('../lib/ui');

module.exports = {
  name: 'password',
  aliases: ['pass', 'pw'],
  version: '0.9.0-bt',
  description: 'Generate password acak',
  role: 0,
  category: 'Utility',
  cooldown: 5,

  execute(api, args, threadId, userInfo) {
    const length = parseInt(args) || 12;
    if (length < 4 || length > 100) return api.sendMessage(UI.error('Panjang password minimal 4 dan maksimal 100 karakter!'), threadId);

    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    api.sendMessage(UI.box('Password Generator', `🔐 Password Anda:\n${retVal}\n\n⚠️ Simpan di tempat yang aman!`), threadId);
  }
};
