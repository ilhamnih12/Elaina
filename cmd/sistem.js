const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
// no file attachments required

module.exports = {
  name: 'sistem',
  aliases: ['hady','ayanokoji'],
  version: '1.0.0',
  description: 'Tampilkan informasi sistem (uptime, RAM, disk, CPU)',
  role: 0,

  async execute(api, args, threadId, userInfo) {
    try {
      const uptime = process.uptime();
      const jam = Math.floor(uptime / 3600);
      const menit = Math.floor((uptime % 3600) / 60);

      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();

      const chika = Date.now();
      const arif = `${jam} jam ${menit} menit`;

      const diskUsage = await getDiskUsage();
      const edi = `${prettyBytes(diskUsage.used)}/${prettyBytes(diskUsage.total)}`;
      const riley = `${prettyBytes(totalMemory - freeMemory)}/${prettyBytes(totalMemory)}`;
      const luxion = `${os.type()} ${os.release()}`;
      const rizky = `${os.cpus()[0] && os.cpus()[0].model ? os.cpus()[0].model : 'unknown'}`;
      const nino = Date.now();
      const raffa = nino - chika;

      const hadi = `[ ${ping(raffa)} | ${raffa}ms ] • 𝗦𝗜𝗦𝗧𝗘𝗠 🜲\n`
                  + `\n- Uptime: ${arif}`
                  + `\n- Ram: ${riley}`
                  + `\n- Disk: ${edi}`
                  + `\n- Cpu: ${rizky} (${os.cpus().length} cores)`;

      // send text-only system info (no image)
      api.sendMessage(hadi, threadId, (err) => {
        if (err) console.error('❌ Error sending sistem message:', err);
        else console.log('✓ Sistem message sent');
      });
    } catch (err) {
      console.error('❌ Error in sistem command:', err);
      api.sendMessage('❌ Terjadi error saat menampilkan info sistem.', threadId, (e) => {});
    }
  }
};

async function getDiskUsage() {
  try {
    const { stdout } = await exec('df -k /');
    const lines = stdout.trim().split('\n');
    if (lines.length < 2) return { total: 0, used: 0 };
    const parts = lines[1].split(/\s+/).filter(Boolean);
    // typical df -k output: Filesystem 1K-blocks Used Available Use% Mounted on
    const total = parseInt(parts[1], 10) * 1024;
    const used = parseInt(parts[2], 10) * 1024;
    return { total, used };
  } catch (err) {
    return { total: 0, used: 0 };
  }
}

function prettyBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let b = bytes;
  while (b >= 1024 && i < units.length - 1) {
    b /= 1024;
    i++;
  }
  return `${b.toFixed(2)} ${units[i]}`;
}

function ping(raffa) {
  if (raffa < 110) return '❄';
  if (raffa < 330) return '🍀';
  if (raffa < 660) return '🍁';
  if (raffa < 990) return '🌡';
  return '🔥';
}


