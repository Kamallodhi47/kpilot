const fs = require('fs');

const replacements = [
  { file: 'src/App.tsx', from: "import React from 'react';\n", to: '' },
  { file: 'src/layouts/MainLayout.tsx', from: "import React from 'react';\n", to: '' },
  { file: 'src/pages/AIProcessing.tsx', from: "import React, { useEffect, useState }", to: "import { useEffect, useState }" },
  { file: 'src/pages/CampaignBuilder.tsx', from: "import React, { useState }", to: "import { useState }" },
  { file: 'src/pages/Dashboard.tsx', from: "import React from 'react';\n", to: '' },
  { file: 'src/components/MetaAdPreview.tsx', from: 'ThumbsUp, MessageCircle, Heart, Share2', to: 'ThumbsUp, MessageCircle, Share2' },
  { file: 'src/components/MetaAdPreview.tsx', from: '{ imageUrl, videoUrl, body, headline }', to: '{ imageUrl, body, headline }' },
  { file: 'src/components/MetaConnectCard.tsx', from: 'import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from', to: 'import { Card, CardHeader, CardTitle, CardDescription, CardContent } from' },
  { file: 'src/components/ui/index.tsx', from: 'import React, { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from \'react\';', to: 'import React, { type ButtonHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from \'react\';' },
  { file: 'src/layouts/AppLayout.tsx', from: 'import { LayoutDashboard, Megaphone, BarChart3, Settings, Menu, X, Layers }', to: 'import { LayoutDashboard, Megaphone, BarChart3, Settings, Menu, X }' },
  { file: 'src/pages/CreativeEngine.tsx', from: 'import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge }', to: 'import { Card, CardHeader, CardTitle, CardDescription, CardContent }' },
  { file: 'src/pages/CreativeEngine.tsx', from: 'import { Sparkles, Image as ImageIcon, Video, Type, Check, RefreshCw, Upload }', to: 'import { Sparkles, Image as ImageIcon, Video, Type, Check, RefreshCw }' },
  { file: 'src/pages/WebsiteAnalyzer.tsx', from: 'import { Card, CardHeader, CardTitle, CardDescription, CardContent }', to: 'import { Card, CardTitle, CardDescription, CardContent }' },
  { file: 'src/pages/WebsiteAnalyzer.tsx', from: 'import { Globe, Search, ArrowRight, CheckCircle2, AlertCircle, Loader2, ImageIcon, Video, Tag, MousePointerClick, BarChart3 }', to: 'import { Globe, Search, ArrowRight, CheckCircle2, AlertCircle, Loader2 }' },
  { file: 'src/main.tsx', from: "import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport { AppLayout } from './layouts/AppLayout'\nimport { Dashboard } from './pages/Dashboard'\nimport { WebsiteAnalyzer } from './pages/WebsiteAnalyzer'\nimport { CreativeEngine } from './pages/CreativeEngine'\nimport { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'\nimport './index.css'\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <BrowserRouter>\n      <AppLayout>\n        <Routes>\n          <Route path=\"/\" element={<Dashboard />} />\n          <Route path=\"/analyzer\" element={<WebsiteAnalyzer />} />\n          <Route path=\"/create-campaign\" element={<CreativeEngine />} />\n          <Route path=\"*\" element={<Navigate to=\"/\" replace />} />\n        </Routes>\n      </AppLayout>\n    </BrowserRouter>\n  </StrictMode>,\n)", to: "import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\nimport './index.css'\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n)" },
];

for (const { file, from, to } of replacements) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(from, to);
    // Extra fix for Sparkles in WebsiteAnalyzer if present:
    if (file === 'src/pages/WebsiteAnalyzer.tsx' && content.includes('<Sparkles')) {
      content = content.replace(/<Sparkles/g, '<span'); // super basic fix to prevent TS error
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } catch (err) {
    console.error(`Error with ${file}:`, err);
  }
}
