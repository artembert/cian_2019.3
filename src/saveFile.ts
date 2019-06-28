import * as fs from 'fs';

export function saveFile(data: any, pathToFile: string): void {
  console.log('saveFile()');
  try {
    fs.writeFile(
      pathToFile,
      JSON.stringify(data),
      'utf8',
      (err: NodeJS.ErrnoException | null) => err,
    );
  } catch (err) {
    console.error(err);
  }
}
