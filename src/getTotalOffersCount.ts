import { CianRequest } from 'CianRequest';
import { getResponse } from './getResponse';
import { defaultRequest, MAX_FLOOR } from './configs/requestOptions';

export async function getTotalOffersCount(
  options: CianRequest,
): Promise<number> {
  options.body.floor.value.gte = 1;
  options.body.floor.value.lte = MAX_FLOOR;
  const response = await getResponse(options);
  options.body.floor.value.gte = defaultRequest.body.floor.value.gte;
  options.body.floor.value.lte = defaultRequest.body.floor.value.lte;
  return response.offerCount;
}
