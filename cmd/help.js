const fs = require('fs-extra');
const path = require('path');

module.exports = {
  name: 'help',
  aliases: ['h'],
  version: '1.0.0',
  description: 'Tampilkan daftar command yang tersedia',
  role: 0, // Semua user bisa akses
  
  execute(api, message, threadId, userInfo) {
    const cmdPath = path.join(__dirname);
    let response = '📋 Command yang tersedia:\n\n';
    
    try {
      const files = fs.readdirSync(cmdPath).filter(f => f.endsWith('.js') && f !== 'help.js');
      
      // Sort files alphabetically
      files.sort();
      
      // Baca setiap command file
      files.forEach(file => {
        try {
          const cmd = require(path.join(cmdPath, file));
          const roleNames = ['', '👮', '⭐'];
          const roleIcon = cmd.role ? roleNames[cmd.role] || '' : '';
          response += `${roleIcon} /${cmd.name} - ${cmd.description}\n`;
        } catch (err) {
          console.error(`Error membaca ${file}:`, err.message);
        }
      });
      
      // Tambah help command sendiri
      const roleNames = ['', '👮', '⭐'];
      response += `/${module.exports.name} - ${module.exports.description}`;
      
    } catch (err) {
      console.error('❌ Error membaca command files:', err.message);
      response = '❌ Terjadi error saat membaca command list';
    }
    
    api.sendMessage(response, threadId, (err) => {
      if (err) {
        console.error('❌ Gagal mengirim response:', err);
      } else {
        console.log('✓ Response terkirim');
      }
    });
  }
};

