import Modal from '@/widgets/ModalWindow/Modal';

('use сlient');
import addressJson from '@/data/profile_json/address_json/address.json';
import { useState } from 'react';
import Image from 'next/image';
import pencilIcon from './icnoAddress/Vector.png';
import { useTranslation } from '@/i18n/useTranslation';

export default function AddressesList() {
  const { t } = useTranslation();
  const [dataJsonAddress, setDataJsonAddress] = useState(addressJson);
  const [modalActive, setModalActive] = useState(false);
  const [editModalActive, setEditModalActive] = useState(false);

  function setDefaultAddress(id: number) {
    setDataJsonAddress((prevState) =>
      prevState.map((item) => ({
        ...item,
        active: item.id === id,
      })),
    );
  }

  return (
    <div>
      <div className={'pl-20'}>
        <p className={' mt-3.5'}>{t.address.address}</p>
        <div className={'flex '}>
          {dataJsonAddress.map((item) => (
            <div key={item.id} className={'p-2 mx-2 border rounded-lg border-[#222] w-[522px]'}>
              {item.active ? (
                <div className={'p-1 text-white bg-zinc-950  w-fit rounded-lg'}>
                  {t.address.default}
                </div>
              ) : (
                <div className={'pb-8'}></div>
              )}
              <div className={'py-2'}>{item.active_delivery}</div>
              <p className={'text-3xl'}>{item.name}</p>
              <p>{item.street}</p>
              <p>{item.city}</p>
              <p>{item.county}</p>
              <p>{item.phone}</p>
              <div className="w-full h-px bg-[#00000066] my-4 "></div>
              <div className={'flex gap-6 '}>
                <button
                  className={'p-4 border rounded-lg border-[#222] text-[#4D4D4D]'}
                  onClick={() => setEditModalActive(true)}
                >
                  {t.address.edit}
                </button>
                <button className={'p-4 border rounded-lg border-[#DA000066] text-[#C0392B]'}>
                  {t.address.delete}
                </button>
                {item.active ? null : (
                  <button
                    className={'p-4 text-white bg-zinc-950 rounded-lg'}
                    onClick={() => setDefaultAddress(item.id)}
                  >
                    {t.address.setDefault}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div
          className={
            'flex flex-col items-center border rounded-lg border-[#0000004D] w-[522px] h-1/5 translate-x-2 py-10' +
            ' my-6'
          }
          onClick={() => {
            setModalActive(true);
            setEditModalActive(false);
          }}
        >
          <p className={' text-[#0000004D] '}>+</p>
          <p className={' text-[#0000004D]'}> {t.address.addNew}</p>
        </div>
      </div>
      <div className="w-full h-px bg-[#00000066] my-4 "></div>
      <div className={'pl-20 '}>
        <form>
          <div>
            <div className={'flex items-center gap-3 p-2'}>
              <p> {t.address.editAddress}</p>
              <Image
                src={pencilIcon}
                className={'w-4 h-4 shrink-0 transform -translate-y-[15px]'}
                alt="Фото профиля"
              />
            </div>
            <div className={'flex gap-5 mb-6'}>
              <div className={'flex flex-col'}>
                <label className={' text-[16px] text-[#000000B2] mb-2'}>
                  {t.address.streetAndHouseNumber}
                </label>
                <input
                  className={'p-2 border w-[500px]  border-[#000000] rounded-lg'}
                  id={'houseNumber'}
                  placeholder={'221B Baker Street'}
                  type={'text'}
                />
              </div>
              <div className={'flex flex-col'}>
                <label className={' text-[16px]  text-[#000000B2] mb-2'}>{t.address.floor}</label>
                <input
                  className={'p-2 border w-[500px]  border-[#000000] rounded-lg'}
                  id={'floor'}
                  placeholder={'2'}
                  type={'number'}
                />
              </div>
            </div>

            <div className={'flex gap-5 mb-6'}>
              <div className={'flex flex-col'}>
                <label className={' text-[16px] text-[#000000B2] mb-2'}>{t.address.city}</label>
                <input
                  className={'p-2 border w-[500px]  border-[#000000] rounded-lg'}
                  id={'city'}
                  placeholder={'London'}
                  type={'text'}
                />
              </div>
              <div className={'flex flex-col'}>
                <label className={' text-[16px]  text-[#000000B2] mb-2'}>
                  {t.address.postcode}
                </label>
                <input
                  className={'p-2 border w-[500px]  border-[#000000] rounded-lg'}
                  id={'postal'}
                  placeholder={'61000'}
                  type={'number'}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <Modal active={modalActive} setActive={setModalActive}>
        <p> {t.address.addNew}</p>
        <form className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-md">
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName">{t.address.firstName}</label>
              <input
                id="firstName"
                type="text"
                className="p-2 border border-gray-400 rounded-lg"
                placeholder="John"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="lastName">{t.address.lastName}</label>
              <input
                id="lastName"
                type="text"
                className="p-2 border border-gray-400 rounded-lg"
                placeholder="Doe"
              />
            </div>

            <div className="col-span-2 flex flex-col gap-2">
              <label htmlFor={'address'}>{t.address.streetAddress}</label>
              <input
                id={'address'}
                type={'text'}
                placeholder={'14 Kensington Gardens Square'}
                className="p-2 border rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="flat">{t.address.apartment}</label>
              <input
                id="flat"
                type="text"
                className="p-2 border border-gray-400 rounded-lg"
                placeholder="Optional"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="city">{t.address.city}</label>
              <input
                id="city"
                type="text"
                className="p-2 border border-gray-400 rounded-lg"
                placeholder="Kyiv"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="postcode">{t.address.postcode}</label>
              <input
                id="postcode"
                type="text"
                className="p-2 border border-gray-400 rounded-lg"
                placeholder="W2 4BQ"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="country">{t.address.country}</label>
              <input
                id="country"
                type="text"
                className="p-2 border border-gray-400 rounded-lg"
                placeholder="Ukraine"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone">{t.address.phone}</label>
              <input
                id="phone"
                type="tel"
                className="p-2 border border-gray-400 rounded-lg"
                placeholder="+380..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className=" px-15 border border-gray-400 rounded-lg"
              onClick={() => setModalActive(false)}
            >
              {t.address.cancel}
            </button>

            <button type="submit" className="px-15 py-2 bg-black text-white rounded-lg">
              {t.address.saveChanges}
            </button>
          </div>
        </form>
      </Modal>

      <Modal active={editModalActive} setActive={setEditModalActive}>
        <p>{t.address.editAddress}</p>
        <form className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-md">
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName">{t.address.editAddress}</label>
              <input
                id="firstName"
                type="text"
                className="p-2 border border-gray-400 rounded-lg"
                placeholder="John"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="lastName">{t.address.firstName}</label>
              <input
                id="lastName"
                type="text"
                className="p-2 border border-gray-400 rounded-lg"
                placeholder="Doe"
              />
            </div>

            <div className="col-span-2 flex flex-col gap-2">
              <label htmlFor={'address'}>{t.address.streetAddress}</label>
              <input
                id={'address'}
                type={'text'}
                placeholder={'14 Kensington Gardens Square'}
                className="p-2 border rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="flat">{t.address.apartment}</label>
              <input
                id="flat"
                type="text"
                className="p-2 border border-gray-400 rounded-lg"
                placeholder="Optional"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="city">{t.address.city}</label>
              <input
                id="city"
                type="text"
                className="p-2 border border-gray-400 rounded-lg"
                placeholder="Kyiv"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="postcode">{t.address.postcode}</label>
              <input
                id="postcode"
                type="text"
                className="p-2 border border-gray-400 rounded-lg"
                placeholder="W2 4BQ"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="country">{t.address.country}</label>
              <input
                id="country"
                type="text"
                className="p-2 border border-gray-400 rounded-lg"
                placeholder="Ukraine"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone">{t.address.phone}</label>
              <input
                id="phone"
                type="tel"
                className="p-2 border border-gray-400 rounded-lg"
                placeholder="+380..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className=" px-15 border border-gray-400 rounded-lg"
              onClick={() => setEditModalActive(false)}
            >
              {t.address.cancel}
            </button>

            <button type="submit" className="px-15 py-2 bg-black text-white rounded-lg">
              {t.address.saveChanges}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
