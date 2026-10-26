import { SafeImage } from '../common/SafeImage';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Social Feed View for CHKPT (Pour toi & Amis)
 * Features local category filter state and Chip-Based CategoryFilterBar (Maquis, Cafés, Culture, Bars)
 */

import React, { useState, useMemo } from 'react';
import { useStore } from '../../services/store';
import { PlaceCategory } from '../../types';
import { PLACE_CATEGORIES } from '../../data/categories';
import { CategoryFilterBar } from '../common/CategoryFilterBar';
import { 
  Heart, 
  MessageCircle, 
  CheckCircle2, 
  MapPin, 
  Send, 
  Filter 
} from 'lucide-react';
import { MediaUploader } from '../common/MediaUploader';

interface FeedViewProps {
  onSelectPlace: (placeId: string) => void;
  onOpenCheckin: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({ onSelectPlace, onOpenCheckin }) => {
  const { 
    currentUser, 
    posts, 
    places, 
    likePost, 
    addComment, 
    createPost, 
    adCampaigns, 
    selectedZone 
  } = useStore();

  const [feedFilter, setFeedFilter] = useState<'for_you' | 'friends'>('for_you');

  // Local state storing selected place categories (Chip-based multi-toggle)
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>([]);

  const [newPostText, setNewPostText] = useState('');
  const [newPostMediaUrl, setNewPostMediaUrl] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Toggle category visibility
  const handleToggleCategory = (catId: PlaceCategory) => {
    setSelectedCategories((prev) => {
      if (prev.includes(catId)) {
        return prev.filter((id) => id !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  // Reset category filters
  const handleResetFilters = () => {
    setSelectedCategories([]);
  };

  // Helper to determine category for any post
  const getPostCategory = (post: typeof posts[0]): PlaceCategory | null => {
    if (post.linkedPlaceId) {
      const place = places.find(p => p.id === post.linkedPlaceId);
      if (place) return place.category as PlaceCategory;
    }

    // Heuristic keyword matching for posts without explicit linkedPlaceId
    const lower = post.text.toLowerCase();
    if (lower.includes('maquis') || lower.includes('braisé') || lower.includes('carpe') || lower.includes('alloco') || lower.includes('kédjénou')) {
      return 'maquis';
    }
    if (lower.includes('café') || lower.includes('coffee') || lower.includes('brunch') || lower.includes('croissant') || lower.includes('boulangerie')) {
      return 'cafes_boulangeries';
    }
    if (lower.includes('art') || lower.includes('expo') || lower.includes('galerie') || lower.includes('vernissage') || lower.includes('peinture')) {
      return 'culture_art';
    }
    if (lower.includes('bar') || lower.includes('rooftop') || lower.includes('cocktail') || lower.includes('lounge') || lower.includes('vue lagune')) {
      return 'bars_lounges';
    }
    if (lower.includes('restaurant') || lower.includes('bistronomie') || lower.includes('dîner') || lower.includes('gastronomie')) {
      return 'restaurants';
    }

    return null;
  };

  // Filter posts based on feed type and selected categories
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (post.audience !== 'public' && post.authorId !== currentUser.id) return false;
      if (feedFilter === 'friends' && post.authorId === currentUser.id && posts.length > 1) {
        // Keep friends feed relevant
      }

      if (selectedCategories.length === 0) return true;

      const postCat = getPostCategory(post);
      if (postCat && selectedCategories.includes(postCat)) return true;

      return false;
    });
  }, [posts, feedFilter, selectedCategories, currentUser.id, places]);

  // Post counts per category for the filter chips
  const categoryPostCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of PLACE_CATEGORIES) {
      counts[cat.id] = posts.filter(p => getPostCategory(p) === cat.id).length;
    }
    return counts;
  }, [posts, places]);

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    createPost({
      text: newPostText.trim(),
      mediaUrl: newPostMediaUrl || undefined,
      isVerifiedVisit: false,
    });

    setNewPostText('');
    setNewPostMediaUrl('');
    setIsCreatingPost(false);
  };

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addComment(postId, commentInput.trim());
    setCommentInput('');
  };

  const activeAd = adCampaigns[0];

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-4 space-y-4 pb-24">
      
      <section className="discovery-hero" aria-label="Découvrir Cocody">
        <SafeImage src="/illustrations/maquis.svg" alt="Illustration d'une terrasse de maquis à la tombée du jour" className="discovery-hero__art" />
        <div className="discovery-hero__shade" />
        <div className="discovery-hero__content">
          <span className="eyebrow">COCODY, À VOTRE RYTHME</span>
          <h1>Sors.<br /><span>Check.</span> Partage.</h1>
          <p>Les meilleures découvertes<br />commencent près de vous.</p>
          <button onClick={() => onSelectPlace('plc_maquis_etoile')} className="hero-cta">Découvrir le spot du jour <span aria-hidden="true">↗</span></button>
          <span className="hero-caption">Lieu fictif · illustration de présentation</span>
        </div>
      </section>
      <div className="flex items-end justify-between pt-2"><div><span className="eyebrow text-blue-300">LA VILLE SE RACONTE</span><h2 className="text-xl font-bold mt-1">Dans la boucle</h2></div><span className="text-xs text-slate-400">Cocody · Abidjan</span></div>
      {/* Feed Tabs: Pour toi / Amis */}
      <div className="flex border-b border-slate-900 gap-4">
        <button
          onClick={() => setFeedFilter('for_you')}
          className={`pb-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
            feedFilter === 'for_you'
              ? 'border-rose-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Pour toi ({selectedZone})
        </button>
        <button
          onClick={() => setFeedFilter('friends')}
          className={`pb-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
            feedFilter === 'friends'
              ? 'border-rose-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Amis & Abonnés
        </button>
      </div>

      {/* Chip-Based Category Filter Bar */}
      <CategoryFilterBar
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
        onClearFilters={handleResetFilters}
        categoryCounts={categoryPostCounts}
        totalCount={posts.length}
        filteredCount={filteredPosts.length}
        allLabel="Toutes"
        countUnit="publications"
        variant="inline"
        showStatusBanner={true}
      />

      {/* Create Post Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 sm:p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <SafeImage
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-700"
          />
          <button
            onClick={() => setIsCreatingPost(true)}
            className="flex-1 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-left text-xs text-slate-400 transition-colors cursor-pointer"
          >
            Qu'avez-vous découvert à {selectedZone} ?
          </button>
        </div>

        {isCreatingPost && (
          <form onSubmit={handlePublishPost} className="mt-3 pt-3 border-t border-slate-800/80 space-y-3">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Partagez vos bonnes adresses, vos coups de cœur..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />

            <MediaUploader
              initialMediaUrl={newPostMediaUrl}
              onMediaUploaded={(url) => setNewPostMediaUrl(url)}
              onMediaCleared={() => setNewPostMediaUrl('')}
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsCreatingPost(false);
                  setNewPostText('');
                  setNewPostMediaUrl('');
                }}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 cursor-pointer"
              >
                Annuler
              </button>
              
              <button
                type="submit"
                disabled={!newPostText.trim()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Publier
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Initial Non-clickable Ad Banner (Section 11 Contractual Compliance) */}
      {activeAd && (
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3 overflow-hidden relative">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 font-medium">
            <span className="uppercase tracking-wider">Publicité · Régie RED LOOP</span>
            <span className="text-slate-400">Non cliquable</span>
          </div>
          <div className="flex items-center gap-3">
            <SafeImage
              src={activeAd.imageUrl}
              alt={activeAd.advertiserName}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-rose-400 block truncate">
                {activeAd.advertiserName}
              </span>
              <h4 className="text-xs font-bold text-white leading-tight mt-0.5">
                {activeAd.bannerTitle}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {activeAd.bannerSubtitle}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Posts List or Empty Filter State */}
      {filteredPosts.length === 0 ? (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Aucune publication pour ces types de lieux</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Soyez le premier à explorer un lieu de cette catégorie et à partager votre visite vérifiée !
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Afficher toutes les publications
            </button>
            <button
              onClick={onOpenCheckin}
              className="px-3.5 py-2 bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              Faire un check-in
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const linkedPlace = post.linkedPlaceId ? places.find(p => p.id === post.linkedPlaceId) : null;

            return (
              <article
                key={post.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm"
              >
                {/* Post Header */}
                <div className="p-3.5 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SafeImage
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{post.authorName}</span>
                        <span className="text-[10px] text-slate-400">@{post.authorUsername}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{post.createdAt}</span>
                    </div>
                  </div>

                  {post.isVerifiedVisit && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{post.isSimulated ? 'Visite simulée · démo' : 'Visite vérifiée'}</span>
                    </span>
                  )}
                </div>

                {/* Linked Place Tag */}
                {post.linkedPlaceName && (
                  <div className="px-4 pb-2">
                    <button
                      onClick={() => post.linkedPlaceId && onSelectPlace(post.linkedPlaceId)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{post.linkedPlaceName}</span>
                    </button>
                  </div>
                )}

                {/* Text */}
                <div className="px-4 pb-3">
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                    {post.text}
                  </p>
                </div>

                {/* Media */}
                {post.mediaUrl && (
                  <div className="aspect-video w-full bg-slate-950 overflow-hidden">
                    <SafeImage
                      src={post.mediaUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Actions Footer */}
                <div className="p-3 sm:p-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => likePost(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        post.isLikedByCurrentUser
                          ? 'text-rose-500'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLikedByCurrentUser ? 'fill-current' : ''}`} />
                      <span>{post.likesCount}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </button>
                  </div>

                  {linkedPlace && (
                    <button
                      onClick={() => onSelectPlace(linkedPlace.id)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                    >
                      Voir la fiche du lieu →
                    </button>
                  )}
                </div>

                {/* Comments Section */}
                {activeCommentPostId === post.id && (
                  <div className="p-3.5 bg-slate-950/60 border-t border-slate-800/80 space-y-2.5">
                    {post.comments.length > 0 && (
                      <div className="space-y-2">
                        {post.comments.map((c) => (
                          <div key={c.id} className="text-xs text-slate-300 flex items-start gap-2">
                            <SafeImage src={c.authorAvatar} alt="" className="w-5 h-5 rounded-md object-cover mt-0.5" />
                            <div>
                              <span className="font-bold text-white mr-1.5">{c.authorName}:</span>
                              <span>{c.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                        placeholder="Ajouter un commentaire..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                      />
                      <button
                        onClick={() => handleSendComment(post.id)}
                        className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

    </div>
  );
};
