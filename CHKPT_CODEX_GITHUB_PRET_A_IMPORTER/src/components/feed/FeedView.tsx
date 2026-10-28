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
  Filter, SlidersHorizontal
} from 'lucide-react';
import { MediaUploader } from '../common/MediaUploader';
import { PublicationCard } from '../common/PublicationCard';

interface FeedViewProps {
  onSelectPlace: (placeId: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({ onSelectPlace }) => {
  const { 
    currentUser,
    followingIds,
    posts, 
    places, 
    createPost, 
    adCampaigns, 
    selectedZone 
  } = useStore();

  const [feedFilter, setFeedFilter] = useState<'for_you' | 'friends'>('for_you');

  // Local state storing selected place categories (Chip-based multi-toggle)
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>([]);

  const [newPostText, setNewPostText] = useState('');
  const [newPostMediaUrl, setNewPostMediaUrl] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [publishing,setPublishing]=useState(false);
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

  const accessiblePosts = useMemo(() => posts.filter(post =>
    (post.audience === 'public' || post.authorId === currentUser.id || (post.audience === 'followers' && followingIds.includes(post.authorId))) &&
    (feedFilter !== 'friends' || followingIds.includes(post.authorId))
  ), [posts, currentUser.id, feedFilter, followingIds]);

  // Filter posts based on feed type and selected categories
  const filteredPosts = useMemo(() => {
    return accessiblePosts.filter((post) => {

      if (selectedCategories.length === 0) return true;

      const postCat = getPostCategory(post);
      if (postCat && selectedCategories.includes(postCat)) return true;

      return false;
    });
  }, [accessiblePosts, selectedCategories, places]);

  // Post counts per category for the filter chips
  const categoryPostCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of PLACE_CATEGORIES) {
      counts[cat.id] = accessiblePosts.filter(p => getPostCategory(p) === cat.id).length;
    }
    return counts;
  }, [accessiblePosts, places]);

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    setPublishing(true);
    const published=await createPost({
      text: newPostText.trim(),
      mediaUrl: newPostMediaUrl || undefined,
      isVerifiedVisit: false,
    });

    setPublishing(false);
    if(!published)return;
    setNewPostText('');
    setNewPostMediaUrl('');
    setIsCreatingPost(false);
  };

  const activeAd = adCampaigns[0];

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 pt-1 pb-24 space-y-3">
      
      <h1 className="sr-only">Accueil</h1>
      <div role="tablist" aria-label="Fil d’actualité" className="grid grid-cols-2 border-b border-line"
        onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === 'Home' ? 'for_you' : event.key === 'End' ? 'friends' : feedFilter === 'for_you' ? 'friends' : 'for_you';
          setFeedFilter(next);
          event.currentTarget.querySelector<HTMLButtonElement>(`[data-feed="${next}"]`)?.focus();
        }}>
        <button type="button" role="tab" id="feed-for-you" data-feed="for_you" aria-selected={feedFilter === 'for_you'} aria-controls="feed-posts" tabIndex={feedFilter === 'for_you' ? 0 : -1}
          onClick={() => setFeedFilter('for_you')} className={`social-tab py-3 text-sm font-bold cursor-pointer ${feedFilter === 'for_you' ? 'is-active text-ink' : 'text-muted'}`}>Pour toi</button>
        <button type="button" role="tab" id="feed-friends" data-feed="friends" aria-selected={feedFilter === 'friends'} aria-controls="feed-posts" tabIndex={feedFilter === 'friends' ? 0 : -1}
          onClick={() => setFeedFilter('friends')} className={`social-tab py-3 text-sm font-bold cursor-pointer ${feedFilter === 'friends' ? 'is-active text-ink' : 'text-muted'}`}>Amis</button>
      </div>
      <div className="flex justify-end text-xs text-muted">
        <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="feed-filters"
          className="inline-flex items-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-soft cursor-pointer" aria-label="Filtrer les publications"><SlidersHorizontal className="w-3.5 h-3.5" />Filtrer{selectedCategories.length > 0 && <span className="text-blue-400 font-bold">({selectedCategories.length})</span>}</button>
      </div>
      {filtersOpen && <div id="feed-filters"><CategoryFilterBar
        selectedCategories={selectedCategories} onToggleCategory={handleToggleCategory} onClearFilters={handleResetFilters}
        categoryCounts={categoryPostCounts} totalCount={accessiblePosts.length} filteredCount={filteredPosts.length}
        allLabel="Toutes" countUnit="publications" variant="inline" showStatusBanner={true}
      /></div>}

      {/* Create Post Card */}
      <div className="bg-surface/90 border border-line rounded-3xl p-3 sm:p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <SafeImage
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            className="w-10 h-10 rounded-full object-cover shrink-0 border border-line-strong"
          />
          <button
            onClick={() => setIsCreatingPost(true)}
            className="flex-1 bg-canvas hover:bg-soft/80 border border-line rounded-2xl px-3.5 py-2.5 text-left text-xs text-muted transition-colors cursor-pointer"
          >
            Qu’as-tu découvert à {selectedZone} ?
          </button>
        </div>

        {isCreatingPost && (
          <form onSubmit={handlePublishPost} className="mt-3 pt-3 border-t border-line/80 space-y-3">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Partage tes bonnes adresses, tes coups de cœur…"
              rows={3}
              className="w-full bg-canvas border border-line rounded-2xl p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-rose-500"
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
                className="text-xs text-muted hover:text-ink px-3 py-1.5 cursor-pointer"
              >
                Annuler
              </button>
              
              <button
                type="submit"
                disabled={publishing || !newPostText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Publier
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Initial Non-clickable Ad Banner (Section 11 Contractual Compliance) */}
      {activeAd && (
        <section aria-label="Publicité fictive de banque" className="bg-surface border border-line rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between gap-2 text-[10px] text-muted px-3 py-2 font-medium">
            <span className="uppercase tracking-wider">Publicité · Exemple fictif</span>
            <span>Non cliquable</span>
          </div>
          <div className="relative aspect-[2/1] bg-[#07182f]">
            <SafeImage
              src={activeAd.imageUrl}
              alt="Illustration fictive : une entrepreneuse dans un café d’Abidjan, tenant une carte bancaire imaginaire."
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07182f]/95 via-[#07182f]/65 to-transparent" />
            <div className="relative h-full w-[70%] flex flex-col justify-center p-4 sm:p-6 text-white">
              <p className="text-[10px] sm:text-xs font-semibold tracking-wide">{activeAd.advertiserName}</p>
              <h4 className="mt-2 text-xl sm:text-3xl font-bold leading-tight">{activeAd.bannerTitle}</h4>
            </div>
          </div>
          <p className="px-3 py-2 text-[10px] text-muted leading-relaxed">
            {activeAd.bannerSubtitle} Visuel généré par IA. Aucun partenariat réel.
          </p>
        </section>
      )}

      {/* Posts List or Empty Filter State */}
      <div role="tabpanel" id="feed-posts" aria-labelledby={feedFilter === 'for_you' ? 'feed-for-you' : 'feed-friends'}>
      {filteredPosts.length === 0 ? (
        <div className="p-8 text-center bg-surface border border-line rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-canvas border border-line text-muted flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-ink">Aucune publication pour ces types de lieux</h3>
          <p className="text-xs text-muted max-w-xs mx-auto">
            Tu peux changer les filtres ou partager une nouvelle découverte.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-3.5 py-2 bg-soft hover:bg-raised text-body text-xs font-semibold rounded-xl cursor-pointer"
            >
              Réinitialiser les filtres
            </button>

          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map(post => <PublicationCard key={post.id} post={post} onSelectPlace={onSelectPlace} />)}
        </div>
      )}
      </div>
    </div>
  );
};
