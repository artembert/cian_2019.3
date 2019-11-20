import { CianResponseData } from 'CianResponse';
import { CianRequest } from 'CianRequest';
import { SimplifyOffer } from 'SimplifyOffer';
import { Offer } from 'Offer';
import { parseOffer } from './parseOffer';
import CustomConsole from './CustomConsole';
import { GlobalState } from 'GlobalState';

export async function parseSerializedData(
  responseData: CianResponseData,
  extendedRequestOptions: CianRequest,
  globalState: GlobalState,
): Promise<SimplifyOffer[]> {
  const parsedOfferList: SimplifyOffer[] = [];
  responseData.offersSerialized.forEach((offer: Offer) => {
    const parsedOffer = parseOffer(offer);
    parsedOfferList.push(parsedOffer);
    globalState.proceedOffers++;
  });
  CustomConsole.DATA_SAVED(globalState.proceedOffers, responseData.offerCount);
  return parsedOfferList;
}
