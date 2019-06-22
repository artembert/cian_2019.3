import requestOptions from './configs/requestOptions';
import * as superagent from 'superagent';

init();

function init(): void {
  console.log("get Async Request");
  getAsyncRequest();
}

async function getAsyncRequest() {
  try {
    const result = await superagent
      .post(requestOptions.uri)
      .send(requestOptions.body)
      .set(
        Object.keys(requestOptions.headers)[0],
        requestOptions.headers['Content-Type'],
      );
    console.log(result);
  } catch (err) {
    console.error('err: ', err);
  }
}
