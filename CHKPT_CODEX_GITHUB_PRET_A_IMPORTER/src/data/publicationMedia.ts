// Upgrade only the prototype's own illustration paths, including cached seed posts.
// Imported media, private API URLs and personal publications keep their original URL.
const replacements = new Map([
  ['/illustrations/maquis.svg', '/illustrations/maquis-demo.png'],
  ['/illustrations/rooftop.svg', '/illustrations/rooftop-demo.png'],
  ['/illustrations/art.svg', '/illustrations/culture-demo.png'],
]);
const generated = new Set([...replacements.values(), '/illustrations/maquis-braise-demo.png', '/illustrations/maquis-boissons-demo.png', '/illustrations/maquis-soiree-demo.png']);

export function publicationImage(source?: string) {
  return source ? replacements.get(source) ?? source : undefined;
}

export function isGeneratedPublicationImage(source?: string) {
  return !!source && generated.has(source);
}
