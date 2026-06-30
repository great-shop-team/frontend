'use client';
import returnProfile from '@/data/profile_json/return_json/returnProfile.json';
import { useTranslation } from '@/i18n/useTranslation';
const imgStyles = 'mr-10 max-w-[50px] max-h-[50px] block my-auto';
const firstUpBlockTextStyles = 'text-2xl m-0';
const secondDownBlockTextStyles = 'text-[#000000B2] text-[16px] m-0';
const blockStyles = 'flex  flex-row  mb-7';
const labelFormStyles = ' text-[16px] text-[#000000B2] my-3';
const inputFormStyles = 'border rounded-lg p-1 block w-[413px] my-3';
const formBlockStyles = 'flex flex-1 flex-row gap-6';
const Return = () => {
  const { t } = useTranslation();
  return (
    <div className="h-screen">
      {t.profile.return}
      <p className={'text-[40px] text-2xl'}>Return an item</p>

      <div>
        <div className={blockStyles}>
          <img
            width={'50px'}
            height={'50px'}
            src={returnProfile.imagesFirst.image_first}
            alt={returnProfile.imagesFirst.alt}
            className={imgStyles}
          />
          <div>
            <p className={firstUpBlockTextStyles}>Choose your order </p>
            <p className={secondDownBlockTextStyles}>
              Select the order and item(s) you would like to return. Returns are accepted within 30
              days of delivery.
            </p>
          </div>
        </div>

        <div className={blockStyles}>
          <img
            width={'50px'}
            height={'50px'}
            src={returnProfile.imagesSecond.image_first}
            alt={returnProfile.imagesSecond.alt}
            className={imgStyles}
          />
          <div>
            <p className={firstUpBlockTextStyles}>Select return reason</p>
            <p className={secondDownBlockTextStyles}>
              Let us know why: wrong size, changed mind, damaged item, or other.
            </p>
          </div>
        </div>
      </div>

      <div className={blockStyles}>
        <img
          width={'50px'}
          height={'50px'}
          src={returnProfile.imagesThird.image_first}
          alt={returnProfile.imagesThird.alt}
          className={imgStyles}
        />
        <div>
          <p className={firstUpBlockTextStyles}>Print label & ship</p>
          <p className={secondDownBlockTextStyles}>
            We will email a prepaid return label. Drop the parcel at any courier point within 5
            days.
          </p>
        </div>
      </div>

      <div className={blockStyles}>
        <img
          width={'50px'}
          height={'50px'}
          src={returnProfile.imagesFouth.image_first}
          alt={returnProfile.imagesFouth.alt}
          className={imgStyles}
        />
        <div>
          <p className={firstUpBlockTextStyles}>Refund processed</p>
          <p className={secondDownBlockTextStyles}>
            Once received, refund is issued within 3–5 business days to your original payment
            method.
          </p>
        </div>
      </div>

      <form>
        <div className={formBlockStyles}>
          <div className={''}>
            <label className={labelFormStyles}> Order number </label>
            <div>
              <input className={inputFormStyles} />
            </div>
          </div>
          <div>
            <label className={labelFormStyles}>Item name</label>
            <div>
              <input className={inputFormStyles} />
            </div>
          </div>
        </div>
        <div className={formBlockStyles}>
          <div>
            <label className={labelFormStyles}>Reson</label>
            <input className={inputFormStyles} placeholder={'Damage/Defective'} />
          </div>
          <div>
            <label className={labelFormStyles}>Preferred resolution</label>
            <input className={inputFormStyles} placeholder={'Refund'} />
          </div>
        </div>
        <div >
          <div className={formBlockStyles}>
            <label className={labelFormStyles}>Additional notes (optional)</label>
          </div>
          <div>
            <textarea className={'border rounded-lg p-1 block w-[822px] h-3/2 mt-3'} />
          </div>
        </div>
        <button className={'border rounded-lg p-2 text-[#FFFFFF] bg-[#222222]'}>Submit return request</button>
      </form>
    </div>
  );
};

export default Return;
