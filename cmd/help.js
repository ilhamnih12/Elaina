const fs = require('fs-extra');
const path = require('path');
const UI = require('../lib/ui');

module.exports = {
  name: 'help',
  aliases: ['h'],
  version: '0.9.0-bt',
  description: 'Tampilkan daftar command yang tersedia',
  role: 0,
  category: 'Info',
  cooldown: 2,

  execute(api, args, threadId, userInfo) {
    const cmdPath = path.join(__dirname);
    
    try {
      const files = fs.readdirSync(cmdPath).filter(f => f.endsWith('.js'));
      const cmds = [];

      files.forEach(file => {
        try {
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

      // 1. Detail Command
      const foundCmd = cmds.find(c =>
        c.name.toLowerCase() === query ||
        (c.aliases && c.aliases.some(a => a.toLowerCase() === query))
      );

      if (foundCmd) {
        const detail = [
          UI.item('Nama', foundCmd.name),
          UI.item('Kategori', foundCmd.category || 'Lainnya'),
          UI.item('Alias', (foundCmd.aliases && foundCmd.aliases.length > 0) ? foundCmd.aliases.join(', ') : '—'),
          UI.item('Role', UI.getRoleName(foundCmd.role)),
          UI.item('Versi', foundCmd.version || '1.0.0'),
          UI.item('Cooldown', `${foundCmd.cooldown || 3} detik`),
          '',
          `📝 ${foundCmd.description}`
        ].join('\n');

        return api.sendMessage(UI.box('Detail Command', detail), threadId);
      }

      // 2. Filter Kategori
      const categories = [...new Set(cmds.map(c => (c.category || 'Lainnya').toLowerCase()))];
      if (categories.includes(query)) {
        const catName = query.charAt(0).toUpperCase() + query.slice(1);
        const catCmds = cmds.filter(c => (c.category || 'Lainnya').toLowerCase() === query);

        let content = catCmds.map(c => `/${c.name} - ${c.description}`).join('\n');
        content += `\n\n💡 Ketik /help <nama command> untuk detail.`;

        return api.sendMessage(UI.box(`Kategori: ${catName}`, content), threadId);
      }

      // 3. Tampilan Utama (Categorized Brief)
      if (!query) {
        const grouped = {};
        cmds.forEach(c => {
          const cat = c.category || 'Lainnya';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(`/${c.name}`);
        });

        let content = '';
        for (const [cat, list] of Object.entries(grouped)) {
          content += `\n━━━ ${cat.toUpperCase()} ━━━\n`;
          content += list.join(', ') + '\n';
        }

        content += `\n--- Halaman [ 1 / 1 ] ---\n`;
        content += `💡 Tips:\n• /help <nomor halaman>\n• /help <kategori>\n• /help <nama command>`;

        return api.sendMessage(UI.box('Daftar Command', content.trim()), threadId);
      }

      // 4. Logika Paging (Flat List)
      const pageSize = 10;
      const totalPages = Math.ceil(cmds.length / pageSize);
      let page = parseInt(query);

      if (isNaN(page)) {
        // Jika query bukan angka, bukan kategori, dan bukan command, maka error
        return api.sendMessage(UI.error(`Command atau kategori '${query}' tidak ditemukan.\nKetik /help untuk melihat daftar.`), threadId);
      }

      if (page < 1) page = 1;
      if (page > totalPages) {
        return api.sendMessage(UI.error(`Halaman ${page} tidak ditemukan. Total halaman: ${totalPages}`), threadId);
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pageCmds = cmds.slice(start, end);

      let content = pageCmds.map(c => `/${c.name} - ${c.description}`).join('\n');
      content += `\n\n--- Halaman [ ${page} / ${totalPages} ] ---\n`;
      content += `💡 Tips:\n• /help <nomor halaman>\n• /help <kategori>\n• /help <nama command>`;

      api.sendMessage(UI.box('Daftar Command', content), threadId);

    } catch (err) {
      console.error('❌ Error in help command:', err);
      api.sendMessage(UI.error('Gagal memuat daftar command.'), threadId);
    }
  }
};
