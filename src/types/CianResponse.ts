export type CianResponse = {
  text: string,
  body:
    {
      status: 'ok',
      data: CianResponseData,
    }
}

export type SerializedOffer = any;

export type CianResponseData = {
  suggestionsQuery: null | string,
  aggregatedCount: number,
  queryString: string,
  redirectData: null| string,
  lastModified: string,
  seoLinks: [],
  top3IsOn: null| string,
  seoData: Object,
  offerCount: number| number,
  suggestionsOffers: SerializedOffer[],
  jsonQuery: Object,
  avgPriceInformer: null| string,
  breadcrumbs: [],
  suggestionsOfferIds: [],
  suggestOffersSerializedList: [],
  qsToUris: Object,
  offersSerialized: any[],
  fullUrl: string,
  topHitsLinks: []
}
