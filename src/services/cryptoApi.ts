import axios from 'axios';
import { Cryptocurrency, CryptoDetailData } from '../types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const cryptoApi = {
	getCryptocurrencies: async (
		page: number = 1,
		perPage: number = 100
	): Promise<Cryptocurrency[]> => {
		try {
			const response = await axios.get(`${BASE_URL}/coins/markets`, {
				params: {
					vs_currency: 'usd',
					order: 'market_cap_desc',
					per_page: perPage,
					page: page,
					sparkline: false,
				},
			});
			return response.data;
		} catch (error) {
			console.error('Error fetching cryptocurrencies:', error);
			throw error;
		}
	},

	getCryptocurrencyDetail: async (id: string): Promise<CryptoDetailData> => {
		try {
			const response = await axios.get(`${BASE_URL}/coins/${id}`);
			return response.data;
		} catch (error) {
			console.error('Error fetching cryptocurrency detail:', error);
			throw error;
		}
	},
};
