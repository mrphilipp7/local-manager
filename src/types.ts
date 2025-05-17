// src/types.ts
export type Status = 'success' | 'error';

export type Value = string | null | object;

export interface WriteProps {
  key: string;
  value: Value;
}

export interface WriteWithExpProps {
  key: string;
  value: Value;
  ttl: number;
}

export type LocalStorageResponse = {
  status: Status;
  value: Value;
};
