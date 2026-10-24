import { api } from '../api';
import { Profile, ProfileUpdateInput } from '../types';

const profilesEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfiles: builder.query<Profile[], void>({
      query: () => '/api/profiles/',
      providesTags: ['Profile'],
    }),
    getProfileById: builder.query<Profile, number>({
      query: (profile_id) => `/api/profiles/${profile_id}/`,
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<Profile, { profile_id: number; body: ProfileUpdateInput }>({
      query: ({ profile_id, body }) => ({
        url: `/api/profiles/${profile_id}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    patchProfile: builder.mutation<Profile, { profile_id: number; body: ProfileUpdateInput }>({
      query: ({ profile_id, body }) => ({
        url: `/api/profiles/${profile_id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    patchProfilePhoto: builder.mutation<Profile, { profile_id: number; photo: File }>({
      query: ({ profile_id, photo }) => {
        const body = new FormData();
        body.append('photo', photo);
        return { url: `/api/profiles/${profile_id}/`, method: 'PATCH', body };
      },
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetProfilesQuery,
  useGetProfileByIdQuery,
  useUpdateProfileMutation,
  usePatchProfileMutation,
  usePatchProfilePhotoMutation,
} = profilesEndpoints;
