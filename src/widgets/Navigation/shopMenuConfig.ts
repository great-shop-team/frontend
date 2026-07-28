import { catalogRoutes } from '@/features/catalog/config/catalogRoutes';

export type ShopMenuLink = {
  labelKey: string;
  href: string;
};

export type ShopMenuColumn = {
  titleKey: string;
  links: ShopMenuLink[];
};

export const shopMenuColumns: ShopMenuColumn[] = [
  {
    titleKey: 'shop',
    links: [
      { labelKey: 'allProducts', href: catalogRoutes.index },
      { labelKey: 'newArrivals', href: catalogRoutes.newArrivals },
      { labelKey: 'bestsellers', href: catalogRoutes.sales },
      { labelKey: 'giftCard', href: catalogRoutes.accessories },
    ],
  },
  {
    titleKey: 'category',
    links: [
      { labelKey: 'women', href: catalogRoutes.women },
      { labelKey: 'men', href: catalogRoutes.men },
      { labelKey: 'perfumes', href: catalogRoutes.perfumes },
      { labelKey: 'accessories', href: catalogRoutes.accessories },
      { labelKey: 'sport', href: catalogRoutes.sport },
    ],
  },
  {
    titleKey: 'type',
    links: [
      { labelKey: 'clothing', href: catalogRoutes.womenClothing },
      { labelKey: 'shoes', href: catalogRoutes.shoes },
      { labelKey: 'bags', href: catalogRoutes.bags },
      { labelKey: 'jewellery', href: catalogRoutes.jewellery },
      { labelKey: 'beauty', href: catalogRoutes.beauty },
    ],
  },
];

export const shopMenuTiles = [
  {
    labelKey: 'womenTile',
    href: catalogRoutes.women,
    className: 'text-white',
    background: '/images/Mega/Women.svg',
  },
  {
    labelKey: 'menTile',
    href: catalogRoutes.men,
    className: 'text-white',
    background: '/images/Mega/Men.svg',
  },
] as const;
