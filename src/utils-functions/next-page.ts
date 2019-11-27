import { CianRequest } from 'CianRequest';
import cloneDeep from 'clone-deep';

export function nextPage(originalRequest: CianRequest): CianRequest {
  const request = cloneDeep(originalRequest);
  request.body.page.value++;
  return request;
}
