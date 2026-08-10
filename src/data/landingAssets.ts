export const landingHeroSlides = [
  { id: 'lessNoise', video: '/video/v1.mp4', href: '/catalog' },
  { id: 'builtDifferent', video: '/video/v2.mp4', href: '/catalog' },
  { id: 'quietConfidence', video: '/video/v3.mp4', href: '/catalog' },
  { id: 'madeForMovement', video: '/video/v4.mp4', href: '/catalog' },
  { id: 'lessTrend', video: '/video/v5.mp4', href: '/catalog' },
] as const;

export const landingClothingItems = [
  {
    id: 'w-cloth-001',
    href: '/catalog/women/w-cloth-001',
    image: { src: '/images/Landing/Essential%20Oversized%20T-Shirt.png' },
  },
  {
    id: 'w-cloth-002',
    href: '/catalog/women/w-cloth-002',
    image: { src: '/images/Landing/Rose%20Oversized%20T-Shirt.png' },
  },
  {
    id: 'w-cloth-004',
    href: '/catalog/women/w-cloth-004',
    image: { src: '/images/Landing/Heritage%20Graphic%20T-Shirt.png' },
  },
] as const;

export const landingShopByItems = [
  {
    id: 'women',
    href: '/catalog/women',
    image: { src: '/images/Landing/women.png' },
  },
  {
    id: 'men',
    href: '/catalog/men',
    image: { src: '/images/Landing/men.png' },
  },
  {
    id: 'perfumes',
    href: '/catalog/accessories?subcategory=fragrances',
    image: { src: '/images/Landing/perfumes.png' },
  },
  {
    id: 'accessories',
    href: '/catalog/accessories',
    image: { src: '/images/Landing/accessories.png' },
  },
] as const;

export const landingFeaturedFrames = {
  lookEditorial: {
    src: '/images/Landing/Frame1@2x.png',
    href: '/catalog/women',
  },
  lookProduct: {
    id: 'm-cloth-010',
    href: '/catalog/men/m-cloth-010',
    image: { src: '/images/Landing/Frame2.png' },
  },
  scentProduct: {
    id: 'a-frag-007',
    href: '/catalog/fragrances/a-frag-007',
    image: { src: '/images/Landing/Frame3.png' },
  },
  scentEditorial: {
    src: '/images/Landing/Frame4@2x.png',
    href: '/catalog/accessories?subcategory=fragrances',
  },
} as const;

export const landingFeaturedLook = {
  editorial: { src: '/images/Landing/Frame1@2x.png' },
  product: {
    id: 'w-cloth-007',
    href: '/catalog/women/w-cloth-007',
    image: { src: '/images/Landing/Frame2.png' },
  },
} as const;

export const landingFeaturedFragrance = {
  editorial: { src: '/images/Landing/Frame4@2x.png' },
  product: {
    id: 'a-frag-002',
    href: '/catalog/fragrances/a-frag-002',
    image: { src: '/images/Landing/Frame3.png' },
  },
} as const;

export const landingWearlyItems = [
  {
    id: 'container1',
    href: '/catalog/women',
    image: { src: '/images/Landing/Container1@2x.png' },
  },
  {
    id: 'container2',
    href: '/catalog/men',
    image: { src: '/images/Landing\/Container2@2x.png' },
  },
  {
    id: 'container3',
    href: '/catalog/women',
    image: { src: '/images/Landing\/Container3@2x.png' },
  },
  {
    id: 'container4',
    href: '/catalog/accessories',
    image: { src: '/images/Landing\/Container4@2x.png' },
  },
] as const;

export const landingStreetStyleItems = [
  {
    id: 'streetOne',
    href: '/catalog/women',
    image: { src: '/images/Landing/Frame1@2x.png' },
  },
  {
    id: 'streetTwo',
    href: '/catalog/men',
    image: { src: '/images/frontViewhoodieBrown.png' },
  },
  {
    id: 'streetThree',
    href: '/catalog/men',
    image: { src: '/images/backViewhoodieBrown.png' },
  },
] as const;

export const landingPromoDuoItems = [
  {
    id: 'nike',
    href: '/brands',
    image: { src: '/images/Landing/LinkCardLarge@2x.png' },
  },
  {
    id: 'ysl',
    href: '/catalog/accessories?subcategory=fragrances',
    image: { src: '/images/Landing/LinkCardLarge2@2x.png' },
  },
] as const;

export const landingCampaignImage = {
  src: '/images/Landing/Frame5@2x.png',
  href: '/catalog/accessories?subcategory=eyewear',
} as const;

export const landingEyewear = {
  editorial: {
    src: '/images/Landing/Frame6@2x.png',
    href: '/catalog/accessories/a-eye-001',
  },
  product: {
    id: 'a-eye-001',
    href: '/catalog/accessories/a-eye-001',
    image: { src: '/images/Landing/Frame7.png' },
  },
} as const;

export const landingPressItems = [
  {
    id: 'pressOne',
    image: { src: '/images/Landing/Rectangle1.png' },
    href: 'https://www.instagram.com/',
  },
  {
    id: 'pressTwo',
    image: { src: '/images/Landing/Rectangle2.png' },
    href: 'https://www.instagram.com/',
  },
  {
    id: 'pressThree',
    image: { src: '/images/Landing/Rectangle3.png' },
    href: 'https://www.instagram.com/',
  },
  {
    id: 'pressFour',
    image: { src: '/images/Landing/Rectangle4.png' },
    href: 'https://www.instagram.com/',
  },
] as const;

/** @deprecated kept for any leftover imports */
export const landingFragranceItems = [
  {
    id: 'tobaccoVanille',
    image: { src: '/images/Landing/TobaccoVanille.png' },
    sizes: ['10 ml', '50 ml', '100 ml'],
  },
  {
    id: 'lostCherry',
    image: { src: '/images/Landing/LostCherry.png' },
    sizes: ['10 ml', '50 ml', '100 ml'],
  },
  {
    id: 'vanillaSex',
    image: { src: '/images/Landing/VanillaSex.png' },
    sizes: ['10 ml', '50 ml', '100 ml'],
  },
] as const;

export const landingCategoryItems = [
  {
    id: 'urbanEssentials',
    href: '/catalog',
    image: { src: '/images/Landing/Frame2.png' },
    thumb: { src: '/images/Landing/Frame3.png' },
  },
  {
    id: 'oversizedTailoring',
    href: '/catalog',
    image: { src: '/images/Landing/Frame1@2x.png' },
    thumb: { src: '/images/Landing/Frame4@2x.png' },
  },
] as const;

export const landingLifestyleImage = {
  src: '/images/Landing/Frame5@2x.png',
} as const;
