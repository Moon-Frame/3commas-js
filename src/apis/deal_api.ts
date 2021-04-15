import { ThreeCommasConfiguration, ThreeCommasService } from './base';

export type DealStatus =
  | 'created'
  | 'base_order_placed'
  | 'bought'
  | 'cancelled'
  | 'completed'
  | 'failed'
  | 'panic_sell_pending'
  | 'panic_sell_order_placed'
  | 'panic_sold'
  | 'cancel_pending'
  | 'stop_loss_pending'
  | 'stop_loss_finished'
  | 'stop_loss_order_placed'
  | 'switched'
  | 'switched_take_profit'
  | 'ttp_activated'
  | 'ttp_order_placed'
  | 'liquidated'
  | 'bought_safety_pending'
  | 'bought_take_profit_pending'
  | 'settled';

export type Deal = {
  id?: number;
  type?: string;
  bot_id?: number;
  max_safety_orders?: number;
  deal_has_error?: boolean;
  /**
   * @deprecated
   */
  from_currency_id?: number;
  /**
   * @deprecated
   */
  to_currency_id?: number;
  account_id?: number;
  active_safety_orders_count?: number;
  created_at?: string;
  updated_at?: string;
  closed_at?: string;
  'finished?'?: boolean;
  current_active_safety_orders_count?: number;
  /**
   * @deprecated
   */
  current_active_safety_orders?: number;
  /**
   * completed safeties (not including manual)
   */
  completed_safety_orders_count?: number;
  /**
   * completed manual safeties
   */
  completed_manual_safety_orders_count?: number;
  'cancellable?'?: boolean;
  'panic_sellable?'?: boolean;
  trailing_enabled?: boolean;
  tsl_enabled?: boolean;
  stop_loss_timeout_enabled?: boolean;
  stop_loss_timeout_in_seconds?: number;
  active_manual_safety_orders?: number;
  /**
   * Format: QUOTE_BASE
   */
  pair?: string;
  status?: DealStatus;
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
  take_profit_type?: 'base' | 'total';
  final_profit?: string;
  martingale_coefficient?: string;
  martingale_volume_coefficient?: string;
  martingale_step_coefficient?: string;
  stop_loss_percentage?: string;
  error_message?: string;
  profit_currency?: 'quote_currency' | 'base_currency';
  stop_loss_type?: 'stop_loss' | 'stop_loss_and_disable_bot';
  safety_order_volume_type?: 'quote_currency' | 'base_currency' | 'percent' | 'xbt';
  base_order_volume_type?: 'quote_currency' | 'base_currency' | 'percent' | 'xbt';
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
  /**
   * Highest price met in case of long deal, lowest price otherwise
   */
  trailing_deviation?: string;
  trailing_max_price?: string;
  /**
   * Highest price met in TSL in case of long deal, lowest price otherwise
   */
  tsl_max_price?: string;
  strategy?: 'short' | 'long';
};

export type DealDetail = Deal & {
  bot_events: {
    message: string;
    created_at: Date;
  }[];
};

export class DealAPI extends ThreeCommasService {
  constructor(protected configuration: ThreeCommasConfiguration) {
    super(configuration, '/public/api/ver1/deals');
  }

  /**
   * User deals (Permission: BOTS_READ, Security: SIGNED)
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
    return await this.request<Deal[]>('GET', '', params);
  }

  /**
   * @deprecated
   *
   * Update max safety orders (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async updateMaxSafetyOrders(
    dealId: number,
    data: {
      /**
       * Max safety orders
       */
      maxSafetyOrders: number;
    }
  ) {
    return await this.request('POST', `/${dealId}/update_max_safety_orders`, {}, data);
  }

  /**
   * Panic sell deal (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async panicSell(dealId: number) {
    return await this.request('POST', `/${dealId}/panic_sell`);
  }

  /**
   * Cancel deal (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async cancel(dealId: number) {
    return await this.request('POST', `/${dealId}/cancel`);
  }

  /**
   * Update deal (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async update(
    dealId: number,
    data: {
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
    }
  ) {
    return await this.request('POST', `/${dealId}/update_deal`, {}, data);
  }

  /**
   * @deprecated
   * DEPRECATED, Update take profit condition. Deal status should be bought (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async updateTakeProfit(
    dealId: number,
    data: {
      /**
       * New take profit value
       */
      newTakeProfitPercentage: number;
    }
  ) {
    return await this.request('POST', `/${dealId}/update_tp`, {}, data);
  }

  /**
   * Info about specific deal (Permission: BOTS_READ, Security: SIGNED)
   *
   * @param {number} dealId - Deal id
   */
  async show(dealId: number): Promise<DealDetail> {
    return await this.request<DealDetail>('GET', `/${dealId}/show`);
  }

  /**
   * Cancel manual safety orders (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async cancelOrder(
    dealId: number,
    data: {
      /**
       * manual safety order id
       */
      orderId: string;
    }
  ): Promise<DealDetail> {
    return await this.request<DealDetail>('POST', `/${dealId}/cancel_order`, {}, data);
  }

  /**
   * Deal safety orders (Permission: BOTS_READ, Security: SIGNED)
   */
  async marketOrders(dealId: number): Promise<DealDetail> {
    return await this.request<DealDetail>('GET', `/${dealId}/market_orders`);
  }

  /**
   * Adding manual safety order (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async addFunds(
    dealId: number,
    data: {
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
    }
  ): Promise<DealDetail> {
    return await this.request('POST', `/${dealId}/add_funds`, {}, data);
  }

  /**
   * Info required to add funds correctly: available amounts, exchange limitations etc  (Permission: BOTS_READ, Security: SIGNED)
   */
  async getDataForAddingFunds(dealId: number): Promise<DealDetail> {
    return await this.request<DealDetail>('GET', `/${dealId}/data_for_adding_funds`);
  }
}
