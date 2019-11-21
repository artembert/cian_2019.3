import { CianRequest } from "CianRequest";
import { getResponse } from "./getResponse";
import { MAX_FLOOR } from "./configs/requestOptions";

export async function getTotalOffersCount(options: CianRequest): Promise<number> {
  options.body.floor.value.gte = 1;
  options.body.floor.value.lte = MAX_FLOOR;
  const response = await getResponse(options);
  return response.offerCount;
}
