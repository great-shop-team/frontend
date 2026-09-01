'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { ReactNode, useMemo, useState } from 'react';
import Delivery from '@/features/profile/ui/ProfileForm/OrderFormList/components/delivery/Delivery';
import Arrived from '@/features/profile/ui/ProfileForm/OrderFormList/components/arrived/Arrived';
import Canceled from '@/features/profile/ui/ProfileForm/OrderFormList/components/canceled/Canceled';
import MyOrder from '@/data/MyOrders_json/MyOrderDelivery.json';
import CancelDelivery from '@/data/MyOrders_json/CanceledDelivery.json';
import arrived from '@/data/MyOrders_json/ArrivedOrderDelivery.json';

type Tab = 'delivery' | 'arrived' | 'canceled';

const OrderFormList = () => {
  const { t } = useTranslation();
  const arrOrederJson = MyOrder;
  const arrOrederCancelDeliveryJson = CancelDelivery;
  const arrOrederArrivedDeliveryJson = arrived;
  const tabs = useMemo(
    () => [
      { id: 'delivery' as Tab, label: t.orderFormList.delivery, count: arrOrederJson.length },
      {
        id: 'arrived' as Tab,
        label: t.orderFormList.arrived,
        count: arrOrederArrivedDeliveryJson.length,
      },
      {
        id: 'canceled' as Tab,
        label: t.orderFormList.canceled,
        count: arrOrederCancelDeliveryJson.length,
      },
    ],
    [t, arrOrederJson.length],
  );

  const tabContent: Record<Tab, ReactNode> = {
    delivery: <Delivery />,
    arrived: <Arrived />,
    canceled: <Canceled />,
  };

  const [activeTab, setActiveTab] = useState<Tab>('delivery');
  return (
    <>
      {/*<div>{t.profile.orderFormList}</div>*/}
      <div className="flex min-h-[50vh] mt-10">
        <div className="flex flex-col  gap-6 mr-25">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={` w-50 rounded-lg p-2 transition-colors flex justify-between  ${
                activeTab === tab.id ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              <span>{tab.count}</span>
              {/*{tab.label}*/}
{/*comment*/}
            </button>
          ))}
        </div>

        <div className="flex-1">{tabContent[activeTab]}</div>
      </div>
    </>
  );
};

export default OrderFormList;


