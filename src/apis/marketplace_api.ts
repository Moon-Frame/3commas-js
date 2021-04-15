import { ThreeCommasConfiguration, ThreeCommasService } from './base';

export type MarketplaceItem = {
  id: number;
  name: string;
  preview_url: string;
  strategy_type: string;
  strategy_key: string;
  card_text_1: string;
  card_text_2: string;
  card_text_3: string;
  card_text_4: string;
};

export type MarketplaceItemSignal = {
  id: number;
  pair: string;
  exchange: string;
  signal_type: 'short' | 'long';
  timestamp: number;
  min: string;
  max: string;
};

export class MarketplaceAPI extends ThreeCommasService {
  constructor(protected configuration: ThreeCommasConfiguration) {
    super(configuration, '/public/api/ver1/marketplace');
  }

  /**
   * All marketplace items (Permission: NONE, Security: NONE)
   */
  async getItems(params?: {
    /**
     * Limit records. Max: 1_000
     * @default 50
     */
    limit?: number;
    /**
     * Offset records
     */
    offset?: number;
    /**
     * paid - show only paid signal providers. free - show only free signal providers
     */
    scope?: 'all' | 'paid' | 'free';
    /**
     * @default newest
     */
    order?: 'subscribers' | 'name' | 'newest';
    /**
     * @default en
     */
    locale?: 'en' | 'ru' | 'zh' | 'zh-CN' | 'cn' | 'es' | 'pt' | 'ko' | 'fr' | 'cs';
  }): Promise<MarketplaceItem[]> {
    return await this.request<MarketplaceItem[]>('GET', '/items', params);
  }

  /**
   * Marketplace Item Signals (Permission: NONE, Security: NONE)
   */
  async getItemSignals(
    itemId: number,
    params?: {
      /**
       * Limit records. Max: 1_000
       * @default 50
       */
      limit?: number;
      /**
       * Offset records
       */
      offset?: number;
      /**
       * @default newest
       */
      order?: 'subscribers' | 'name' | 'newest';
      /**
       * @default desc
       */
      order_direction?: 'asc' | 'desc';
      /**
       * @default en
       */
      locale?: 'en' | 'ru' | 'zh' | 'zh-CN' | 'cn' | 'es' | 'pt' | 'ko' | 'fr' | 'cs';
    }
  ): Promise<MarketplaceItemSignal[]> {
    return await this.request<MarketplaceItemSignal[]>('GET', `/${itemId}/signals`, params);
  }
}
