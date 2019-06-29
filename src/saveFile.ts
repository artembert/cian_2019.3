import * as fs from 'fs';
import * as util from 'util';
import CustomConsole from './CustomConsole';

const writeFile = util.promisify(fs.writeFile);

export async function saveFile(data: any, pathToFile: string): Promise<boolean> {
  console.log('saveFile()');
  await writeFile(pathToFile, JSON.stringify(data), 'utf8');
  CustomConsole.SYSTEM_INFORMATION(
    `serialized data saved to ${pathToFile}`,
  );
  return true;
}
