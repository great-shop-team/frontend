'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { useState } from 'react';
import { useChangePasswordMutation } from '@/store/endpoints/authEndpoints';

interface FormChangePassword {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
const inputStyle = 'rounded-lg border border-[#222] py-2 px-2 rounded-lg max-w-3/4 my-3';
const ChangePassword = () => {
  const { t } = useTranslation();

  const [form, setForm] = useState<FormChangePassword>({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword(form).unwrap();
    } catch (err) {
      console.error(err);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <p className="text-[20px] font-normal my-4"> {t.profile.changePassword}</p>

        <label htmlFor="currentPassword">{t.changePassword.currentPassword}</label>
        <input
          className={inputStyle}
          id="oldPassword"
          name="old_password"
          type="text"
          placeholder={t.changePassword.EnterCurrentPassword}
          onChange={handleChange}
        />

        <label htmlFor="currentPassword">{t.changePassword.NewPassword}</label>
        <input
          className={inputStyle}
          id="newPassword"
          name="new_password"
          type="text"
          placeholder={t.changePassword.MinCharacters}
          onChange={handleChange}
        />

        <label htmlFor="currentPassword">{t.changePassword.ConfirmNewPassword}</label>
        <input
          className={inputStyle}
          id="confirmPassword"
          name="confirm_password"
          type="text"
          placeholder={t.changePassword.RepeatNewPassword}
          onChange={handleChange}
        />
        <button
          type={'submit'}
          disabled={isLoading}
          className={'border border-[#333] py-3 max-w-1/5 my-5 rounded-lg bg-[#FAFAFA]'}
        >
          {t.changePassword.SaveChanges}
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;
