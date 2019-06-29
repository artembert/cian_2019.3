import { requestOptions } from './configs/requestOptions';
import { askForRequestOptions } from './askForRequestOptions';
import * as superagent from 'superagent';
import CustomConsole from './CustomConsole';
import { CianResponse, CianResponseData } from 'CianResponse';
import { CianRequest, TypeAndRoomChoice } from 'CianRequest';
import { saveFile } from './saveFile';
import { Offer } from 'Offer';
import { SimplifyOffer } from 'SimplifyOffer';
import { parseOffer } from './parseOffer';
import { extendRequestOptions } from './extendRequestOptions';

let proceedOffers: number = 0;

init();

async function init(): Promise<void> {
  CustomConsole.HELLO_MESSAGE();
  const userInput: TypeAndRoomChoice
    = await askForRequestOptions();
  const extendedRequestOptions: CianRequest
    = extendRequestOptions(userInput, requestOptions);
  const responseData: CianResponseData
    = await getResponse(extendedRequestOptions);
  const parsedOfferList: SimplifyOffer[]
    = await parseSerializedData(responseData, extendedRequestOptions);
  const isFileSaved
    = await saveFile(parsedOfferList, '../data/parsedOfferList.json')
    .catch((err: NodeJS.ErrnoException | null) => console.error(err));
  if (!isFileSaved) {
    throw new Error('file save FAILED')
  }
}

async function getResponse(
  requestOptions: CianRequest): Promise<CianResponseData> {
  console.log('getResponse()');
  try {
    const result: CianResponse = await superagent
      .post(requestOptions.uri)
      .send(requestOptions.body)
      .set(
        Object.keys(requestOptions.headers)[0],
        requestOptions.headers['Content-Type'],
      );
    return result.body.data;
  } catch (err) {
    console.error('err: ', err);
  }
}

async function parseSerializedData(responseData: CianResponseData,
                                 extendedRequestOptions: CianRequest):
  Promise<SimplifyOffer[]> {
  if (!responseData) {
    responseData = await getResponse(extendedRequestOptions);
  } else {
    if (responseData.offerCount > 0 &&
      responseData.offerCount > proceedOffers) {
      const parsedOfferList: SimplifyOffer[] = [];
      responseData.offersSerialized.forEach((offer: Offer) => {
        const parsedOffer = parseOffer(offer);
        parsedOfferList.push(parsedOffer);
        proceedOffers++;
        CustomConsole.DATA_SAVED(proceedOffers, responseData.offerCount);
      });
      return parsedOfferList;
    }
  }
}

