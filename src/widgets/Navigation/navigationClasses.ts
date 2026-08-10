export const headerNav = {
  list: 'flex items-center gap-10',
  link: 'inline-flex items-center pb-0.5 transition-[border-color] duration-300 ease-in-out',
  linkInactive: 'border-b-0 hover:border-b hover:border-current',
  linkActive: 'border-b border-current',
  megaMenuTrigger: 'relative',
  megaMenuWrap: 'fixed right-0 left-0 top-[calc(var(--site-header-height)-24px)] z-100 pt-15',
  megaMenuPanel: 'border-t border-black/5 bg-white text-dark shadow-[0_12px_32px_rgb(0_0_0/8%)]',
  megaMenuInner:
    'mx-auto box-border w-full max-w-(--layout-max-width) px-(--header-padding-x) py-10',
  shopGrid: 'grid grid-cols-[repeat(3,minmax(0,140px))_1fr] gap-12',
  shopColumnTitle: 'mb-4 text-xs font-semibold tracking-[0.12em] uppercase text-gray',
  shopColumnList: 'flex flex-col gap-2.5',
  shopTypeColumns: 'grid gap-x-8 gap-y-2 sm:gap-y-0',
  shopTypeColumnList: 'grid gap-2.5 min-w-[180px] w-full',
  shopTypeLink:
    'block w-full text-sm font-normal text-dark transition-colors hover:text-dark/70 hover:opacity-60 cursor-pointer',
  shopColumnLink:
    'inline-flex items-center pb-0.5 transition-[border-color] duration-300 ease-in-out hover:opacity-60 cursor-pointer',
  shopTiles: 'flex justify-end gap-4',
  shopTile:
    'relative flex h-[280px] w-[200px] items-end overflow-hidden rounded-sm p-4 text-sm font-medium transition-opacity hover:opacity-90',
  brandsLayout: 'flex flex-col',
  brandsGrid: 'grid grid-cols-5 gap-12',
  brandsFooter: 'mt-8 w-full border-t border-dark/15 pt-5',
  shopColumnFooter: 'mt-6 border-t border-dark/15 pt-4',
} as const;

export function getNavLinkClass(isActive: boolean) {
  return `${headerNav.link} ${isActive ? headerNav.linkActive : headerNav.linkInactive}`;
}
