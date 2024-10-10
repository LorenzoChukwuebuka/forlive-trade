import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { Service } from 'typedi';
import HttpError from '../utils/httpError';

dotenv.config();

const app = express();
app.use(express.json());

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "D03RKHRYMKA9KN5E";
const BASE_URL = 'https://www.alphavantage.co/query';

interface Trade {
    symbol: string;
    quantity: number;
    price: number;
    type: 'buy' | 'sell';
    timestamp: Date;
}

interface StopLossOrder {
    symbol: string;
    quantity: number;
    stopPrice: number;
}

@Service()

export class TradingApp {
    private portfolio: { [symbol: string]: number } = {};
    private trades: Trade[] = [];
    private stopLossOrders: StopLossOrder[] = [];
    private cash: number = 10000; // Starting with $10,000

    async getStockPrice(symbol: string): Promise<number> {
        try {
            const response = await axios.get(BASE_URL, {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol,
                    apikey: ALPHA_VANTAGE_API_KEY
                }
            });

            const price = parseFloat(response.data['Global Quote']['05. price']);
            if (isNaN(price)) {
                throw new HttpError('Invalid price data received');
            }
            return price;
        } catch (error) {
            console.error('Error fetching stock price:', error);
            throw new HttpError(error as string, 400, error as object);
        }
    }

    async buy(symbol: string, quantity: number): Promise<string> {
        const price = await this.getStockPrice(symbol);
        const totalCost = price * quantity;

        if (totalCost > this.cash) {
            throw new HttpError('Insufficient funds');
        }

        this.cash -= totalCost;
        this.portfolio[symbol] = (this.portfolio[symbol] || 0) + quantity;

        const trade: Trade = {
            symbol,
            quantity,
            price,
            type: 'buy',
            timestamp: new Date()
        };
        this.trades.push(trade);

        return `Bought ${quantity} shares of ${symbol} at $${price} per share`;
    }

    async sell(symbol: string, quantity: number): Promise<string> {
        if (!this.portfolio[symbol] || this.portfolio[symbol] < quantity) {
            throw new HttpError('Insufficient shares');
        }

        const price = await this.getStockPrice(symbol);
        const totalRevenue = price * quantity;

        this.cash += totalRevenue;
        this.portfolio[symbol] -= quantity;

        const trade: Trade = {
            symbol,
            quantity,
            price,
            type: 'sell',
            timestamp: new Date()
        };
        this.trades.push(trade);

        return `Sold ${quantity} shares of ${symbol} at $${price} per share`;
    }

    async setStopLoss(symbol: string, quantity: number, stopPrice: number): Promise<string> {
        if (!this.portfolio[symbol] || this.portfolio[symbol] < quantity) {
            throw new HttpError('Insufficient shares for stop-loss order');
        }

        this.stopLossOrders.push({ symbol, quantity, stopPrice });
        return `Set stop-loss order for ${quantity} shares of ${symbol} at $${stopPrice}`;
    }

    async checkStopLossOrders(): Promise<void> {
        for (const order of this.stopLossOrders) {
            const currentPrice = await this.getStockPrice(order.symbol);
            if (currentPrice <= order.stopPrice) {
                await this.sell(order.symbol, order.quantity);
                this.stopLossOrders = this.stopLossOrders.filter(o => o !== order);
                console.log(`Executed stop-loss order for ${order.quantity} shares of ${order.symbol} at $${currentPrice}`);
            }
        }
    }

    getPortfolio(): { portfolio: { [symbol: string]: number }, cash: number } {
        return { portfolio: this.portfolio, cash: this.cash };
    }

    getTradeHistory(): Trade[] {
        return this.trades;
    }
}

