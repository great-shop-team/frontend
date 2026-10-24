'use client';

import Link from 'next/link';

import { useTranslation } from '@/i18n/useTranslation';
import { useGetProductsQuery } from '@/store/endpoints/productsEndpoints';

const MONTHS = {
  uk: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
} as const;

const STATS = [
  {
    key: 'revenue',
    value: '$00 000',
    delta: '+10.0%',
    up: true,
    className: 'bg-[#3d6bff] text-white',
    deltaClass: 'text-white/90',
  },
  {
    key: 'customers',
    value: '0 000',
    delta: '+1.5%',
    up: true,
    className: 'bg-[#c6f34d] text-[#1d2433]',
    deltaClass: 'text-[#1d2433]',
  },
  {
    key: 'transactions',
    value: '00 000',
    delta: '+3.6%',
    up: true,
    className: 'bg-[#e4d6ff] text-[#1d2433]',
    deltaClass: 'text-[#1d2433]',
  },
  {
    key: 'totalProducts',
    value: '0 000',
    delta: '-1.5%',
    up: false,
    className: 'bg-[#fff3b0] text-[#1d2433]',
    deltaClass: 'text-[#ef4444]',
  },
] as const;

export default function AdminOverview() {
  const { t, locale } = useTranslation();
  const products = useGetProductsQuery();
  const months = locale === 'uk' ? MONTHS.uk : MONTHS.en;
  const popular = (products.data ?? []).slice(0, 4);
  const labels = {
    revenue: t.admin.revenue,
    customers: t.admin.customers,
    transactions: t.admin.transactions,
    totalProducts: t.admin.totalProducts,
  };

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
      <div>
        <h1 className="m-0 text-[26px] leading-tight font-bold">{t.admin.dashboard}</h1>
        <p className="m-0 mt-1 text-sm text-[#9aa1ad]">{t.admin.dashboard}</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <article key={stat.key} className={`rounded-2xl px-5 py-4 shadow-[0_8px_24px_rgb(30_41_59/6%)] ${stat.className}`}>
            <div className="flex items-start justify-between gap-3 text-sm font-medium">
              <span>{labels[stat.key]}</span>
              <NorthEastIcon />
            </div>
            <div className="mt-6 flex items-end justify-between gap-3">
              <p className="m-0 text-[28px] leading-none font-bold tracking-tight whitespace-nowrap">{stat.value}</p>
              <p className={`m-0 text-right text-xs leading-tight ${stat.deltaClass}`}>
                <span className="font-semibold">{stat.up ? '↗' : '↘'} {stat.delta}</span>
                <span className="mt-1 block opacity-80">{t.admin.lastWeek}</span>
              </p>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-2xl bg-white px-5 py-4 shadow-[0_8px_24px_rgb(30_41_59/6%)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="m-0 text-base font-bold">{t.admin.salesYear}</h2>
          <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-[#6b7280] no-underline">
            {t.admin.showAll} <NorthEastIcon />
          </Link>
        </div>
        <div className="mb-2 flex flex-wrap gap-4 text-xs text-[#6b7280]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#c6f34d]" />
            {t.admin.avgCheck}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#3d6bff]" />
            {t.admin.avgItems}
          </span>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute top-2 left-2 z-1 rounded-lg border border-dashed border-[#d5dbe6] bg-white/80 px-3 py-2 text-[11px] text-[#9aa1ad]">
            {t.admin.avgItems}
            <span className="mt-1 block text-sm font-semibold text-[#1d2433]">000</span>
          </div>
          <div className="pointer-events-none absolute top-2 left-44 z-1 rounded-lg bg-[#d9f99d] px-3 py-2 text-[11px] text-[#3f6212]">
            {t.admin.avgCheck}
            <span className="mt-1 block text-sm font-bold text-[#1d2433]">$ 0 000</span>
          </div>
          <SalesChart />
        </div>
        <div className="mt-2 grid grid-cols-12 text-center text-[11px] text-[#b0b6c3]">
          {months.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white px-5 py-4 shadow-[0_8px_24px_rgb(30_41_59/6%)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="m-0 text-base font-bold">{t.admin.popular}</h2>
          <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-[#6b7280] no-underline">
            {t.admin.showAll} <NorthEastIcon />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs text-[#9aa1ad]">
                <th className="px-3 py-3 font-medium">{t.admin.name}</th>
                <th className="px-3 py-3 font-medium">{t.admin.price}</th>
                <th className="px-3 py-3 font-medium">{t.admin.salesCount}</th>
                <th className="px-3 py-3 font-medium">{t.admin.status}</th>
              </tr>
            </thead>
            <tbody>
              {products.isLoading ? (
                <tr>
                  <td className="px-3 py-6 text-[#9aa1ad]" colSpan={4}>
                    {t.common.loading}
                  </td>
                </tr>
              ) : null}
              {products.isError ? (
                <tr>
                  <td className="px-3 py-6 text-[#9aa1ad]" colSpan={4}>
                    {t.admin.loadError}
                  </td>
                </tr>
              ) : null}
              {!products.isLoading && !products.isError && popular.length === 0 ? (
                <tr>
                  <td className="px-3 py-6 text-[#9aa1ad]" colSpan={4}>
                    {t.admin.empty}
                  </td>
                </tr>
              ) : null}
              {popular.map((product) => {
                const image = product.images.main.front.src;
                const amount = product.price.current;
                const price = Number.isFinite(amount) ? `$${amount.toFixed(2)}` : '—';
                return (
                  <tr key={product.id} className="border-t border-[#f1f3f7]">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        {image ? (
                          <img src={image} alt="" className="size-10 rounded-lg object-cover" />
                        ) : (
                          <span className="inline-block size-10 rounded-lg bg-[#f3f4f6]" />
                        )}
                        <span>
                          <span className="block text-[11px] text-[#b0b6c3]">SKU: {product.code || product.id}</span>
                          <span className="block font-semibold">{product.title}</span>
                          <span className="block text-xs text-[#6b7280]">{product.brand}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">{price}</td>
                    <td className="px-3 py-3 text-[#6b7280]">—</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex rounded-full bg-[#e9f9ee] px-3 py-1 text-xs font-semibold text-[#22a06b]">
                        {t.admin.success}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function NorthEastIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 14 14 6M8 6h6v6" />
    </svg>
  );
}

function SalesChart() {
  return (
    <svg viewBox="0 0 1000 230" className="h-56 w-full" role="img" aria-hidden>
      <path
        d="M20 150 C 70 142, 110 158, 160 148 S 250 168, 310 140 S 390 118, 450 132 S 540 150, 600 138 S 700 120, 770 112 S 880 128, 980 104"
        fill="none"
        stroke="#c6f34d"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M20 168 C 80 172, 120 160, 180 164 S 270 150, 330 142 S 420 128, 480 136 S 560 150, 630 146 S 730 132, 800 124 S 900 118, 980 122"
        fill="none"
        stroke="#3d6bff"
        strokeWidth="3"
        strokeDasharray="7 7"
        strokeLinecap="round"
      />
      <line x1="500" y1="28" x2="500" y2="205" stroke="#8eb6ff" strokeWidth="2" />
    </svg>
  );
}
