import { Service } from "typedi";
import { TradingApp } from "../service/trade.service";
import Controller from "./controller";
import { Request } from "express";

interface BuyOrderParams {
    symbol: string;
    quantity: number;
}

interface SellOrderParams {
    symbol: string;
    quantity: number;
}

interface StopLossOrderParams {
    symbol: string;
    quantity: number;
    stopPrice: number;
}

@Service()
export class TradeController extends Controller {
    constructor(private readonly tradeService: TradingApp) {
        super()
    }

    buy = this.control(async (request: Request) => {
        const { symbol, quantity }: BuyOrderParams = request.body;
        if (!symbol || typeof quantity !== 'number' || quantity <= 0) {
            throw new Error('Invalid buy order parameters');
        }
        const result = await this.tradeService.buy(symbol, quantity);
        return result;
    })

    sell = this.control(async (request: Request) => {
        const { symbol, quantity }: SellOrderParams = request.body;
        if (!symbol || typeof quantity !== 'number' || quantity <= 0) {
            throw new Error('Invalid sell order parameters');
        }
        const result = await this.tradeService.sell(symbol, quantity);
        return result;
    })

    setStopLoss = this.control(async (request: Request) => {
        const { symbol, quantity, stopPrice }: StopLossOrderParams = request.body;
        if (!symbol || typeof quantity !== 'number' || quantity <= 0 || typeof stopPrice !== 'number' || stopPrice <= 0) {
            throw new Error('Invalid stop-loss order parameters');
        }
        const result = await this.tradeService.setStopLoss(symbol, quantity, stopPrice);
        return result;
    })

    getPortfolio = this.control(async () => {
        const portfolio = this.tradeService.getPortfolio();
        return portfolio;
    })

    getTradeHistory = this.control(async () => {
        const tradeHistory = this.tradeService.getTradeHistory();
        return tradeHistory;
    })

    getStockPrice = this.control(async (request: Request) => {
        const { symbol } = request.query;
        if (!symbol) {
            throw new Error('Invalid stock symbol');
        }
        const price = await this.tradeService.getStockPrice(symbol as string);
        return { symbol, price };
    })
}
