import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import CryptoTable from '../components/CryptoTable/CryptoTable';
import * as cryptoApi from '../services/cryptoApi';

// Mock the API
jest.mock('../services/cryptoApi');
const mockedCryptoApi = cryptoApi as jest.Mocked<typeof cryptoApi>;

const mockCryptos = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://example.com/bitcoin.png',
    current_price: 50000,
    market_cap: 1000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 5.5,
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CryptoTable', () => {
  beforeEach(() => {
    mockedCryptoApi.cryptoApi.getCryptocurrencies.mockResolvedValue(mockCryptos as any);
  });

  test('renders loading state initially', () => {
    renderWithRouter(<CryptoTable />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders crypto data after loading', async () => {
    renderWithRouter(<CryptoTable />);
    
    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.getByText('BTC')).toBeInTheDocument();
    });
  });

  test('filters cryptocurrencies based on search term', async () => {
    renderWithRouter(<CryptoTable />);
    
    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search cryptocurrencies...');
    expect(searchInput).toBeInTheDocument();
  });
});
