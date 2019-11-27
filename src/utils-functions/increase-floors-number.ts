import { CianRequest } from 'CianRequest';
import cloneDeep from 'clone-deep';

export function increaseFloorsNumber(request: CianRequest): CianRequest {
  const updatedRequest = cloneDeep(request);
  updatedRequest.body.floorn.value.gte += 1;
  updatedRequest.body.floorn.value.lte += 1;
  return updatedRequest;
}
