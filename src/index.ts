import { requestOptions, rentOption, saleOptions } from './configs/requestOptions';
import { askForRequestOptions } from './askForRequestOptions';
import * as superagent from 'superagent';
import CustomConsole from './CustomConsole';
import { CianResponse, CianResponseData } from 'CianResponse';
import { CianRequest, TypeAndRoomChoice } from 'CianRequest';
import { roomCountCode } from './configs/roomCountCode';
import { saveFile } from './saveFile';
import { Offer } from 'Offer';
import { SimplifyOffer } from 'SimplifyOffer';

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
  // CustomConsole.DATA_LOADED();
  // CustomConsole.ITERATE_OVER_DATA(responseData);
  // CustomConsole.SERIALIZED_DATA(responseData.offersSerialized[0]);
  const parsedOfferList: SimplifyOffer[]
    = await parseSerializedData(responseData, extendedRequestOptions);
  saveFile(parsedOfferList, '../data/parsedOfferList.json');
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

function extendRequestOptions(options: TypeAndRoomChoice,
                              requestOptions: CianRequest): CianRequest {
  console.log('extendRequestOptions()');
  if (options.adType === 'rent') {
    Object.assign(requestOptions, rentOption);
  } else if (options.adType === 'sale') {
    Object.assign(requestOptions, saleOptions);
  }
  requestOptions.body.room.value = roomCountCode[options.roomCount];
  return requestOptions;
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

function parseOffer(offer: Offer): SimplifyOffer {
  return {
    id: offer.id,
    floors_count: offer.building ? offer.building.floorsCount : 0,
    floor: offer.floorNumber,
    total_area: offer.totalArea,
    rooms_count: offer.roomsCount,
    price: offer.bargainTerms ? offer.bargainTerms.price : 0,
    latitude: offer.geo && offer.geo.coordinates ? offer.geo.coordinates.lat : 0,
    longitude: offer.geo && offer.geo.coordinates ? offer.geo.coordinates.lng : 0,
    metro: offer.geo && offer.geo.undergrounds && offer.geo.undergrounds.length > 0
      ? offer.geo.undergrounds[0].name
      : '',
    metro_time: offer.geo && offer.geo.undergrounds && offer.geo.undergrounds.length > 0
      ? offer.geo.undergrounds[0].time
      : 0,
    metro_type: offer.geo && offer.geo.undergrounds && offer.geo.undergrounds.length > 0
      ? (offer.geo.undergrounds[0].transportType === 'walk'
        ? 'пешком'
        : (offer.geo.undergrounds[0].transportType === 'transport' ? 'на машине' : ''))
      : '',
    description: offer.description,
    address: offer.geo ? offer.geo.userInput : '',
    date: 'Required!'
  }
}
