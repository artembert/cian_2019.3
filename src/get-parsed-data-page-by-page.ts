import { GlobalState } from 'GlobalState';
import { CianRequest } from 'CianRequest';
import { FLOOR_INTERVAL_STEP, MAX_FILTERED_OFFERS_COUNT, MAX_FLOOR } from './configs/requestOptions';
import CustomConsole from './CustomConsole';
import { getResponse } from './getResponse';
import { SimplifyOffer } from 'SimplifyOffer';
import { parseSerializedData } from './parseSerializedData';
import { appendOrSaveFile } from './saveFile';
import { getFileName } from './get-file-name';
import { requestOffersByFloorNumber } from './request-offers-by-floor-number';

export async function getParsedDataPageByPage(
  globalState: GlobalState,
  request: CianRequest,
  startDate: string,
): Promise<void> {
  while (request.body.floor.value.lte <= MAX_FLOOR) {
    let parsedOfferList: SimplifyOffer[];
    CustomConsole.SELECTED_FLOORS(request.body.floor.value.gte, request.body.floor.value.lte);
    CustomConsole.BLUE(`PAGE: [${request.body.page.value}]`);
    const responseData = await getResponse(request);
    CustomConsole.IMPORTANT(`Offers by current filter: [${responseData.offerCount}]`);

    if (!responseData.offersSerialized || !responseData.offersSerialized.length) {
      request = updateFloors(request);
      continue;
    }

    if (responseData.offerCount > MAX_FILTERED_OFFERS_COUNT) {
      CustomConsole.IMPORTANT(`Iterate over floorNumbers`);
      const rawResponses = await requestOffersByFloorNumber(request, responseData.offerCount);
      parsedOfferList = await parseSerializedData(rawResponses, globalState);

      await appendOrSaveFile(getFileName({ request: request, startDate, isTemp: true }), parsedOfferList).catch(
        (err: NodeJS.ErrnoException | null) => {
          console.error(err);
          throw new Error('file save FAILED');
        },
      );
      break;
    } else {
      parsedOfferList = await parseSerializedData(responseData.offersSerialized, globalState);
      await appendOrSaveFile(getFileName({ request: request, startDate, isTemp: true }), parsedOfferList).catch(
        (err: NodeJS.ErrnoException | null) => {
          console.error(err);
          throw new Error('file save FAILED');
        },
      );
    }

    await appendOrSaveFile(getFileName({ request: request, startDate, isTemp: true }), parsedOfferList).catch(
      (err: NodeJS.ErrnoException | null) => {
        console.error(err);
        throw new Error('file save FAILED');
      },
    );

    request = nextPage(request);
  }
}

function updateFloors(request: CianRequest): CianRequest {
  request.body.floor.value.gte += FLOOR_INTERVAL_STEP;
  request.body.floor.value.lte += FLOOR_INTERVAL_STEP;
  request.body.page.value = 1;
  return request;
}

function nextPage(request: CianRequest): CianRequest {
  request.body.page.value++;
  return request;
}
