import { SafeImage } from './SafeImage';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Secure Media Uploader Component with EXIF Purging on Canvas 2D
 */

import React, { useState, useRef } from 'react';
import { Camera, UploadCloud, X, Check, Loader2, ShieldCheck } from 'lucide-react';
import { useStore } from '../../services/store';

interface MediaUploaderProps {
  initialMediaUrl?: string;
  onMediaUploaded: (url: string) => void;
  onMediaCleared?: () => void;
  label?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  initialMediaUrl,
  onMediaUploaded,
  onMediaCleared,
  label = 'Photo (EXIF GPS purgé automatiquement)',
}) => {
  const { authSessionToken, currentUser } = useStore();
  const [previewUrl, setPreviewUrl] = useState<string>(initialMediaUrl || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Reads raw file, renders onto HTML5 Canvas 2D to purge EXIF (GPS tags),
   * compresses to max 1920px HD, and uploads to server
   */
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to redraw pixels and eliminate EXIF metadata
        const canvas = document.createElement('canvas');
        const maxDim = 1920;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setErrorMsg('Impossible de traiter l\'image sur ce navigateur.');
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP / JPEG without original metadata
        const sanitizedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        setPreviewUrl(sanitizedBase64);

        // Upload to server
        fetch('/api/media/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authSessionToken}`,
          },
          body: JSON.stringify({
            dataBase64: sanitizedBase64,
            mimeType: 'image/jpeg',
            audience: currentUser.visibility === 'private' ? 'private' : 'public',
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.readUrl) {
              onMediaUploaded(data.readUrl);
            } else {
              // Fallback to sanitized client base64 preview
              onMediaUploaded(sanitizedBase64);
            }
          })
          .catch(() => {
            onMediaUploaded(sanitizedBase64);
          })
          .finally(() => {
            setIsProcessing(false);
          });
      };
      img.onerror = () => {
        setErrorMsg('Fichier image invalide ou illisible.');
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreviewUrl('');
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onMediaCleared) onMediaCleared();
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
        <span>{label}</span>
        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-normal">
          <ShieldCheck className="w-3 h-3" />
          <span>Purge EXIF native</span>
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group aspect-video max-h-48">
          <SafeImage src={previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] text-white backdrop-blur-sm flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Image sécurisée & optimisée</span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="w-full p-4 border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/60 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
        >
          {isProcessing ? (
            <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
          ) : (
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-medium">Ajouter une photo de la visite</span>
            </div>
          )}
          <span className="text-[10px] text-slate-400">
            JPG, PNG ou WebP · Nettoyage automatique des métadonnées de géolocalisation
          </span>
        </button>
      )}

      {errorMsg && (
        <p className="text-[11px] text-rose-400">{errorMsg}</p>
      )}
    </div>
  );
};
