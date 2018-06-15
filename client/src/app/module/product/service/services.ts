import { BidService } from '../product-detail/bid.service'
import { ProductService, API_PRODUCTS_SERVICE_URL, API_SEARCH_SERVICE_URL, API_SOCIAL_SERVICE_URL } from '../service/product.service'
import { WebsocketService } from '../product-detail/websocket.service';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { environment } from '../../../../environments/environment';

export const ONLINE_AUCTION_SERVICES = [
  BidService,
  ProductService,
  WebsocketService,
  AuthenticationService,
  { provide:API_PRODUCTS_SERVICE_URL, useValue: environment.productsURL },
  { provide:API_SEARCH_SERVICE_URL, useValue: environment.productionURL + '/api/search' },
  { provide: API_SOCIAL_SERVICE_URL, useValue: environment.socialURL },
];
