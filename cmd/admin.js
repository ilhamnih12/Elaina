const fs = require('fs-extra');
const path = require('path');

module.exports = {
  name: 'admin',
  aliases: ['adm', 'a'],
  version: '1.0.0',
  description: 'Perintah khusus admin (kelola config)',
  role: 2, // Hanya admin yang bisa akses
  
  execute(api, args, threadId, userInfo) {
    const configPath = path.join(__dirname, '..', 'config.json');
    
    const subCommand = (args || '').split(' ')[0].toLowerCase();
    
    let response = '❌ Subcommand tidak dikenal.\n';
    response += 'Gunakan: /admin [list|addrole|removerole]\n';
    
    if (!subCommand) {
      api.sendMessage(response, threadId);
      return;
    }
    
    try {
      const config = fs.readJsonSync(configPath);
      
      if (subCommand === 'list') {
        if (!Array.isArray(config.admins) || config.admins.length === 0) {
          response = 'ℹ️ Belum ada admin terdaftar';
        } else {
          response = '👥 Daftar Admin:\n' + config.admins.join('\n');
        }
      }
      else if (subCommand === 'addrole') {
        const userId = args.split(' ')[1];
        if (!userId) {
          api.sendMessage('❌ Gunakan: /admin addrole <user_id>', threadId);
          return;
        }
        
        if (!config.admins.includes(userId)) {
          config.admins.push(userId);
          fs.writeJsonSync(configPath, config, { spaces: 2 });
          response = `✓ Admin ${userId} ditambahkan`;
        } else {
          response = `⚠️ Admin ${userId} sudah ada`;
        }
      }
      
      else if (subCommand === 'removerole') {
        const userId = args.split(' ')[1];
        if (!userId) {
          api.sendMessage('❌ Gunakan: /admin removerole <user_id>', threadId);
          return;
        }
        
        if (config.admins.includes(userId)) {
          config.admins = config.admins.filter(id => id !== userId);
          fs.writeJsonSync(configPath, config, { spaces: 2 });
          response = `✓ Admin ${userId} dihapus`;
        } else {
          response = `⚠️ Admin ${userId} tidak ditemukan`;
        }
      }
      
      else {
        response = '❌ Subcommand tidak dikenal: ' + subCommand;
      }
      
    } catch (err) {
      console.error('Error:', err.message);
      response = '❌ Error: ' + err.message;
    }
    
    api.sendMessage(response, threadId, (err) => {
      if (err) console.error('❌ Gagal mengirim response:', err);
    });
  }
};
