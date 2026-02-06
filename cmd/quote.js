const UI = require('../lib/ui');

const quotes = [
  "Hari ini adalah kesempatan untuk menjadi lebih baik dari kemarin.",
  "Jangan pernah menyerah, karena keajaiban terjadi setiap hari.",
  "Kesuksesan bukanlah akhir, kegagalan bukanlah fatal: keberanian untuk melanjutkanlah yang utama.",
  "Hiduplah seolah-olah kamu akan mati besok. Belajarlah seolah-olah kamu akan hidup selamanya.",
  "Cara terbaik untuk memprediksi masa depan adalah dengan menciptakannya.",
  "Pekerjaan hebat dilakukan bukan dengan kekuatan, melainkan dengan ketekunan.",
  "Kebahagiaan bukanlah sesuatu yang sudah jadi. Itu berasal dari tindakanmu sendiri."
];

module.exports = {
  name: 'quote',
  aliases: ['kata', 'bijak'],
  version: '0.9.0-bt',
  description: 'Dapatkan kata-kata bijak acak',
  role: 0,
  category: 'Utility',
  cooldown: 5,

  execute(api, args, threadId, userInfo) {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    api.sendMessage(UI.box('Random Quote', `✨ "${quote}"`), threadId);
  }
};
