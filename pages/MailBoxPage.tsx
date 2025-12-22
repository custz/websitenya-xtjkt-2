
import React, { useState, useRef } from 'react';
import { 
  Heart, MessageSquare, Send, Trash2, ShieldCheck, User, 
  Sparkles, Globe, Plus, X, Reply, Image, Video, Loader2
} from 'lucide-react';
import { useStore } from '../services/store';
import { Post, Comment, Reply as ReplyType } from '../types';

// Helper to compress status images
const compressPostImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800; // Optimal size for posts
      const scale = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(base64Str);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.6)); // Balanced compression
    };
  });
};

const MailBoxPage: React.FC = () => {
  const { data, updateData, userRole, userProfile } = useStore();
  const [isPosting, setIsPosting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [postType, setPostType] = useState<'text' | 'image' | 'video'>('text');
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<{ postId: string, commentId: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) return alert("File terlalu besar! Maks 10MB.");
      
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        if (file.type.startsWith('image/')) {
          const compressed = await compressPostImage(base64);
          setMediaUrl(compressed);
          setPostType('image');
        } else {
          setMediaUrl(base64);
          setPostType('video');
        }
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const createPost = () => {
    if (!caption.trim() && !mediaUrl) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      authorName: data.adminProfile.name,
      authorImage: data.adminProfile.image,
      authorRole: data.adminProfile.role,
      type: postType,
      contentUrl: mediaUrl,
      caption: caption,
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      likes: 0,
      likedBy: [],
      comments: [],
      isAdmin: true
    };

    updateData({ posts: [newPost, ...data.posts] });
    setIsPosting(false);
    setCaption('');
    setMediaUrl('');
  };

  const handleLike = (postId: string) => {
    const updated = data.posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likedBy.includes(userProfile.name);
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          likedBy: hasLiked 
            ? post.likedBy.filter(n => n !== userProfile.name) 
            : [...post.likedBy, userProfile.name]
        };
      }
      return post;
    });
    updateData({ posts: updated });
  };

  const handleComment = (postId: string) => {
    if (!commentText.trim()) return;
    const updated = data.posts.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: Date.now().toString(),
          userId: userProfile.name,
          userName: userProfile.name,
          userImage: userProfile.image,
          text: commentText,
          timestamp: "Baru saja",
          replies: []
        };
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });
    updateData({ posts: updated });
    setCommentText('');
  };

  return (
    <div className="min-h-screen pt-32 pb-40 px-4 md:px-8 bg-[#020205] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px]"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-blue-500">
               <Globe size={24} className="animate-spin-slow" />
               <span className="mono text-[10px] font-black uppercase tracking-[0.5em]">TJKT Network Activity Hub</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
               Class <span className="text-stroke-blue">Feed</span>
             </h1>
          </div>
          {userRole === 'admin' && (
            <button onClick={() => setIsPosting(true)} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 transition-all active:scale-95"><Plus size={16} /> Buat Postingan</button>
          )}
        </header>

        {isPosting && (
          <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
             <div className="w-full max-w-lg glass-card rounded-[3rem] p-8 border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-white uppercase">New Broadcast</h3>
                  <button onClick={() => setIsPosting(false)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
                </div>
                <div className="space-y-6">
                  {mediaUrl && (
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10">
                       {postType === 'video' ? <video src={mediaUrl} className="w-full h-full object-cover" controls /> : <img src={mediaUrl} className="w-full h-full object-cover" />}
                       <button onClick={() => setMediaUrl('')} className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full"><X size={16} /></button>
                    </div>
                  )}
                  {isProcessing && <div className="flex items-center justify-center py-10 text-blue-500"><Loader2 className="animate-spin mr-3" /> Mengompresi Media...</div>}
                  <textarea className="w-full bg-slate-900/50 border border-white/5 rounded-3xl p-6 text-white outline-none focus:border-blue-500/50 h-32 resize-none" placeholder="Tulis caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
                  <div className="flex gap-4">
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-4 rounded-2xl bg-white/5 text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"><Image size={18} /> Upload Media</button>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
                  <button onClick={createPost} disabled={(!caption.trim() && !mediaUrl) || isProcessing} className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white rounded-3xl font-black uppercase tracking-widest text-xs transition-all">Publish Status</button>
                </div>
             </div>
          </div>
        )}

        <div className="space-y-12">
          {data.posts.map((post) => (
            <article key={post.id} className="glass-card rounded-[3.5rem] border-white/5 overflow-hidden animate-in fade-in slide-in-from-bottom-8">
               <div className="p-8 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-5">
                     <div className="w-12 h-12 rounded-xl overflow-hidden border border-blue-500/30 glow-blue flex items-center justify-center bg-slate-800">
                        {post.authorImage ? <img src={post.authorImage} className="w-full h-full object-cover" /> : <User size={20} className="text-slate-600" />}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-lg font-black text-white uppercase">{post.authorName}</span>
                        <span className="mono text-[8px] font-bold text-slate-500 uppercase">{post.timestamp}</span>
                     </div>
                  </div>
                  {userRole === 'admin' && (
                    <button onClick={() => updateData({ posts: data.posts.filter(p => p.id !== post.id) })} className="p-3 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                  )}
               </div>
               {post.contentUrl && (
                 <div className="bg-black/20">
                    {post.type === 'video' ? <video src={post.contentUrl} className="w-full max-h-[500px] object-contain" controls /> : <img src={post.contentUrl} className="w-full max-h-[500px] object-contain" />}
                 </div>
               )}
               <div className="p-8 space-y-8">
                  <p className="text-xl text-slate-300 font-medium italic border-l-4 border-blue-600/20 pl-6 leading-relaxed">"{post.caption}"</p>
                  <div className="flex items-center gap-8 border-t border-white/5 pt-8">
                    <button onClick={() => handleLike(post.id)} className={`flex items-center gap-3 ${post.likedBy.includes(userProfile.name) ? 'text-pink-500' : 'text-slate-500'}`}>
                      <Heart size={20} fill={post.likedBy.includes(userProfile.name) ? "currentColor" : "none"} />
                      <span className="mono text-[10px] font-black">{post.likes}</span>
                    </button>
                    <button onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)} className="flex items-center gap-3 text-slate-500">
                      <MessageSquare size={20} />
                      <span className="mono text-[10px] font-black">{post.comments.length}</span>
                    </button>
                  </div>
                  {activeCommentPost === post.id && (
                    <div className="space-y-6 pt-4">
                      <div className="flex gap-4">
                         <input className="flex-1 bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-blue-500 outline-none" placeholder="Tulis komentar..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)} />
                         <button onClick={() => handleComment(post.id)} className="p-4 bg-blue-600 text-white rounded-2xl"><Send size={18} /></button>
                      </div>
                      {post.comments.map(c => (
                        <div key={c.id} className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0">
                            {c.userImage ? <img src={c.userImage} className="w-full h-full object-cover" /> : <User size={14} className="m-auto text-slate-700" />}
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl flex-1 border border-white/5">
                            <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-black text-white uppercase">{c.userName}</span></div>
                            <p className="text-xs text-slate-400">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MailBoxPage;
