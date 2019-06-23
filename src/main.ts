import {requestOptions, rentOption, saleOptions} from './configs/requestOptions';
import * as superagent from 'superagent';
import CustomConsole from './CustomConsole';
import { CianResponseData } from 'CianResponseData';
import { CianResponse } from 'CianResponse';

let responseData: CianResponseData;

init();

function init(): void {
  CustomConsole.HELLO_MESSAGE();
  getAsyncRequest()
    .then(() => CustomConsole.DATA_LOADED());
}

async function getAsyncRequest() {
  console.log("get Async Request");
  try {
    const result: CianResponse = await superagent
      .post(requestOptions.uri)
      .send(requestOptions.body)
      .set(
        Object.keys(requestOptions.headers)[0],
        requestOptions.headers['Content-Type'],
      );
    responseData = result.body.data;
    console.log(responseData);
  } catch (err) {
    console.error('err: ', err);
  }
}
