'use client';

import { skipToken } from '@reduxjs/toolkit/query';
import { FormEvent, useState } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSessionEmail } from '@/features/auth/hooks/useSessionEmail';
import { useTranslation } from '@/i18n/useTranslation';
import { toImageUrl } from '@/store/api/mappers/products.mapper';
import { useGetProfileByIdQuery, usePatchProfileMutation, usePatchProfilePhotoMutation } from '@/store/endpoints/profilesEndpoints';
import type { Profile, ProfileUpdateInput } from '@/store/types';

import AdminPhotoEditor, { type AdminPhoto } from './AdminPhotoEditor';
import { formErrorText } from './formError';

const fieldClass =
  'h-11 w-full rounded-xl border border-[#e7eaf0] bg-[#f8f9fc] px-4 text-sm text-[#1d2433] outline-none transition-colors focus:border-[#3d6bff] focus:bg-white';
const labelClass = 'mb-1.5 block text-xs font-semibold tracking-wide text-[#8b93a1] uppercase';

type ProfileFormState = {
  first_name: string;
  last_name: string;
  phone: string;
};

const emptyForm: ProfileFormState = {
  first_name: '',
  last_name: '',
  phone: '',
};

function profileToForm(profile: Profile): ProfileFormState {
  return {
    first_name: profile.first_name ?? '',
    last_name: profile.last_name ?? '',
    phone: profile.phone ?? '',
  };
}

function profilePhoto(profile: Profile) {
  const extra = profile as Profile & { photo?: string | null; avatar?: string | null; image?: string | null };
  return toImageUrl(extra.photo || extra.avatar || extra.image || '');
}

function ProfileFields({
  initial,
  initialPhoto,
  userId,
  email,
}: {
  initial: ProfileFormState;
  initialPhoto: string;
  userId: number | null;
  email: string;
}) {
  const { t } = useTranslation();
  const [patchProfile, { isLoading }] = usePatchProfileMutation();
  const [patchProfilePhoto, photoState] = usePatchProfilePhotoMutation();
  const [form, setForm] = useState(initial);
  const [photos, setPhotos] = useState<AdminPhoto[]>(
    initialPhoto ? [{ key: 'profile-photo', src: initialPhoto }] : [],
  );
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const saving = isLoading || photoState.isLoading;

  function setField(name: keyof ProfileFormState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!userId) {
      setError(t.admin.signInToSave);
      return;
    }

    const body: ProfileUpdateInput = {
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
    };

    try {
      await patchProfile({ profile_id: userId, body }).unwrap();
      const file = photos[0]?.file;
      if (file) await patchProfilePhoto({ profile_id: userId, photo: file }).unwrap();
      setMessage(t.admin.saved);
    } catch (submitError) {
      setError(formErrorText(submitError, t.admin.saveError));
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgb(30_41_59/6%)]">
      <div className="flex items-start gap-8">
        <AdminPhotoEditor photos={photos} onChange={setPhotos} multiple={false} shape="avatar" label={t.admin.photo} />
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>{t.profile.firstName}</span>
            <input className={fieldClass} value={form.first_name} onChange={(event) => setField('first_name', event.target.value)} />
          </label>
          <label className="block">
            <span className={labelClass}>{t.profile.lastName}</span>
            <input className={fieldClass} value={form.last_name} onChange={(event) => setField('last_name', event.target.value)} />
          </label>
          <label className="block">
            <span className={labelClass}>{t.profile.phoneNumber}</span>
            <input className={fieldClass} type="tel" value={form.phone} onChange={(event) => setField('phone', event.target.value)} />
          </label>
          <label className="block">
            <span className={labelClass}>{t.profile.email}</span>
            <input className={`${fieldClass} text-[#6b7280]`} value={email} readOnly />
          </label>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-end gap-4 border-t border-[#f0f2f6] pt-5">
        {message ? <p className="m-0 text-sm text-[#16a34a]">{message}</p> : null}
        {error ? <p className="m-0 text-sm text-[#ef4444]">{error}</p> : null}
        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer rounded-xl border-0 bg-[#3d6bff] px-6 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_rgb(61_107_255/28%)] disabled:opacity-60"
        >
          {saving ? t.common.saving : t.admin.save}
        </button>
      </div>
    </form>
  );
}

export default function AdminProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { email } = useSessionEmail();
  const userId = user?.id ?? null;
  const profile = useGetProfileByIdQuery(userId ?? skipToken);
  const initial = profile.data ? profileToForm(profile.data) : emptyForm;
  const initialPhoto = profile.data ? profilePhoto(profile.data) : '';

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
      <div>
        <h1 className="m-0 text-[28px] leading-tight font-bold">{t.admin.profile}</h1>
        <p className="m-0 mt-1 text-sm text-[#9aa1ad]">{t.profile.personalDataTitle}</p>
      </div>
      {profile.isLoading ? <p className="m-0 text-sm text-[#6b7280]">{t.common.loading}</p> : null}
      <ProfileFields
        key={`${userId ?? 'guest'}-${profile.data?.id ?? 'empty'}-${initialPhoto}`}
        initial={initial}
        initialPhoto={initialPhoto}
        userId={userId}
        email={email || user?.email || ''}
      />
    </div>
  );
}
