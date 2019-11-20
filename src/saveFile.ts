import * as fs from 'fs';
import * as util from 'util';
import CustomConsole from './CustomConsole';

const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);

export async function saveFile(pathToFile: string, data: any): Promise<boolean> {
  console.log('saveFile()');
  await writeFile(pathToFile, JSON.stringify([...data], null, 2), 'utf8');
  CustomConsole.SYSTEM_INFORMATION(
    `file ${pathToFile} created`,
  );
  return true;
}

export async function appendOrSaveFile(pathToFile: string, data: any): Promise<boolean> {
  console.log('appendToFile()');
  if (fs.existsSync(pathToFile)) {
    await appendFile(pathToFile, JSON.stringify([...data], null, 2), 'utf8');
    CustomConsole.SYSTEM_INFORMATION(
      `serialized data saved to ${pathToFile}`,
    );
    return true;
  } else {
    await writeFile(pathToFile, JSON.stringify([...data], null, 2), 'utf8');
    CustomConsole.SYSTEM_INFORMATION(
      `file ${pathToFile} created`,
    );
    return true;
  }
}
