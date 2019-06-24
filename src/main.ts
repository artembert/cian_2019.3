import {requestOptions, rentOption, saleOptions} from './configs/requestOptions';
import {askForRequestOptions} from './askForRequestOptions'
import * as superagent from 'superagent';
import CustomConsole from './CustomConsole';
import { CianResponse, CianResponseData } from 'CianResponse';
import { CianRequest, TypeAndRoomChoice } from 'CianRequest';

let responseData: CianResponseData;

init();

function init(): void {
  CustomConsole.HELLO_MESSAGE();
  askForRequestOptions()
    .then((answers: TypeAndRoomChoice) => console.log(answers));

  // getAsyncRequest()
  //   .then(() => CustomConsole.DATA_LOADED())
  //   .then(() =>
  //     CustomConsole.SERIALIZED_DATA(responseData.offersSerialized.length));
}

async function getAsyncRequest(): Promise<void> {
  console.log("getAsyncRequest()");
  try {
    const result: CianResponse = await superagent
      .post(requestOptions.uri)
      .send(requestOptions.body)
      .set(
        Object.keys(requestOptions.headers)[0],
        requestOptions.headers['Content-Type'],
      );
    responseData = result.body.data;
    // console.log(responseData);
  } catch (err) {
    console.error('err: ', err);
  }
}



function extendRequestOptions(options: TypeAndRoomChoice,
                              requestOptions: CianRequest): void {
  if (options.adType === 'rent') {
    Object.assign(requestOptions, rentOption)
  } else if (options.adType === 'sale') {
    Object.assign(requestOptions, saleOptions)
  }
}
