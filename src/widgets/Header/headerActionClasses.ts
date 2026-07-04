export const headerBarTextClass =
  'font-(family-name:--font-unbounded) text-base font-normal leading-5';

export const headerActionBaseClass =
  'inline-flex h-10 w-10 items-center justify-center text-inherit transition-[border-color] duration-300 ease-in-out';

export function getHeaderActionClass(isActive: boolean) {
  return `${headerActionBaseClass} ${
    isActive ? 'border-b border-current' : 'border-b-0 hover:border-b hover:border-current'
  }`;
}

export function isActivePath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
