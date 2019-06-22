import { CianResponseData } from 'CianResponseData';

type CianResponse = {
  text: string,
  body:
    {
      status: 'ok',
      data: CianResponseData,
    }
}


export {
  CianResponse
}
