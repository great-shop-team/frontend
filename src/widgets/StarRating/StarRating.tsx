'use client';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Rating {
  count: number;
}

export default function StarRating({ count = 0 }: Rating) {
  const stars = Array.from({ length: 5 });

  const [currentItem, setCurrentItem] = useState<number>(count);
  const [hoverItem, setHoverItem] = useState<number>(0);

  return (
    <div className="flex max-h-[110px] max-w-[130px]">
      {stars.map((_, index) => {
        const icon = index <= (hoverItem || currentItem) ? faStar : regularStar;
        return (
          <FontAwesomeIcon
            onMouseMove={() => setHoverItem(index)}
            onMouseOut={() => setHoverItem(0)}
            key={index}
            icon={icon}
            onClick={() => setCurrentItem(index)}
          />
        );
      })}
    </div>
  );
}
