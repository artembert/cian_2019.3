import { CianResponseData } from 'CianResponse';
import { CianRequest } from 'CianRequest';
import { SimplifyOffer } from 'SimplifyOffer';
import { Offer } from 'Offer';
import { parseOffer } from './parseOffer';
import CustomConsole from './CustomConsole';
import { getResponse } from './getResponse';
import { GlobalState } from 'GlobalState';

export async function parseSerializedData(responseData: CianResponseData,
                                   extendedRequestOptions: CianRequest,
                                          globalState: GlobalState):
  Promise<SimplifyOffer[]> {
  if (!responseData) {
    responseData = await getResponse(extendedRequestOptions);
  } else {
    if (responseData.offerCount > 0 &&
      responseData.offerCount > globalState.proceedOffers) {
      const parsedOfferList: SimplifyOffer[] = [];
      responseData.offersSerialized.forEach((offer: Offer) => {
        const parsedOffer = parseOffer(offer);
        parsedOfferList.push(parsedOffer);
        globalState.proceedOffers++;
        CustomConsole.DATA_SAVED(globalState.proceedOffers, responseData.offerCount);
      });
      return parsedOfferList;
    }
  }
}
