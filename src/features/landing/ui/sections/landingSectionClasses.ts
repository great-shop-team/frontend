export const landingSection = {
  breakout: 'relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2',
  section: 'mb-12 md:mb-20 lg:mb-[100px]',
  sectionHeader: 'mb-5 flex items-baseline justify-between gap-3 md:mb-8 md:gap-4',
  sectionTitle:
    'm-0 font-(family-name:--font-unbounded) text-[18px] font-medium tracking-wide text-black/60 md:text-[20px]',
  sectionContent: 'mx-auto w-full max-w-[1280px]',
  productGrid: 'grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3',
  imageGrid: 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5',
  viewAll:
    'inline-flex min-h-11 shrink-0 items-center font-(family-name:--font-pt-sans-caption) text-[14px] font-normal text-dark no-underline transition-opacity hover:opacity-60',
  splitGrid: 'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5',
  duoGrid: 'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5',
  carouselBtn:
    'flex size-10 cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white text-dark transition-colors hover:bg-[#f5f5f5] md:size-9',
  editorialTitle:
    'absolute top-4 left-4 z-1 m-0 max-w-[calc(100%-2rem)] font-(family-name:--font-unbounded) text-sm font-normal md:top-6 md:left-6 md:text-base',
} as const;
