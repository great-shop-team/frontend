import Image from 'next/image';
import Link from 'next/link';

import { catalogRoutes } from '@/features/catalog/config/catalogRoutes';

type ErrorPageProps = {
  errorCode: string;
  title: string;
  description: string;
};

export default function ErrorPage({ errorCode, title, description }: ErrorPageProps) {
  return (
    <main className="min-h-screen bg-[#EEE]">
      <div className="mx-auto flex min-h-screen w-full max-w-360 items-center justify-center px-6 py-10 md:px-10 lg:px-18.5 lg:py-19">
        <section className="grid w-full items-center gap-10 lg:grid-cols-[1fr_567px] lg:gap-18">
          <div className="max-w-144.5 lg:pl-0.75">
            <p className="m-0 font-(family-name:--font-pt-sans-caption) text-[28px] leading-none font-normal text-black md:text-[32px] lg:text-[40px]">
              Error {errorCode}
            </p>

            <h1 className="m-0 mt-8 font-(family-name:--font-pt-sans-caption) text-[96px] leading-[0.88] font-bold text-black md:text-[120px] lg:mt-9.5 lg:text-[150px]">
              {errorCode}
            </h1>

            <h2 className="m-0 mt-6 font-(family-name:--font-pt-sans-caption) text-[40px] leading-[1.05] font-normal text-black md:text-[48px] lg:mt-9 lg:text-[60px]">
              {title}
            </h2>

            <p className="m-0 mt-8 max-w-114.25 font-(family-name:--font-pt-sans-caption) text-[18px] leading-[1.59] font-normal text-black md:text-[20px] lg:mt-14.5 lg:text-[22px]">
              {description}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row lg:mt-35 lg:gap-14">
              <Link
                href="/"
                className="flex h-12 w-full max-w-60 items-center justify-center rounded-lg bg-[#4D4D4D] px-3.5 text-center font-(family-name:--font-unbounded) text-[18px] leading-none font-normal text-[#FAFAFA] no-underline transition-opacity hover:opacity-90"
              >
                Go to Homepage
              </Link>

              <Link
                href={catalogRoutes.index}
                className="flex h-12 w-full max-w-60 items-center justify-center rounded-lg border border-[#4D4D4D] px-3.5 text-center font-(family-name:--font-unbounded) text-[18px] leading-none font-normal text-[#4D4D4D] no-underline transition-colors hover:bg-[#4D4D4D] hover:text-[#FAFAFA]"
              >
                Shop New In
              </Link>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-141.75 lg:block">
            <Image
              src="/images/alina-bordunova-Lq78VGxRJhc-unsplash.jpg"
              alt="Fashion model walking"
              width={567}
              height={807}
              priority
              className="h-auto w-full rotate-180 object-cover"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
