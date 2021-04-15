import { ThreeCommasConfiguration, ThreeCommasService } from './base';

export type Bot = {
  id?: number;
  account_id?: number;
  is_enabled?: boolean;
  max_safety_orders?: number;
  active_safety_orders_count?: number;
  pairs?: string;
  strategy_list?: string;
  max_active_deals?: number;
  active_deals_count?: number;
  'deletable?'?: boolean;
  created_at?: string;
  updated_at?: string;
  trailing_enabled?: boolean;
  tsl_enabled?: boolean;
  deal_start_delay_seconds?: number;
  stop_loss_timeout_enabled?: boolean;
  stop_loss_timeout_in_seconds?: number;
  disable_after_deals_count?: number;
  deals_counter?: number;
  allowed_deals_on_same_pair?: number;
  easy_form_supported?: boolean;
  name?: string;
  take_profit?: string;
  base_order_volume?: string;
  safety_order_volume?: string;
  safety_order_step_percentage?: string;
  take_profit_type?: string;
  type?: string;
  martingale_volume_coefficient?: string;
  martingale_step_coefficient?: string;
  stop_loss_percentage?: string;
  cooldown?: string;
  strategy?: string;
  min_volume_btc_24h?: string;
  profit_currency?: string;
  min_price?: string;
  max_price?: string;
  stop_loss_type?: string;
  safety_order_volume_type?: string;
  base_order_volume_type?: string;
  account_name?: string;
  trailing_deviation?: string;
  finished_deals_profit_usd?: string;
  finished_deals_count?: string;
  leverage_type?: string;
  leverage_custom_value?: string;
  start_order_type?: string;
};

export class BotsAPI extends ThreeCommasService {
  constructor(protected configuration: ThreeCommasConfiguration) {
    super(configuration, '/public/api/ver1/bots');
  }

  /**
   * Available strategy list for bot (Permission: BOTS_READ, Security: SIGNED)
   */
  async getStrategyList(params: {
    /**
     * id from GET /ver1/accounts
     */
    accountId?: number;
    type?: 'simple' | 'composite';
    strategy?: 'long' | 'short';
  }): Promise<any> {
    return await this.request<any>('GET', '/strategy_list', params);
  }

  /**
   * Black List for bot pairs (Permission: BOTS_READ, Security: SIGNED)
   */
  async getBlackListForBotPairs(): Promise<any> {
    return await this.request<any>('GET', '/pairs_black_list');
  }

  /**
   * Create or Update pairs BlackList for bots (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async createOrUpdatePairsBlackListForBots(data: { pairs: string[] }): Promise<void> {
    return await this.request('POST', '/update_pairs_black_list', {}, data);
  }

  /**
   * Create bot (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async createBot(data: {
    name: string;
    /**
     * id from GET /ver1/accounts
     */
    accountId: number;
    /**
     * Pass single pair to create SingleBot or any other number of pairs to create MultiBot
     */
    pairs: string[];
    maxActiveDeals?: number;
    /**
     * Base order size
     */
    baseOrderVolume: number;
    /**
     * base order volume currency
     */
    baseOrderVolumeType?: 'quote_currency' | 'base_currency' | 'percent' | 'xbt';
    /**
     * Target profit(percentage)
     */
    takeProfit: number;
    /**
     * Safety trade size
     */
    safetyOrderVolume: number;
    /**
     * safety order volume currency
     */
    safetyOrderVolumeType?: 'quote_currency' | 'base_currency' | 'percent' | 'xbt';
    martingaleVolumeCoefficient: number;
    martingaleStepCoefficient: number;
    /**
     * Max safety trades count
     */
    maxSafetyOrders: number;
    /**
     * Max active safety trades count
     */
    activeSafetyOrdersCount: number;
    stopLossPercentage?: number;
    cooldown?: number;
    /**
     * Enable trailing take profit. Binance only.
     */
    trailingEnabled?: boolean;
    /**
     * required if trailing_enabled
     */
    trailingDeviation?: number;
    btcPriceLimit?: number;
    /**
     * @default long
     */
    strategy?: 'short' | 'long';
    /**
     * Price deviation to open safety trades(percentage)
     */
    safetyOrderStepPercentage: number;
    /**
     * Percentage: base – from base order, total – from total volume
     *
     * @default base
     */
    takeProfitType: 'base' | 'total';
    /**
     * For manual signals: [{"strategy":"manual"}] or []
     * For non-stop(1 pair only): [{"strategy":"nonstop"}]
     * QFL: {"options"=>{"type"=>"original"}, "strategy"=>"qfl"}]
     * TradingView: [{"options"=>{"time"=>"5m", "type"=>"buy_or_strong_buy"}, "strategy"=>"trading_view"}
     */
    strategyList: any[];
    /**
     * Used for Bitmex bots only
     *
     * @default not_specified
     */
    leverageType?: 'custom' | 'cross' | 'not_specified';
    /**
     * required if leverage_type is custom
     */
    leverageCustomValue?: number;
    /**
     * minimum price to open deal
     */
    minPrice?: number;
    /**
     * maximum price to open deal
     */
    maxPrice?: number;
    /**
     * StopLoss timeout in seconds if StopLoss timeout enabled
     */
    stopLossTimeoutEnabled?: boolean;
    stopLossTimeoutInSeconds?: number;
    minVolumeBtc24H?: number;
    /**
     * Enable trailing stop loss. Bitmex only.
     */
    tslEnabled?: boolean;
    /**
     * Deal start delay in seconds
     */
    dealStartDelaySeconds?: number;
    /**
     * Take profit currency
     */
    profitCurrency?: 'quote_currency' | 'base_currency';
    startOrderType?: 'limit' | 'market';
    stopLossType?: 'stop_loss' | 'stop_loss_and_disable_bot';
    /**
     * Bot will be disabled after opening this number of deals
     */
    disableAfterDealsCount?: number;
    /**
     * Allow specific number of deals on the same pair. Multibot only.
     */
    allowedDealsOnSamePair?: number;
  }): Promise<void> {
    return await this.request('POST', '/create_bot', {}, data);
  }

  /**
   * User bots (Permission: BOTS_READ, Security: SIGNED)
   */
  async getUserBots(params: {
    /**
     * Limit records. Max: 100
     *
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
    scope?: 'enabled' | 'disabled';
    strategy?: 'long' | 'short';
  }): Promise<Bot[]> {
    return await this.request<Bot[]>('GET', '', params);
  }

  /**
   * Get bot stats (Permission: BOTS_READ, Security: SIGNED)
   */
  async getBotStats(params: {
    /**
     * Account to show on. Null - show for all. Gather this from GET /ver1/accounts
     */
    accountId?: number;
    /**
     * Bots to show on. Null - show for all
     */
    botId?: number;
  }): Promise<any> {
    return await this.request<any>('GET', '/stats', params);
  }

  /**
   * Edit bot (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async editBot(
    botId: number,
    data: {
      name: string;
      pairs: string[];
      /**
       * @default 1
       */
      maxActiveDeals?: number;
      /**
       * Base order size
       */
      baseOrderVolume: number;
      /**
       * base order volume currency
       */
      baseOrderVolumeType?: 'quote_currency' | 'base_currency' | 'percent' | 'xbt';
      /**
       * Target profit(percentage)
       */
      takeProfit: number;
      /**
       * Safety trade size
       */
      safetyOrderVolume: number;
      /**
       * safety order volume currency
       */
      safetyOrderVolumeType?: 'quote_currency' | 'base_currency' | 'percent' | 'xbt';
      martingaleVolumeCoefficient: number;
      martingaleStepCoefficient: number;
      /**
       * Max safety trades count
       */
      maxSafetyOrders: number;
      /**
       * Max active safety trades count
       */
      activeSafetyOrdersCount: number;
      stopLossPercentage?: number;
      cooldown?: number;
      /**
       * Enable trailing take profit. Binance only.
       */
      trailingEnabled?: boolean;
      /**
       * required if trailing_enabled
       */
      trailingDeviation?: number;
      btcPriceLimit?: number;
      /**
       * Price deviation to open safety trades(percentage)
       */
      safetyOrderStepPercentage: number;
      /**
       * Percentage: base – from base order, total – from total volume
       *
       * @default total
       */
      takeProfitType: 'total' | 'base';
      /**
       * For manual signals: [{"strategy":"nonstop"}] or []
       * For non-stop(1 pair only): [{"strategy":"nonstop"}]
       * QFL: {"options"=>{"type"=>"original"}, "strategy"=>"qfl"}]
       * TradingView: [{"options"=>{"time"=>"5m", "type"=>"buy_or_strong_buy"}, "strategy"=>"trading_view"}
       */
      strategyList: any[];
      /**
       * Used for Bitmex bots only
       *
       * @default not_specified
       */
      leverageType?: 'custom' | 'cross' | 'not_specified';
      /**
       * required if leverage_type is custom
       */
      leverageCustomValue?: number;
      /**
       * minimum price to open deal
       */
      minPrice?: number;
      /**
       * maximum price to open deal
       */
      maxPrice?: number;
      stopLossTimeoutEnabled?: boolean;
      /**
       * StopLoss timeout in seconds if StopLoss timeout enabled
       */
      stopLossTimeoutInSeconds?: number;
      minVolumeBtc24H?: number;
      /**
       * Enable trailing stop loss. Bitmex only.
       */
      tslEnabled?: boolean;
      /**
       * Deal start delay in seconds
       */
      dealStartDelaySeconds?: number;
      /**
       * Take profit currency
       */
      profitCurrency?: 'quote_currency' | 'base_currency';
      startOrderType?: 'limit' | 'market';
      /**
       * Bot will be disabled after opening this number of deals
       */
      stopLossType?: 'stop_loss' | 'stop_loss_and_disable_bot';
      /**
       * Allow specific number of deals on the same pair. Multibot only.
       */
      disableAfterDealsCount?: number;
      allowedDealsOnSamePair?: number;
    }
  ): Promise<void> {
    return await this.request('PATCH', `/${botId}/update`, {}, data);
  }

  /**
   * Disable bot (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async disableBot(botId: number): Promise<void> {
    return await this.request('POST', `${botId}/disable`);
  }

  /**
   * Enable bot (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async enableBot(botId: number): Promise<void> {
    return await this.request('POST', `${botId}/enable`);
  }

  /**
   * Start new deal asap (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async startNewDealASAP(
    botId: number,
    data?: {
      /**
       * Can be omited for simple bot
       */
      pair?: string;
      /**
       * If false or not specified then all paramaters like signals or volume filters will be checked. If true - those checks will be skipped
       */
      skipSignalChecks?: boolean;
      /**
       * If true then you will be allowed to open more then one deal per pair in composite bot
       */
      skipOpenDealsChecks?: boolean;
    }
  ): Promise<void> {
    return await this.request('POST', `${botId}/start_new_deal`, {}, data);
  }

  /**
   * Delete bot (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async deleteBot(botId: number): Promise<void> {
    return await this.request('POST', `${botId}/delete`);
  }

  /**
   * Panic sell all bot deals (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async panicSellAllBotDeals(botId: number): Promise<void> {
    return await this.request('POST', `${botId}/panic_sell_all_deals`);
  }

  /**
   * Cancel all bot deals (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async cancelAllBotDeals(botId: number): Promise<void> {
    return await this.request('POST', `${botId}/cancel_all_deals`);
  }

  /**
   * Bot info (Permission: BOTS_READ, Security: SIGNED)
   */
  async getBotInfo(
    botId: number,
    params?: {
      includeEvents?: boolean;
    }
  ): Promise<Bot> {
    return await this.request<Bot>('GET', `${botId}/show`, params);
  }
}
