// Proposition non exécutée : vérifier l'autorisation et les règles du service choisi.
// Rectangle indicatif, pas la limite administrative officielle de Cocody.
[out:json][timeout:25][bbox:5.33,-4.04,5.43,-3.90];
(
  nwr["amenity"~"^(restaurant|fast_food|cafe|bar|pub|nightclub|arts_centre|events_venue|community_centre)$"];
  nwr["tourism"~"^(hotel|guest_house|museum|gallery|attraction|artwork)$"];
  nwr["shop"="bakery"];
  nwr["historic"];
  nwr["leisure"="dance"];
);
out center meta;
