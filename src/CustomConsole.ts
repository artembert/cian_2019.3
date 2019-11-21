import { CianResponseData } from 'CianResponse';

const chalk = require('chalk');

export default class CustomConsole {
  public constructor() {}

  public static SERIALIZED_DATA(serializedData: string | [] | number): void {
    console.log(serializedData);
  }

  public static DATA_LOADED(message: string): void {
    console.log(chalk.magenta.bold(message));
  }

  public static HELLO_MESSAGE(): void {
    console.log(chalk.bold.cyan(' HELLO '));
  }

  public static ITERATE_OVER_DATA(data: CianResponseData): void {
    Object.entries(data).forEach(([key, value]: [string, any]) => {
      if (key !== 'offersSerialized') {
        console.log(`${chalk.blue.bold(key)}: ${value}`);
      }
    });
  }

  public static DATA_SAVED(savedCount: number, totalCount: number): void {
    console.log(chalk.green.bold(`RESULT: [${savedCount}] of [${totalCount}]`));
  }

  public static SELECTED_FLOORS(min: number, max: number): void {
    console.log(chalk.blue.bold(`FLOORS: from [${min}] to [${max}]`));
  }

  public static SYSTEM_INFORMATION(message: string): void {
    console.log(chalk.bgCyan.black(message));
  }

  public static INPUT_OUTPUT(message: string): void {
    console.log(chalk.cyan(message));
  }
}
