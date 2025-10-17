'use client';
import { FC } from 'react';
import { localInter, localMono } from '@/packages/constant/font-collection';
import { useClassnames } from '@/packages/hooks/use-classnames';
import { RootBodyProps } from './root-body.type';

const AppBody: FC<RootBodyProps> = (props) => {
  const { children } = props;

  const cx = useClassnames({
    root: [
      localInter.variable,
      localMono.variable,
      'h-screen overflow-x-hidden',
    ],
  });

  return (
    <body suppressHydrationWarning={true} lang="en" className={cx.root}>
      {children}
    </body>
  );
};

export default AppBody;
