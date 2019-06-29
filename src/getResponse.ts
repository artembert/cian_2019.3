import { CianRequest } from 'CianRequest';
import { CianResponse, CianResponseData } from 'CianResponse';
import * as superagent from 'superagent';

export async function getResponse(
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
