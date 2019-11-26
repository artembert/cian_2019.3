import { CianRequest } from 'CianRequest';
import { SerializedOffer } from 'CianResponse';
import cloneDeep from 'clone-deep';
import { MAX_FLOORS_NUMBER } from './configs/requestOptions';
import { getResponse } from './getResponse';
import CustomConsole from './CustomConsole';

export async function requestOffersByFloorNumber(
  originalRequest: CianRequest,
  estimatedOffersCount: number,
): Promise<SerializedOffer[]> {
  const offersInFloor: SerializedOffer[] = [];
  let request = cloneDeep(originalRequest);
  request.body.floorn.value.gte = 0;
  request.body.floorn.value.lte = 0;
  while (offersInFloor.length <= estimatedOffersCount) {
    request = increaseFloorsNumber(request);
    const responseData = await getResponse(request);
    offersInFloor.push(...responseData.offersSerialized);
    CustomConsole.DATA_LOADED(
      `FloorsNumber: [${request.body.floorn.value.gte}]-[${
        request.body.floorn.value.lte
      }]; rawOffers: offersInFloor: [${offersInFloor.length}]`,
    );
    if (request.body.floorn.value.gte >= MAX_FLOORS_NUMBER) {
      break;
    }
  }
  return offersInFloor;
}

function increaseFloorsNumber(request: CianRequest): CianRequest {
  const updatedRequest = cloneDeep(request);
  updatedRequest.body.floorn.value.gte += 1;
  updatedRequest.body.floorn.value.lte += 1;
  return updatedRequest;
}
