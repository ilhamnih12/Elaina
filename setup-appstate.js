const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Tool untuk membuat/extract appstate
 */

console.log('📱 Facebook Appstate Extractor\n');
console.log('Cara mendapatkan appstate.json:');
console.log('==========================================');
console.log('1. Login ke Facebook di browser');
console.log('2. Buka DevTools (F12)');
console.log('3. Buka tab "Console"');
console.log('4. Copy & paste script berikut:');
console.log('');
console.log('```javascript');
console.log('(async () => {');
console.log('  const data = document.cookie');
console.log('    .split("; ")');
console.log('    .map(c => {');
console.log('      const [name, value] = c.split("=");');
console.log('      return {');
console.log('        key: name,');
console.log('        value: decodeURIComponent(value),');
console.log('        domain: ".facebook.com",');
console.log('        path: "/",');
console.log('        expirationDate": Math.floor(Date.now() / 1000) + 86400 * 365');
console.log('      };');
console.log('    });');
console.log('  console.log(JSON.stringify(data, null, 2));');
console.log('})();');
console.log('```');
console.log('');
console.log('5. Copy hasil output ke file appstate.json di folder project');
console.log('==========================================\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Sudah mendapatkan appstate? Tempel di sini (paste appstate JSON): ', (answer) => {
  try {
    const appState = JSON.parse(answer);
    
    if (!Array.isArray(appState)) {
      throw new Error('Format harus berupa array');
    }

    const appstatePath = path.join(__dirname, 'appstate.json');
    fs.writeFileSync(appstatePath, JSON.stringify(appState, null, 2));
    
    console.log('\n✓ Appstate berhasil disimpan ke appstate.json!');
    console.log('Sekarang jalankan: npm start');
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.log('Pastikan input adalah JSON yang valid');
  }
  
  rl.close();
});
