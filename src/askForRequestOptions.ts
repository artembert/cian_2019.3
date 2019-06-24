import * as inquirer from 'inquirer';

export function askForRequestOptions(): Promise<Object>  {
  console.log('askForRequestOptions()');
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'adType',
        message: 'Rent or sail?',
        choices: ['rent', 'sail'],
      },
      {
        type: 'list',
        name: 'roomCount',
        message: 'Rent or sail?',
        choices: ['apartment-studio', '1-room', '2-room', '3-room'],
      },
    ])
}
