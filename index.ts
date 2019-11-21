import {
  defaultRequest,
  FLOOR_INTERVAL_STEP,
} from './src/configs/requestOptions';
import { askForRequestOptions } from './src/askForRequestOptions';
import CustomConsole from './src/CustomConsole';
import { CianRequest, TypeAndRoomChoice } from 'CianRequest';
import { loadFile, saveFile, saveRawFile } from './src/saveFile';
import { extendRequestOptions } from './src/extendRequestOptions';
import { GlobalState } from 'GlobalState';
import { CustomDate } from './src/CustomDate';
import { toGeoJSON } from './src/geo-json-convert';
import { getTotalOffersCount } from './src/getTotalOffersCount';
import { getFileName } from './src/get-file-name';
import { getParsedDataPageByPage } from './src/get-parsed-data-page-by-page';
import { changeFloor } from './src/change-floor';

const globalState: GlobalState = {
  proceedOffers: 0,
  respondedOffers: 0,
};
const startDate: string = CustomDate.TIME_STAMP();
let request: CianRequest;

init().then(() =>
  CustomConsole.DATA_LOADED(`Offers saved: [${globalState.proceedOffers}]`),
);

async function init(): Promise<void> {
  CustomConsole.HELLO_MESSAGE();
  const userInput: TypeAndRoomChoice = await askForRequestOptions();
  request = extendRequestOptions(userInput, defaultRequest);

  globalState.respondedOffers = await getTotalOffersCount(request);
  CustomConsole.DATA_LOADED(
    `Total Offers Count: [${globalState.respondedOffers}]`,
  );

  request = changeFloor(request, 1, FLOOR_INTERVAL_STEP);
  await getParsedDataPageByPage(globalState, request, startDate);
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

function mergeResponses(responses: string): string {
  return responses.replace(/]\[/gi, `,`);
}
