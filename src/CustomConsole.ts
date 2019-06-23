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
}
