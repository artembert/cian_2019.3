import requestOptions from './configs/requestOptions';
import * as superagent from 'superagent';

init();

function init(): void {
  sendRequest();
  console.log("get Async Request");
  getAsyncRequest();
}

function sendRequest(): void {
  superagent
    .post(requestOptions.uri)
    .send(requestOptions.body)
    .set(
      Object.keys(requestOptions.headers)[0],
      requestOptions.headers['Content-Type'],
    )
    .end((err: superagent.ResponseError, res: superagent.Response) => {
      console.log('err: ', err);
      console.log('res: ', res);
    });
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
