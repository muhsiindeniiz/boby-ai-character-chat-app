import type { VariantProps } from 'class-variance-authority';

type UnionRecordValues<T extends Record<string, any>> = {
  [K in keyof T]: VariantProps<T[K]>;
}[keyof T];

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

export type CvaProp<T extends Record<string, VariantProps<any>>> =
  UnionToIntersection<UnionRecordValues<T>>;
