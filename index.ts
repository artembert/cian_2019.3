import { RegionName, requestOptions } from './src/configs/requestOptions';
import { askForRequestOptions } from './src/askForRequestOptions';
import CustomConsole from './src/CustomConsole';
import { CianResponseData } from 'CianResponse';
import { CianRequest, TypeAndRoomChoice } from 'CianRequest';
import { appendOrSaveFile, loadFile, saveRawFile } from './src/saveFile';
import { SimplifyOffer } from 'SimplifyOffer';
import { extendRequestOptions } from './src/extendRequestOptions';
import { getResponse } from './src/getResponse';
import { parseSerializedData } from './src/parseSerializedData';
import { GlobalState } from 'GlobalState';
import { CustomDate } from './src/CustomDate';

const globalState: GlobalState = {
  proceedOffers: 0,
  respondedOffers: 0,
};
const DATA_PATH = {
  TEMP: `./data/temp/`,
  COMPLETE: `./data/`,
};
const MAX_FLOOR: number = 50;
const FLOOR_INTERVAL_STEP: number = 3;
const floorInterval: { min: number; max: number } = {
  min: requestOptions.body.floor.value.gte,
  max: requestOptions.body.floor.value.lte,
};

const startDate: string = CustomDate.TIME_STAMP();
let extendedRequestOptions: CianRequest;

init();

async function init(): Promise<void> {
  CustomConsole.HELLO_MESSAGE();
  const userInput: TypeAndRoomChoice = await askForRequestOptions();
  extendedRequestOptions = extendRequestOptions(userInput, requestOptions);
  const responseData: CianResponseData = await getResponse(extendedRequestOptions);
  globalState.respondedOffers = responseData.offerCount;
  await getParsedDataPageByPage(responseData, globalState, extendedRequestOptions);
  const invalidResponsesJSON = await loadFile(getFileName(extendedRequestOptions, startDate, true));
  const validResponses: string = mergeResponses(invalidResponsesJSON);
  await saveRawFile(getFileName(extendedRequestOptions, startDate, false), validResponses);
}

function nextPage(extendedRequestOptions: CianRequest): CianRequest {
  extendedRequestOptions.body.page.value++;
  return extendedRequestOptions;
}

async function getParsedDataPageByPage(
  responseData: CianResponseData,
  globalState: GlobalState,
  extendedRequestOptions: CianRequest,
): Promise<void> {
  while (floorInterval.min < MAX_FLOOR) {
    CustomConsole.SELECTED_FLOORS(
      extendedRequestOptions.body.floor.value.gte,
      extendedRequestOptions.body.floor.value.lte,
    );
    responseData = await getResponse(extendedRequestOptions);

    const parsedOfferList: SimplifyOffer[] = await parseSerializedData(
      responseData,
      extendedRequestOptions,
      globalState,
    );

    if (!parsedOfferList || !parsedOfferList.length) {
      extendedRequestOptions = updateFloors(extendedRequestOptions);
      continue;
    }

    await appendOrSaveFile(
      getFileName(extendedRequestOptions, startDate, true),
      parsedOfferList,
    ).catch((err: NodeJS.ErrnoException | null) => {
      console.error(err);
      throw new Error('file save FAILED');
    });

    extendedRequestOptions = nextPage(extendedRequestOptions);
  }
}

function updateFloors(request: CianRequest): CianRequest {
  floorInterval.min = floorInterval.max + 1;
  floorInterval.max = floorInterval.min + FLOOR_INTERVAL_STEP;
  changeFloor(request, floorInterval.min, floorInterval.max);
  return goToFirstPage(request);
}

function goToFirstPage(extendedRequestOptions: CianRequest): CianRequest {
  extendedRequestOptions.body.page.value = 1;
  return extendedRequestOptions;
}

function getFileName(request: CianRequest, startDate: string, isTemp: boolean): string {
  return (
    (isTemp ? DATA_PATH.TEMP : DATA_PATH.COMPLETE) +
    RegionName[request.body.region.value[0]] +
    '-' +
    request.body._type.substring(4) +
    '-' +
    request.body.room.value[0] +
    '-' +
    startDate +
    (isTemp ? '--temp' : '')
    + '.json'
  );
}

function changeFloor(request: CianRequest, minFloor: number, maxFloor: number): CianRequest {
  request.body.floor.value.gte = minFloor;
  request.body.floor.value.lte = maxFloor;
  return request;
}


function mergeResponses(responses: string): string {
  return responses.replace(/\]\[/gi, `,`)
}
