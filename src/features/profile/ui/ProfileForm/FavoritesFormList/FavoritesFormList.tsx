import { useTranslation } from '@/i18n/useTranslation';
import MyOrder from '@/data/MyOrders_json/MyOrderDelivery.json';
import CancelDelivery from '@/data/MyOrders_json/CanceledDelivery.json';
import arrived from '@/data/MyOrders_json/ArrivedOrderDelivery.json';
import { ReactNode, useMemo, useState } from 'react';
import AllFavorites from '@/features/profile/ui/ProfileForm/FavoritesFormList/AllFavorites/AllFavorites';
import WomenFavorites from '@/features/profile/ui/ProfileForm/FavoritesFormList/WomenFavorites/WomenFavorites';
import ManFavorites from '@/features/profile/ui/ProfileForm/FavoritesFormList/ManFavorites/ManFavorites';
import PerfumesFavorites from '@/features/profile/ui/ProfileForm/FavoritesFormList/PerfumesFavorites/PerfumesFavorites';

type Tab = 'all' | 'women' | 'man' | 'perfumes';

const FavoritesFormList = () => {
  const { t } = useTranslation();
  const arrOrederJson = MyOrder;
  const arrOrederCancelDeliveryJson = CancelDelivery;
  const arrOrederArrivedDeliveryJson = arrived;
  const tabs = useMemo(
    () => [
      { id: 'all' as Tab, label: t.favoritesFormList.all, count: arrOrederJson.length },
      {
        id: 'women' as Tab,
        label: t.favoritesFormList.women,
        count: arrOrederArrivedDeliveryJson.length,
      },
      {
        id: 'man' as Tab,
        label: t.favoritesFormList.man,
        count: arrOrederCancelDeliveryJson.length,
      },
      {
        id: 'perfumes' as Tab,
        label: t.favoritesFormList.perfumes,
        count: arrOrederCancelDeliveryJson.length,
      },
    ],
    [t, arrOrederJson.length],
  );

  const tabContent: Record<Tab, ReactNode> = {
    all: <AllFavorites />,
    women: <WomenFavorites />,
    man: <ManFavorites />,
    perfumes: <PerfumesFavorites />,
  };

  const [activeTab, setActiveTab] = useState<Tab>('all');
  return (
    <>
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
            </button>
          ))}
        </div>

        <div className="flex-1">{tabContent[activeTab]}</div>
      </div>
    </>
  );
};

export default FavoritesFormList;
