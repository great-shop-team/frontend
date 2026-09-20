import {
  useGetFavoritesUserListQuery,
  useDeleteFavoriteMutation,
} from '@/store/endpoints/favoritesEndpoints';
import { useEffect, useState } from 'react';
import { FavoriteUserList } from '@/store/types';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const AllFavorites = () => {
  const { data, isError } = useGetFavoritesUserListQuery();
  const [deleteFavoriteId, { isLoading: isDeleting }] = useDeleteFavoriteMutation();
  const [favoriteId, setFavoriteId] = useState();

  if (isError) {
    return <div>Error</div>;
  }

  function deletedFavorite(id) {
    if (!favoriteId.includes(id)) {
      setFavoriteId([...favoriteId, id]);
    } else {
      setFavoriteId(favoriteId.filter((item) => item !== id));
    }
  }
  function handleDelete(id: number) {
    deleteFavoriteId(id);
  }
  useEffect(() => {
    if (data) {
      setFavoriteId(data.map((item) => item.id));
    }
  }, [data]);
  return (
    <div className={'flex flex-row flex-wrap'}>
      {data?.map((item, key) => (
        <div key={item.product_variant.id} className="bg-[#F7F7F6] m-4 rounded-lg">
          <div className={' px-2  '}>
            <div className={'relative'}>
              <div className={'flex justify-between absolute top-4 left-5 right-5 '}>
                <NotificationsNoneIcon className={''}  />
                {favoriteId?.includes(item.id) ? (
                  <FavoriteOutlinedIcon
                    onClick={() => {
                      {
                        deletedFavorite(item.id);
                        handleDelete(item.id);
                      }
                    }}
                    className={''}
                  />
                ) : (
                  <FavoriteBorderOutlinedIcon onClick={() => deletedFavorite(item.id)} />
                )}
              </div>

              <img
                className={'w-[270px] h-[320px] p-3 rounded-lg '}
                src={item.product_variant.images?.[0]?.image}
              />
            </div>
            {}
          </div>
          <div>
            <p className={' px-5 m-0 text-xs opacity-60'}>{item.product_variant.gender}</p>
            <p className={'font-bold px-5 m-0 text-base'}>{item.product_variant.color.name}</p>
            <p className={'font-bold px-5 m-0'}>${Number(item.product_variant.price)}</p>
          </div>
          <div className={'flex items-center gap-1 my-3 px-2'}>
            <button className={'border py-2 px-12 rounded-lg bg-black text-white'}>
              Add to cart
            </button>
            <p className={'m-0 border py-2 px-4 rounded-lg opacity-60'}>
              {item.product_variant.size.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllFavorites;
