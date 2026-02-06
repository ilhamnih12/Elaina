const fs = require('fs-extra');
const path = require('path');
const UI = require('../lib/ui');

module.exports = {
  name: 'help',
  aliases: ['h'],
  version: '1.1.0',
  description: 'Tampilkan daftar command yang tersedia',
  role: 0,
  cooldown: 2,

  execute(api, args, threadId, userInfo) {
    const cmdPath = path.join(__dirname);
    
    try {
      const files = fs.readdirSync(cmdPath).filter(f => f.endsWith('.js'));
      const cmds = [];

      files.forEach(file => {
        try {
          // Clear cache to get fresh data if needed, though usually not necessary for bot commands
          const fullPath = path.join(cmdPath, file);
          delete require.cache[require.resolve(fullPath)];
          const cmd = require(fullPath);
          if (cmd.name) {
            cmds.push(cmd);
          }
        } catch (err) {
          console.error(`Error loading command file ${file}:`, err);
        }
      });

      // Sort alphabetically
      cmds.sort((a, b) => a.name.localeCompare(b.name));

      const query = (args || '').trim().toLowerCase();

      // Jika query adalah nama command atau alias
      const foundCmd = cmds.find(c =>
        c.name.toLowerCase() === query ||
        (c.aliases && c.aliases.some(a => a.toLowerCase() === query))
      );

      if (foundCmd) {
        // Tampilkan detail command
        const detail = [
          UI.item('Nama', foundCmd.name),
          UI.item('Alias', (foundCmd.aliases && foundCmd.aliases.length > 0) ? foundCmd.aliases.join(', ') : '—'),
          UI.item('Role', UI.getRoleName(foundCmd.role)),
          UI.item('Versi', foundCmd.version || '1.0.0'),
          UI.item('Cooldown', `${foundCmd.cooldown || 3} detik`),
          '',
          `📝 ${foundCmd.description}`
        ].join('\n');

        return api.sendMessage(UI.box('Detail Command', detail), threadId);
      }

      // Logika Paging
      const pageSize = 10;
      const totalPages = Math.ceil(cmds.length / pageSize);
      let page = parseInt(query) || 1;

      if (isNaN(page) || page < 1) page = 1;
      
      if (page > totalPages) {
        return api.sendMessage(UI.error(`Halaman ${page} tidak ditemukan. Total halaman: ${totalPages}`), threadId);
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pageCmds = cmds.slice(start, end);

      let content = pageCmds.map(c => `/${c.name} - ${c.description}`).join('\n');
      content += `\n\n--- Halaman [ ${page} / ${totalPages} ] ---\n`;
      content += `💡 Tips:\n• /help <nomor halaman>\n• /help <nama command>`;

      api.sendMessage(UI.box('Daftar Command', content), threadId);

    } catch (err) {
      console.error('❌ Error in help command:', err);
      api.sendMessage(UI.error('Gagal memuat daftar command.'), threadId);
    }
  }
};
