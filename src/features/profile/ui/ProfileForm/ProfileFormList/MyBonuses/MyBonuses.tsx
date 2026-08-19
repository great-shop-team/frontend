'use client';
import { useTranslation } from '@/i18n/useTranslation';
import myBonus from '@/data/profile_json/bonus_json/myBonus.json';
import { useState } from 'react';

const MyBonuses = () => {
  const [dataBonus, setDataBonus] = useState(myBonus);
  const arrDataBonus = dataBonus.history
  console.log(dataBonus);
  const { t } = useTranslation();
  return (
    <div>
      <p className={'text-3xl font-bold'}>{t.profile.myBonuses}</p>

      <div
        className={
          'flex justify-between px-4  border border-[#484848] rounded-lg bg-black text-white'
        }
      >
        <div>
          <p className={'text-5xl font-bold m-0 pt-5'}>{dataBonus.bonus.availablePoints}</p>
          <p className={'text-2 py-2 text-xs'}>available bonus points</p>
        </div>
        <div className={'px-4.5 py-8'}>
          <p className={'m-0 text-xs'}>
            {dataBonus.bonus.exchangeRate.points}bonus = {dataBonus.bonus.exchangeRate.discount}$
          </p>
          <p className={'m-0 text-xs'}>
            discount Min. order {dataBonus.bonus.minOrder.amount}$ to redeem
          </p>
          <p className={'m-0 text-xs'}>
            Points expire in {dataBonus.bonus.expirationMonths} months
          </p>
        </div>
      </div>
      <p className={'py-10 text-2xl font-bold '}>Bonus History</p>

      <div>
        <div className="flex justify-between ">
          <p className={'text-[#4D4D4D]'}>Date</p>
          <p className={'text-[#4D4D4D]'}>Description</p>
          <p className={'text-[#4D4D4D]'}>Points</p>
        </div>
        <div className="w-full h-px bg-[#00000066] my-4 "></div>

        {arrDataBonus.map((item) => (
          <div key={item.date}>
            <div className="flex">
              <p className="w-1/3">{item.date}</p>
              <p className="w-1/3 text-center ">{item.description}</p>
              <p className="w-1/3 text-right text-[#007C11]">+{item.points}</p>
            </div>

            <div className="w-full h-px bg-[#00000066] my-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBonuses;
