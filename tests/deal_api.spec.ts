/**
 * @jest-environment node
 */
import { DealAPI } from '../src/apis/deal_api';

describe('DealApi', () => {
  let dealApi: DealAPI;

  beforeEach(() => {
    dealApi = new DealAPI({ apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET });
  });

  describe('GetDeals', () => {
    it('should retrieve things from the api', (done) => {
      dealApi.getAll().then((deals) => {
        let totalProfit = 0;
        for (const deal of deals) {
          // tslint:disable-next-line:no-console
          totalProfit += +deal.usd_final_profit || 0;
        }
        // tslint:disable-next-line:no-console
        console.log(totalProfit);

        done();
      });
    });
  });

  describe('ShowDeal', () => {
    fit('should retrieve detail about a deal from the api', (done) => {
      dealApi.show({ dealId: 123 }).then((dealDetail) => {
        // tslint:disable-next-line:no-console
        console.log(dealDetail);
        done();
      });
    });
  });
});
