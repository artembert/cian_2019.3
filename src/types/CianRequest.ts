import { AdType } from 'AdType';
import { RoomCount } from 'RoomCount';

export interface CianRequest {
  uri: string;
  method: string;
  headers: Headers;
  json: boolean;
  body: Body;
}

export interface Body {
  region: Region;
  room: Room;
  engine_version: Currency;
  currency: Currency;
  page: Currency;
  floor: Floor;
  floorn: Floor;
  _type: string;
  for_day: ForDay;
  rent?: Rent;
  sale?: Sale;
}

export interface Region {
  type: string;
  value: number[];
}

export interface Room {
  type: string;
  value: number[];
}

export interface Currency {
  type: string;
  value: number;
}

export interface Floor {
  type: string;
  value: {
    gte: number; // min includes
    lte: number; // max includes
  };
}

export interface ForDay {
  type: string;
  value: string;
}

export interface Headers {
  'Content-Type': 'application/json';
}

export interface Rent {
  _type: 'flatrent';
  for_day: { type: 'term'; value: '!1' };
}

export interface Sale {
  _type: 'flatsale';
  building_status: { type: 'term'; value: 1 };
}

export interface TypeAndRoomChoice {
  adType: AdType,
  roomCount: RoomCount
}
