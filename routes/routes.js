import express from "express";
import { getGoldPrice } from "../controllers/goldController.js";
import { getBitcoinPrice } from "../controllers/bitcoinController.js";

const router = express.Router();
router.route("/gold").get(getGoldPrice);
router.route("/gold/:historic/:date/:currency").get(getGoldPrice);
router.route("/bitcoin").get(getBitcoinPrice);

export default router;
