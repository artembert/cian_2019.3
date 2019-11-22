import { CianRequest, TypeAndRoomChoice } from 'CianRequest';
import { rentOption, saleOptions } from './configs/requestOptions';
import { roomCountCode } from './configs/roomCountCode';
import cloneDeep from "clone-deep";

export function extendRequestOptions(
  options: TypeAndRoomChoice,
  request: CianRequest,
): CianRequest {
  console.log('extendRequestOptions()');
  const extendedRequest: CianRequest = cloneDeep(request);
  if (options.adType === 'rent') {
    Object.assign(extendedRequest.body, rentOption);
  } else if (options.adType === 'sale') {
    Object.assign(extendedRequest.body, saleOptions);
  }
  extendedRequest.body.room.value = roomCountCode[options.roomCount];
  return extendedRequest;
}
