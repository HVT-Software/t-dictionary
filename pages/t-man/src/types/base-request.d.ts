declare type Sorting = {
  direction: 0 | 1 | 2;
  propertyName: string;
};

declare type ListRequest = {
  pageIndex: number;
  pageSize: number;
  isCount?: boolean;
  searchText?: string;
  from?: string;
  to?: string;
  sort?: Sorting;
  isAll?: boolean;
};
