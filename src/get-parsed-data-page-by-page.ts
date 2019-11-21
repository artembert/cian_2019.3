import { GlobalState } from 'GlobalState';
import { CianRequest } from 'CianRequest';
import {
  defaultRequest,
  FLOOR_INTERVAL_STEP,
  MAX_FLOOR,
} from './configs/requestOptions';
import CustomConsole from './CustomConsole';
import { getResponse } from './getResponse';
import { SimplifyOffer } from 'SimplifyOffer';
import { parseSerializedData } from './parseSerializedData';
import { appendOrSaveFile } from './saveFile';
import { getFileName } from './get-file-name';
import { changeFloor } from './change-floor';

const floorInterval: { min: number; max: number } = {
  min: defaultRequest.body.floor.value.gte,
  max: defaultRequest.body.floor.value.lte,
};

export async function getParsedDataPageByPage(
  globalState: GlobalState,
  request: CianRequest,
  startDate: string,
): Promise<void> {
  while (floorInterval.min <= MAX_FLOOR) {
    CustomConsole.SELECTED_FLOORS(
      request.body.floor.value.gte,
      request.body.floor.value.lte,
    );
    CustomConsole.BLUE(`PAGE: [${request.body.page.value}]`);
    const responseData = await getResponse(request);

    const parsedOfferList: SimplifyOffer[] = await parseSerializedData(
      responseData,
      request,
      globalState,
    );

    if (!parsedOfferList || !parsedOfferList.length) {
      request = updateFloors(request);
      continue;
    }

    await appendOrSaveFile(
      getFileName({ request: request, startDate, isTemp: true }),
      parsedOfferList,
    ).catch((err: NodeJS.ErrnoException | null) => {
      console.error(err);
      throw new Error('file save FAILED');
    });

    request = nextPage(request);
  }
}

function updateFloors(request: CianRequest): CianRequest {
  floorInterval.min = floorInterval.max + 1;
  floorInterval.max = floorInterval.min + FLOOR_INTERVAL_STEP;
  changeFloor(request, floorInterval.min, floorInterval.max);
  return goToFirstPage(request);
}

function goToFirstPage(request: CianRequest): CianRequest {
  request.body.page.value = 1;
  return request;
}

function nextPage(request: CianRequest): CianRequest {
  request.body.page.value++;
  return request;
}
