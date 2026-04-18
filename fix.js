const fs = require('fs');
let content = fs.readFileSync('components/wallet-action-drawer.tsx', 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\${/g, '${');
fs.writeFileSync('components/wallet-action-drawer.tsx', content, 'utf8');
