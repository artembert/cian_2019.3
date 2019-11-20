import * as fs from 'fs';
import * as util from 'util';
import CustomConsole from './CustomConsole';

const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);

export async function saveFile(pathToFile: string, data: any): Promise<void> {
  console.log('saveFile()');
  await writeFile(pathToFile, JSON.stringify([...data], null, 2), 'utf8');
  CustomConsole.SYSTEM_INFORMATION(
    `file ${pathToFile} created`,
  );
}

export async function appendOrSaveFile(pathToFile: string, data: any): Promise<void> {
  console.log('appendToFile()');
  if (fs.existsSync(pathToFile)) {
    await appendFile(pathToFile, JSON.stringify([...data], null, 2), 'utf8');
    CustomConsole.SYSTEM_INFORMATION(
      `serialized data saved to ${pathToFile}`,
    );
  } else {
    await writeFile(pathToFile, JSON.stringify([...data], null, 2), 'utf8');
    CustomConsole.SYSTEM_INFORMATION(
      `file ${pathToFile} created`,
    );
  }
}
