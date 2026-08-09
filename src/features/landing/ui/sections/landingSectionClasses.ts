export const landingSection = {
  breakout: 'w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]',
  section: 'mb-16 md:mb-20 lg:mb-[100px]',
  sectionHeader: 'mb-6 flex items-baseline justify-between gap-4 md:mb-8',
  sectionTitle:
    'm-0 font-(family-name:--font-unbounded) text-[20px] font-medium tracking-wide text-black/60',
  sectionContent: 'mx-auto w-full max-w-[1280px]',
  productGrid: 'grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3',
  imageGrid: 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5',
  viewAll:
    'shrink-0 font-(family-name:--font-pt-sans-caption) text-[14px] font-normal text-dark no-underline transition-opacity hover:opacity-60',
  splitGrid: 'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5',
  duoGrid: 'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5',
} as const;
