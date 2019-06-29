import { CianRequest, TypeAndRoomChoice } from 'CianRequest';
import { rentOption, saleOptions } from './configs/requestOptions';
import { roomCountCode } from './configs/roomCountCode';

export function extendRequestOptions(options: TypeAndRoomChoice,
                              requestOptions: CianRequest): CianRequest {
  console.log('extendRequestOptions()');
  if (options.adType === 'rent') {
    Object.assign(requestOptions, rentOption);
  } else if (options.adType === 'sale') {
    Object.assign(requestOptions, saleOptions);
  }
  requestOptions.body.room.value = roomCountCode[options.roomCount];
  return requestOptions;
}
