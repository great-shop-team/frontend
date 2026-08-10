'use client';

import Image from 'next/image';
import Link from 'next/link';

import { formatMessage, useTranslation } from '@/i18n/useTranslation';

const REVIEW_COUNT = 24;
const AVERAGE_RATING = 4.3;

const REVIEWS = [
  {
    initials: 'JD',
    name: 'Jack Daniels',
    rating: 5,
    comment: 'very nice hoodie',
    date: '08.08.2026',
  },
  {
    initials: 'MS',
    name: 'Maria S.',
    rating: 5,
    comment: '100% cotton!!! Fine quality.',
    date: '31.07.2026',
  },
  {
    initials: 'PP',
    name: 'P. Peters',
    rating: 4,
    comment: 'Hoodie is good.',
    date: '29.07.2026',
  },
] as const;

function SummaryStars() {
  return (
    <div className="flex items-center gap-1.25">
      {Array.from({ length: 4 }).map((_, index) => (
        <Image key={`filled-${index}`} src="/icons/Star1.svg" alt="" width={20} height={19} />
      ))}
      <Image src="/icons/Star5.svg" alt="" width={20} height={19} />
    </div>
  );
}

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Image
          key={index}
          src={index < rating ? '/icons/star-small-filled.svg' : '/icons/star-small-empty.svg'}
          alt=""
          width={14}
          height={14}
        />
      ))}
    </div>
  );
}

function RatingDistribution({ alt }: { alt: string }) {
  const starLevels = [5, 4, 3, 2, 1];

  return (
    <div className="flex w-47.25 items-start gap-3.25">
      <div className="flex gap-1.5">
        <div className="flex h-30.75 flex-col justify-between font-heading text-[16px] leading-[1.2] font-light text-black">
          {starLevels.map((level) => (
            <span key={level}>{level}</span>
          ))}
        </div>

        <div className="flex h-29.75 flex-col justify-between pt-0.5">
          {starLevels.map((level) => (
            <Image key={level} src="/icons/star-column.svg" alt="" width={15} height={14} />
          ))}
        </div>
      </div>

      <Image src="/icons/rating-bars.svg" alt={alt} width={138} height={109} className="mt-1.75" />
    </div>
  );
}

function ReviewSummary() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full max-w-77.25 shrink-0 flex-col gap-4.75">
      <div className="flex w-full flex-col gap-3.25">
        <h2 className="m-0 font-heading text-[22px] leading-[1.2] font-normal text-black">
          {formatMessage(t.product.reviews.title, { count: REVIEW_COUNT })}
        </h2>

        <div className="flex h-7.25 items-center gap-2.75">
          <span className="font-heading text-[24px] leading-[1.2] font-normal text-black">
            {AVERAGE_RATING}
          </span>
          <SummaryStars />
        </div>
      </div>

      <div className="flex w-47.25 flex-col gap-6.5">
        <RatingDistribution alt={t.product.reviews.ratingDistributionAlt} />

        <button
          type="button"
          className="inline-flex h-11.25 w-47.25 items-center justify-center rounded-lg border border-black bg-white-fa px-5 font-heading text-[14px] font-normal text-[#4d4d4d] transition-colors duration-200 hover:bg-[#f0f0f0]"
        >
          {t.product.reviews.writeReview}
        </button>
      </div>
    </div>
  );
}

function ReviewItem({
  initials,
  name,
  rating,
  comment,
  date,
}: {
  initials: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}) {
  return (
    <article className="flex w-full gap-6">
      <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-[30px] bg-[#d9d9d9] font-heading text-[16px] leading-none font-light text-black">
        {initials}
      </div>

      <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="m-0 font-heading text-[16px] font-light text-black">{name}</p>
          <div className="mt-1">
            <ReviewStars rating={rating} />
          </div>
          <p className="mt-2 mb-0 font-heading text-[12px] font-light text-black">{comment}</p>
        </div>

        <time className="shrink-0 font-heading text-[12px] font-extralight text-black">{date}</time>
      </div>
    </article>
  );
}

function ReviewList() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full max-w-188.5 flex-1 flex-col gap-4">
      {REVIEWS.map((review) => (
        <div key={review.initials} className="w-full">
          <div className="min-h-21.5 w-full">
            <ReviewItem {...review} />
          </div>
          <div className="h-0 w-full border-b border-[#d9d9d9]" />
        </div>
      ))}

      <Link
        href="/"
        className="self-start bg-transparent p-0 font-sans text-[14px] font-normal text-[#757575] underline decoration-skip-ink-none"
      >
        {t.product.reviews.viewMore}
      </Link>
    </div>
  );
}

export default function ProductReviews() {
  const { t } = useTranslation();

  return (
    <section className="mb-24" aria-label={t.product.reviews.ariaLabel}>
      <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:gap-54.25">
        <ReviewSummary />
        <ReviewList />
      </div>
    </section>
  );
}
