const requestOptions = {
  uri: 'https://spb.cian.ru/cian-api/site/v1/search-offers/',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  json: true,
  body: {
    region: { type: 'terms', value: [Array] },
    room: { type: 'terms', value: [Array] },
    engine_version: { type: 'term', value: 2 },
    currency: { type: 'term', value: 2 },
    page: { type: 'term', value: 1 },
    floor: { type: 'range', value: [Object] },
    floorn: { type: 'range', value: [Object] },
    _type: 'flatrent',
    for_day: { type: 'term', value: '!1' },
  },
};

export default requestOptions;
