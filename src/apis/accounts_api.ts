import { ThreeCommasConfiguration, ThreeCommasService } from './base';

export type Account = {
  id?: number;
  auto_balance_period?: number;
  auto_balance_portfolio_id?: number;
  auto_balance_currency_change_limit?: number;
  autobalance_enabled?: boolean;
  is_locked?: boolean;
  smart_trading_supported?: boolean;
  /**
   * @deprecated use smart_trading_supported instead
   */
  smart_selling_supported?: boolean;
  available_for_trading?: boolean;
  stats_supported?: boolean;
  trading_supported?: boolean;
  market_buy_supported?: boolean;
  market_sell_supported?: boolean;
  conditional_buy_supported?: boolean;
  bots_allowed?: boolean;
  bots_ttp_allowed?: boolean;
  bots_tsl_allowed?: boolean;
  gordon_bots_available?: boolean;
  multi_bots_allowed?: boolean;
  created_at?: string;
  updated_at?: string;
  last_auto_balance?: string;
  /**
   * Sell all to USD/BTC possibility
   */
  fast_convert_available?: boolean;
  grid_bots_allowed?: boolean;
  supported_market_types?: string;
  api_key?: string;
  name?: string;
  /**
   * Values: time, currency_change
   */
  auto_balance_method?: number;
  auto_balance_error?: string;
  lock_reason?: string;
  btc_amount?: string;
  usd_amount?: string;
  day_profit_btc?: string;
  day_profit_usd?: string;
  day_profit_btc_percentage?: string;
  day_profit_usd_percentage?: string;
  /**
   * Month period
   */
  btc_profit?: string;
  /**
   * Month period
   */
  usd_profit?: string;
  /**
   * Month period
   */
  usd_profit_percentage?: string;
  /**
   * Month period
   */
  btc_profit_percentage?: string;
  total_btc_profit?: string;
  total_usd_profit?: string;
  pretty_display_type?: string;
  exchange_name?: string;
  market_code?: string;
  address?: string;
};

export class AccountsAPI extends ThreeCommasService {
  constructor(protected configuration: ThreeCommasConfiguration) {
    super(configuration, '/public/api/ver1/accounts');
  }

  /**
   * Transfer coins between accounts (Permission: ACCOUNTS_WRITE, Security: SIGNED)
   */
  async transfer(data: {
    /**
     * Currency code(example: USDT)
     */
    currency: string;
    amount: number;
    /**
     * Recipient account ID (possible values in /transfer_data)
     */
    toAccountId: number;
    /**
     * Sender account ID (possible values in /transfer_data)
     */
    fromAccountId: number;
  }): Promise<void> {
    return await this.request('POST', '/transfer', {}, data);
  }

  /**
   * Transfers history (Permission: ACCOUNTS_READ, Security: SIGNED)
   */
  // TODO: Complete return type
  async transferHistory(params: {
    /**
     * Sender or Recipient account ID (possible values in /transfer_data)
     */
    accountId: number;
    /**
     * Currency code(example: USDT)
     */
    currency: string;
    /**
     * Page number
     *
     * @default 1
     */
    page?: number;
    /**
     * Elements per page
     *
     * @default 10
     */
    perPage?: number;
  }): Promise<any> {
    return await this.request('GET', '/transfer_history', params);
  }

  /**
   * Data for transfer between accounts (Permission: ACCOUNTS_READ, Security: SIGNED)
   */
  // TODO: Complete return type
  async transferData(): Promise<any> {
    return await this.request('GET', '/transfer_data');
  }

  /**
   * Add exchange account (Permission: ACCOUNTS_WRITE, Security: SIGNED)
   */
  async addExchangeAccount(data: {
    /**
     * check market_code in market_list method
     */
    type: string;
    /**
     * Account name (any string)
     */
    name: string;
    /**
     * Requires unless type = binance_dex
     */
    apiKey?: string;
    /**
     * Requires unless type = binance_dex
     */
    secret?: string;
    /**
     * For Bitstamp
     */
    customerId?: string;
    /**
     * For Coinbase Pro (GDAX)
     */
    passphrase?: string;
    howConnect?: 'mnemonic_phrase' | 'keystore';
    /**
     * keystore file content. Requires if type = binance_dex and how_connect = keystore
     */
    keystore?: { [key: string]: any };
    /**
     * Requires if type = binance_dex and how_connect = keystore
     */
    walletPassword?: string;
    /**
     * Requires if type = binance_dex and how_connect = mnemonic_phrase
     */
    mnemonicPhrase?: string;
  }): Promise<void> {
    return await this.request('POST', '/accounts/new', {}, data);
  }

  /**
   * Edit exchange account
   */
  async editExchangeAccount(data: {
    accountId: number;
    /**
     * Account name (any string)
     */
    name?: string;
    apiKey?: string;
    secret?: string;
    /**
     * For Bitstamp
     */
    customerId?: string;
    /**
     * For Coinbase Pro (GDAX)
     */
    passphrase?: string;
  }): Promise<void> {
    return await this.request('POST', '/accounts/update', {}, data);
  }

  /**
   * User connected exchanges(and EthereumWallet) list (Permission: ACCOUNTS_READ, Security: SIGNED)
   */
  async listConnectedExhanges(): Promise<Account[]> {
    return await this.request<Account[]>('GET', '/accounts');
  }

  /**
   * Supported markets list (Permission: NONE, Security: NONE)
   */
  // TODO: Add return type
  async getSupportedMarketsList(): Promise<any> {
    return await this.request<any>('GET', '/accounts/market_list');
  }

  /**
   * All market pairs (Permission: NONE, Security: NONE)
   */
  // TODO: Add return type
  async getAllMarketPairs(params: {
    /**
     * @deprecated use market_code instead
     */
    prettyDisplayType?: string;
    /**
     * market_code from account model
     */
    marketCode?: string;
  }): Promise<any> {
    return await this.request<any>('GET', '/accounts/market_pairs', params);
  }

  /**
   * Currency rates and limits (Permission: NONE, Security: NONE)
   */
  // TODO: Add return type
  async getCurrencyRates(params: {
    /**
     * @deprecated use market_code instead
     */
    prettyDisplayType?: string;
    /**
     * market_code from account model
     */
    marketCode?: string;
    /**
     * Pair
     */
    pair: string;
  }): Promise<any> {
    return await this.request<any>('GET', '/accounts/currency_rates', params);
  }

  /**
   * Active trade entities (Permission: ACCOUNTS_READ, Security: SIGNED)
   */
  // TODO: Add return type
  async getActiveTradeEntities(accountId: number): Promise<any> {
    return await this.request<any>('GET', `/accounts/${accountId}/active_trading_entities`);
  }

  /**
   * Sell all to USD (Permission: ACCOUNTS_WRITE, Security: SIGNED)
   */
  async sellAllToUSD(accountId: number): Promise<void> {
    return await this.request('POST', `/accounts/${accountId}/sell_all_to_usd`);
  }

  /**
   * Sell all to BTC (Permission: ACCOUNTS_WRITE, Security: SIGNED)
   */
  async sellAllToBTC(accountId: number): Promise<void> {
    return await this.request('POST', `/accounts/${accountId}/sell_all_to_btc`);
  }

  /**
   * balance history data (Permission: ACCOUNTS_READ, Security: SIGNED)
   */
  // TODO: Add return type
  async getBalanceHistoryData(
    accountId: number,
    params: {
      dateFrom: string;
      dateTo?: string;
    }
  ): Promise<any> {
    return await this.request<any>('GET', `/accounts/${accountId}/balance_chart_data`, params);
  }

  /**
   * Load balances for specified exchange (Permission: ACCOUNTS_READ, Security: SIGNED)
   */
  // TODO: weird type
  async loadBalancesForExchange(accountId: number): Promise<void> {
    return await this.request('POST', `/accounts/${accountId}/load_balances`);
  }

  /**
   * Rename exchange connection (Permission: ACCOUNTS_WRITE, Security: SIGNED)
   */
  async renameExchangeConnection(
    accountId: number,
    data: {
      name: string;
    }
  ): Promise<void> {
    return await this.request('POST', `/accounts/${accountId}/rename`, {}, data);
  }

  /**
   * Information about all user balances on specified exchange in pretty for pie chart format (Permission: ACCOUNTS_READ, Security: SIGNED)
   */
  // TODO: weird type
  async getExchangePieChartData(accountId: number): Promise<void> {
    return await this.request('POST', `/accounts/${accountId}/pie_chart_data`);
  }

  /**
   * Information about all user balances on specified exchange (Permission: ACCOUNTS_READ, Security: SIGNED)
   */
  // TODO: weird type
  async getExchangeTableData(accountId: number): Promise<void> {
    return await this.request('POST', `/accounts/${accountId}/account_table_data`);
  }

  /**
   * Remove exchange connection (Permission: ACCOUNTS_WRITE, Security: SIGNED)
   */
  async removeExchangeConnection(accountId: number): Promise<void> {
    return await this.request('POST', `/accounts/${accountId}/remove`);
  }

  /**
   * Information about account leverage (Permission: ACCOUNTS_READ, Security: SIGNED)
   */
  // TODO: fix type
  async getLeverageData(
    accountId: number,
    params: {
      pair: string;
    }
  ): Promise<any> {
    return await this.request<any>('GET', `/accounts/${accountId}/leverage_data`, params);
  }

  /**
   * Single Account Info (Permission: ACCOUNTS_READ, Security: SIGNED)
   */
  async getAccount(accountId: number): Promise<Account> {
    return await this.request<Account>('GET', `/accounts/${accountId}`);
  }

  /**
   * Single Account Summary (Permission: ACCOUNTS_READ, Security: SIGNED)
   */
  async getAccountSummary(): Promise<Account> {
    return await this.request<Account>('GET', '/accounts/summary');
  }
}
