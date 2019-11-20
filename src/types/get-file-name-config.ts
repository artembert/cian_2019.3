import { CianRequest } from 'CianRequest';

export interface GetFileNameConfig {
  request: CianRequest;
  startDate: string;
  isTemp?: boolean;
  isGeoJSON?: boolean
}
