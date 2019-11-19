import { requestOptions } from './configs/requestOptions';
import { askForRequestOptions } from './askForRequestOptions';
import CustomConsole from './CustomConsole';
import { CianResponseData } from 'CianResponse';
import { CianRequest, TypeAndRoomChoice } from 'CianRequest';
import { appendOrSaveFile, saveFile } from './saveFile';
import { SimplifyOffer } from 'SimplifyOffer';
import { extendRequestOptions } from './extendRequestOptions';
import { getResponse } from './getResponse';
import { parseSerializedData } from './parseSerializedData';
import { GlobalState } from 'GlobalState';
import { CustomDate } from './CustomDate';

const globalState: GlobalState = {
  proceedOffers: 0,
  respondedOffers: 0,
};

init();

async function init(): Promise<void> {
  CustomConsole.HELLO_MESSAGE();
  const userInput: TypeAndRoomChoice = await askForRequestOptions();
  const extendedRequestOptions: CianRequest = extendRequestOptions(userInput, requestOptions);
  const responseData: CianResponseData = await getResponse(extendedRequestOptions);
  globalState.respondedOffers = responseData.offerCount;
  getParsedDataPageByPage(responseData, globalState, extendedRequestOptions);
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
  const startDate: string = CustomDate.TIME_STAMP();
  while (responseData && globalState.proceedOffers < globalState.respondedOffers) {
    responseData = await getResponse(extendedRequestOptions);

    const parsedOfferList: SimplifyOffer[] = await parseSerializedData(
      responseData,
      extendedRequestOptions,
      globalState,
    );

    const isFileSaved = await saveFile(
      `../data/parsedOfferList-${CustomDate.TIME_STAMP()}.json`,
      parsedOfferList,
    ).catch((err: NodeJS.ErrnoException | null) => console.error(err));

    if (!isFileSaved) {
      throw new Error('file save FAILED');
    }

    extendedRequestOptions = nextPage(extendedRequestOptions);
    await timer(getRandomInteger(1000, 3000));
  }
}

function timer(ms: number): Promise<void> {
  // tslint:disable-next-line:promise-must-complete
  return new Promise(() => setTimeout(() => {}, ms));
}

export function getRandomInteger(min: number = 0, max: number): number {
  // tslint:disable-next-line:insecure-random
  return Math.floor(min + Math.random() * (max - min));
}
