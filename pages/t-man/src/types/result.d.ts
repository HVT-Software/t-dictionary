declare type Result<T> = {
  success: boolean;
  message?: string;
  data: T;
};

declare type WrapList<T> = {
  totalCount: number;
  items: Array<T>;
};

declare type FileResult = {
  fileName: string;
  byteArray: Uint8Array;
};
