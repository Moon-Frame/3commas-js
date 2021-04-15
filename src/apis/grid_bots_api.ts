import { ThreeCommasConfiguration, ThreeCommasService } from './base';

export type GridBot = {
  id?: number;
  account_id?: number;
  account_name?: string;
  is_enabled?: boolean;
  grids_quantity?: string;
  created_at?: string;
  updated_at?: string;
  lower_price?: string;
  upper_price?: string;
  quantity_per_grid?: string;
  leverage_type?: string;
  leverage_custom_value?: string;
  name?: string;
  pair?: string;
  start_price?: string;
  grid_price_step?: string;
  current_profit?: string;
  current_profit_usd?: string;
  bought_volume?: string;
  sold_volume?: string;
  profit_percentage?: string;
  current_price?: string;
  investment_base_currency?: string;
  investment_quote_currency?: string;
  grid_lines?: GridLine;
};

export type GridLine = {
  price?: string;
  side?: string;
};

export type GridBotProfits = {
  grid_line_id?: number;
  profit?: string;
  usd_profit?: string;
  created_at?: string;
};

export class GridBotsAPI extends ThreeCommasService {
  constructor(protected configuration: ThreeCommasConfiguration) {
    super(configuration, '/public/api/ver1/grid_bots');
  }

  /**
   * Create AI Grid Bot (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async createAIGridBot(data: {
    /**
     * id from GET /ver1/accounts
     */
    accountId: number;
    pair: string;
    totalQuantity: number;
    /**
     * Leverage type for futures accounts
     * @default not_specified
     */
    leverageType?: 'custom' | 'cross' | 'not_specified';
    /**
     * Required if leverage_type = 'custom'
     */
    leverageCustomValue?: number;
  }): Promise<void> {
    return await this.request('POST', '/ai', {}, data);
  }

  /**
   * Create Manual Grid Bot (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async createManualGridBot(data: {
    /**
     * id from GET /ver1/accounts
     */
    accountId: number;
    pair: string;
    upperPrice: number;
    lowerPrice: number;
    quantityPerGrid: number;
    gridsQuantity: number;
    /**
     * Leverage type for futures accounts
     *
     * @default not_specified
     */
    leverageType?: 'custom' | 'cross' | 'not_specified';
    /**
     * Required if leverage_type = 'custom'
     */
    leverageCustomValue?: number;
    /**
     * Turn on or off grid_bot after creation
     *
     * @default true
     */
    isEnabled?: boolean;
  }): Promise<void> {
    return await this.request('POST', '/manual', {}, data);
  }

  /**
   * Get AI settings (Permission: BOTS_READ, Security: SIGNED)
   */
  // TODO: Type return
  async getAISettings(params: {
    pair: string;
    /**
     * Market code from /accounts/market_list
     */
    marketCode: string;
  }): Promise<void> {
    return await this.request('GET', '/ai_settings', params);
  }

  /**
   * Grid bots list (Permission: BOTS_READ, Security: SIGNED)
   */
  async getGridBots(params?: {
    /**
     * Filter by account id
     */
    accountIds?: number[];
    /**
     * Filter by account type
     */
    accountTypes?: string[];
    /**
     * Filter by bot state
     */
    state?: 'enabled' | 'disabled';
    /**
     * Sort column
     */
    sortBy?: 'current_profit' | 'bot_id' | 'pair';
    /**
     * Sort direction
     */
    sortDirection?: 'desc' | 'asc';
    limit?: number;
    offset?: number;
  }): Promise<GridBot[]> {
    return await this.request<GridBot[]>('GET', '', params);
  }

  /**
   * Grid Bot Market Orders (Permission: BOTS_READ, Security: SIGNED)
   */
  // TODO: Type return
  async getGridBotMarketOrders(gridBotId: number): Promise<any> {
    return await this.request('GET', `/${gridBotId}/market_orders`);
  }

  /**
   * Grid Bot Profits (Permission: BOTS_READ, Security: SIGNED)
   */
  // TODO: Type return
  async getGridBotProfits(gridBotId: number): Promise<GridBotProfits> {
    return await this.request<GridBotProfits>('GET', `/${gridBotId}/profits`);
  }

  /**
   * Edit Grid Bot (AI) (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async editGridBotAI(
    gridBotId: number,
    data: {
      pair: string;
      totalQuantity: number;
      /**
       * Leverage type for futures accounts
       *
       * @default not_specified
       */
      leverageType?: 'custom' | 'cross' | 'not_specified';
      /**
       * Required if leverage_type = 'custom'
       */
      leverageCustomValue?: number;
    }
  ): Promise<void> {
    return await this.request('PATCH', `/${gridBotId}/ai`, {}, data);
  }

  /**
   * Edit Grid Bot (Manual) (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async editGridBotManual(
    gridBotId: number,
    data: {
      pair: string;
      upperPrice: number;
      lowerPrice: number;
      quantityPerGrid: number;
      gridsQuantity: number;
      /**
       * Leverage type for futures accounts
       *
       * @default not_specified
       */
      leverageType?: 'custom' | 'cross' | 'not_specified';
      /**
       * Required if leverage_type = 'custom'
       */
      leverageCustomValue?: number;
    }
  ): Promise<void> {
    return await this.request('PATCH', `/${gridBotId}/manual`, {}, data);
  }

  /**
   * Show Grid Bot (Permission: BOTS_READ, Security: SIGNED)
   */
  async showGridBot(gridBotId: number): Promise<GridBot> {
    return await this.request<GridBot>('GET', `/${gridBotId}`);
  }

  /**
   * Delete Grid Bot (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async deleteGridBot(gridBotId: number): Promise<void> {
    return await this.request('DELETE', `/${gridBotId}`);
  }

  /**
   * Disable Grid Bot (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async disableGridBot(gridBotId: number): Promise<void> {
    return await this.request('POST', `/${gridBotId}/disable`);
  }

  /**
   * Enable Grid Bot (Permission: BOTS_WRITE, Security: SIGNED)
   */
  async enableGridBot(gridBotId: number): Promise<void> {
    return await this.request('POST', `/${gridBotId}/enable`);
  }

  /**
   * Enable Grid Bot (Permission: BOTS_WRITE, Security: SIGNED)
   */
  // TODO: Complete return typing
  async getGridBotRequiredBalances(gridBotId: number): Promise<any> {
    return await this.request<any>('GET', `/${gridBotId}/required_balances`);
  }
}
