import { Offer } from 'Offer';
import { SimplifyOffer } from 'SimplifyOffer';

export function parseOffer(offer: Offer): SimplifyOffer {
  return {
    id: offer.id,
    floors_count: offer.building ? offer.building.floorsCount : 0,
    floor: offer.floorNumber,
    total_area: offer.totalArea,
    rooms_count: offer.roomsCount,
    price: offer.bargainTerms ? offer.bargainTerms.price : 0,
    latitude:
      offer.geo && offer.geo.coordinates ? offer.geo.coordinates.lat : 0,
    longitude:
      offer.geo && offer.geo.coordinates ? offer.geo.coordinates.lng : 0,
    metro:
      offer.geo && offer.geo.undergrounds && offer.geo.undergrounds.length > 0
        ? offer.geo.undergrounds[0].name
        : '',
    metro_time:
      offer.geo && offer.geo.undergrounds && offer.geo.undergrounds.length > 0
        ? offer.geo.undergrounds[0].time
        : 0,
    metro_type:
      offer.geo && offer.geo.undergrounds && offer.geo.undergrounds.length > 0
        ? offer.geo.undergrounds[0].transportType === 'walk'
          ? 'пешком'
          : offer.geo.undergrounds[0].transportType === 'transport'
          ? 'на машине'
          : ''
        : '',
    description: offer.description,
    address: offer.geo ? offer.geo.userInput : '',
    date: 'Required!',
  };
}
