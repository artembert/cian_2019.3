import * as GeoJSON from 'geojson';
import { SimplifyOffer } from 'SimplifyOffer';
import { FeatureCollection } from 'geojson';

export function toGeoJSON(data: SimplifyOffer[]): FeatureCollection {
  // @ts-ignore
  return GeoJSON.parse(data, { Point: ['latitude', 'longitude'] });
}
