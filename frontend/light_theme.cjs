const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/layouts/MainLayout.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/CampaignBuilder.tsx',
  'src/pages/AIProcessing.tsx'
];

for (const file of filesToUpdate) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace hardcoded white/dark colors with semantic/light theme equivalents
  content = content
    .replace(/text-white/g, 'text-foreground')
    .replace(/text-gray-300/g, 'text-muted-foreground')
    .replace(/text-gray-400/g, 'text-muted-foreground')
    .replace(/text-gray-500/g, 'text-muted-foreground')
    .replace(/border-white\/5/g, 'border-black/5')
    .replace(/border-white\/10/g, 'border-black/10')
    .replace(/border-white\/25/g, 'border-black/20')
    .replace(/bg-white\/5/g, 'bg-black/5')
    .replace(/bg-white\/10/g, 'bg-black/10')
    .replace(/bg-black\/40/g, 'bg-white/40')
    .replace(/hover:text-white/g, 'hover:text-foreground')
    .replace(/hover:bg-white\/5/g, 'hover:bg-black/5')
    .replace(/bg-primary\/20/g, 'bg-primary/10')
    .replace(/divide-white\/10/g, 'divide-black/10')
    .replace(/divide-white\/5/g, 'divide-black/5');

  // Specific Recharts fixes for Dashboard
  if (file.includes('Dashboard.tsx')) {
    content = content
      .replace(/rgba\(255,255,255,0\.1\)/g, 'rgba(0,0,0,0.1)')
      .replace(/rgba\(15, 23, 42, 0\.9\)/g, 'rgba(255,255,255,0.9)')
      .replace(/color: '#fff'/g, 'color: \'#0f172a\'');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
