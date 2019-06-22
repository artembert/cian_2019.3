import requestOptions from './configs/requestOptions';
import * as superagent from 'superagent';

init();

function init(): void {
  sendAsyncRequest();
}

function sendAsyncRequest(): void {
  superagent
    .post(requestOptions.uri)
    .send(requestOptions.body)
    .set(
      Object.keys(requestOptions.headers)[0],
      requestOptions.headers['Content-Type'],
    )
    .end((err: superagent.ResponseError,
          res: superagent.Response) => {
      console.log('err: ', err);
      console.log('res: ', res);
    });
}
