import express, {Request, Response} from "express";
import * as MarketGrabber from "./marketgrabber"
import { VendingData } from "./types/vending";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
const vendingRouter = express.Router();
const app = express();
dotenv.config({path: "/.env"})

var cachedResponse = { "data": <VendingData[]> [] };
var readyToQuery = true;
vendingRouter.get('/', async(req: Request, res: Response) => {
    if (readyToQuery) {
        MarketGrabber.findAll((err: Error, vendings: VendingData[]) => {
            if (err) {
                return res.status(500).json({ "errorMessage": err.message });
            }

            cachedResponse = { "data": vendings };
            res.status(200).json(cachedResponse);
        });
        readyToQuery = false;
    } else {
        res.status(200).json(cachedResponse);
    }
});

const timer: number = parseInt(`${process.env.API_CACHE_TIME}`) || 300000;
setInterval(function(){ 
    readyToQuery = true;
}, timer);

const port =  3000;

app.use(bodyParser.json());
app.use("/", vendingRouter);

app.listen(port, () => console.log(`App listening on Port ${port}`));