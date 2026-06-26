export const catalogNavMenu = {
  trigger: 'relative',
  dropdown: 'absolute top-full left-1/2 z-100 -translate-x-1/2 pt-2',
  panel:
    'min-w-[232px] rounded-md border border-black/8 bg-white px-1.5 py-3 text-dark shadow-[0_12px_40px_rgb(0_0_0/10%)]',
  panelList: 'flex flex-col gap-0.5',
  panelLink:
    'block rounded-sm px-4 py-2 text-[13px] font-normal tracking-wide text-dark/90 transition-colors hover:bg-neutral-100 hover:text-dark',
  panelLinkActive: 'bg-neutral-100 font-medium text-dark',
  divider: 'mx-3 my-2.5 border-t border-black/8',
  tagLink:
    'flex items-center gap-2.5 rounded-sm px-4 py-2 text-[13px] font-normal tracking-wide text-dark/85 transition-colors hover:bg-neutral-100 hover:text-dark',
  tagEmoji: 'text-[15px] leading-none',
} as const;
