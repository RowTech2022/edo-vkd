declare type Nullable<T> = { [K in keyof T]: Nullable<T[K]> | null }
