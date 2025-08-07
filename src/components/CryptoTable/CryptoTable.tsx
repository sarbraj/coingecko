import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cryptocurrency } from '../../types/crypto';

const CryptoTable: FunctionComponent = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [searchResults, setSearchResults] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null); // Separate search error
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState<keyof Cryptocurrency>('market_cap_rank');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(50);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Debounced search
  const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Format functions
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  }, []);

  const formatMarketCap = useCallback((marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return formatPrice(marketCap);
  }, [formatPrice]);

  // Reset search function
  const resetSearch = useCallback(() => {
    setSearchTerm('');
    setIsSearchMode(false);
    setSearchResults([]);
    setSearchError(null);
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
      setSearchDebounceTimer(null);
    }
  }, [searchDebounceTimer]);

  // Fetch paginated crypto data
  const fetchCryptos = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${itemsPerPage}&page=${page}&sparkline=false&price_change_percentage=24h,7d`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const estimatedTotal = 10000;
      const calculatedTotalPages = Math.ceil(estimatedTotal / itemsPerPage);

      setCryptos(data);
      setTotalPages(Math.min(calculatedTotalPages, 200));
      setCurrentPage(page);

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  // API-based search function
  const searchCryptos = useCallback(async (query: string) => {
    if (!query.trim()) {
      resetSearch();
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError(null); // Clear previous search errors

      // Use CoinGecko search endpoint
      const searchResponse = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
      );

      if (!searchResponse.ok) {
        throw new Error(`Search failed! status: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();

      // Get detailed data for search results (limit to first 50 results)
      const coinIds = searchData.coins.slice(0, 50).map((coin: any) => coin.id).join(',');

      if (coinIds) {
        const detailResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false&price_change_percentage=24h,7d`
        );

        if (detailResponse.ok) {
          const detailData = await detailResponse.json();
          setSearchResults(detailData);
          setIsSearchMode(true);
        }
      } else {
        setSearchResults([]);
        setIsSearchMode(true);
      }

    } catch (err) {
      console.error('Search error:', err);
      setSearchError(err instanceof Error ? err.message : 'Search failed');
      setIsSearchMode(true); // Still enter search mode to show error
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [resetSearch]);

  // Handle search input with debouncing
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Clear existing timer
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    // Set new timer
    const newTimer = setTimeout(() => {
      searchCryptos(value);
    }, 500);

    setSearchDebounceTimer(newTimer);
  }, [searchCryptos, searchDebounceTimer]);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    resetSearch();
  }, [resetSearch]);

  // Handle sorting
  const handleSort = useCallback((property: keyof Cryptocurrency) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [orderBy, order]);

  // Handle pagination
  const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, page: number) => {
    if (!isSearchMode) {
      fetchCryptos(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isSearchMode, fetchCryptos]);

  // Sort function
  const sortedCryptos = React.useMemo(() => {
    const dataToSort = isSearchMode ? searchResults : cryptos;

    return [...dataToSort].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return order === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [cryptos, searchResults, isSearchMode, orderBy, order]);

  // Initial data fetch
  useEffect(() => {
    fetchCryptos(1);
  }, [fetchCryptos]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
    };
  }, [searchDebounceTimer]);

  // Handle crypto click
  const handleCryptoClick = useCallback((cryptoId: string) => {
    navigate(`/crypto/${cryptoId}`);
  }, [navigate]);

  if (loading && !isSearchMode) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (error && !isSearchMode) {
    return (
      <Box m={2}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{
      maxWidth: '1400px',
      mx: 'auto',
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 2, md: 3 }
    }}>
      {/* Search Bar with Clear Button */}
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {searchLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                )}
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClearSearch}
                  edge="end"
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(102, 126, 234, 0.04)'
                    }
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'grey.50',
              },
            },
          }}
        />

        {/* Search Results Info */}
        {isSearchMode && !searchError && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchResults.length} search results for "{searchTerm}"
          </Typography>
        )}

        {/* Search Mode Controls */}
        {isSearchMode && (
          <Box display="flex" alignItems="center" gap={2} mt={2}>
            <Button
              variant="outlined"
              size="small"
              onClick={resetSearch}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              ← Back to All Cryptocurrencies
            </Button>
            {searchTerm && (
              <Typography variant="body2" color="primary.main" fontWeight="500">
                Search Mode Active
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Search Error Alert */}
      {searchError && (
        <Alert
          severity="error"
          sx={{ borderRadius: 2, mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={resetSearch}
              sx={{ textTransform: 'none' }}
            >
              Reset Search
            </Button>
          }
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            {searchError}
          </Typography>
          <Typography variant="caption">
            Click "Reset Search" to return to browsing all cryptocurrencies
          </Typography>
        </Alert>
      )}

      {/* Results Info */}
      {!isSearchMode && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="600">
            All Cryptocurrencies
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of {totalPages}
          </Typography>
        </Box>
      )}

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600, border: 'none' }}>
                <TableSortLabel
                  active={orderBy === 'market_cap_rank'}
                  direction={orderBy === 'market_cap_rank' ? order : 'asc'}
                  onClick={() => handleSort('market_cap_rank')}
                >
                  Rank
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, border: 'none' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, border: 'none' }}>
                <TableSortLabel
                  active={orderBy === 'current_price'}
                  direction={orderBy === 'current_price' ? order : 'asc'}
                  onClick={() => handleSort('current_price')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, border: 'none' }}>24h Change</TableCell>
              {!isMobile && (
                <>
                  <TableCell sx={{ fontWeight: 600, border: 'none' }}>7d Change</TableCell>
                  <TableCell sx={{ fontWeight: 600, border: 'none' }}>
                    <TableSortLabel
                      active={orderBy === 'market_cap'}
                      direction={orderBy === 'market_cap' ? order : 'asc'}
                      onClick={() => handleSort('market_cap')}
                    >
                      Market Cap
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, border: 'none' }}>Volume (24h)</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCryptos.map((crypto) => (
              <TableRow
                key={crypto.id}
                hover
                onClick={() => handleCryptoClick(crypto.id)}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                    transform: 'scale(1.01)',
                  },
                  border: 'none',
                }}
              >
                <TableCell sx={{ border: 'none', py: 2 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    {crypto.market_cap_rank}
                  </Typography>
                </TableCell>
                <TableCell sx={{ border: 'none', py: 2 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={crypto.image}
                      sx={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40 }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight="600">
                        {crypto.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight="500">
                        {crypto.symbol.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ border: 'none', py: 2 }}>
                  <Typography variant="body1" fontWeight="600">
                    {formatPrice(crypto.current_price)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ border: 'none', py: 2 }}>
                  <Chip
                    label={`${crypto.price_change_percentage_24h?.toFixed(2)}%`}
                    color={crypto.price_change_percentage_24h > 0 ? 'success' : 'error'}
                    size="small"
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                {!isMobile && (
                  <>
                    <TableCell sx={{ border: 'none', py: 2 }}>
                      <Typography
                        variant="body2"
                        color={crypto.price_change_percentage_7d_in_currency > 0 ? 'success.main' : 'error.main'}
                        fontWeight="500"
                      >
                        {crypto.price_change_percentage_7d_in_currency > 0 ? '+' : ''}
                        {crypto.price_change_percentage_7d_in_currency?.toFixed(2) || 'N/A'}%
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ border: 'none', py: 2 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        {formatMarketCap(crypto.market_cap)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ border: 'none', py: 2 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        {formatMarketCap(crypto.total_volume)}
                      </Typography>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination - Only show when not in search mode */}
      {!isSearchMode && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={2}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 2}
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 2,
                fontWeight: 600,
              },
              '& .Mui-selected': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: { xs: 0, sm: 3 } }}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, currentPage * itemsPerPage)}
            of {totalPages * itemsPerPage}+ cryptocurrencies
          </Typography>
        </Box>
      )}

      {/* No Search Results */}
      {isSearchMode && searchResults.length === 0 && !searchLoading && !searchError && (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No cryptocurrencies found for "{searchTerm}"
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try searching with different keywords or browse all cryptocurrencies
          </Typography>
          <Button
            variant="contained"
            onClick={resetSearch}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
          >
            Browse All Cryptocurrencies
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CryptoTable;
