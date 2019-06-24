import {requestOptions, rentOption, saleOptions} from './configs/requestOptions';
import {askForRequestOptions} from './askForRequestOptions'
import * as superagent from 'superagent';
import CustomConsole from './CustomConsole';
import { CianResponse, CianResponseData } from 'CianResponse';
import { CianRequest, TypeAndRoomChoice } from 'CianRequest';
import { roomCountCode } from './configs/roomCountCode';

let responseData: CianResponseData;

init();

async function init(): Promise<void> {
  CustomConsole.HELLO_MESSAGE();
  const userInput: TypeAndRoomChoice
    = await askForRequestOptions();
  const extendedRequestOptions: CianRequest
    = extendRequestOptions(userInput, requestOptions);
  const responseData: CianResponseData
    = await getAsyncRequest(extendedRequestOptions);
  CustomConsole.DATA_LOADED();
  CustomConsole.SERIALIZED_DATA(responseData.offersSerialized.length);
}

async function getAsyncRequest(
  requestOptions: CianRequest):Promise<CianResponseData> {
  console.log("getAsyncRequest()");
  try {
    const result: CianResponse = await superagent
      .post(requestOptions.uri)
      .send(requestOptions.body)
      .set(
        Object.keys(requestOptions.headers)[0],
        requestOptions.headers['Content-Type'],
      );
    return responseData = result.body.data;
  } catch (err) {
    console.error('err: ', err);
  }
}

function extendRequestOptions(options: TypeAndRoomChoice,
                              requestOptions: CianRequest): CianRequest {
  console.log("extendRequestOptions()");
  if (options.adType === 'rent') {
    Object.assign(requestOptions, rentOption)
  } else if (options.adType === 'sale') {
    Object.assign(requestOptions, saleOptions)
  }
  requestOptions.body.room.value = roomCountCode[options.roomCount];
  return requestOptions;
}
