import React from 'react';

/** Local illustration fallback; uploaded/private media keep their original URL. */
export function SafeImage({ onError, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img decoding="async" {...props} onError={event => {
    onError?.(event);
    const image = event.currentTarget;
    if (!image.dataset.fallback) {
      image.dataset.fallback = 'true';
      image.src = '/illustrations/maquis.svg';
    }
  }} />;
}
