import * as express from 'express';
import * as compression from 'compression';
import * as path from 'path';
import {Server as HttpServer} from 'http';
import {Server as WsServer} from 'ws';
import {Product, Review, getProducts, getProductById, getReviewsByProductId, addProduct} from './model';
// HTTP API

const app = express();
// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)

  // Pass to next layer of middleware
  next();
});

app.use(compression());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use("/outputs", express.static(path.join(__dirname, 'data/outputs')))
app.use("/styles", express.static(path.join(__dirname, 'data/styles')))

app.get('/api/products', (req, res) => {
  res.json(getProducts(req.query));
});

app.get('/api/products/:id', (req, res) => {
  res.json(getProductById(req.params.id));
});

app.get('/api/products/:id/reviews', (req, res) => {
  res.json(getReviewsByProductId(req.params.id));
});

app.get('/api/upload', (req, res) => {
  res.json([{'owner': 'Jason'}]);
});

var bodyParser = require('body-parser');
app.use(express.json({limit:'50mb'}));
var jsonParser = bodyParser.json() 
var urlencodedParser = bodyParser.urlencoded({ extended: false }) 
app.post('/api/upload', jsonParser, (req, res) => {
  res.json(addProduct(req.body));
});

const httpServer: HttpServer = app.listen(8000, 'localhost', () => {
  const {address, port} = httpServer.address();
  console.log('Listening on %s:%s', address, port);
});

// Using WS API

// Create the WebSocket server listening to the same port as HTTP server
const wsServer: WsServer = new WsServer({server: httpServer});
wsServer.on('connection', ws => {
  ws.on('message', message => {
    let subscriptionRequest = JSON.parse(message);
    subscribeToProductBids(ws, subscriptionRequest.productId);
  });
});

setInterval(() => {
  generateNewBids();
  broadcastNewBidsToSubscribers();
}, 2000);

// Helper functions

// The map key is a reference to WebSocket connection that represents a user.
const subscriptions = new Map<any, string[]>();

function subscribeToProductBids(client, productId: string): void {
  let products = subscriptions.get(client) || [];
  subscriptions.set(client, [...products, productId]);
}

// Bid generator

const currentBids = new Map<string, number>();

function generateNewBids() {
  getProducts().forEach(p => {
    const currentBid = currentBids.get(p.id) || p.price;
    const newBid = random(currentBid, currentBid + 5); // Max bid increase is $5
    currentBids.set(p.id, newBid);
  });
}

function broadcastNewBidsToSubscribers() {

  subscriptions.forEach((products: string[], ws: WebSocket) => {
    if (ws.readyState === 1) { // 1 - READY_STATE_OPEN
      let newBids = products.map(pid => ({
        productId: pid,
        bid: currentBids.get(pid)
      }));
      ws.send(JSON.stringify(newBids));
    } else {
      subscriptions.delete(ws);
    }
  });
}

function random(low: number, high: number): number {
  return Math.random() * (high - low) + low;
}
