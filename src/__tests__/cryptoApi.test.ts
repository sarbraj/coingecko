import axios from 'axios';
import { cryptoApi } from '../services/cryptoApi';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('cryptoApi', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('getCryptocurrencies returns data successfully', async () => {
		const mockData = [{ id: 'bitcoin', name: 'Bitcoin' }];
		mockedAxios.get.mockResolvedValue({ data: mockData });

		const result = await cryptoApi.getCryptocurrencies();

		expect(mockedAxios.get).toHaveBeenCalledWith(
			'https://api.coingecko.com/api/v3/coins/markets',
			{
				params: {
					vs_currency: 'usd',
					order: 'market_cap_desc',
					per_page: 100,
					page: 1,
					sparkline: false,
				},
			}
		);
		expect(result).toEqual(mockData);
	});

	test('getCryptocurrencyDetail returns data successfully', async () => {
		const mockData = { id: 'bitcoin', name: 'Bitcoin' };
		mockedAxios.get.mockResolvedValue({ data: mockData });

		const result = await cryptoApi.getCryptocurrencyDetail('bitcoin');

		expect(mockedAxios.get).toHaveBeenCalledWith(
			'https://api.coingecko.com/api/v3/coins/bitcoin'
		);
		expect(result).toEqual(mockData);
	});
});
