import { MoreHorizontal, ThumbsUp, MessageSquare, Share2, Globe, Heart } from 'lucide-react';
import { Card } from './ui';

interface MetaAdPreviewProps {
  pageName: string;
  adCopy: string;
  imageUrl?: string;
  videoUrl?: string;
  headline: string;
  description: string;
  cta: string;
  format: 'image' | 'video' | 'carousel';
}

export function MetaAdPreview({ pageName, adCopy, imageUrl, videoUrl, headline, description, cta, format }: MetaAdPreviewProps) {
  return (
    <Card className="max-w-md mx-auto bg-white rounded-xl shadow-lg border-slate-200 overflow-hidden font-sans">
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
            <span className="font-bold text-slate-500 text-sm">{pageName.charAt(0)}</span>
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-bold text-[15px] text-slate-900 leading-tight">{pageName}</span>
            </div>
            <div className="flex items-center text-[13px] text-slate-500">
              <span>Sponsored</span>
              <span className="mx-1">·</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>
        <MoreHorizontal className="text-slate-500 w-5 h-5 cursor-pointer hover:bg-slate-100 rounded-full" />
      </div>

      {/* Ad Copy */}
      <div className="px-3 pb-3 text-[15px] text-slate-900 whitespace-pre-wrap leading-relaxed">
        {adCopy}
      </div>

      {/* Creative */}
      <div className="w-full bg-slate-100 aspect-square relative flex items-center justify-center border-y border-slate-100">
        {format === 'image' && imageUrl ? (
          <img src={imageUrl} alt="Ad Creative" className="w-full h-full object-cover" />
        ) : format === 'video' ? (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
            <span className="text-white text-lg font-bold">Video Creative Placeholder</span>
            <div className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 rounded text-xs text-white">0:15</div>
          </div>
        ) : format === 'carousel' ? (
          <div className="w-full h-full flex overflow-x-hidden snap-x">
            <div className="w-[80%] shrink-0 h-full bg-blue-100 border-r border-white flex items-center justify-center snap-center">
              <span className="text-blue-500 font-bold">Card 1</span>
            </div>
            <div className="w-[80%] shrink-0 h-full bg-green-100 flex items-center justify-center snap-center">
              <span className="text-green-500 font-bold">Card 2</span>
            </div>
          </div>
        ) : (
          <span className="text-slate-400 font-bold">Image Placeholder</span>
        )}
      </div>

      {/* Bottom Action Area (Headline + CTA) */}
      <div className="bg-[#f0f2f5] p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200">
        <div className="flex-1">
          <p className="text-[12px] text-slate-500 uppercase tracking-wide mb-1">Example.com</p>
          <h3 className="font-bold text-[16px] text-slate-900 leading-tight">{headline}</h3>
          <p className="text-[14px] text-slate-500 line-clamp-1 mt-0.5">{description}</p>
        </div>
        <button className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold px-4 py-2 rounded-lg text-sm shrink-0 transition-colors">
          {cta}
        </button>
      </div>

      {/* Engagement Actions */}
      <div className="px-4 py-2 flex items-center justify-between text-slate-500 text-[15px] font-medium border-t border-slate-100">
        <div className="flex items-center space-x-1 cursor-pointer hover:bg-slate-50 py-1.5 px-2 rounded-lg">
          <ThumbsUp className="w-5 h-5" />
          <span>Like</span>
        </div>
        <div className="flex items-center space-x-1 cursor-pointer hover:bg-slate-50 py-1.5 px-2 rounded-lg">
          <MessageSquare className="w-5 h-5" />
          <span>Comment</span>
        </div>
        <div className="flex items-center space-x-1 cursor-pointer hover:bg-slate-50 py-1.5 px-2 rounded-lg">
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </div>
      </div>
    </Card>
  );
}
