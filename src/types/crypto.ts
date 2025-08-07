export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number; // Added for 7-day change
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  // Optional additional properties that might be useful
  price_change_percentage_1h_in_currency?: number; // 1-hour change
  price_change_percentage_30d_in_currency?: number; // 30-day change
  price_change_percentage_1y_in_currency?: number; // 1-year change
  sparkline_in_7d?: {
    price: number[];
  }; // For mini charts if needed later
}

export interface CryptoDetailData {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank?: number; // Added this
  description: {
    en: string;
  };
  image: {
    large: string;
  };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d?: number; // Added this
    ath?: { usd: number }; // Added this
    atl?: { usd: number }; // Added this
    circulating_supply?: number; // Added this
    total_supply?: number; // Added this
    max_supply?: number; // Added this
  };
  // Additional detail properties from your previous interface
  links?: {
    homepage?: string[];
    blockchain_site?: string[];
    official_forum_url?: string[];
    chat_url?: string[];
    announcement_url?: string[];
    twitter_screen_name?: string;
    facebook_username?: string;
    subreddit_url?: string;
  };
  genesis_date?: string;
  sentiment_votes_up_percentage?: number;
  sentiment_votes_down_percentage?: number;
  coingecko_rank?: number;
  coingecko_score?: number;
  developer_score?: number;
  community_score?: number;
  liquidity_score?: number;
  public_interest_score?: number;
}
