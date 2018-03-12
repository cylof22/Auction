import { BidService } from '../product-detail/bid.service'
import { ProductService } from '../service/product.service'
import { WebsocketService } from '../product-detail/websocket.service'

export const ONLINE_AUCTION_SERVICES = [
  BidService,
  ProductService,
  WebsocketService
];
