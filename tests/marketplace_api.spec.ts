/**
 * @jest-environment node
 */
import { MarketplaceAPI } from '../src/apis/marketplace_api';

describe('MarketplaceApi', () => {
  let dealApi: MarketplaceAPI;

  beforeEach(() => {
    dealApi = new MarketplaceAPI({
      apiKey: process.env.API_KEY,
      apiSecret: process.env.API_SECRET,
    });
  });

  describe('GetMarketplaces', () => {
    fit('should all items from the marketplace api', (done) => {
      dealApi.getItems({ order: 'subscribers' }).then((items) => {
        // tslint:disable-next-line:no-console
        console.log(items);
        dealApi.getItemSignals(items[0].id).then((signals) => {
          // tslint:disable-next-line:no-console
          console.log(signals);
          done();
        });
      });
    });
  });
});
