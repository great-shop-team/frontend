export type PhoneCountry = {
  iso: string;
  dial: string;
  nameEn: string;
  nameUk: string;
};

export const phoneCountries: PhoneCountry[] = [
  { iso: 'UA', dial: '+380', nameEn: 'Ukraine', nameUk: 'Україна' },
  { iso: 'PL', dial: '+48', nameEn: 'Poland', nameUk: 'Польща' },
  { iso: 'DE', dial: '+49', nameEn: 'Germany', nameUk: 'Німеччина' },
  { iso: 'CZ', dial: '+420', nameEn: 'Czechia', nameUk: 'Чехія' },
  { iso: 'SK', dial: '+421', nameEn: 'Slovakia', nameUk: 'Словаччина' },
  { iso: 'RO', dial: '+40', nameEn: 'Romania', nameUk: 'Румунія' },
  { iso: 'MD', dial: '+373', nameEn: 'Moldova', nameUk: 'Молдова' },
  { iso: 'LT', dial: '+370', nameEn: 'Lithuania', nameUk: 'Литва' },
  { iso: 'LV', dial: '+371', nameEn: 'Latvia', nameUk: 'Латвія' },
  { iso: 'EE', dial: '+372', nameEn: 'Estonia', nameUk: 'Естонія' },
  { iso: 'GB', dial: '+44', nameEn: 'United Kingdom', nameUk: 'Велика Британія' },
  { iso: 'FR', dial: '+33', nameEn: 'France', nameUk: 'Франція' },
  { iso: 'IT', dial: '+39', nameEn: 'Italy', nameUk: 'Італія' },
  { iso: 'ES', dial: '+34', nameEn: 'Spain', nameUk: 'Іспанія' },
  { iso: 'NL', dial: '+31', nameEn: 'Netherlands', nameUk: 'Нідерланди' },
  { iso: 'US', dial: '+1', nameEn: 'United States', nameUk: 'США' },
  { iso: 'CA', dial: '+1', nameEn: 'Canada', nameUk: 'Канада' },
  { iso: 'TR', dial: '+90', nameEn: 'Turkey', nameUk: 'Туреччина' },
  { iso: 'GE', dial: '+995', nameEn: 'Georgia', nameUk: 'Грузія' },
];

export function flagImageSrc(iso: string) {
  return `/images/flags/${iso.toLowerCase()}.png`;
}

export const deliveryCountries = phoneCountries.map((country) => ({
  id: country.iso,
  nameEn: country.nameEn,
  nameUk: country.nameUk,
}));
