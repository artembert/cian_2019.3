type CianResponseData = {
  suggestionsQuery: null | string,
  aggregatedCount: number,
  queryString: string,
  redirectData: null| string,
  lastModified: string,
  seoLinks: [],
  top3IsOn: null| string,
  seoData: Object,
  offerCount: number| number,
  suggestionsOffers: [],
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

export {
  CianResponseData
}
