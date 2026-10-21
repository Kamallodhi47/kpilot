import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, FolderPlus, Search, List, Grid, Image as ImageIcon, 
  Video, FileText, Folder, Moon, Sun, AlertCircle, Sparkles, 
  ArrowRight, Download, Trash2, Eye, Plus, X, MoreVertical,
  Check, Filter, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AIAssistantWidget from '../components/AIAssistantWidget';
import { useTheme } from '../context/ThemeContext';

interface AssetFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'folder' | 'script';
  url?: string;
  size?: string;
  date: string;
  dimensions?: string;
  folder?: string;
}

export default function Assets() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // User Profile
  const [userName, setUserName] = useState('User');
  const [userInitial, setUserInitial] = useState('K');
  const [userEmail, setUserEmail] = useState('');

  // View & Filter States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  
  // Modals & Upload State
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial Folders & Assets
  const [assets, setAssets] = useState<AssetFile[]>([
    {
      id: 'folder-1',
      name: 'kaal',
      type: 'folder',
      date: 'Updated today'
    },
    {
      id: 'folder-2',
      name: 'Whey Protein Creatives',
      type: 'folder',
      date: 'Updated 2 days ago'
    },
    {
      id: 'folder-3',
      name: 'Summer Campaign 2026',
      type: 'folder',
      date: 'Updated last week'
    }
  ]);

  // Fetch logged in user profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/auth/me', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        if (data.name) setUserName(data.name);
        if (data.initial) setUserInitial(data.initial);
        if (data.email) setUserEmail(data.email);
      })
      .catch(err => console.error(err));
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newItems: AssetFile[] = Array.from(files).map((file, idx) => ({
        id: (Date.now() + idx).toString(),
        name: file.name,
        type: file.type.startsWith('video') ? 'video' : 'image',
        url: URL.createObjectURL(file),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        date: 'Just now',
        dimensions: '1080 x 1080',
        folder: currentFolder || undefined
      }));

      setAssets(prev => [...newItems, ...prev]);
    }
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newFolder: AssetFile = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      type: 'folder',
      date: 'Just now'
    };

    setAssets(prev => [newFolder, ...prev]);
    setNewFolderName('');
    setIsNewFolderModalOpen(false);
    setCurrentFolder(newFolder.name);
  };

  // Filter assets depending on whether we are at root or inside a specific folder
  const currentAssets = assets.filter(item => {
    if (currentFolder) {
      return item.folder === currentFolder;
    }
    // At root: show folders AND root assets
    return !item.folder;
  });

  const filteredAssets = currentAssets.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col min-h-screen ${isDark ? 'bg-[#07070c] text-white' : 'bg-slate-50 text-slate-900'} p-6 sm:p-10 relative font-sans select-none transition-colors duration-200`}>
      
      {/* ================= TOP HEADER (DYNAMIC BASED ON ROOT OR INSIDE FOLDER) ================= */}
      <div className={`flex items-center justify-between pb-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        
        {currentFolder ? (
          /* When Inside Folder */
          <div className="flex items-center gap-3.5">
            <span className={`text-sm font-bold tracking-wider uppercase font-mono ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              RECENT
            </span>
            <div className={`px-4 py-1.5 rounded-full ${isDark ? 'bg-[#18172c] border-white/15 text-white' : 'bg-purple-50 border-purple-200 text-purple-900'} border text-sm font-semibold flex items-center gap-2.5 shadow-sm`}>
              <Folder className="w-4 h-4 text-purple-400 fill-purple-400/20" />
              <span>{currentFolder}</span>
            </div>
          </div>
        ) : (
          /* When at Root Assets Directory */
          <div>
            <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Assets
            </h1>
            <p className={`text-sm sm:text-base font-medium mt-1.5 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Explore the creations by everyone in this workspace here
            </p>
          </div>
        )}

        {/* Top Right Actions: Theme Toggle & Avatar */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className={`w-12 h-8 rounded-full ${isDark ? 'bg-[#1a1a2e] border-white/15 text-gray-300 hover:text-white' : 'bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'} border flex items-center justify-center transition-colors cursor-pointer shadow-sm`}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Moon className="w-4 h-4 text-purple-300" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] flex items-center justify-center text-white text-base font-bold shadow-md shadow-orange-600/30 ring-2 ring-white/10">
            {userInitial}
          </div>
        </div>

      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        accept="image/*,video/*"
        className="hidden"
      />

      {/* ================= SECOND ROW: BREADCRUMBS & TOP CONTROLS ================= */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        
        {/* Left: Back button & Breadcrumb path */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentFolder(null)}
            className={`px-5 py-2.5 rounded-xl text-base font-bold transition-all cursor-pointer border ${
              isDark 
                ? 'bg-[#18172c] hover:bg-[#23213d] border-white/15 text-white shadow-sm' 
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm'
            }`}
          >
            Back
          </button>
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold">
            <button
              onClick={() => setCurrentFolder(null)}
              className={`cursor-pointer transition-colors ${
                !currentFolder 
                  ? (isDark ? 'text-white' : 'text-slate-950') 
                  : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
              }`}
            >
              Assets
            </button>
            {currentFolder && (
              <>
                <span className={isDark ? 'text-gray-500 font-bold' : 'text-slate-400 font-bold'}>/</span>
                <span className={`font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>{currentFolder}</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Upload, New Folder, Search & Grid/List view */}
        <div className="flex items-center flex-wrap gap-3.5">
          {/* Upload Button */}
          <button
            onClick={() => {
              if (fileInputRef.current) fileInputRef.current.click();
            }}
            className={`px-5 py-2.5 rounded-xl text-base font-bold transition-all shadow-sm flex items-center gap-2.5 cursor-pointer border ${
              isDark 
                ? 'bg-[#18172c] hover:bg-[#23213d] border-white/15 text-white' 
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
            }`}
          >
            <Upload className={`w-4 h-4 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
            <span>Upload</span>
          </button>

          {/* New Folder Button */}
          <button
            onClick={() => setIsNewFolderModalOpen(true)}
            className={`px-5 py-2.5 rounded-xl text-base font-bold transition-all shadow-sm flex items-center gap-2.5 cursor-pointer border ${
              isDark 
                ? 'bg-[#18172c] hover:bg-[#23213d] border-white/15 text-white' 
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
            }`}
          >
            <FolderPlus className={`w-4 h-4 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
            <span>New Folder</span>
          </button>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files & folders"
              className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-base font-medium focus:outline-none transition-colors ${
                isDark 
                  ? 'bg-[#121124] border-white/15 text-white placeholder-gray-400 focus:border-purple-500' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-600'
              }`}
            />
          </div>

          {/* View mode buttons */}
          <div className={`flex items-center gap-1.5 border rounded-xl p-1.5 ${isDark ? 'bg-[#121124] border-white/15' : 'bg-white border-slate-300'}`}>
            <button
              onClick={() => setViewMode('list')}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-600/30'
                  : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-600/30'
                  : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
              }`}
              title="Grid View"
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col py-8">
        
        {filteredAssets.length === 0 ? (
          /* Empty State when folder has no items */
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6 animate-in fade-in duration-300 py-16">
            
            {/* Exclamation Circle Icon */}
            <div className={`w-18 h-18 rounded-full border-2 flex items-center justify-center shadow-lg ${
              isDark 
                ? 'border-purple-500/60 text-purple-300 bg-purple-950/20 shadow-purple-950/50' 
                : 'border-purple-400 text-purple-600 bg-purple-50 shadow-purple-200'
            }`}>
              <span className="text-4xl font-extrabold font-mono">!</span>
            </div>

            {/* Empty notice text with enhanced readable font */}
            <p className={`text-lg sm:text-xl font-semibold leading-relaxed max-w-sm ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>
              There are currently no assets inside <span className="font-bold underline text-purple-400">{currentFolder || 'this workspace'}</span>. Use our tools or click Upload to add new ones.
            </p>

            {/* Try Now Section */}
            <div className="pt-2 space-y-3">
              <h4 className={`text-lg font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>Try Now</h4>
              
              <button
                onClick={() => navigate('/pixeo')}
                className={`px-7 py-3 rounded-full border text-base font-bold transition-all cursor-pointer shadow-md flex items-center gap-2.5 mx-auto ${
                  isDark 
                    ? 'bg-[#18172c] hover:bg-[#252342] border-white/20 text-white' 
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
                }`}
              >
                <ImageIcon className="w-5 h-5 text-purple-400" />
                <span>Pixeo AI Generator</span>
              </button>
            </div>

          </div>
        ) : (
          /* Assets Grid / List View */
          <div className="w-full">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => {
                      if (asset.type === 'folder') {
                        setCurrentFolder(asset.name);
                      }
                    }}
                    className={`group border rounded-2xl overflow-hidden transition-all shadow-lg flex flex-col cursor-pointer ${
                      isDark 
                        ? 'bg-[#131222] border-white/10 hover:border-purple-500/70 hover:shadow-purple-950/40' 
                        : 'bg-white border-slate-200 hover:border-purple-400 hover:shadow-slate-300'
                    }`}
                  >
                    <div className={`relative aspect-square w-full overflow-hidden flex items-center justify-center ${
                      isDark ? 'bg-black/50' : 'bg-slate-100'
                    }`}>
                      {asset.type === 'folder' ? (
                        <div className="flex flex-col items-center justify-center p-4">
                          <Folder className="w-20 h-20 text-purple-400 group-hover:scale-110 transition-transform drop-shadow" />
                          <span className={`text-sm font-bold mt-2 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>Folder</span>
                        </div>
                      ) : (
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <div className={`p-4 flex items-center justify-between border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                      <div className="truncate pr-2">
                        <p className={`text-base font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {asset.name}
                        </p>
                        <p className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                          {asset.size || asset.date}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssets(prev => prev.filter(a => a.id !== asset.id));
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`w-full border rounded-2xl overflow-hidden divide-y ${
                isDark ? 'bg-[#131222] border-white/10 divide-white/5' : 'bg-white border-slate-200 divide-slate-100'
              }`}>
                {filteredAssets.map((asset) => (
                  <div 
                    key={asset.id} 
                    onClick={() => {
                      if (asset.type === 'folder') {
                        setCurrentFolder(asset.name);
                      }
                    }}
                    className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {asset.type === 'folder' ? (
                        <Folder className="w-6 h-6 text-purple-400" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-indigo-400" />
                      )}
                      <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{asset.name}</span>
                    </div>
                    <div className={`flex items-center gap-6 text-sm sm:text-base font-semibold ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                      <span>{asset.size || 'Folder'}</span>
                      <span>{asset.date}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssets(prev => prev.filter(a => a.id !== asset.id));
                        }}
                        className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ================= NEW FOLDER MODAL ================= */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-sm border rounded-3xl p-6 shadow-2xl relative ${
            isDark ? 'bg-[#131222] border-white/15' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b mb-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Create New Folder</h3>
              <button
                onClick={() => setIsNewFolderModalOpen(false)}
                className={`p-1 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name (e.g. Summer Ads 2026)"
                autoFocus
                className={`w-full border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none transition-colors ${
                  isDark 
                    ? 'bg-black/50 border-white/15 text-white placeholder-gray-500 focus:border-purple-500' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-600'
                }`}
              />

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-sm font-bold shadow-md shadow-purple-600/30 transition-all cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Robot AI Assistant Widget */}
      <AIAssistantWidget />

    </div>
  );
}
