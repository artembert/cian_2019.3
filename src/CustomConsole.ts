import { CianResponseData } from 'CianResponse';

const chalk = require('chalk');

export default class CustomConsole {
  public constructor() {}

  public static SERIALIZED_DATA(serializedData: string | [] | number): void {
    console.log(serializedData);
  }

  public static DATA_LOADED(): void {
    console.log(chalk.bgGreen.gray(' Data loaded '));
  }

  public static HELLO_MESSAGE(): void {
    console.log(chalk.gray.bgWhite.bold(' HELLO '));
  }

  public static ITERATE_OVER_DATA(data: CianResponseData): void {
    Object.entries(data).forEach(([key, value]: [string, any]) => {
      if (key !== 'offersSerialized') {
        console.log(`${chalk.blue.bold(key)}: ${value}`)
      }
    })
  }

  public static DATA_SAVED(savedCount: number, totalCount: number): void {
    console.log(chalk.green.bold(`RESULT: [${savedCount}] of [${totalCount}]`));
  }

  public static SYSTEM_INFORMATION(message: string): void {
    console.log(chalk.bgWhite.black(message));
  }
}
