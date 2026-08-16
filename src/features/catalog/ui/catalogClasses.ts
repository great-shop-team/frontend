export const catalogSection = {
  banner:
    'relative left-1/2 mb-8 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden bg-cover bg-center bg-no-repeat after:pointer-events-none after:absolute after:inset-0 after:bg-black/20 max-md:h-[min(70dvh,520px)] max-md:bg-[center_22%] md:mb-20 md:h-[clamp(520px,59.03vw,850px)] md:bg-[center_18%]',
  bannerContent:
    'layout-gutter relative z-1 mx-0 mr-auto box-border flex h-full w-full max-w-[600px] flex-col justify-end pb-10 pt-[calc(var(--site-header-offset)+16px)] md:justify-center md:pt-[calc(var(--site-header-offset)+24px)] md:pb-16',
  bannerTitle:
    'm-0 mb-3 max-w-[560px] font-(family-name:--font-unbounded) text-[28px] leading-[1.15] font-bold text-white md:mb-6 md:text-4xl',
  bannerDescription:
    'm-0 mb-5 max-w-[36rem] text-sm leading-relaxed text-white md:mb-8 md:text-base',
} as const;

export const catalogPage = {
  content: 'scroll-mt-[var(--site-header-offset)]',
} as const;

export const catalogToolbar = {
  root: 'mb-6 flex flex-col gap-3 md:mb-[60px] md:flex-row md:items-center md:justify-between',
  controls: 'flex w-full items-center justify-between gap-2 md:w-auto md:justify-start md:gap-8',
  control:
    'inline-flex min-h-11 min-w-0 cursor-pointer items-center border-0 bg-transparent px-1 text-left text-sm md:max-w-none md:px-4 md:text-base [&_svg]:ml-1.5 [&_svg]:shrink-0 md:[&_svg]:ml-2.5',
  stylesCount: 'text-sm font-light text-dark/70 md:text-base md:text-dark',
} as const;

export const catalogGrid = {
  root: 'grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3',
} as const;

export const catalogProductCard = {
  root: 'flex w-full min-w-0 max-w-[413px] flex-col',
  imageWrap: 'relative aspect-258/387 h-full shrink-0 overflow-hidden',
  addToCartBtn:
    'absolute right-2 bottom-2 flex h-10 w-10 items-center justify-center rounded-full border-none bg-black text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-[#C4C4C4] disabled:text-white/70 disabled:hover:bg-[#C4C4C4] md:right-4 md:bottom-4',
  meta: 'mb-3 flex items-start justify-between gap-2 md:mb-4',
  stockStatus: 'mt-2 min-h-4 text-xs font-light text-gray md:mt-3',
} as const;

export const catalogLoadMore = {
  root: 'mt-12 text-center md:mt-30',
  summary: 'mb-6 font-light md:mb-15',
  button: 'btn-primary mx-auto',
} as const;
