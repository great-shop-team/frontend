'use client';
import bonusProfile from '@/data/profile_json/promoCode_json/promoCodeProfile.json';
import { useTranslation } from '@/i18n/useTranslation';
import { useState } from 'react';

interface IPromocode {
  nameBonus: string;
  dayBonus: string;
  active: boolean;
}

const MyPromocodes = () => {
  const { t } = useTranslation();

  const [dataBonus, setDataBonus] = useState<IPromocode[]>(bonusProfile);
  return (
    <div>
      <p className={'text-3xl font-extrabold'}>{t.promoCode.MyPrCodes}</p>
      <div>
        {dataBonus.map((item) => (
          <div
            className={
              item.active
                ? 'border border-[#484848] rounded-lg my-12 px-2'
                : 'border border-[#484848] rounded-lg my-12 px-2 opacity-40'
            }
            key={item.nameBonus}
          >
            <p className={'text-3xl font-extrabold mb-0.5 mt-1'}>{item.nameBonus}</p>
            <div className={'flex gap-3'}>
              <p className={'mb-2 '}>{item.dayBonus}</p>
              {item.active ? (
                <img
                  className="w-[75px] h-[27px] shrink-0"
                  src="/images/bonuses/status_active.png"
                  alt=""
                  width={75}
                  height={27}
                />
              ) : (
                <img
                  className="w-[75px] h-[27px] shrink-0"
                  src="/images/bonuses/status_used.png"
                  alt=""
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPromocodes;
