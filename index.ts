import { defaultRequest, FLOOR_INTERVAL_STEP, MAX_FLOOR } from './src/configs/requestOptions';
import { askForRequestOptions } from './src/askForRequestOptions';
import CustomConsole from './src/CustomConsole';
import { CianRequest, TypeAndRoomChoice } from 'CianRequest';
import { appendOrSaveFile, loadFile, saveFile, saveRawFile } from './src/saveFile';
import { SimplifyOffer } from 'SimplifyOffer';
import { extendRequestOptions } from './src/extendRequestOptions';
import { getResponse } from './src/getResponse';
import { parseSerializedData } from './src/parseSerializedData';
import { GlobalState } from 'GlobalState';
import { CustomDate } from './src/CustomDate';
import { toGeoJSON } from './src/geo-json-convert';
import { getTotalOffersCount } from './src/getTotalOffersCount';
import { getFileName } from './src/get-file-name';

const globalState: GlobalState = {
  proceedOffers: 0,
  respondedOffers: 0,
};

const floorInterval: { min: number; max: number } = {
  min: defaultRequest.body.floor.value.gte,
  max: defaultRequest.body.floor.value.lte,
};

const startDate: string = CustomDate.TIME_STAMP();
let request: CianRequest;

init().then(() => CustomConsole.DATA_LOADED(`Offers saved: [${globalState.proceedOffers}]`));

async function init(): Promise<void> {
  CustomConsole.HELLO_MESSAGE();
  const userInput: TypeAndRoomChoice = await askForRequestOptions();
  request = extendRequestOptions(userInput, defaultRequest);

  globalState.respondedOffers = await getTotalOffersCount(request);
  CustomConsole.DATA_LOADED(`Total Offers Count: [${globalState.respondedOffers}]`);

  request = changeFloor(request, 1, FLOOR_INTERVAL_STEP);
  await getParsedDataPageByPage(globalState, request);
  const invalidResponsesJSON = await loadFile(
    getFileName({ request: request, startDate, isTemp: true }),
  );
  const validResponses: string = mergeResponses(invalidResponsesJSON);
  await saveRawFile(
    getFileName({
      request: request,
      startDate,
    }),
    validResponses,
  );
  const geoFile = toGeoJSON(JSON.parse(validResponses));
  await saveFile(getFileName({ request: request, startDate, isGeoJSON: true }), geoFile);
}

function nextPage(request: CianRequest): CianRequest {
  request.body.page.value++;
  return request;
}

async function getParsedDataPageByPage(
  globalState: GlobalState,
  request: CianRequest,
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

function changeFloor(request: CianRequest, minFloor: number, maxFloor: number): CianRequest {
  request.body.floor.value.gte = minFloor;
  request.body.floor.value.lte = maxFloor;
  return request;
}

function mergeResponses(responses: string): string {
  return responses.replace(/]\[/gi, `,`);
}
