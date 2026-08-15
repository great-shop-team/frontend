'use client';

import { ReactNode, useMemo, useState } from 'react';

import Return from '@/features/profile/ui/ProfileForm/ProfileFormList/Return/Return';
import MyBonuses from '@/features/profile/ui/ProfileForm/ProfileFormList/MyBonuses/MyBonuses';
import PersonalData from '@/features/profile/ui/ProfileForm/ProfileFormList/PersonalData/PersonalData';
import MyPurchases from '@/features/profile/ui/ProfileForm/ProfileFormList/MyPurchases/MyPurchases';
import ChangePassword from '@/features/profile/ui/ProfileForm/ProfileFormList/ChangePassword/ChangePassword';
import MyPromocodes from '@/features/profile/ui/ProfileForm/ProfileFormList/MyPromocodes/MyPromocodes';
import { useTranslation } from '@/i18n/useTranslation';

type Tab =
  | 'return'
  | 'myPromocodes'
  | 'personalData'
  | 'myPurchases'
  | 'changePassword'
  | 'myBonuses';

const ProfileFormList = () => {
  const { t } = useTranslation();

  const tabs = useMemo(
    () => [
      { id: 'myPurchases' as Tab, label: t.profile.myPurchases },
      { id: 'myBonuses' as Tab, label: t.profile.myBonuses },
      { id: 'myPromocodes' as Tab, label: t.profile.myPromocodes },
      { id: 'return' as Tab, label: t.profile.return },
      { id: 'personalData' as Tab, label: t.profile.personalData },
      { id: 'changePassword' as Tab, label: t.profile.changePassword },
    ],
    [t],
  );

  const tabContent: Record<Tab, ReactNode> = {
    return: <Return />,
    myPromocodes: <MyPromocodes />,
    personalData: <PersonalData />,
    myPurchases: <MyPurchases />,
    changePassword: <ChangePassword />,
    myBonuses: <MyPromocodes />,
  };

  const [activeTab, setActiveTab] = useState<Tab>('personalData');

  return (
    <>
      <div className="flex min-h-[50vh] mt-10">
        <div className="flex flex-col  gap-6 mr-25">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`rounded-lg p-2 transition-colors ${
                activeTab === tab.id ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1">{tabContent[activeTab]}</div>
      </div>
    </>
  );
};

export default ProfileFormList;
