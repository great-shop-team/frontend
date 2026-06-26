'use client';

import Image from 'next/image';
import Link from 'next/link';
import StarRating from '@/widgets/StarRating/StarRating';
import { useEffect, useMemo, useState } from 'react';

interface ProductShowcaseProps {
  brand: string;
  title: string;
  description: string[];
  price: {
    current: number;
    currency: string;
  };
  code: string;
  rating: number;
  size: string[];

  images: {
    main: {
      front: { src: string; alt: string };
      back: { src: string; alt: string };
    };
    gallery: { src: string; alt: string }[];
    colors: { src: string; alt: string }[];
  };

  link: {
    href: string;
    label: string;
  };

  breadcrumbs: {
    label: string;
    href?: string;
    current?: boolean;
  }[];
}

const INFO_TABS = [
  {
    id: 'materials',
    label: 'Materials and design details',
    content:
      'Premium fabrics, clean construction and a relaxed silhouette designed for everyday wear.',
  },
  {
    id: 'measurements',
    label: 'Measurements',
    content:
      'Designed with an oversized fit. Choose your usual size for the intended shape or size down for a cleaner outline.',
  },
  {
    id: 'packaging',
    label: 'Packaging',
    content:
      'Your order is packed in a protective branded package to keep the garment in perfect condition during delivery.',
  },
  {
    id: 'shipping',
    label: 'Shipping and returns',
    content:
      'Fast worldwide delivery and a simple return flow. Final shipping timing depends on your region and selected method.',
  },
];

const SIDEBAR_ANIMATION_DURATION_MS = 300;
const IMAGE_MODAL_ANIMATION_DURATION_MS = 360;

export default function ProductShowcase({
  brand,
  title,
  description,
  price,
  code,
  rating,
  images,
  size,
  breadcrumbs,
}: ProductShowcaseProps) {
  const [currentSize, setCurrentSize] = useState<number>();
  const [currentColor, setCurrentColor] = useState<number>();
  const [isSidebarRendered, setIsSidebarRendered] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [isImageModalRendered, setIsImageModalRendered] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const previewImages = useMemo(() => {
    const allImages = [images.main.front, images.main.back, ...images.gallery].filter(
      (item) => item.src,
    );

    const uniqueImages = allImages.filter(
      (item, index, array) => array.findIndex((candidate) => candidate.src === item.src) === index,
    );

    return uniqueImages.length > 0 ? uniqueImages : [images.main.front].filter((item) => item.src);
  }, [images]);

  const galleryPreviewImages =
    images.gallery.length > 0 ? images.gallery : [images.main.front].filter((item) => item.src);

  const hasMultiplePreviewImages = previewImages.length > 1;

  const activePreviewImage = previewImages[activePreviewIndex] ?? previewImages[0];
  const displayCurrency = price.currency === 'USD' ? '$' : price.currency;

  const openImageModal = () => {
    setSelectedImageIndex(activePreviewIndex);

    if (isImageModalRendered) {
      setIsImageModalVisible(true);
      return;
    }

    setIsImageModalRendered(true);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsImageModalVisible(true);
      });
    });
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
  };

  const handleShowPreviousImage = () => {
    if (!hasMultiplePreviewImages) {
      return;
    }

    setSelectedImageIndex((prev) => (prev === 0 ? previewImages.length - 1 : prev - 1));
  };

  const handleShowNextImage = () => {
    if (!hasMultiplePreviewImages) {
      return;
    }

    setSelectedImageIndex((prev) => (prev === previewImages.length - 1 ? 0 : prev + 1));
  };

  const handleOpenSidebar = (tabId: string) => {
    setActiveTab(tabId);

    if (isSidebarRendered) {
      setIsSidebarVisible(true);
      return;
    }

    setIsSidebarRendered(true);
    window.requestAnimationFrame(() => {
      setIsSidebarVisible(true);
    });
  };

  const handleCloseSidebar = () => {
    setIsSidebarVisible(false);
  };

  const handleToggleTab = (tabId: string) => {
    setActiveTab((prev) => (prev === tabId ? null : tabId));
  };

  useEffect(() => {
    document.body.style.overflow = isSidebarRendered || isImageModalRendered ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isImageModalRendered, isSidebarRendered]);

  useEffect(() => {
    if (!isSidebarRendered || isSidebarVisible) {
      return;
    }

    const closeTimeout = window.setTimeout(() => {
      setIsSidebarRendered(false);
      setActiveTab(null);
    }, SIDEBAR_ANIMATION_DURATION_MS);

    return () => {
      window.clearTimeout(closeTimeout);
    };
  }, [isSidebarRendered, isSidebarVisible]);

  useEffect(() => {
    if (!isImageModalRendered || isImageModalVisible) {
      return;
    }

    const closeTimeout = window.setTimeout(() => {
      setIsImageModalRendered(false);
    }, IMAGE_MODAL_ANIMATION_DURATION_MS);

    return () => {
      window.clearTimeout(closeTimeout);
    };
  }, [isImageModalRendered, isImageModalVisible]);

  useEffect(() => {
    if (!isImageModalRendered) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeImageModal();
      }

      if (event.key === 'ArrowLeft' && hasMultiplePreviewImages) {
        setSelectedImageIndex((prev) => (prev === 0 ? previewImages.length - 1 : prev - 1));
      }

      if (event.key === 'ArrowRight' && hasMultiplePreviewImages) {
        setSelectedImageIndex((prev) => (prev === previewImages.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasMultiplePreviewImages, isImageModalRendered, previewImages.length]);

  return (
    <section className="mb-24 pt-10.5">
      <nav
        aria-label="Breadcrumb"
        className="mb-10 flex flex-wrap items-center gap-2 text-[16px] leading-[1.2] text-black/70"
      >
        {breadcrumbs.map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !item.current ? (
              <Link href={item.href} className="transition-opacity duration-200 hover:opacity-100">
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}

            {index < breadcrumbs.length - 1 ? <span>/</span> : null}
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-12 xl:flex-row xl:gap-16">
        <div className="w-full max-w-157.5 shrink-0">
          <div className="relative flex min-h-105 items-center justify-center overflow-hidden bg-[#f3f3f3] p-6 sm:min-h-132.75">
            {activePreviewImage ? (
              <Image
                src={activePreviewImage.src}
                alt={activePreviewImage.alt}
                width={310}
                height={531}
                className="h-auto max-h-132.75 w-auto object-contain"
              />
            ) : null}

            <button
              type="button"
              className="absolute right-4 bottom-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-black bg-white-fa transition-transform duration-200 hover:scale-105"
              onClick={openImageModal}
              aria-label="Open image gallery"
            >
              <Image src="/icons/plus-sign-in-a-circle.svg" alt="" width={28} height={28} />
            </button>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-4">
            {galleryPreviewImages.map((item, index) => (
              <button
                type="button"
                key={`${item.src}-${index}`}
                className="flex h-52 w-36.25 cursor-pointer items-center justify-center overflow-hidden bg-[#f3f3f3] p-4 transition-transform duration-300 hover:-translate-y-0.5"
                onClick={() =>
                  setActivePreviewIndex(
                    Math.max(
                      0,
                      previewImages.findIndex((previewImage) => previewImage.src === item.src),
                    ),
                  )
                }
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={145}
                  height={208}
                  className={`h-full w-full object-contain transition-opacity duration-200 ${
                    activePreviewImage?.src === item.src ? 'opacity-100' : 'opacity-75'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="w-full flex-1 xl:max-w-130 xl:pt-1">
          <p className="mb-2 font-sans text-[16px] font-normal text-black">{brand}</p>
          <div className="mb-6 flex items-start justify-between gap-6">
            <div>
              <h1 className="mb-0 max-w-[320px] text-[24px] leading-[1.2] font-bold">{title}</h1>
            </div>
            <div
              className="min-w-18 pt-1 text-right text-[24px] leading-[120%] font-light text-black whitespace-nowrap"
              style={{ fontFamily: 'var(--second-family)' }}
            >
              {'\u00A0'}
              {displayCurrency}
              {price.current}
            </div>
          </div>

          <div className="mb-4 max-w-82.5 font-sans text-[16px] leading-6 text-black/80">
            {description.map((item, key) => (
              <p className="mb-3" key={key}>
                {item}
              </p>
            ))}
          </div>

          <p className="mb-4 font-sans text-[16px] leading-[1.2] text-black/70">
            Product-code:{code}
          </p>

          <div className="mb-5">
            <StarRating count={rating} />
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {size.map((item, key) => (
              <button
                type="button"
                key={key}
                onClick={() => setCurrentSize(key)}
                className={`inline-flex h-8 min-w-10 items-center justify-center rounded-[10px] border border-black px-3 font-sans text-[14px] leading-none transition-colors duration-200 ${
                  key === currentSize ? 'bg-black text-white-fa' : 'bg-white text-black'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {images.colors.length > 0 ? (
            <>
              <p className="mb-3 font-sans text-[16px] leading-[1.2] text-black">Color</p>
              <div className="mb-8 flex flex-wrap gap-4">
                {images.colors.map((item, key) => (
                  <button
                    type="button"
                    key={`${item.src}-${key}`}
                    onClick={() => setCurrentColor(key)}
                    className={`overflow-hidden border-b pb-1 transition-colors duration-200 ${
                      key === currentColor ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={112}
                      height={124}
                      className="h-31 w-28 object-contain bg-[#f3f3f3]"
                    />
                  </button>
                ))}
              </div>
            </>
          ) : null}

          <div className="mb-8 flex flex-wrap gap-4">
            <button
              type="button"
              className="inline-flex h-12 min-w-35 items-center justify-center rounded-[10px] border border-black bg-black px-6 font-sans text-[16px] font-medium text-white-fa transition-opacity duration-200 hover:opacity-90"
            >
              Buy now
            </button>
            <button
              type="button"
              className="inline-flex h-12 min-w-35 items-center justify-center rounded-[10px] border border-black px-6 font-sans text-[16px] font-normal text-black transition-colors duration-200 hover:bg-black hover:text-white-fa"
            >
              Add to cart
            </button>
          </div>

          <div className="flex flex-col border-t border-black/10">
            {INFO_TABS.map((tab) => (
              <button
                type="button"
                key={tab.id}
                className="flex w-full items-center justify-between border-b border-black/10 bg-transparent py-4 text-left font-sans text-[16px] leading-[1.2] text-black transition-opacity duration-200 hover:opacity-70"
                onClick={() => handleOpenSidebar(tab.id)}
              >
                <span>{tab.label}</span>
                <span className="text-[20px] leading-none">{'>'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {isSidebarRendered && (
        <>
          <div
            className={`fixed inset-0 z-110 bg-black/10 transition-[opacity,backdrop-filter] duration-300 ${
              isSidebarVisible ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'
            }`}
            onClick={handleCloseSidebar}
          />

          <div
            className={`fixed top-0 right-0 z-111 flex h-screen w-full max-w-135 flex-col bg-white px-8 py-7 shadow-[-4px_0_24px_rgb(0_0_0/10%)] transition-transform duration-300 ease-out sm:px-10 ${
              isSidebarVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="mb-8 flex items-start justify-between gap-4 border-b border-black/10 pb-5">
              <div>
                <p className="mb-2 font-heading text-[24px] leading-[1.2] font-light text-black">
                  Info
                </p>
                <p className="mb-0 font-sans text-[12px] leading-[1.4] text-black/60">{title}</p>
              </div>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black bg-white transition-transform duration-200 hover:scale-105"
                onClick={handleCloseSidebar}
                aria-label="Close info"
              >
                <span className="relative block h-5 w-5">
                  <span className="absolute top-1/2 left-0 h-px w-5 -translate-y-1/2 rotate-45 bg-black" />
                  <span className="absolute top-1/2 left-0 h-px w-5 -translate-y-1/2 -rotate-45 bg-black" />
                </span>
              </button>
            </div>

            <div className="flex flex-col">
              {INFO_TABS.map((tab) => (
                <div key={tab.id} className="border-b border-black/10 py-5">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between bg-transparent text-left font-sans text-[16px] leading-[1.2] font-normal text-black"
                    onClick={() => handleToggleTab(tab.id)}
                    aria-expanded={activeTab === tab.id}
                  >
                    {tab.label}
                    <span
                      aria-hidden="true"
                      className="inline-flex h-5 w-5 items-center justify-center"
                    >
                      <span
                        className={`h-2.5 w-2.5 border-r border-b border-black transition-transform duration-300 ${
                          activeTab === tab.id
                            ? '-translate-y-px rotate-[-135deg]'
                            : 'translate-y-px rotate-45'
                        }`}
                      />
                    </span>
                  </button>
                  <div
                    aria-hidden={activeTab !== tab.id}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                      activeTab === tab.id
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div
                      className={`overflow-hidden font-sans text-[14px] leading-[1.6] text-black/70 transition-[transform,margin-top] duration-300 ${
                        activeTab === tab.id ? 'mt-4 translate-y-0' : '-translate-y-2 mt-0'
                      }`}
                    >
                      <p className="m-0">{tab.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {isImageModalRendered && previewImages[selectedImageIndex] && (
        <div
          className={`fixed inset-0 z-120 bg-black/20 transition-[opacity,backdrop-filter] duration-360 ease-out ${
            isImageModalVisible ? 'opacity-100 backdrop-blur-[18px]' : 'opacity-0 backdrop-blur-0'
          }`}
          onClick={closeImageModal}
        >
          <div className="relative z-1 h-full overflow-y-auto">
            <div className="flex min-h-screen items-start justify-center px-6 pt-28.5 pb-10 xl:px-20">
              <button
                type="button"
                className={`fixed top-7 right-7 z-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-black bg-white-fa transition-[transform,opacity] duration-360 ease-out hover:scale-105 ${
                  isImageModalVisible ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  closeImageModal();
                }}
                aria-label="Close image gallery"
              >
                <span className="relative block h-5 w-5">
                  <span className="absolute top-1/2 left-0 h-px w-5 -translate-y-1/2 rotate-45 bg-black" />
                  <span className="absolute top-1/2 left-0 h-px w-5 -translate-y-1/2 -rotate-45 bg-black" />
                </span>
              </button>

              <div
                className={`w-full max-w-211.5 max-h-[819vh] transition-[transform,opacity] duration-360 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isImageModalVisible
                    ? 'translate-y-0 scale-100 opacity-100'
                    : 'translate-y-6 scale-[0.985] opacity-0'
                }`}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex w-full flex-col gap-8 xl:flex-row xl:items-start xl:gap-18.5">
                  <div className="flex w-full flex-1 flex-col items-center">
                    <div className="relative flex h-204.75 w-211.5 max-w-full items-center justify-center bg-white-fa px-8 py-10">
                      <Image
                        src={previewImages[selectedImageIndex].src}
                        alt={previewImages[selectedImageIndex].alt}
                        width={846}
                        height={819}
                        className="h-auto max-h-full w-auto max-w-full object-contain"
                      />

                      <span className="pointer-events-none absolute right-8 bottom-8 inline-flex h-12 w-12 items-center justify-center">
                        <Image
                          src="/icons/video-start-arrow.svg"
                          alt="Play preview"
                          width={48}
                          height={49}
                        />
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-center gap-6">
                      <button
                        type="button"
                        className="inline-flex h-11 w-11 items-center justify-center disabled:cursor-default disabled:opacity-40"
                        onClick={handleShowPreviousImage}
                        disabled={!hasMultiplePreviewImages}
                        aria-label="Previous image"
                      >
                        <Image src="/icons/arrow-left.svg" alt="" width={44} height={44} />
                      </button>

                      <button
                        type="button"
                        className="inline-flex h-11 w-11 items-center justify-center disabled:cursor-default disabled:opacity-40"
                        onClick={handleShowNextImage}
                        disabled={!hasMultiplePreviewImages}
                        aria-label="Next image"
                      >
                        <Image src="/icons/arrow-right.svg" alt="" width={44} height={44} />
                      </button>
                    </div>
                  </div>

                  <div
                    className={`w-full shrink-0 transition-[transform,opacity] delay-75 duration-360 ease-out xl:w-49.25 ${
                      isImageModalVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                  >
                    <div className="flex max-h-236 flex-row gap-4 overflow-x-auto xl:flex-col xl:gap-6 xl:overflow-y-auto xl:overflow-x-visible">
                      {previewImages.map((item, index) => {
                        const isActive = selectedImageIndex === index;

                        return (
                          <button
                            type="button"
                            key={`${item.src}-${index}`}
                            className={`relative flex h-54.5 w-49.25 shrink-0 items-center justify-center overflow-hidden bg-white px-4 py-3 transition-opacity duration-200 ${
                              isActive ? 'opacity-100' : 'opacity-70'
                            }`}
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <Image
                              src={item.src}
                              alt={item.alt}
                              width={197}
                              height={218}
                              className="h-full w-full object-contain"
                            />

                            {isActive ? (
                              <span className="absolute right-0 bottom-0 left-0 h-px bg-black" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
