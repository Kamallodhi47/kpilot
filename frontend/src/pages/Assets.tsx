import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, FolderPlus, Search, List, Grid, Image as ImageIcon, 
  Video, FileText, Folder, Moon, AlertCircle, Sparkles, 
  ArrowRight, Download, Trash2, Eye, Plus, X, MoreVertical,
  Check, Filter, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AIAssistantWidget from '../components/AIAssistantWidget';

interface AssetFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'folder' | 'script';
  url?: string;
  size?: string;
  date: string;
  dimensions?: string;
}

export default function Assets() {
  const navigate = useNavigate();

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

  // Asset Items List
  const [assets, setAssets] = useState<AssetFile[]>([]);

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
        dimensions: '1080 x 1080'
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
  };

  const filteredAssets = assets.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#07070c] text-white p-5 sm:p-8 relative font-sans select-none">
      
      {/* ================= TOP HEADER ================= */}
      <div className="flex items-start justify-between pb-5 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Assets</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Explore the creations by everyone in this workspace here
          </p>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Theme Switcher */}
          <button className="w-10 h-6 rounded-full bg-[#161626] border border-white/10 flex items-center px-1 text-gray-400 hover:text-white transition-colors cursor-pointer">
            <Moon className="w-3.5 h-3.5 text-gray-300" />
          </button>

          {/* User Avatar Circle */}
          <div className="w-8 h-8 rounded-full bg-[#ea580c] flex items-center justify-center text-white text-xs font-bold shadow-md shadow-orange-600/30">
            {userInitial}
          </div>
        </div>
      </div>

      {/* ================= ACTION BUTTONS (UPLOAD / NEW FOLDER) ================= */}
      <div className="flex items-center justify-end gap-3 pt-5 pb-4">
        <button
          onClick={() => {
            if (fileInputRef.current) fileInputRef.current.click();
          }}
          className="px-4 py-2 rounded-full bg-[#131322] hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 text-gray-300" />
          <span>Upload</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          accept="image/*,video/*"
          className="hidden"
        />

        <button
          onClick={() => setIsNewFolderModalOpen(true)}
          className="px-4 py-2 rounded-full bg-[#131322] hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <FolderPlus className="w-3.5 h-3.5 text-gray-300" />
          <span>New Folder</span>
        </button>
      </div>

      {/* ================= BREADCRUMBS & TOOLBAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-t border-white/5">
        
        {/* Breadcrumb row */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentFolder(null)}
            className="px-3.5 py-1 rounded-full bg-[#161528] hover:bg-[#201d36] border border-white/10 text-gray-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
          >
            Back
          </button>
          <div className="flex items-center gap-1.5 text-xs font-medium text-white">
            <span className="text-white">Assets</span>
            {currentFolder && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-500" />
                <span className="text-purple-400">{currentFolder}</span>
              </>
            )}
          </div>
        </div>

        {/* Search & Grid/List Switcher */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files & folders"
              className="w-full bg-[#131222] border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#100f1c] border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#7c3aed] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col items-center justify-center py-16 sm:py-24">
        
        {filteredAssets.length === 0 ? (
          /* Exact Empty State matching media_1791611060595.png */
          <div className="flex flex-col items-center text-center max-w-md mx-auto space-y-4 animate-in fade-in duration-300">
            
            {/* Exclamation Circle Icon */}
            <div className="w-14 h-14 rounded-full border border-purple-500/50 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-950/40">
              <span className="text-2xl font-bold font-mono">!</span>
            </div>

            {/* Empty notice text */}
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm">
              There are currently no assets of this type. Use our tools to generate new ones.
            </p>

            {/* Try Now Section */}
            <div className="pt-3 space-y-3">
              <h4 className="text-base font-bold text-white tracking-wide">Try Now</h4>
              
              <button
                onClick={() => navigate('/pixeo')}
                className="px-5 py-2 rounded-full bg-black/40 hover:bg-white/10 border border-white/20 text-white text-xs font-medium transition-all cursor-pointer shadow-sm flex items-center gap-2 mx-auto"
              >
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                <span>Pixeo</span>
              </button>
            </div>

          </div>
        ) : (
          /* Assets Grid / List View */
          <div className="w-full">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="group bg-[#111020] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all shadow-lg flex flex-col"
                  >
                    <div className="relative aspect-square w-full bg-black/50 overflow-hidden flex items-center justify-center">
                      {asset.type === 'folder' ? (
                        <Folder className="w-12 h-12 text-purple-400 group-hover:scale-110 transition-transform" />
                      ) : (
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <p className="text-xs font-semibold text-white truncate">{asset.name}</p>
                        <p className="text-[10px] text-gray-400">{asset.size || asset.date}</p>
                      </div>
                      <button
                        onClick={() => setAssets(prev => prev.filter(a => a.id !== asset.id))}
                        className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full bg-[#111020] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                {filteredAssets.map((asset) => (
                  <div key={asset.id} className="p-3.5 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      {asset.type === 'folder' ? (
                        <Folder className="w-4 h-4 text-purple-400" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-indigo-400" />
                      )}
                      <span className="text-xs font-semibold text-white">{asset.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{asset.size || 'Folder'}</span>
                      <span>{asset.date}</span>
                      <button
                        onClick={() => setAssets(prev => prev.filter(a => a.id !== asset.id))}
                        className="text-gray-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
          <div className="w-full max-w-sm bg-[#131222] border border-white/10 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <h3 className="text-sm font-bold text-white">Create New Folder</h3>
              <button
                onClick={() => setIsNewFolderModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name (e.g. Summer Ads 2026)"
                autoFocus
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-full text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all"
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
