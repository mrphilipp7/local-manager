type Status = 'success' | 'error';
type Value = string | null | object;

interface WriteProps {
  key: string;
  value: Value;
}

interface WriteWithExpProps {
  key: string;
  value: any;
  ttl: number;
}

type LocalStorageResponse = {
  status: Status;
  value: Value;
};
