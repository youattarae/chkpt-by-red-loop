/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Shared Place Category Definitions for MapView & FeedView Filtering
 */

import { PlaceCategory } from '../types';

export interface CategoryFilterItem {
  id: PlaceCategory;
  label: string;
  shortLabel: string;
  iconName: 'Flame' | 'Coffee' | 'Palette' | 'Wine' | 'Utensils';
  description: string;
  color: string;
}

export const PLACE_CATEGORIES: CategoryFilterItem[] = [
  {
    id: 'maquis',
    label: 'Maquis & Grillades',
    shortLabel: 'Maquis',
    iconName: 'Flame',
    description: 'Poissons et poulets braisés, alloco et kédjénous traditionnels',
    color: 'rose',
  },
  {
    id: 'cafes_boulangeries',
    label: 'Cafés & Torréfacteurs',
    shortLabel: 'Cafés',
    iconName: 'Coffee',
    description: 'Coffee shops artisanaux, brunchs et viennoiseries pur beurre',
    color: 'amber',
  },
  {
    id: 'culture_art',
    label: 'Culture & Art',
    shortLabel: 'Culture',
    iconName: 'Palette',
    description: 'Galeries d\'art contemporain, centres culturels et céramique',
    color: 'purple',
  },
  {
    id: 'bars_lounges',
    label: 'Bars & Rooftops',
    shortLabel: 'Bars',
    iconName: 'Wine',
    description: 'Rooftops panoramiques, cocktails et terrasses face lagune',
    color: 'blue',
  },
  {
    id: 'restaurants',
    label: 'Restaurants & Bistronomie',
    shortLabel: 'Restaurants',
    iconName: 'Utensils',
    description: 'Haute gastronomie, tables bistronomiques et fusion',
    color: 'emerald',
  },
];
