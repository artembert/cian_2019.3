import { CianRequest } from 'CianRequest';
import cloneDeep from 'clone-deep';
import { FLOORS_NUMBER_INTERVAL_STEP } from '../configs/requestOptions';

export function increaseFloorsNumber(request: CianRequest): CianRequest {
  const updatedRequest = cloneDeep(request);
  updatedRequest.body.floorn.value.gte += FLOORS_NUMBER_INTERVAL_STEP;
  updatedRequest.body.floorn.value.lte += FLOORS_NUMBER_INTERVAL_STEP;
  return updatedRequest;
}
