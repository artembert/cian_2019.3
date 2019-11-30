import { CianRequest } from 'CianRequest';
import cloneDeep from 'clone-deep';

export function firstPage(originalRequest: CianRequest): CianRequest {
  const request = cloneDeep(originalRequest);
  request.body.page.value = 1;
  return request;
}
