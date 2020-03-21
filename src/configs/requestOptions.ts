import { CianRequest, Rent, Sale } from 'CianRequest';

export const MAX_FLOOR: number = 50;
export const MAX_FLOORS_NUMBER: number = 50;
export const FLOOR_INTERVAL_STEP: number = 1;
export const FLOORS_NUMBER_INTERVAL_STEP: number = 2;
export const MAX_FILTERED_OFFERS_COUNT = 1400;

export const defaultRequest: CianRequest = {
  uri: 'https://spb.cian.ru/cian-api/site/v1/search-offers/',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  json: true,
  body: {
    region: { type: 'terms', value: [4593] },
    room: { type: 'terms', value: [] },
    engine_version: { type: 'term', value: 2 },
    currency: { type: 'term', value: 2 },
    page: { type: 'term', value: 1 },
    floor: { type: 'range', value: { gte: 1, lte: FLOOR_INTERVAL_STEP } },
    floorn: { type: 'range', value: { gte: 1, lte: MAX_FLOORS_NUMBER } }, // floor number in a house
    for_day: { type: 'term', value: '!1' },
  },
};

export const saleOptions: Sale = {
    '_type': 'flatsale',
    building_status: {
      type: 'term',
      value: 1
    }
};

export const rentOption: Rent = {
  '_type': 'flatrent',
  for_day: {
    type: 'term',
    value: "!1"
  }
};

export const RegionName = {
  2: `SPb`,
  4593: `MoscowRegion`,
  4713: `Voronezh`,
};
