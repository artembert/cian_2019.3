import * as fs from 'fs';
import * as util from 'util';
import CustomConsole from './CustomConsole';

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const appendFile = util.promisify(fs.appendFile);

export async function saveFile(pathToFile: string, data: any): Promise<void> {
  console.log('saveFile()');
  await writeFile(pathToFile, JSON.stringify(data, null, 2), 'utf8');
  CustomConsole.INPUT_OUTPUT(
    `file ${pathToFile} created`,
  );
}

export async function saveRawFile(pathToFile: string, data: any): Promise<void> {
  console.log('saveRawFile()');
  await writeFile(pathToFile, data, 'utf8');
  CustomConsole.INPUT_OUTPUT(
    `file ${pathToFile} created`,
  );
}

export async function appendOrSaveFile(pathToFile: string, data: any): Promise<void> {
  console.log('appendToFile()');
  if (fs.existsSync(pathToFile)) {
    await appendFile(pathToFile, JSON.stringify([...data], null, 2), 'utf8');
    CustomConsole.INPUT_OUTPUT(
      `serialized data saved to ${pathToFile}`,
    );
  } else {
    await writeFile(pathToFile, JSON.stringify([...data], null, 2), 'utf8');
    CustomConsole.INPUT_OUTPUT(
      `file ${pathToFile} created`,
    );
  }
}

export async function loadFile(pathToFile: string): Promise<string> {
  CustomConsole.INPUT_OUTPUT(
    `loading file [${pathToFile}]`,
  );
  return await readFile(pathToFile, 'utf8');
}
