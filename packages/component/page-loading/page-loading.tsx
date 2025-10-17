'use client';
import type { FC } from 'react';
import React from 'react';
import * as cva from '@/packages/component/page-loading/page-loading.cva';
import { PageLoadingProps } from '@/packages/component/page-loading/page-loading.type';
import { useClassnames } from '@/packages/hooks/use-classnames';
import Image from 'next/image';
import lightLoading from '@/packages/asset/image/loading.gif';

const PageLoading: FC<PageLoadingProps> = () => {
  const cx = useClassnames({
    root: cva.rootCva(),
  });

  return (
    <div className={cx.root}>
      <div className="relative">
        <Image
          unoptimized
          src={lightLoading}
          alt="loading"
          className="w-[250px] h-[250px] object-contain transform scale-125"
          width={100}
          height={100}
        />
        <h3
          className={`text-primary text-center font-inter absolute left-1/2 bottom-[30px] transform -translate-x-1/2 -translate-y-full`}
          style={{}}
        >
          Loading...
        </h3>
      </div>
    </div>
  );
};

export default PageLoading;
