const fs = require('fs-extra');
const path = require('path');
const UI = require('../lib/ui');

module.exports = {
  name: 'admin',
  aliases: ['adm', 'a'],
  version: '1.1.0',
  description: 'Perintah khusus admin (kelola config)',
  role: 2,
  cooldown: 5,
  
  execute(api, args, threadId, userInfo) {
    const configPath = path.join(__dirname, '..', 'config.json');
    const subArgs = (args || '').trim().split(' ');
    const subCommand = subArgs[0].toLowerCase();
    
    if (!subCommand) {
      const msg = [
        'Gunakan:',
        UI.item('list', 'Daftar admin'),
        UI.item('addrole <id>', 'Tambah admin'),
        UI.item('removerole <id>', 'Hapus admin')
      ].join('\n');
      return api.sendMessage(UI.box('Admin Panel', msg), threadId);
    }
    
    try {
      const config = fs.readJsonSync(configPath);
      
      if (subCommand === 'list') {
        let content = '';
        if (!Array.isArray(config.admins) || config.admins.length === 0) {
          content = 'Belum ada admin terdaftar.';
        } else {
          content = 'Daftar Admin:\n' + config.admins.map(id => `• ${id}`).join('\n');
        }
        return api.sendMessage(UI.box('Admin List', content), threadId);
      }

      if (subCommand === 'addrole') {
        const userId = subArgs[1];
        if (!userId) return api.sendMessage(UI.error('Gunakan: /admin addrole <user_id>'), threadId);
        
        if (!config.admins.includes(userId)) {
          config.admins.push(userId);
          fs.writeJsonSync(configPath, config, { spaces: 2 });
          return api.sendMessage(UI.success(`Admin ${userId} berhasil ditambahkan.`), threadId);
        } else {
          return api.sendMessage(UI.error(`Admin ${userId} sudah terdaftar.`), threadId);
        }
      }
      
      if (subCommand === 'removerole') {
        const userId = subArgs[1];
        if (!userId) return api.sendMessage(UI.error('Gunakan: /admin removerole <user_id>'), threadId);
        
        if (config.admins.includes(userId)) {
          config.admins = config.admins.filter(id => id !== userId);
          fs.writeJsonSync(configPath, config, { spaces: 2 });
          return api.sendMessage(UI.success(`Admin ${userId} berhasil dihapus.`), threadId);
        } else {
          return api.sendMessage(UI.error(`Admin ${userId} tidak ditemukan.`), threadId);
        }
      }
      
      return api.sendMessage(UI.error(`Subcommand '${subCommand}' tidak dikenal.`), threadId);
      
    } catch (err) {
      api.sendMessage(UI.error(`Terjadi kesalahan: ${err.message}`), threadId);
    }
  }
};
