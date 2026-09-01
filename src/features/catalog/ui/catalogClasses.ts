export const catalogSection = {
  banner:
    'relative left-1/2 mb-4 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden bg-cover bg-center bg-no-repeat after:pointer-events-none after:absolute after:inset-0 after:bg-black/20 max-md:h-[min(70dvh,520px)] max-md:bg-[center_22%] md:mb-6 md:h-[clamp(520px,59.03vw,850px)] md:bg-[center_18%]',
  bannerContent:
    'layout-gutter relative z-1 mx-0 mr-auto box-border flex h-full w-full max-w-[600px] flex-col justify-end pb-10 pt-[calc(var(--site-header-offset)+16px)] md:justify-center md:pt-[calc(var(--site-header-offset)+24px)] md:pb-16',
  bannerTitle:
    'm-0 mb-3 max-w-[560px] font-(family-name:--font-unbounded) text-[28px] leading-[1.15] font-bold text-white md:mb-6 md:text-4xl',
  bannerDescription:
    'm-0 mb-5 max-w-[36rem] text-sm leading-relaxed text-white md:mb-8 md:text-base',
} as const;

export const catalogPage = {
  content: 'scroll-mt-[var(--site-header-offset)]',
  breadcrumbs: 'mb-6 md:mb-8',
} as const;

export const catalogToolbar = {
  root: 'mb-6 flex flex-col gap-3 md:mb-[60px] md:flex-row md:items-center md:justify-between',
  controls: 'flex w-full items-center justify-between gap-2 md:w-auto md:justify-start md:gap-8',
  control:
    'inline-flex min-h-11 min-w-0 cursor-pointer items-center border-0 bg-transparent px-1 text-left text-sm md:max-w-none md:px-4 md:text-base [&_svg]:ml-1.5 [&_svg]:shrink-0 md:[&_svg]:ml-2.5',
  stylesCount: 'text-sm font-light text-dark/70 md:text-base md:text-dark',
} as const;

export const catalogFilterPanel = {
  overlay: 'fixed inset-0 z-120',
  backdrop: 'absolute inset-0 border-none bg-black/40 transition-opacity',
  aside:
    'absolute inset-y-0 right-0 flex h-full w-full max-w-full flex-col bg-white text-black shadow-[-8px_0_32px_rgb(0_0_0/12%)] transition-transform duration-300 ease-out md:w-[min(100%,420px)]',
  header: 'flex h-16 shrink-0 items-center justify-between gap-3 px-5 md:px-6',
  title: 'm-0 text-xl font-medium md:text-[22px]',
  closeBtn:
    'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-black',
  body: 'min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 md:px-6',
  footer:
    'shrink-0 space-y-3 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-6 md:pb-6',
  applyBtn:
    'flex h-12 w-full cursor-pointer items-center justify-center rounded-[10px] border border-black bg-black text-base font-medium text-white',
  clearBtn:
    'flex h-12 w-full cursor-pointer items-center justify-center rounded-[10px] border border-black bg-white text-base font-medium text-black',
  accordionBtn:
    'flex w-full min-h-14 cursor-pointer items-center justify-between gap-3 border-none bg-transparent px-0 py-3 text-left text-base font-medium text-black',
  optionList: 'm-0 flex list-none flex-col gap-1 px-0 pt-0 pb-4',
  optionLabel: 'flex min-h-11 cursor-pointer items-center gap-3 text-[15px] leading-none text-black',
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
