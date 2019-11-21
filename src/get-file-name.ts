import { GetFileNameConfig } from "get-file-name-config";
import { RegionName } from "./configs/requestOptions";
import { DATA_PATH } from "./configs/glogal-config";

export function getFileName({ request, startDate, isTemp, isGeoJSON }: GetFileNameConfig): string {
  return (
    (isTemp ? DATA_PATH.TEMP : DATA_PATH.COMPLETE) +
    RegionName[request.body.region.value[0]] +
    '-' +
    request.body._type.substring(4) +
    '-' +
    request.body.room.value[0] +
    '-' +
    startDate +
    (isTemp ? '--temp' : '') +
    (isGeoJSON ? '.geojson' : '.json')
  );
}
