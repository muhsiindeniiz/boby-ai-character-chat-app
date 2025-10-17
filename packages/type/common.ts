import { FC } from 'react';
import { DeepNonNullable, DeepRequired } from 'ts-essentials';

export type FlattenObjectKeys<
  T extends Record<string, unknown>,
  Key = keyof T,
> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
  : never;

export type MergeRecords<T extends any[]> = T extends [
  infer First,
  ...infer Rest,
]
  ? First extends object | undefined
    ? Rest extends any[]
      ? MergeRecords<Rest> & First
      : First
    : {}
  : {};

export type OptionalField<T, K extends keyof T> = Omit<T, K> & {
  [P in keyof T]?: T[P] | undefined;
};

export type UnionRecord<R extends object> = R[keyof R];

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type DeepNullable<T> = Prettify<{
  [K in keyof T]: T[K] extends object ? DeepNullable<T[K]> : T[K] | null;
}>;

export type DeepComplete<T> = DeepRequired<DeepNonNullable<T>>;

export type OverrideObject<
  TObj extends object,
  TOver extends object,
> = Prettify<Omit<TObj, keyof TOver> & TOver>;

export type MetaFC<P, M> = FC<P> & { meta: M };

export type Entry<T> = [keyof T, T[keyof T]];
