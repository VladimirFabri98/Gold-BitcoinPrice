import { writeReport } from "../helpers/writer.js";

export async function getGoldPrice(req, res) {
  const historic = req.params?.historic;
  const date = req.params?.date;
  const currency = req.params?.currency;

  let goldAPIResponse = "";
  if (date) {
    if (date.length !== 10)
      return res.status(400).json({
        status: "Failure",
        message:
          "Invalid date format. Date has to be entered in YYYY-MM-DD format",
      });
    const transformedDate = date.replace("-", "");

    goldAPIResponse = await fetchGoldPrice(
      req.headers["x-access-token"],
      transformedDate,
      currency,
      historic
    );
  } else {
    goldAPIResponse = await fetchGoldPrice(req.headers["x-access-token"]);
  }

  await writeReport("Gold", goldAPIResponse.price, currency);

  return res.status(200).json({
    status: "Success",
    date: date,
    message: `Gold price is ${goldAPIResponse.price} ${
      currency ? currency : "USD"
    } per kg`,
  });
}

async function fetchGoldPrice(
  token,
  date = null,
  currency = "USD",
  historic = false
) {
  const myHeaders = new Headers();
  myHeaders.append("x-access-token", token);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  let respObjGold = "";
  if (historic) {
    respObjGold = await fetch(
      `https://www.goldapi.io/api/XAU/${currency}/${date}`,
      requestOptions
    );
  } else {
    respObjGold = await fetch(
      `https://www.goldapi.io/api/XAU/${currency}`,
      requestOptions
    );
  }
  return respObjGold.json();
}
