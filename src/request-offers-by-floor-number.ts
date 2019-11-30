import { CianRequest } from 'CianRequest';
import { SerializedOffer } from 'CianResponse';
import cloneDeep from 'clone-deep';
import { MAX_FLOORS_NUMBER } from './configs/requestOptions';
import { getResponse } from './getResponse';
import CustomConsole from './CustomConsole';
import { increaseFloorsNumber } from './utils-functions/increase-floors-number';
import { nextPage } from './utils-functions/next-page';
import { firstPage } from './utils-functions/first-page';

export async function requestOffersByFloorNumber(
  originalRequest: CianRequest,
  estimatedOffersCount: number,
): Promise<SerializedOffer[]> {
  const offersInFloor: SerializedOffer[] = [];
  let request = cloneDeep(originalRequest);
  request.body.floorn.value.gte = 1;
  request.body.floorn.value.lte = 1;

  while (offersInFloor.length <= estimatedOffersCount) {
    CustomConsole.DATA_LOADED(
      `FloorsNumber: [${request.body.floorn.value.gte}]-[${
        request.body.floorn.value.lte
      }]`,
    );
    request = firstPage(request);
    let responseData = await getResponse(request);
    CustomConsole.DATA_LOADED(
      `Offers by current filter: [${responseData.offerCount}]`,
    );
    while (responseData.offersSerialized?.length) {
      CustomConsole.BLUE(`PAGE: [${request.body.page.value}]`);
      responseData = await getResponse(request);
      offersInFloor.push(...responseData.offersSerialized);
      request = nextPage(request);
    }
    CustomConsole.DATA_LOADED(
      `Offers in floor: [${offersInFloor.length}]`,
    );
    if (request.body.floorn.value.gte >= MAX_FLOORS_NUMBER) {
      break;
    }
    request = increaseFloorsNumber(request);
  }

  return offersInFloor;
}
