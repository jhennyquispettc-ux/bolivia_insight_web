const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'web', 'src', 'paginas', 'Dashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = {
  'â†’': '→',
  'Ã­': 'í',
  'Ã©': 'é',
  'Ã³': 'ó',
  'Ã¡': 'á',
  'Ãº': 'ú',
  'Ã±': 'ñ',
  'Â·': '·',
  'Ã“': 'Ó',
  'Ã ': 'Í',
  'Ã‰': 'É',
  'Ãš': 'Ú',
  'â€”': '—',
  'CafÃ©': 'Café',
  'PotosÃ­': 'Potosí'
};

for (const [bad, good] of Object.entries(replacements)) {
  content = content.split(bad).join(good);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Encoding fixed.');
