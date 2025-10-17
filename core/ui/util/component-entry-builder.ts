import { FC } from 'react';

export const componentEntryBuilder = <
  N extends string,
  C extends Record<string, C[keyof C]>,
  O extends Partial<{
    removePrefix?: boolean;
  }>,
>(
  namespace: N,
  components: C,
  options?: O,
) => {
  const entries = {} as { [key in keyof C]: FC };

  for (const [key, component] of Object.entries(components)) {
    entries[key as keyof C] = component;

    if (options?.removePrefix) {
      entries[key as keyof C].displayName = `${namespace}/${key}`;
    } else {
      entries[key as keyof C].displayName = `Uikit/${namespace}/${key}`;
    }
  }

  return entries as { [key in keyof C]: C[key] };
};
