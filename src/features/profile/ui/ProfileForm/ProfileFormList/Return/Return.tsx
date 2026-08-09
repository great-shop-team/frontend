'use client';

import Image from 'next/image';
import returnProfile from '@/data/profile_json/return_json/returnProfile.json';
import { useTranslation } from '@/i18n/useTranslation';

const imgStyles = 'mr-10 max-w-[50px] max-h-[50px] shrink-0 block my-auto';
const firstUpBlockTextStyles = 'text-2xl m-0';
const secondDownBlockTextStyles = 'text-[#000000B2] text-[16px] m-0';
const blockStyles = 'flex flex-row mb-[3%]';
const labelFormStyles = 'text-[16px] text-[#000000B2] my-3';
const inputFormStyles = 'border rounded-lg p-3 block w-[413px] my-[4%]';
const formBlockStyles = 'flex flex-1 flex-row gap-6';

const Return = () => {
  const { t } = useTranslation();

  return (
    <div className="h-screen">
      <p className="text-[40px]">{t.profile.returnPage.title}</p>

      <div>
        <div className={blockStyles}>
          <Image
            width={50}
            height={50}
            src={returnProfile.imagesFirst.image_first}
            alt={returnProfile.imagesFirst.alt}
            className={imgStyles}
          />
          <div>
            <p className={firstUpBlockTextStyles}>{t.profile.returnPage.stepOneTitle}</p>
            <p className={secondDownBlockTextStyles}>{t.profile.returnPage.stepOneDescription}</p>
          </div>
        </div>

        <div className={blockStyles}>
          <Image
            width={50}
            height={50}
            src={returnProfile.imagesSecond.image_first}
            alt={returnProfile.imagesSecond.alt}
            className={imgStyles}
          />
          <div>
            <p className={firstUpBlockTextStyles}>{t.profile.returnPage.stepTwoTitle}</p>
            <p className={secondDownBlockTextStyles}>{t.profile.returnPage.stepTwoDescription}</p>
          </div>
        </div>

        <div className={blockStyles}>
          <Image
            width={50}
            height={50}
            src={returnProfile.imagesThird.image_first}
            alt={returnProfile.imagesThird.alt}
            className={imgStyles}
          />
          <div>
            <p className={firstUpBlockTextStyles}>{t.profile.returnPage.stepThreeTitle}</p>
            <p className={secondDownBlockTextStyles}>{t.profile.returnPage.stepThreeDescription}</p>
          </div>
        </div>

        <div className={blockStyles}>
          <Image
            width={50}
            height={50}
            src={returnProfile.imagesFouth.image_first}
            alt={returnProfile.imagesFouth.alt}
            className={imgStyles}
          />
          <div>
            <p className={firstUpBlockTextStyles}>{t.profile.returnPage.stepFourTitle}</p>
            <p className={secondDownBlockTextStyles}>{t.profile.returnPage.stepFourDescription}</p>
          </div>
        </div>
      </div>

      <form className="bg-[#FAFAFA] my-6">
        <div className={formBlockStyles}>
          <div>
            <label className={labelFormStyles}>{t.profile.returnPage.orderNumber}</label>
            <div>
              <input className={inputFormStyles} />
            </div>
          </div>

          <div>
            <label className={labelFormStyles}>{t.profile.returnPage.itemName}</label>
            <div>
              <input className={inputFormStyles} />
            </div>
          </div>
        </div>

        <div className={formBlockStyles}>
          <div>
            <label className={labelFormStyles}>{t.profile.returnPage.reason}</label>
            <input
              className={inputFormStyles}
              placeholder={t.profile.returnPage.reasonPlaceholder}
            />
          </div>

          <div>
            <label className={labelFormStyles}>{t.profile.returnPage.preferredResolution}</label>
            <input
              className={inputFormStyles}
              placeholder={t.profile.returnPage.resolutionPlaceholder}
            />
          </div>
        </div>

        <div>
          <div className={formBlockStyles}>
            <label className={labelFormStyles}>{t.profile.returnPage.additionalNotes}</label>
          </div>

          <div>
            <textarea className="border rounded-lg p-1 block w-[822px] h-[173px] mt-3" />
          </div>
        </div>

        <div className="flex justify-center my-6">
          <button className="border rounded-lg p-2 text-white bg-[#222222]">
            {t.profile.returnPage.submitButton}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Return;
