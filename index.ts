import {
  FLOOR_INTERVAL_STEP,
  MAX_FLOOR,
  RegionName,
  defaultRequest,
} from './src/configs/requestOptions';
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
import { GetFileNameConfig } from 'get-file-name-config';
import { getTotalOffersCount } from './src/getTotalOffersCount';

const globalState: GlobalState = {
  proceedOffers: 0,
  respondedOffers: 0,
};
const DATA_PATH = {
  TEMP: `./data/temp/`,
  COMPLETE: `./data/`,
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
  await saveFile(
    getFileName({ request: request, startDate, isGeoJSON: true }),
    geoFile,
  );
}

function nextPage(extendedRequestOptions: CianRequest): CianRequest {
  extendedRequestOptions.body.page.value++;
  return extendedRequestOptions;
}

async function getParsedDataPageByPage(
  globalState: GlobalState,
  extendedRequestOptions: CianRequest,
): Promise<void> {
  while (floorInterval.min < MAX_FLOOR) {
    CustomConsole.SELECTED_FLOORS(
      extendedRequestOptions.body.floor.value.gte,
      extendedRequestOptions.body.floor.value.lte,
    );
    const responseData = await getResponse(extendedRequestOptions);

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
      getFileName({ request: extendedRequestOptions, startDate, isTemp: true }),
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

function getFileName({ request, startDate, isTemp, isGeoJSON }: GetFileNameConfig): string {
  return (
    (isTemp ? DATA_PATH.TEMP : DATA_PATH.COMPLETE) +
    RegionName[request.body.region.value[0]] +
    '-' +
    request.body._type.substring(4) +
    '-' +
    request.body.room.value[0] +
    '-' +
    startDate +
    (isTemp ? '--temp' : '') +
    (isGeoJSON ? '.geojson' : '.json')
  );
}

function changeFloor(request: CianRequest, minFloor: number, maxFloor: number): CianRequest {
  request.body.floor.value.gte = minFloor;
  request.body.floor.value.lte = maxFloor;
  return request;
}

function mergeResponses(responses: string): string {
  return responses.replace(/]\[/gi, `,`);
}
