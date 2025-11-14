import { writeReport } from "../helpers/writer.js";

export async function getBitcoinPrice(req, res, next) {
  let apiNinjasResponse = await fetchBitcoinPrice(req.headers["x-api-key"]);

  await writeReport("Bitcoin", apiNinjasResponse.price, "USD");

  return res.status(200).json({
    status: "Success",
    message: `Bitcoin price is ${apiNinjasResponse.price} USD per one unit`,
  });
}

async function fetchBitcoinPrice(token) {
  const myHeaders = new Headers();
  myHeaders.append("X-Api-Key", token);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const respObjBtc = await fetch(
    "https://api.api-ninjas.com/v1/bitcoin",
    requestOptions
  );
  return respObjBtc.json();
}
