import localFont from 'next/font/local';

export const localInter = localFont({
  variable: '--font-inter',
  src: [
    {
      path: '../asset/font/inter/inter-roman.woff2',
      weight: '300 900',
      style: 'normal',
    },
    {
      path: '../asset/font/inter/inter-italic.woff2',
      weight: '300 900',
      style: 'italic',
    },
  ],
});

export const localMono = localFont({
  variable: '--font-mono',
  src: [
    {
      path: '../asset/font/sf-mono/sf-mono-light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../asset/font/sf-mono/sf-mono-regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../asset/font/sf-mono/sf-mono-medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../asset/font/sf-mono/sf-mono-semibold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../asset/font/sf-mono/sf-mono-bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
});
