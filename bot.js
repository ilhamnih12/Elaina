const login = require('mao-fca');
const fs = require('fs-extra');
const path = require('path');

// Path untuk menyimpan appstate
const appstatePath = path.join(__dirname, 'appstate.json');
const configPath = path.join(__dirname, 'config.json');

// Load config
let config = { admins: [], groupAdmins: {} };
if (fs.existsSync(configPath)) {
  try {
    config = fs.readJsonSync(configPath);
    console.log('✓ Config loaded');
  } catch (err) {
    console.warn('⚠️  Config tidak valid, menggunakan default');
  }
} else {
  fs.writeJsonSync(configPath, config, { spaces: 2 });
  console.log('✓ Config baru dibuat');
}

// Load semua command dari folder cmd
const cmdPath = path.join(__dirname, 'cmd');
const commands = new Map();

function loadCommands() {
  if (!fs.existsSync(cmdPath)) {
    console.warn('⚠️  Folder cmd tidak ditemukan');
    return;
  }

  const files = fs.readdirSync(cmdPath).filter(f => f.endsWith('.js'));
  
  files.forEach(file => {
    try {
      const cmd = require(path.join(cmdPath, file));
      const cmdName = cmd.name.toLowerCase();
      commands.set(cmdName, cmd);
      
      // Load aliases jika ada
      if (cmd.aliases && Array.isArray(cmd.aliases)) {
        cmd.aliases.forEach(alias => {
          commands.set(alias.toLowerCase(), cmd);
        });
        console.log(`✓ Command loaded: ${cmd.name} v${cmd.version} - ${cmd.description} [${cmd.aliases.join(', ')}]`);
      } else {
        console.log(`✓ Command loaded: ${cmd.name} v${cmd.version} - ${cmd.description}`);
      }
    } catch (err) {
      console.error(`❌ Gagal load command ${file}:`, err.message);
    }
  });

  console.log(`\n📦 Total command terload: ${commands.size}\n`);
}

/**
 * Ambil role user (0: user, 1: admin grup, 2: admin)
 */
function getUserRole(userId, groupId = null) {
  // Cek jika admin
  if (config.admins && config.admins.includes(userId.toString())) {
    return 2; // Admin
  }
  
  // Cek jika admin grup
  if (groupId && config.groupAdmins && config.groupAdmins[groupId]) {
    if (config.groupAdmins[groupId].includes(userId.toString())) {
      return 1; // Admin Grup
    }
  }
  
  return 0; // User biasa
}

/**
 * Login dengan appstate
 */
async function startBot() {
  try {
    // Cek apakah appstate sudah ada
    if (!fs.existsSync(appstatePath)) {
      console.error('❌ File appstate.json tidak ditemukan!');
      console.log('\n📝 Cara mendapatkan appstate.json:');
      console.log('1. Login di https://www.facebook.com');
      console.log('2. Buka DevTools (F12) > Application > Cookies');
      console.log('3. Copy semua cookies dan format menjadi appstate.json');
      console.log('4. Atau gunakan tool extractor appstate');
      process.exit(1);
    }

    console.log('✓ Membaca appstate.json...');
    const appState = fs.readJsonSync(appstatePath);
    
    // Debug: check format appstate
    console.log(`📊 Appstate memiliki ${appState.length} cookies`);
    if (!Array.isArray(appState)) {
      throw new Error('Appstate harus berupa array');
    }

    console.log('🔐 Sedang login ke Facebook...');
    
    // Gunakan callback style (bukan await) untuk mao-fca
    login({ appState: appState }, (err, api) => {
      if (err) {
        console.error('❌ Gagal login:', err.message);
        console.log('\n🔧 Tips:');
        console.log('1. Pastikan appstate.json valid dan fresh');
        console.log('2. Buat appstate baru: npm run setup');
        console.log('3. Cek status akun Facebook');
        process.exit(1);
      }

      console.log('✓ Bot berhasil login!');
      console.log('🤖 Bot aktif dan siap menerima pesan!');
      console.log('Tekan Ctrl+C untuk berhenti.\n');

      // Berikan delay lebih lama sebelum listenMqtt agar session sepenuhnya ready
      setTimeout(() => {
        // Setup event listener menggunakan listenMqtt
        api.listenMqtt((err, event) => {
          if (err) {
            console.error('❌ Error listenMqtt:', err.message || err);
            console.log('⚠️ Coba regenerate appstate: npm run setup');
            return;
          }

          // Handle pesan masuk - cek berbagai type
          if (event.type === 'message' || event.body) {
            handleMessage(api, event);
          }

          // Handle pesan read
          if (event.type === 'message_read') {
            console.log(`📖 Pesan dibaca dari: ${event.reader}`);
          }

          // Handle typing indicator
          if (event.type === 'typ') {
            console.log(`⌨️ ${event.from} sedang mengetik...`);
          }
        });
      }, 3000);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * Handle pesan masuk
 */
function handleMessage(api, event) {
  const senderId = event.senderID;
  const message = event.body;
  const threadId = event.threadID;

  if (!message) return;

  console.log(`\n💬 Pesan dari ${senderId}:`);
  console.log(`   "${message}"`);

  // Cek jika pesan dengan / (command)
  if (message.trim().startsWith('/')) {
    console.log('→ Deteksi sebagai command');
    handleCommand(api, message, threadId, senderId, event);
    return;
  }

  // Jika bukan command, abaikan
  console.log('→ Bukan command, diabaikan');
}

/**
 * Handle command dari user
 */
function handleCommand(api, message, threadId, senderId, event) {
  // Extract command name (case-insensitive)
  const trimmed = message.trim().slice(1);
  const args = trimmed.split(' ');
  const cmdName = args[0].toLowerCase();
  const cmdArgs = args.slice(1).join(' ');

  console.log(`⚡ Command terdeteksi: ${cmdName}`);

  // Cek apakah command ada
  if (!commands.has(cmdName)) {
    console.log(`❌ Command ${cmdName} tidak ditemukan. Available: ${Array.from(commands.keys()).join(', ')}`);
    const response = `❌ Command '/${cmdName}' tidak dikenal.\nKetik /help untuk melihat command yang tersedia.`;
    api.sendMessage(response, threadId, (err) => {
      if (err) console.error('❌ Gagal mengirim response:', err);
      else console.log('✓ Error message terkirim');
    });
    return;
  }

  // Jalankan command
  const cmd = commands.get(cmdName);
  console.log(`✓ Menjalankan command: ${cmd.name} v${cmd.version}`);
  
  // Cek role jika command memerlukan
  if (cmd.role !== undefined) {
    const userRole = getUserRole(senderId, threadId);
    const roleNames = ['User', 'Admin Grup', 'Admin'];
    
    console.log(`👤 User role: ${roleNames[userRole]} (${userRole}), Required: ${roleNames[cmd.role]} (${cmd.role})`);
    
    if (userRole < cmd.role) {
      const response = `❌ Command ini memerlukan role: ${roleNames[cmd.role]}`;
      api.sendMessage(response, threadId, (err) => {
        if (err) console.error('❌ Gagal mengirim response:', err);
      });
      return;
    }
  }
  
  try {
    // Coba ambil info pengguna dari API untuk mendapatkan nama Facebook
    api.getUserInfo(senderId, (err, info) => {
      let userName = null;
      if (!err && info && info[senderId]) {
        userName = info[senderId].name || null;
        console.log(`👤 User name dari API: ${userName}`);
      }
      
      cmd.execute(api, cmdArgs, threadId, { userId: senderId, threadId: threadId, userRole: getUserRole(senderId, threadId), name: userName });
    });
  } catch (err) {
    console.error(`❌ Error saat execute command ${cmdName}:`, err.message);
    api.sendMessage('❌ Terjadi error saat menjalankan command', threadId, (err) => {
      if (err) console.error('❌ Gagal mengirim error message:', err);
    });
  }
}

// Load command terlebih dahulu
loadCommands();

// Jalankan bot
startBot();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Bot dihentikan.');
  process.exit(0);
});
