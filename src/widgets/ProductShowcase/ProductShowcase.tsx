'use client';
import Image from 'next/image';
import StarRating from '@/widgets/StarRating/StarRating';
import { useEffect, useState } from 'react';

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
}

const INFO_TABS = [
  { id: 'materials', label: 'Materials and design details' },
  { id: 'measurements', label: 'Measurements' },
  { id: 'packaging', label: 'Packaging' },
  { id: 'shipping', label: 'Shipping and returns' },
];

const SIDEBAR_ANIMATION_DURATION_MS = 300;

export default function ProductShowcase({
  brand,
  title,
  description,
  price,
  code,
  rating,
  images,
  size,
}: ProductShowcaseProps) {
  const [currentSize, setCurrentSize] = useState<number>();
  const [currentColor, setCurrentColor] = useState<number>();
  const [isSidebarRendered, setIsSidebarRendered] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

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
    document.body.style.overflow = isSidebarRendered ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarRendered]);

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

  return (
    <div className="mb-[10%] flex">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 items-center">
          <div>
            <Image
              src={images.main.front.src}
              alt={images.main.front.alt}
              width={310}
              height={531}
            />
          </div>
          <div>
            <Image src={images.main.back.src} alt={images.main.back.alt} width={310} height={531} />
          </div>
        </div>

        <div className="flex flex-1 items-center">
          {images.gallery.map((item, key) => (
            <Image key={key} src={item.src} alt={item.alt} width={145} height={208} />
          ))}
        </div>
      </div>

      <div className="ml-[13%] flex flex-1 flex-col">
        <h2>{brand}</h2>
        <div className="flex justify-start gap-[50%]">
          <h1>{title}</h1>
          <div>
            {price.current} {price.currency}
          </div>
        </div>
        <div>
          {description.map((item, key) => (
            <ul className="max-w-[50%]" key={key}>
              {item}
            </ul>
          ))}
        </div>
        <ul className="mt-2.5">Product-code:{code}</ul>
        <div className="my-[3%]">
          <StarRating count={rating} />
        </div>
        <div className="my-[3%] flex flex-row gap-[1%]">
          {size.map((item, key) => (
            <button
              type="button"
              key={key}
              onClick={() => setCurrentSize(key)}
              className={`w-[10%] rounded-lg border border-[#666666] p-[2%] ${
                key === currentSize ? 'bg-dark text-white-fa' : ''
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        Color
        <div className="flex flex-row">
          {images.colors.map((item, key) => (
            <Image
              key={key}
              src={item.src}
              alt={item.alt}
              width={152}
              height={168}
              onClick={() => setCurrentColor(key)}
              className={`cursor-pointer ${key === currentColor ? 'border-b border-dark' : ''}`}
            />
          ))}
        </div>
        <div className="my-[3%] flex flex-row gap-[3%]">
          <button
            type="button"
            className="border border-[#666666] bg-dark px-[10%] py-[2%] text-white-fa"
          >
            Buy now
          </button>
          <button type="button" className="border border-[#666666] px-[10%] py-[2%]">
            Add to cart
          </button>
        </div>
        <div className="flex flex-col gap-[4%]">
          {INFO_TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              className="flex w-full max-w-[50%] items-center justify-between border-b border-transparent bg-transparent py-2 text-left transition-colors duration-200 hover:border-dark"
              onClick={() => handleOpenSidebar(tab.id)}
            >
              {tab.label} <span>{'>'}</span>
            </button>
          ))}
        </div>
      </div>

      {isSidebarRendered && (
        <>
          <div
            className={`fixed top-0 left-0 z-9998 h-screen w-screen bg-black/15 transition-[opacity,backdrop-filter] duration-300 ${
              isSidebarVisible ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'
            }`}
            onClick={handleCloseSidebar}
          />

          <div
            className={`fixed top-0 right-0 z-9999 box-border flex h-screen w-112.5 max-w-screen flex-col bg-white p-10 shadow-[-4px_0_24px_rgb(0_0_0/10%)] transition-transform duration-300 ease-out ${
              isSidebarVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="mb-10 flex items-center justify-between">
              <h3 className="text-xl font-medium">{title}</h3>
              <button
                type="button"
                className="cursor-pointer border-none bg-transparent p-1.25 text-2xl text-dark"
                onClick={handleCloseSidebar}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col">
              {INFO_TABS.map((tab) => (
                <div key={tab.id} className="border-b border-[#e5e5e5] py-5">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between bg-transparent text-left text-base font-medium text-dark"
                    onClick={() => handleToggleTab(tab.id)}
                    aria-expanded={activeTab === tab.id}
                  >
                    {tab.label}
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-5 min-h-5 w-5 min-w-5 items-center justify-center transition-transform duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        activeTab === tab.id ? 'className="translate-y-[1px]' : ''
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 border-r-[1.5px] border-b-[1.5px] border-dark transition-transform duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          activeTab === tab.id
                            ? '-translate-x-px rotate-[-135deg]'
                            : '-translate-y-px rotate-45'
                        }`}
                      />
                    </span>
                  </button>
                  <div
                    aria-hidden={activeTab !== tab.id}
                    className={`grid transition-[grid-template-rows,opacity] duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      activeTab === tab.id
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div
                      className={`overflow-hidden text-sm leading-normal text-[#666666] transition-[transform,margin-top] duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        activeTab === tab.id ? 'mt-3.75 translate-y-0' : '-translate-y-2 mt-0'
                      }`}
                    >
                      <p className="m-0">
                        Detailed information about {tab.label.toLowerCase()} goes here. Crafted from
                        premium materials designed for comfort and durability.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
