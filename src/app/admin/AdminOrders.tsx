'use client';

import { useTranslation } from '@/i18n/useTranslation';

const columns = ['orderNumber', 'orderDate', 'customer', 'phone', 'status', 'orderTotal'] as const;

export default function AdminOrders() {
  const { t } = useTranslation();
  const headings = {
    orderNumber: t.admin.orderNumber,
    orderDate: t.admin.orderDate,
    customer: t.admin.customer,
    phone: t.admin.phone,
    status: t.admin.status,
    orderTotal: t.admin.orderTotal,
  };

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
      <div>
        <h1 className="m-0 text-[28px] leading-tight font-bold">{t.admin.orders}</h1>
      </div>

      <section className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgb(30_41_59/6%)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-[#9aa1ad] uppercase">
                {columns.map((column) => (
                  <th key={column} className="px-5 py-3 font-semibold">
                    {headings[column]}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        <div className="flex flex-col items-center px-6 py-16 text-center">
          <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-[#e8f1ff] text-[#3d6bff]">
            <ReceiptIcon />
          </span>
          <p className="m-0 mt-5 max-w-md text-sm leading-6 text-[#6b7280]">{t.admin.ordersPending}</p>
        </div>
      </section>
    </div>
  );
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.5h10a1 1 0 0 1 1 1V20l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2L6 20V4.5a1 1 0 0 1 1-1Z" />
      <path strokeLinecap="round" d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}
