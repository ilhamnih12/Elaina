/**
 * UI Helper for consistent command output
 */

const roleNames = ['User', 'Admin Grup', 'Admin'];

module.exports = {
  /**
   * Mendapatkan nama role berdasarkan level
   * @param {number} role
   * @returns {string}
   */
  getRoleName: (role) => {
    return roleNames[role] || 'User';
  },

  /**
   * Membuat tampilan box untuk output command
   * @param {string} title
   * @param {string} content
   * @returns {string}
   */
  box: (title, content) => {
    const lines = content.split('\n');
    let result = `╭──── [ ${title.toUpperCase()} ] ────╮\n`;
    result += `│\n`;
    lines.forEach(line => {
      result += `│ ${line}\n`;
    });
    result += `│\n`;
    result += `╰────────────────────────╯`;
    return result;
  },

  /**
   * Format pesan error
   * @param {string} message
   * @returns {string}
   */
  error: (message) => {
    return `❌ Error: ${message}`;
  },

  /**
   * Format pesan sukses
   * @param {string} message
   * @returns {string}
   */
  success: (message) => {
    return `✅ ${message}`;
  },

  /**
   * Format list item
   * @param {string} label
   * @param {string} value
   * @returns {string}
   */
  item: (label, value) => {
    return `• ${label}: ${value}`;
  }
};
