import { ThreeCommasConfiguration, ThreeCommasService } from './base';

export type Deal = {
  id?: number;
  type?: string;
  bot_id?: number;
  max_safety_orders?: number;
  deal_has_error?: boolean;
  from_currency_id?: number;
  to_currency_id?: number;
  account_id?: number;
  active_safety_orders_count?: number;
  created_at?: string;
  updated_at?: string;
  closed_at?: string;
  'finished?'?: boolean;
  current_active_safety_orders_count?: number;
  current_active_safety_orders?: number;
  completed_safety_orders_count?: number;
  completed_manual_safety_orders_count?: number;
  'cancellable?'?: boolean;
  'panic_sellable?'?: boolean;
  trailing_enabled?: boolean;
  tsl_enabled?: boolean;
  stop_loss_timeout_enabled?: boolean;
  stop_loss_timeout_in_seconds?: number;
  active_manual_safety_orders?: number;
  pair?: string;
  status?: string;
  take_profit?: string;
  base_order_volume?: string;
  safety_order_volume?: string;
  safety_order_step_percentage?: string;
  bought_amount?: string;
  bought_volume?: string;
  bought_average_price?: string;
  sold_amount?: string;
  sold_volume?: string;
  sold_average_price?: string;
  take_profit_type?: string;
  final_profit?: string;
  martingale_coefficient?: string;
  martingale_volume_coefficient?: string;
  martingale_step_coefficient?: string;
  stop_loss_percentage?: string;
  error_message?: string;
  profit_currency?: string;
  stop_loss_type?: string;
  safety_order_volume_type?: string;
  base_order_volume_type?: string;
  from_currency?: string;
  to_currency?: string;
  current_price?: string;
  take_profit_price?: string;
  stop_loss_price?: string;
  final_profit_percentage?: string;
  actual_profit_percentage?: string;
  bot_name?: string;
  account_name?: string;
  usd_final_profit?: string;
  actual_profit?: string;
  actual_usd_profit?: string;
  failed_message?: string;
  reserved_base_coin?: string;
  reserved_second_coin?: string;
  trailing_deviation?: string;
  trailing_max_price?: string;
  tsl_max_price?: string;
  strategy?: string;
};

export type DealDetail = Deal & {
  bot_events: {
    message: string;
    created_at: Date;
  }[];
};

export class DealAPI extends ThreeCommasService {
  constructor(protected configuration: ThreeCommasConfiguration) {
    super(configuration);
  }

  /**
   * User deals (Permission: BOTS_READ, Security: SIGNED)
   *
   * @param {object} params - Optional parameters
   */
  async getAll(params?: {
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
     * Account to show bots on. Return all if not specified. Gather this from GET /ver1/accounts
     */
    accountId?: number;
    /**
     * Bot show deals on. Return all if not specified
     */
    botId?: number;
    /**
     * active - active deals, finished - finished deals, completed - successfully completed, cancelled - cancelled deals, failed - failed deals, any other value or null (default) - all deals
     */
    scope?: string;
    /**
     * @default created_at
     */
    order?: 'created_at' | 'closed_at';
  }): Promise<Deal[]> {
    return await this.request<Deal[]>('GET', '/public/api/ver1/deals', params);
  }

  /**
   * @deprecated
   * Update max safety orders (Permission: BOTS_WRITE, Security: SIGNED)
   *
   * @param {object} params - Optional parameters
   */
  async updateMaxSafetyOrders(params: {
    /**
     * Max safety orders
     */
    maxSafetyOrders: number;
    /**
     * The id of the deal
     */
    dealId: number;
  }) {
    const { dealId, ...formData } = params;
    return await this.request(
      'POST',
      `/public/api/ver1/deals/${dealId}/update_max_safety_orders`,
      {},
      formData
    );
  }

  /**
   * Panic sell deal (Permission: BOTS_WRITE, Security: SIGNED)
   *
   * @param {object} params - Optional parameters
   */
  async panicSell(params: {
    /**
     * The id of the deal
     */
    dealId: number;
  }) {
    return await this.request('POST', `/public/api/ver1/deals/${params.dealId}/panic_sell`, {});
  }

  /**
   * Cancel deal (Permission: BOTS_WRITE, Security: SIGNED)
   *
   * @param {object} params - Optional parameters
   */
  async cancel(params: {
    /**
     * The id of the deal
     */
    dealId: number;
  }) {
    return await this.request('POST', `/public/api/ver1/deals/${params.dealId}/cancel`, {});
  }

  /**
   * Update deal (Permission: BOTS_WRITE, Security: SIGNED)
   *
   * @param {object} params - Optional parameters
   */
  async update(params: {
    /**
     * New take profit value
     */
    takeProfit?: number;
    profitCurrency?: 'quote_currency' | 'base_currency';
    /**
     * base – from base order, total – from total volume
     */
    takeProfitType?: string;
    trailingEnabled?: boolean;
    /**
     * New trailing deviation value
     */
    trailingDeviation?: number;
    /**
     * New stop loss percentage value
     */
    stopLossPercentage?: number;
    /**
     * New max safety orders value
     */
    maxSafetyOrders?: number;
    /**
     * New active safety orders count value
     */
    activeSafetyOrdersCount?: number;
    stopLossTimeoutEnabled?: boolean;
    /**
     * StopLoss timeout in seconds if StopLoss timeout enabled
     */
    stopLossTimeoutInSeconds?: number;
    /**
     * Trailing stop loss enabled
     */
    tslEnabled?: boolean;
    stopLossType?: 'stop_loss' | 'stop_loss_and_disable_bot';
    /**
     * The id of the deal
     */
    dealId: number;
  }) {
    const { dealId, ...formData } = params;
    return await this.request('POST', `/public/api/ver1/deals/${dealId}/update_deal`, {}, formData);
  }

  /**
   * @deprecated
   * DEPRECATED, Update take profit condition. Deal status should be bought (Permission: BOTS_WRITE, Security: SIGNED)
   *
   * @param {object} params - Optional parameters
   */
  async updateTakeProfit(params: {
    /**
     * New take profit value
     */
    newTakeProfitPercentage: number;
    /**
     * The id of the deal
     */
    dealId: number;
  }) {
    const { dealId, ...formData } = params;
    return await this.request('POST', `/public/api/ver1/deals/${dealId}/update_tp`, {}, formData);
  }

  /**
   * Info about specific deal (Permission: BOTS_READ, Security: SIGNED)
   *
   * @param {object} params - Optional parameters
   */
  async show(params: {
    /**
     * The id of the deal
     */
    dealId: number;
  }): Promise<DealDetail> {
    return await this.request<DealDetail>(
      'GET',
      `/public/api/ver1/deals/${params.dealId}/show`,
      {}
    );
  }

  /**
   * Cancel manual safety orders (Permission: BOTS_WRITE, Security: SIGNED)
   *
   * @param {object} params - Optional parameters
   */
  async cancelOrder(params: {
    /**
     * manual safety order id
     */
    orderId: string;
    /**
     * The id of the deal
     */
    dealId: number;
  }): Promise<DealDetail> {
    const { dealId, ...formData } = params;
    return await this.request<DealDetail>(
      'GET',
      `/public/api/ver1/deals/${params.dealId}/cancel_order`,
      {},
      formData
    );
  }

  /**
   * Deal safety orders (Permission: BOTS_READ, Security: SIGNED)
   *
   * @param {object} params - Optional parameters
   */
  async marketOrders(params: {
    /**
     * The id of the deal
     */
    dealId: number;
  }): Promise<DealDetail> {
    const { dealId, ...formData } = params;
    return await this.request<DealDetail>(
      'POST',
      `/public/api/ver1/deals/${dealId}/market_orders`,
      {},
      formData
    );
  }

  /**
   * Adding manual safety order (Permission: BOTS_WRITE, Security: SIGNED)
   *
   * @param {object} params - Optional parameters
   */
  async addFunds(params: {
    /**
     * safety order quantity
     */
    quantity: number;
    /**
     * true - use MARKET order, false - use LIMIT order
     */
    isMarket: boolean;
    responseType?: 'empty' | 'deal' | 'market_order';
    /**
     * safety order rate. Required if LIMIT order used
     */
    rate: number;
    /**
     * The id of the deal
     */
    dealId: number;
  }): Promise<DealDetail> {
    const { dealId, ...formData } = params;
    return await this.request('POST', `/public/api/ver1/deals/${dealId}/add_funds`, {}, formData);
  }

  /**
   * Info required to add funds correctly: available amounts, exchange limitations etc  (Permission: BOTS_READ, Security: SIGNED)
   *
   * @param {object} params - Optional parameters
   */
  async getInfoForAddingFunds(params: {
    /**
     * The id of the deal
     */
    dealId: number;
  }): Promise<DealDetail> {
    const { dealId } = params;
    return await this.request<DealDetail>(
      'GET',
      `/public/api/ver1/deals/${dealId}/data_for_adding_funds`,
      {}
    );
  }
}
