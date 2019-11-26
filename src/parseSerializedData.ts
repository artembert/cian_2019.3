import { SerializedOffer } from 'CianResponse';
import { SimplifyOffer } from 'SimplifyOffer';
import { Offer } from 'Offer';
import { parseOffer } from './parseOffer';
import CustomConsole from './CustomConsole';
import { GlobalState } from 'GlobalState';

export async function parseSerializedData(
  offersSerialized: SerializedOffer[],
  globalState: GlobalState,
): Promise<SimplifyOffer[]> {
  const parsedOfferList: SimplifyOffer[] = [];
  offersSerialized.forEach((offer: Offer) => {
    const parsedOffer = parseOffer(offer);
    parsedOfferList.push(parsedOffer);
    globalState.proceedOffers++;
  });
  CustomConsole.DATA_SAVED(globalState.proceedOffers, globalState.respondedOffers);
  return parsedOfferList;
}
