import * as fs from 'fs';
import * as util from 'util';
const writeFile = util.promisify(fs.writeFile);

export function saveFile(data: any, pathToFile: string): void {
  console.log('saveFile()');
  writeFile(pathToFile, JSON.stringify(data), 'utf8')
    .then(() => console.log(`serialized data saved to ${pathToFile}`))
    .catch((err: NodeJS.ErrnoException | null) => console.error(err))
}
