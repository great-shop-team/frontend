import AccountHeader from '@/features/orders/ui/AccountHeader';
import Orders from '@/features/orders/Orders';

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-[1440px] pb-10">
      <AccountHeader activeTab="orders" />
      <Orders />
    </div>
  );
}
