export const catalogSection = {
  banner:
    'relative -mx-[calc(50vw-50%)] mb-20 h-[clamp(520px,59.03vw,850px)] w-screen overflow-hidden bg-cover bg-center bg-no-repeat after:pointer-events-none after:absolute after:inset-0 after:bg-black/20 max-md:bg-[center_22%] md:bg-[center_18%]',
  bannerContent:
    'layout-gutter relative z-1 mx-0 mr-auto box-border flex h-full w-full max-w-[600px] flex-col justify-center pt-[calc(--site-header-height+24px)] pb-16',
  bannerTitle:
    'm-0 mb-6 max-w-[560px] font-(family-name:--font-unbounded) text-4xl leading-[1.15] font-bold text-white max-md:text-[36px]',
  bannerDescription: 'm-0 mb-8 text-base leading-relaxed text-white',
} as const;

export const catalogPage = {
  content: 'scroll-mt-(--site-header-height)',
} as const;

export const catalogToolbar = {
  root: 'mb-[60px] flex items-center justify-between',
  controls: 'flex items-center gap-8',
  control: 'flex cursor-pointer border-0 bg-transparent px-4 text-inherit [&_svg]:ml-2.5',
  stylesCount: 'font-light',
} as const;

export const catalogGrid = {
  root: 'grid grid-cols-3 items-stretch gap-5',
} as const;

export const catalogProductCard = {
  root: 'flex h-full w-full max-w-[413px] flex-col',
  body: 'flex flex-1 flex-col',
  footer: 'mt-auto flex flex-col',
  title:
    'line-clamp-2 min-h-[2.75rem] text-base leading-snug font-normal [overflow-wrap:anywhere]',
  sizes: 'mt-3 flex min-h-[46px] flex-wrap content-start gap-2',
  actions: 'mt-3',
  moreColoursSpacer: 'block h-12 w-[170px] max-w-full',
  imageArea:
    'relative mx-auto mb-4 flex aspect-258/387 w-full max-w-[280px] items-center justify-center bg-[#FAFAFA]',
  imageWrap: 'relative aspect-258/387 h-full shrink-0 overflow-hidden',
  addToCartBtn:
    'absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full border-none bg-black text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-[#C4C4C4] disabled:text-white/70 disabled:hover:bg-[#C4C4C4]',
  meta: 'mb-4 flex items-start justify-between gap-3',
  stockStatus: 'mt-2 min-h-4 text-xs font-light text-gray',
} as const;

export const catalogLoadMore = {
  root: 'mt-30 text-center',
  summary: 'mb-15 font-light',
  button: 'btn-primary mx-auto',
} as const;
