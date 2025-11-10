import fs from "fs/promises";
import { dirname } from "path";
import { fileURLToPath } from "url";
import readline from "readline";

//////////////////////////////////////
const fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(fileName);
//////////////////////////////////////

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
//////////////////////////////////////

async function getCommodityPrices() {
  try {
    let commodity = await ask(
      "Which commodity price do you want to know? BTC or Gold:"
    );
    let date = "";

    commodity = commodity.toLowerCase();

    let platformProvider = "";
    if (commodity == "btc") platformProvider = "API-Ninjas";
    else if (commodity == "gold") {
      platformProvider = "GoldAPI";
      const dataType = await ask(
        "Historic data or current data. Please answer with 0 for historic or 1 for current data:"
      );

      if (isNaN(dataType))
        throw new Error(
          `You have to enter 0 or 1 for the data type - ${dataType} is invalid type of an input`
        );

      if (Number(dataType) === 0) {
        date = await ask(
          "Please enter the date in the following format: YYYY-MM-DD:"
        );
        if (date.length !== 10) throw new Error("Invalid date format");
        date = date.replace("-", "");
      } else if (
        Math.round(Number(dataType)) > 1 ||
        Math.round(Number(dataType)) < 0
      ) {
        throw new Error(
          `${Number(dataType)} is an invalid value - please enter 0 or 1`
        );
      }
    } else {
      throw new Error(`We do not provide services for ${commodity}`);
    }
    // Ask for user's API key
    const apiKey = await ask(`Please enter your ${platformProvider} API key:`);
    // Send request
    const response = await fetchPrice(commodity, apiKey, !date ? null : date);
    // Filter json response
    const price = response.price;
    if (!price) throw new Error("Could not fetch a price for specified date");
    // Write it to a file
    await writeReport(commodity, price);
    // Log a success message!
    console.log("Report successfully constructed! ✅");
  } catch (error) {
    console.log(error.message);
  }
}

getCommodityPrices();

async function fetchPrice(commodity, apiKey, historic) {
  const myHeaders = new Headers();
  myHeaders.append(
    commodity == "gold" ? "x-access-token" : "X-Api-Key",
    `${apiKey}`
  );
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  if (commodity == "gold") {
    if (historic) {
      const respObjGold = await fetch(
        `https://www.goldapi.io/api/XAU/USD/${historic}`,
        requestOptions
      );
      return respObjGold.json();
    } else {
      const respObjGold = await fetch(
        "https://www.goldapi.io/api/XAU/USD",
        requestOptions
      );
      return respObjGold.json();
    }
  } else if (commodity == "btc") {
    const respObjBtc = await fetch(
      "https://api.api-ninjas.com/v1/bitcoin",
      requestOptions
    );
    return respObjBtc.json();
  } else {
    throw new Error(`Invalid commodity: ${commodity}`);
  }
}

async function writeReport(commodity, price, date = null) {
  const stringToBeWritten = `############################################ \n Report created on ${new Date().toLocaleDateString()} \n Price of the ${commodity.toUpperCase()} for specified date is ${price} USD \n ############################################ \n`;
  await fs.appendFile(`${__dirname}/commodities.txt`, stringToBeWritten);
}
