'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SuggestField, { type SuggestOption } from '@/features/checkout/ui/SuggestField';
import {
  deliveryCountries,
  flagImageSrc,
  phoneCountries,
} from '@/features/checkout/lib/phoneCountries';
import { useTranslation } from '@/i18n/useTranslation';
import type { RootState } from '@/store/store';
import { removeFromCart, setCartItemQuantity } from '@/store/slices/cartSlice';
import type { CartItem } from '@/store/types';

const SAVED_ADDRESS_KEY = 'wearly.checkout.address';

type PaymentId = 'google' | 'visa' | 'mastercard';

type SavedAddress = {
  firstName: string;
  lastName: string;
  phoneIso: string;
  phone: string;
  email: string;
  countryId: string;
  city: string;
  cityRef: string;
  warehouse: string;
  warehouseRef: string;
  notes: string;
};

type FieldErrors = Partial<
  Record<
    | 'firstName'
    | 'lastName'
    | 'phone'
    | 'email'
    | 'country'
    | 'city'
    | 'warehouse'
    | 'payment'
    | 'terms',
    string
  >
>;

const formatPrice = (amount: number, currency: string) => {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return currency === 'USD' ? `$${formatted}` : `${formatted} ${currency}`;
};

const inputClass =
  'h-12 w-full rounded-lg border border-black bg-white px-2.5 font-[family-name:var(--font-poppins)] text-[16px] text-black outline-none placeholder:text-black/60';

export default function CheckoutPage() {
  const { t, locale } = useTranslation();
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const phoneListId = useId();
  const phoneRootRef = useRef<HTMLDivElement>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneIso, setPhoneIso] = useState('UA');
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [countryId, setCountryId] = useState('UA');
  const [countryQuery, setCountryQuery] = useState(locale === 'uk' ? 'Україна' : 'Ukraine');
  const [city, setCity] = useState('');
  const [cityRef, setCityRef] = useState('');
  const [cityOptions, setCityOptions] = useState<SuggestOption[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [warehouse, setWarehouse] = useState('');
  const [warehouseRef, setWarehouseRef] = useState('');
  const [warehouseOptions, setWarehouseOptions] = useState<SuggestOption[]>([]);
  const [warehousesLoading, setWarehousesLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [saveAddress, setSaveAddress] = useState(false);
  const [payment, setPayment] = useState<PaymentId | ''>('');
  const [agreed, setAgreed] = useState(false);
  const [promo, setPromo] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitNote, setSubmitNote] = useState('');
  const [loadError, setLoadError] = useState('');

  const cartItems = items.filter(
    (item) => typeof item.price === 'number' && typeof item.title === 'string',
  );
  const currency = cartItems[0]?.currency ?? 'USD';
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0;
  const shippingFee = 0;
  const total = subtotal - discount + shippingFee;

  const selectedPhone = phoneCountries.find((country) => country.iso === phoneIso) ?? phoneCountries[0];
  const novaPoshtaAvailable = countryId === 'UA';

  const applyPhoneCountry = (iso: string) => {
    const country = phoneCountries.find((item) => item.iso === iso);
    if (!country) return;
    setPhoneIso(country.iso);
    setPhoneOpen(false);
    setCountryId(country.iso);
    setCountryQuery(locale === 'uk' ? country.nameUk : country.nameEn);
    setCity('');
    setCityRef('');
    setWarehouse('');
    setWarehouseRef('');
    setCityOptions([]);
    setWarehouseOptions([]);
    setLoadError('');
  };

  const countryOptions = useMemo(() => {
    const query = countryQuery.trim().toLowerCase();
    return deliveryCountries
      .map((country) => ({
        id: country.id,
        label: locale === 'uk' ? country.nameUk : country.nameEn,
      }))
      .filter((country) => !query || country.label.toLowerCase().includes(query));
  }, [countryQuery, locale]);

  useEffect(() => {
    const raw = window.localStorage.getItem(SAVED_ADDRESS_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as SavedAddress;
      setFirstName(saved.firstName || '');
      setLastName(saved.lastName || '');
      setPhoneIso(saved.phoneIso || 'UA');
      setPhone(saved.phone || '');
      setEmail(saved.email || '');
      setCountryId(saved.countryId || 'UA');
      setCity(saved.city || '');
      setCityRef(saved.cityRef || '');
      setWarehouse(saved.warehouse || '');
      setWarehouseRef(saved.warehouseRef || '');
      setNotes(saved.notes || '');
      setSaveAddress(true);
      const country = deliveryCountries.find((item) => item.id === (saved.countryId || 'UA'));
      if (country) {
        setCountryQuery(locale === 'uk' ? country.nameUk : country.nameEn);
      }
    } catch {
      window.localStorage.removeItem(SAVED_ADDRESS_KEY);
    }
  }, [locale]);

  useEffect(() => {
    const country = deliveryCountries.find((item) => item.id === countryId);
    if (!country) return;
    setCountryQuery(locale === 'uk' ? country.nameUk : country.nameEn);
  }, [countryId, locale]);

  useEffect(() => {
    if (!phoneOpen) return undefined;
    const onPointerDown = (event: MouseEvent) => {
      if (!phoneRootRef.current?.contains(event.target as Node)) setPhoneOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [phoneOpen]);

  const cityTimer = useRef<number | null>(null);
  const warehouseTimer = useRef<number | null>(null);

  const loadCities = async (query: string) => {
    setCitiesLoading(true);
    setLoadError('');
    try {
      const response = await fetch(`/api/nova-poshta?kind=cities&q=${encodeURIComponent(query)}`);
      const payload = (await response.json()) as {
        items?: { id: string; label: string; area?: string }[];
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error || 'failed');
      setCityOptions(
        (payload.items ?? []).map((item) => ({
          id: item.id,
          label: item.label,
          hint: item.area,
        })),
      );
    } catch {
      setCityOptions([]);
      setLoadError(t.checkout.loadError);
    } finally {
      setCitiesLoading(false);
    }
  };

  const loadWarehouses = async (query: string) => {
    if (!cityRef) {
      setWarehouseOptions([]);
      return;
    }
    setWarehousesLoading(true);
    setLoadError('');
    try {
      const response = await fetch(
        `/api/nova-poshta?kind=warehouses&cityRef=${encodeURIComponent(cityRef)}&q=${encodeURIComponent(query)}`,
      );
      const payload = (await response.json()) as {
        items?: { id: string; label: string; kind?: string }[];
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error || 'failed');
      const queryLower = query.trim().toLowerCase();
      setWarehouseOptions(
        (payload.items ?? [])
          .filter((item) => !queryLower || item.label.toLowerCase().includes(queryLower))
          .map((item) => ({
            id: item.id,
            label: item.label,
            hint: item.kind,
          })),
      );
    } catch {
      setWarehouseOptions([]);
      setLoadError(t.checkout.loadError);
    } finally {
      setWarehousesLoading(false);
    }
  };

  const changeQuantity = (item: CartItem, nextQuantity: number) => {
    dispatch(
      setCartItemQuantity({
        productId: item.productId,
        variantId: item.variantId,
        quantity: nextQuantity,
      }),
    );
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    if (!firstName.trim()) nextErrors.firstName = t.checkout.required;
    if (!lastName.trim()) nextErrors.lastName = t.checkout.required;
    if (!/^\d{7,12}$/.test(phone.replace(/\s/g, ''))) nextErrors.phone = t.checkout.invalidPhone;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = t.checkout.invalidEmail;
    if (!countryId) nextErrors.country = t.checkout.required;
    if (!cityRef) nextErrors.city = t.checkout.selectCity;
    if (!warehouseRef) nextErrors.warehouse = t.checkout.selectWarehouse;
    if (!payment) nextErrors.payment = t.checkout.selectPayment;
    if (!agreed) nextErrors.terms = t.checkout.agreeRequired;
    if (cartItems.length === 0) nextErrors.payment = t.checkout.emptyText;

    setErrors(nextErrors);
    setSubmitNote('');
    if (Object.keys(nextErrors).length > 0) return;

    if (saveAddress) {
      const saved: SavedAddress = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneIso,
        phone: phone.trim(),
        email: email.trim(),
        countryId,
        city,
        cityRef,
        warehouse,
        warehouseRef,
        notes,
      };
      window.localStorage.setItem(SAVED_ADDRESS_KEY, JSON.stringify(saved));
    } else {
      window.localStorage.removeItem(SAVED_ADDRESS_KEY);
    }

    setSubmitNote(t.checkout.noEndpoint);
  };

  const payments: { id: PaymentId; src: string; alt: string }[] = [
    { id: 'google', src: '/images/catalog/google-pay-icon.png', alt: t.checkout.googlePay },
    { id: 'visa', src: '/images/catalog/visa-icon.svg', alt: t.checkout.visa },
    { id: 'mastercard', src: '/images/catalog/mastercard-icon.svg', alt: t.checkout.mastercard },
  ];

  return (
    <section className="mx-auto w-full max-w-[1440px] bg-white px-4 pt-6 pb-16 text-black md:px-6 lg:px-20">
      <div className="h-px w-full bg-black/40" />
      <p className="m-0 py-8 font-sans text-[20px] leading-[1.2] font-normal text-black/70">
        {t.checkout.deliveryInfo}
      </p>
      <div className="h-px w-full bg-black/40" />

      <form
        className="mt-12 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between"
        onSubmit={onSubmit}
        noValidate
      >
        <div className="flex w-full flex-col gap-8 lg:max-w-[606px]">
          <div className="flex items-center gap-3">
            <h1 className="m-0 font-heading text-[20px] font-normal text-dark">
              {t.checkout.personalData}
            </h1>
            <Image src="/images/catalog/Edit.svg" alt="" width={24} height={24} />
          </div>

          <div className="flex flex-col gap-5">
            <p className="m-0 font-[family-name:var(--font-poppins)] text-[16px] text-black">
              {t.checkout.personalInfo}
            </p>
            <label className="flex flex-col gap-1">
              <input
                value={firstName}
                placeholder={t.checkout.firstName}
                className={`${inputClass} ${errors.firstName ? 'border-error' : ''}`}
                onChange={(event) => setFirstName(event.target.value)}
              />
              {errors.firstName ? <span className="text-[12px] text-error">{errors.firstName}</span> : null}
            </label>
            <label className="flex flex-col gap-1">
              <input
                value={lastName}
                placeholder={t.checkout.lastName}
                className={`${inputClass} ${errors.lastName ? 'border-error' : ''}`}
                onChange={(event) => setLastName(event.target.value)}
              />
              {errors.lastName ? <span className="text-[12px] text-error">{errors.lastName}</span> : null}
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <div ref={phoneRootRef} className="relative flex flex-col gap-2">
                <span className="font-[family-name:var(--font-poppins)] text-[16px] text-black">
                  {t.checkout.phone}
                </span>
                <div
                  className={`flex h-12 items-center gap-1 rounded-lg border bg-white px-2.5 ${
                    errors.phone ? 'border-error' : 'border-black'
                  }`}
                >
                  <button
                    type="button"
                    aria-label={t.checkout.phoneCode}
                    aria-expanded={phoneOpen}
                    aria-controls={phoneListId}
                    className="inline-flex size-[30px] shrink-0 items-center justify-center border-0 bg-transparent p-0"
                    onClick={() => setPhoneOpen((open) => !open)}
                  >
                    <img
                      src={flagImageSrc(selectedPhone.iso)}
                      alt=""
                      width={30}
                      height={20}
                      className="h-5 w-[30px] rounded-[2px] object-cover"
                    />
                  </button>
                  <span className="font-[family-name:var(--font-poppins)] text-[14px] text-[#757575]">
                    {selectedPhone.dial}
                  </span>
                  <input
                    inputMode="numeric"
                    value={phone}
                    placeholder={t.checkout.phonePlaceholder}
                    aria-invalid={Boolean(errors.phone)}
                    className="h-full min-w-0 flex-1 border-0 bg-transparent font-[family-name:var(--font-poppins)] text-[16px] text-[#757575] outline-none placeholder:text-[#757575]"
                    onChange={(event) => setPhone(event.target.value.replace(/[^\d\s]/g, ''))}
                  />
                  <button
                    type="button"
                    aria-label={t.checkout.phoneCode}
                    aria-expanded={phoneOpen}
                    aria-controls={phoneListId}
                    className="inline-flex size-6 items-center justify-center border-0 bg-transparent p-0"
                    onClick={() => setPhoneOpen((open) => !open)}
                  >
                    <Image
                      src="/images/catalog/lsicon_down-filled.svg"
                      alt=""
                      width={15}
                      height={9}
                      className={`transition-transform duration-200 ${phoneOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
                {phoneOpen ? (
                  <ul
                    id={phoneListId}
                    role="listbox"
                    className="absolute top-full z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-black/20 bg-white py-1 shadow-lg"
                  >
                    {phoneCountries.map((country) => (
                      <li key={country.iso}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={country.iso === phoneIso}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-black/5"
                          onClick={() => applyPhoneCountry(country.iso)}
                        >
                          <img
                            src={flagImageSrc(country.iso)}
                            alt=""
                            width={30}
                            height={20}
                            className="h-5 w-[30px] rounded-[2px] object-cover"
                          />
                          <span className="font-[family-name:var(--font-poppins)] text-[14px] text-black">
                            {locale === 'uk' ? country.nameUk : country.nameEn}
                          </span>
                          <span className="ml-auto font-[family-name:var(--font-poppins)] text-[14px] text-[#757575]">
                            {country.dial}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {errors.phone ? <span className="text-[12px] text-error">{errors.phone}</span> : null}
              </div>

              <label className="flex flex-col gap-2">
                <span className="font-[family-name:var(--font-poppins)] text-[16px] text-black">
                  {t.checkout.email}
                </span>
                <input
                  type="email"
                  value={email}
                  placeholder={t.checkout.emailPlaceholder}
                  className={`${inputClass} ${errors.email ? 'border-error' : ''}`}
                  onChange={(event) => setEmail(event.target.value)}
                />
                {errors.email ? <span className="text-[12px] text-error">{errors.email}</span> : null}
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="m-0 font-heading text-[20px] font-normal text-dark">
              {t.checkout.deliveryMethod}
            </h2>
            <Image
              src="/images/catalog/new-posta-icon.png"
              alt={t.checkout.novaPoshta}
              width={92}
              height={60}
              className="h-[60px] w-[92px]"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Image src="/images/catalog/basket-icon.svg" alt="" width={28} height={24} />
              <h2 className="m-0 font-heading text-[20px] font-normal text-black normal-case">
                {t.checkout.shippingInfo}
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SuggestField
                value={countryQuery}
                placeholder={t.checkout.country}
                options={countryOptions}
                emptyText={t.checkout.noMatches}
                error={errors.country}
                onOpen={() => undefined}
                onValueChange={(value) => {
                  setCountryQuery(value);
                  setCountryId('');
                  setCity('');
                  setCityRef('');
                  setWarehouse('');
                  setWarehouseRef('');
                }}
                onSelect={(option) => {
                  setCountryId(option.id);
                  setCountryQuery(option.label);
                  setPhoneIso(option.id);
                  setCity('');
                  setCityRef('');
                  setWarehouse('');
                  setWarehouseRef('');
                  setCityOptions([]);
                  setWarehouseOptions([]);
                }}
              />
              <SuggestField
                value={city}
                placeholder={t.checkout.city}
                options={cityOptions}
                loading={citiesLoading}
                emptyText={t.checkout.noMatches}
                error={errors.city}
                disabled={!novaPoshtaAvailable}
                onOpen={() => {
                  void loadCities(city);
                }}
                onValueChange={(value) => {
                  setCity(value);
                  setCityRef('');
                  setWarehouse('');
                  setWarehouseRef('');
                  if (cityTimer.current) window.clearTimeout(cityTimer.current);
                  cityTimer.current = window.setTimeout(() => {
                    void loadCities(value);
                  }, 250);
                }}
                onSelect={(option) => {
                  setCity(option.label);
                  setCityRef(option.id);
                  setWarehouse('');
                  setWarehouseRef('');
                }}
              />
            </div>

            <SuggestField
              value={warehouse}
              placeholder={t.checkout.warehouse}
              options={warehouseOptions}
              loading={warehousesLoading}
              emptyText={t.checkout.noMatches}
              error={errors.warehouse}
              disabled={!novaPoshtaAvailable || !cityRef}
              onOpen={() => {
                void loadWarehouses(warehouse);
              }}
              onValueChange={(value) => {
                setWarehouse(value);
                setWarehouseRef('');
                if (warehouseTimer.current) window.clearTimeout(warehouseTimer.current);
                warehouseTimer.current = window.setTimeout(() => {
                  void loadWarehouses(value);
                }, 250);
              }}
              onSelect={(option) => {
                setWarehouse(option.label);
                setWarehouseRef(option.id);
              }}
            />
            {countryId && !novaPoshtaAvailable ? (
              <p className="m-0 text-[12px] text-black/60">{t.checkout.npOnlyUkraine}</p>
            ) : null}
            {loadError ? <p className="m-0 text-[12px] text-error">{loadError}</p> : null}
          </div>

          <textarea
            value={notes}
            placeholder={t.checkout.notes}
            rows={3}
            className="min-h-[91px] w-full resize-y rounded-lg border border-black px-2.5 py-2.5 font-[family-name:var(--font-poppins)] text-[16px] text-black outline-none placeholder:text-[#646464]"
            onChange={(event) => setNotes(event.target.value)}
          />

          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              checked={saveAddress}
              className="mt-0.5 size-5 shrink-0 accent-black"
              onChange={(event) => setSaveAddress(event.target.checked)}
            />
            <span className="font-[family-name:var(--font-poppins)] text-[12px] text-[#757575]">
              {t.checkout.saveAddress}
            </span>
          </label>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <h2 className="m-0 font-heading text-[20px] font-normal text-dark">
                {t.checkout.paymentMethod}
              </h2>
              <Image src="/images/catalog/Edit.svg" alt="" width={24} height={24} />
            </div>
            <div className="flex flex-wrap gap-[23px]" role="radiogroup" aria-label={t.checkout.paymentMethod}>
              {payments.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  role="radio"
                  aria-checked={payment === method.id}
                  aria-label={method.alt}
                  className={`inline-flex h-[60px] w-[92px] items-center justify-center border-0 bg-transparent p-0 ${
                    payment === method.id ? 'rounded-[5px] outline outline-2 outline-black' : ''
                  }`}
                  onClick={() => setPayment(method.id)}
                >
                  <Image
                    src={method.src}
                    alt=""
                    width={92}
                    height={60}
                    className="h-[60px] w-[92px] object-contain"
                  />
                </button>
              ))}
            </div>
            {errors.payment ? <p className="m-0 text-[12px] text-error">{errors.payment}</p> : null}
            <label className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={agreed}
                className="mt-0.5 size-5 shrink-0 accent-black"
                onChange={(event) => setAgreed(event.target.checked)}
              />
              <span className="font-[family-name:var(--font-poppins)] text-[12px] text-[#757575] underline">
                <Link href="/terms" className="text-inherit">
                  {t.checkout.terms}
                </Link>
                {' · '}
                <Link href="/privacy" className="text-inherit">
                  {t.checkout.privacy}
                </Link>
              </span>
            </label>
            {errors.terms ? <p className="m-0 text-[12px] text-error">{errors.terms}</p> : null}
          </div>
        </div>

        <aside className="flex w-full flex-col gap-6 lg:w-[526px]">
          <div>
            <div className="flex items-center justify-between pb-4">
              <h2 className="m-0 font-heading text-[22px] font-normal text-black">
                {t.checkout.shoppingCard}
              </h2>
              <p className="m-0 font-heading text-[20px] font-normal text-black">{t.checkout.price}</p>
            </div>
            <div className="h-px bg-black/40" />
            {cartItems.length === 0 ? (
              <div className="py-10 text-center">
                <p className="m-0 font-heading text-[20px] text-black">{t.checkout.emptyTitle}</p>
                <p className="m-0 mt-2 font-sans text-[16px] text-black/60">{t.checkout.emptyText}</p>
                <Link
                  href="/catalog"
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-dark px-6 font-heading text-[16px] text-white"
                >
                  {t.checkout.toCatalog}
                </Link>
              </div>
            ) : (
              <ul className="m-0 max-h-[564px] list-none overflow-y-auto p-0">
                {cartItems.map((item) => (
                  <li
                    key={`${item.productId}-${item.variantId}`}
                    className="border-b border-black/40 py-4"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-[188px] w-[145px] shrink-0 items-center justify-center bg-white-fa p-2.5">
                        {item.imageSrc ? (
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt || item.title}
                            width={146}
                            height={188}
                            className="h-full w-full object-contain"
                          />
                        ) : null}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="m-0 font-sans text-[16px] leading-[1.2] font-bold text-black">
                          {item.brand}
                        </p>
                        <div className="mt-2 flex items-start justify-between gap-3">
                          <p className="m-0 font-heading text-[16px] leading-[1.2] text-black">
                            {item.title}
                          </p>
                          <p className="m-0 shrink-0 font-heading text-[24px] leading-[1.2] font-light text-black">
                            {formatPrice(item.price * item.quantity, item.currency)}
                          </p>
                        </div>
                        <p className="m-0 mt-2 font-heading text-[14px] leading-[1.5] font-light text-black">
                          {t.checkout.sku}: {item.sku || '—'}
                          <br />
                          {t.checkout.color}: {item.color || '—'}
                          <br />
                          {t.checkout.size}: {item.size || '—'}
                        </p>
                        <div className="mt-4 flex items-center gap-8">
                          <div className="flex h-11 w-[110px] items-center justify-between rounded-[10px] border border-black/40 px-2.5">
                            <button
                              type="button"
                              aria-label={t.checkout.decrease}
                              disabled={item.quantity <= 1}
                              className="inline-flex size-6 items-center justify-center border-0 bg-transparent p-0 disabled:opacity-40"
                              onClick={() => changeQuantity(item, item.quantity - 1)}
                            >
                              <Image src="/images/catalog/minus-icon.svg" alt="" width={24} height={24} />
                            </button>
                            <span className="font-sans text-[20px] leading-[1.2] text-black">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={t.checkout.increase}
                              className="inline-flex size-6 items-center justify-center border-0 bg-transparent p-0"
                              onClick={() => changeQuantity(item, item.quantity + 1)}
                            >
                              <Image src="/images/catalog/plus-icon.svg" alt="" width={24} height={24} />
                            </button>
                          </div>
                          <button
                            type="button"
                            aria-label={t.checkout.remove}
                            className="inline-flex size-6 items-center justify-center border-0 bg-transparent p-0"
                            onClick={() =>
                              dispatch(
                                removeFromCart({
                                  productId: item.productId,
                                  variantId: item.variantId,
                                }),
                              )
                            }
                          >
                            <Image
                              src="/images/catalog/basket-delete-icon.svg"
                              alt=""
                              width={24}
                              height={24}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <h2 className="m-0 font-heading text-[22px] leading-[1.5] font-normal text-black">
            {t.checkout.estimatedTotal}
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={promo}
              placeholder={t.checkout.promo}
              className={`${inputClass} sm:w-[391px]`}
              onChange={(event) => setPromo(event.target.value)}
            />
            <button
              type="button"
              className="inline-flex h-[51px] w-full items-center justify-center rounded-[5px] bg-dark px-6 font-[family-name:var(--font-poppins)] text-[16px] font-medium text-white-fa sm:w-[117px]"
              onClick={() => setPromoMessage(t.checkout.promoUnavailable)}
            >
              {t.checkout.apply}
            </button>
          </div>
          {promoMessage ? <p className="m-0 text-[12px] text-black/60">{promoMessage}</p> : null}

          <div className="h-px bg-black/40" />
          <dl className="m-0 flex flex-col gap-3">
            {[
              [t.checkout.subtotal, formatPrice(subtotal, currency)],
              [t.checkout.discount, formatPrice(discount, currency)],
              [t.checkout.shippingFee, formatPrice(shippingFee, currency)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <dt className="font-heading text-[20px] font-normal text-black">{label}</dt>
                <dd className="m-0 font-heading text-[24px] font-light text-black">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="h-px bg-black/40" />
          <div className="flex items-center justify-between gap-4">
            <p className="m-0 font-heading text-[26px] leading-[1.5] font-medium text-black">
              {t.checkout.total}
            </p>
            <p className="m-0 font-heading text-[24px] font-medium text-black">
              {formatPrice(total, currency)}
            </p>
          </div>
          <div className="h-px bg-black/40" />
          <p className="m-0 font-heading text-[20px] leading-[1.5] font-light text-black">
            {t.checkout.secureTitle}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              '/images/catalog/secure-paiment.svg',
              '/images/catalog/easy-30-days-returns.svg',
              '/images/catalog/free-shipping.svg',
            ].map((src) => (
              <div
                key={src}
                className="flex h-16 items-center justify-center rounded-[5px] border-2 border-[#c0c0c0] px-2"
              >
                <Image src={src} alt="" width={138} height={45} className="h-auto max-h-11 w-full object-contain" />
              </div>
            ))}
          </div>
          <div className="h-px bg-black/40" />
          <button
            type="submit"
            className="inline-flex h-14 w-full items-center justify-center rounded-lg bg-dark px-5 font-heading text-[16px] font-normal text-white"
          >
            {t.checkout.confirm}
          </button>
          {submitNote ? (
            <p role="status" className="m-0 text-[14px] leading-[1.4] text-black/70">
              {submitNote}
            </p>
          ) : null}
          <div className="flex items-center justify-center gap-1">
            <Image src="/images/catalog/si_lock-duotone.svg" alt="" width={24} height={24} />
            <p className="m-0 font-heading text-[12px] leading-[1.5] font-light text-[#757575]">
              {t.checkout.ssl}
            </p>
          </div>
        </aside>
      </form>
    </section>
  );
}
