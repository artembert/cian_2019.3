import * as fs from 'fs';

export const storeData = (data: any, pathToFile: string) => {
  try {
    fs.writeFile(pathToFile,
      JSON.stringify(data),
      'utf8',
      (err: NodeJS.ErrnoException | null) => err);
  } catch (err) {
    console.error(err);
  }
};
