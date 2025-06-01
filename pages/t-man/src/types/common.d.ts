import '@tanstack/react-table';

declare type Params = {
  searchParams: Promise<SearchParams>;
};

declare type Nullable<T> = T | null;

declare type WrappedComponentProps = {
  children: React.ReactNode;
};

declare module '@tanstack/react-table' {
  export interface ColumnFilter<TKey extends string = string, TValue = any> {
    id: TKey;
    value: TValue;
  }

  export type ColumnFiltersState<TKey extends string = string, TValue = any> = Array<ColumnFilter<TKey, TValue>>;
}
