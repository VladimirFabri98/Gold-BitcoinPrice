import fs from "fs/promises";
import { dirname } from "path";
import { fileURLToPath } from "url";

//////////////////////////////////////
const fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(fileName);
//////////////////////////////////////

export async function writeReport(commodity, price, currency) {
  const stringToBeWritten = `############################################ \n Report created on ${new Date().toLocaleDateString()} \n Price of the ${commodity.toUpperCase()} for specified date is ${price} ${currency} \n ############################################ \n`;
  await fs.appendFile(`${__dirname}/../commodities.txt`, stringToBeWritten);
}
