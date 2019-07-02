import * as DateTime from 'luxon';

export class CustomDate {
  public static TIME_STAMP(): string {
    return `${DateTime.DateTime.utc().day}.${DateTime.DateTime.utc().month}.${
      DateTime.DateTime.utc().year
    }_${DateTime.DateTime.utc().hour}.${DateTime.DateTime.utc().minute
    }.${DateTime.DateTime.utc().second}`;
  }
}
