import { BidService } from '../product-detail/bid.service'
import { ProductService, API_PRODUCTS_SERVICE_URL } from '../service/product.service'
import { WebsocketService } from '../product-detail/websocket.service'

export const ONLINE_AUCTION_SERVICES = [
  BidService,
  ProductService,
  WebsocketService,
  {provide:API_PRODUCTS_SERVICE_URL, useValue: "http://localhost:8000"}
];
