import { CianRequest, TypeAndRoomChoice } from 'CianRequest';
import { rentOption, saleOptions } from './configs/requestOptions';
import { roomCountCode } from './configs/roomCountCode';
import cloneDeep from "clone-deep";

export function extendRequestOptions(
  options: TypeAndRoomChoice,
  request: CianRequest,
): CianRequest {
  const extendedRequest: CianRequest = cloneDeep(request);
  console.log('extendRequestOptions()');
  if (options.adType === 'rent') {
    Object.assign(extendedRequest.body, rentOption);
  } else if (options.adType === 'sale') {
    Object.assign(extendedRequest.body, saleOptions);
  }
  extendedRequest.body.room.value = roomCountCode[options.roomCount];
  return extendedRequest;
}
