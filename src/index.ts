import { requestOptions } from './configs/requestOptions';
import { askForRequestOptions } from './askForRequestOptions';
import CustomConsole from './CustomConsole';
import { CianResponseData } from 'CianResponse';
import { CianRequest, TypeAndRoomChoice } from 'CianRequest';
import { saveFile } from './saveFile';
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
  while (responseData && globalState.proceedOffers <= 90) {
    responseData = await getResponse(extendedRequestOptions);

    const parsedOfferList: SimplifyOffer[] = await parseSerializedData(
      responseData,
      extendedRequestOptions,
      globalState,
    );

    const isFileSaved = await saveFile(
      parsedOfferList,
      `../data/parsedOfferList-${CustomDate.TIME_STAMP()}.json`,
    ).catch((err: NodeJS.ErrnoException | null) => console.error(err));

    if (!isFileSaved) {
      throw new Error('file save FAILED');
    }

    extendedRequestOptions = nextPage(extendedRequestOptions);
  }
}
