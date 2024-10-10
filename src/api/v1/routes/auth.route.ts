// AuthRoute.ts
import { Service } from "typedi";
import Route from "./base.route";
import { TradeController } from '../controller/trade.controller';


@Service()
export class AuthRoute extends Route {
    constructor(private readonly tradecontroller: TradeController) {
        super()
        this.initRoutes();
    }

    initRoutes(): void {
        this.router.get('/', this.tradecontroller.getPortfolio)
        this.router.get('/stockprice', this.tradecontroller.getStockPrice)
        this.router.get('/gettradehistory', this.tradecontroller.getTradeHistory)
        this.router.post('/buy', this.tradecontroller.buy)
        this.router.post('/sell', this.tradecontroller.sell)
        this.router.post('/stoploss', this.tradecontroller.setStopLoss)
    }
}