import { CianRequest, Rent, Sale } from 'CianRequest';

export let requestOptions: CianRequest = {
  uri: 'https://spb.cian.ru/cian-api/site/v1/search-offers/',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  json: true,
  body: {
    region: { type: 'terms', value: [2] },
    room: { type: 'terms', value: [] },
    engine_version: { type: 'term', value: 2 },
    currency: { type: 'term', value: 2 },
    page: { type: 'term', value: 1 },
    floor: { type: 'range', value: { gte: 1, lte: 1 } },
    floorn: { type: 'range', value: { gte: 1, lte: 6 } }, // floor number in a house
    _type: 'flatrent',
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
