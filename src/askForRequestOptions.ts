import * as inquirer from 'inquirer';
import { TypeAndRoomChoice } from 'CianRequest';

export function askForRequestOptions(): Promise<TypeAndRoomChoice> {
  console.log('askForRequestOptions()');
  return inquirer.prompt([
    {
      type: 'list',
      name: 'adType',
      message: 'Rent or sale?',
      choices: ['rent', 'sale'],
    },
    {
      type: 'list',
      name: 'roomCount',
      message: 'Rent or sale?',
      choices: ['1-room', '2-room', '3-room', 'apartment-studio'],
    },
  ]);
}
