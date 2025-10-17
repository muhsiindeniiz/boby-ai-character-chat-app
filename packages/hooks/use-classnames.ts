import { useMemo } from 'react';
import type { ClassNameValue } from 'tailwind-merge';
import { twMerge } from 'tailwind-merge';
import { MergeRecords } from '../type/common';

export type ClassnamesProp<K extends string> = {
  classNames?: string;
};

export const useClassnames = <
  I extends { [key in keyof MergeRecords<D>]: ClassNameValue },
  D extends (Partial<Record<string, ClassNameValue>> | undefined)[],
>(
  initial: I,
  dependencies?: [...D],
) => {
  return useMemo(() => {
    const computedClassnames: Record<string, string> = {};

    for (const key in initial) {
      const currentClass: ClassNameValue[] = [];
      currentClass.push(initial[key]);

      for (const dependency of dependencies ?? []) {
        if (!dependency) continue;
        currentClass.push(dependency[key] as ClassNameValue);
      }

      computedClassnames[key] = twMerge(...currentClass);
    }

    return computedClassnames;
  }, [initial, dependencies]) as {
    [key in keyof Required<MergeRecords<D> & I>]: string;
  };
};
