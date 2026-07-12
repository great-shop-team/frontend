'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { HiOutlineShoppingBag } from 'react-icons/hi2';

import productCard from '@/data/orderCard.json';
import { formatMessage, useTranslation } from '@/i18n/useTranslation';

type OrderFilter = 'delivery' | 'arrived' | 'canceled';

type OrderItem = {
  id: string;
  brand: string;
  name: string;
  code: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
};

function OrderItemCard({ productCard }: { productCard: OrderItem }) {
  return (
    <article className="grid grid-cols-[140px_1fr_auto] items-center gap-5 rounded-xl border border-gray-200 px-5 py-4">
      <div className="flex h-30 w-30 items-center justify-center rounded-lg bg-[#f3f3f3] p-2">
        <Image
          src={productCard.image}
          alt={productCard.name}
          width={200}
          height={200}
          className="h-full w-full object-contain"
          priority
        />
      </div>

      <div className="flex min-h-30 flex-col justify-between py-1">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-black">{productCard.brand}</p>
          <p className="text-base font-semibold text-black">{productCard.name}</p>
          <p className="text-xs text-gray-400">{productCard.code}</p>
          <p className="text-sm text-gray-600">{productCard.variant}</p>
        </div>
        <p className="text-2xl font-bold leading-none">${productCard.price}</p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-300 text-base font-medium">
        {productCard.quantity}
      </div>
    </article>
  );
}

export default function Orders() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('delivery');
  const order = productCard;

  const filters = useMemo(
    () => [
      { id: 'delivery' as OrderFilter, label: t.orders.delivery, count: 4 },
      { id: 'arrived' as OrderFilter, label: t.orders.arrived, count: 3 },
      { id: 'canceled' as OrderFilter, label: t.orders.canceled, count: 1 },
    ],
    [t],
  );

  return (
    <div className="mx-auto mt-8 max-w-[1440px] w-full px-4 grid min-h-[50vh] grid-cols-[23%_1fr] gap-[32px]">
      <nav className="flex flex-col gap-[32px]" aria-label={t.orders.filtersAria}>
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`flex w-full items-center justify-between rounded-lg px-[14px] py-[14px] text-left text-base font-medium transition-colors ${
                isActive
                  ? 'bg-black text-white'
                  : 'bg-[rgba(148,148,151,0.12)] text-black hover:bg-[rgba(148,148,151,0.22)]'
              }`}
            >
              {filter.label}
              <span
                className={`flex min-w-[28px] items-center justify-center rounded-full px-2 py-0.5 text-sm font-medium ${
                  isActive ? 'bg-white text-black' : 'bg-[rgba(148,148,151,0.25)] text-black'
                }`}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </nav>

      <section className="flex flex-col gap-6">
        <div className="border-b border-gray-100 pb-5">
          <div className="grid grid-cols-[1fr_auto] items-start gap-x-8 gap-y-2">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-black">
                {formatMessage(t.orders.orderId, { id: order.id })}
              </h2>
              <div className="flex items-center gap-2.5 font-medium text-gray-800">
                <HiOutlineShoppingBag className="h-5 w-5 shrink-0 text-black" aria-hidden />
                <span>{order.store}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 self-start">
              <span className="whitespace-nowrap text-sm text-gray-500">
                {formatMessage(t.orders.estimatedDelivery, { date: order.estimatedDelivery })}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg bg-[#FFBF40] p-[10px] w-[123px] h-[39px] px-4 py-1.5 text-sm font-normal text-[#000000]">
                <span className="h-2 w-2 rounded-full bg-[#FF9933]" aria-hidden />
                {order.status}
              </span>
            </div>
          </div>

          <div className="mt-4 flex w-full flex-wrap items-center gap-y-4">
            <div className="flex items-center gap-2.5 text-sm text-gray-600 w-[77%] shrink-0 min-w-0">
              <span>{order.fromAddress}</span>
            </div>

            <div className="flex items-center gap-2.5 text-sm text-gray-600 w-[23%] shrink-0 min-w-0">
              <span>{order.toAddress}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {order.productCard.map((item) => (
            <OrderItemCard key={item.id} productCard={item} />
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between rounded-lg bg-[rgba(148,148,151,0.08)] px-8 py-5">
          <p className="text-2xl font-bold text-black">
            {formatMessage(t.orders.total, { amount: order.total })}
          </p>
          <button
            type="button"
            className="rounded-lg bg-black px-10 py-3 text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            {t.orders.details}
          </button>
        </div>
      </section>
    </div>
  );
}
