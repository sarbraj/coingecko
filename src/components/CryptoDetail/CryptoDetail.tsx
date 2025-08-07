import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { useNavigate, useParams } from 'react-router-dom';

import { cryptoApi } from '../../services/cryptoApi';
import { CryptoDetailData } from '../../types/crypto';

const CryptoDetail: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [crypto, setCrypto] = useState<CryptoDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await cryptoApi.getCryptocurrencyDetail(id);
        setCrypto(data);
      } catch (err) {
        setError('Failed to fetch cryptocurrency details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoDetail();
  }, [id]);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  }, []);

  const formatMarketCap = useCallback(
    (marketCap: number) => {
      if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
      if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
      if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
      return formatPrice(marketCap);
    },
    [formatPrice]
  );

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Memoized price data for performance
  const priceData = useMemo(() => {
    if (!crypto?.market_data) return null;

    const currentPrice = crypto.market_data.current_price.usd;
    const change24h = crypto.market_data.price_change_percentage_24h || 0;
    const isPositive = change24h > 0;

    return {
      currentPrice,
      change24h,
      isPositive,
      high24h: crypto.market_data.high_24h.usd,
      low24h: crypto.market_data.low_24h.usd,
      marketCap: crypto.market_data.market_cap.usd,
      volume: crypto.market_data.total_volume.usd,
    };
  }, [crypto]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
          margin: 2,
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (error || !crypto || !priceData) {
    return (
      <Box
        sx={{
          maxWidth: '1400px',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          Back to List
        </Button>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error || 'Cryptocurrency not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: '1400px',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 3 },
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
          }}
        >
          Back to List
        </Button>
        <IconButton
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          }}
        >
          <StarBorderIcon />
        </IconButton>
      </Box>

      {/* Desktop Layout */}
      {!isMobile ? (
        // <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
        <Grid container spacing={2}>
          {/* Left Column - Main Price Info */}
          {/* Main Price Card */}
          { }
          {/* <Grid alignItems={'center'}> */}
          <Grid container
            sx={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "stretch",
            }}
            size="grow">
            <Card
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                mb: 4,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              }}
            >
              {/* Price card */}
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={3} mb={2}>
                  <Avatar
                    src={crypto.image.large}
                    sx={{
                      width: 80,
                      height: 80,
                      border: '3px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}
                  />
                  <Box>
                    <Typography
                      variant="h3"
                      component="h1"
                      fontWeight="700"
                      sx={{ mb: 1 }}
                    >
                      {crypto.name}
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.8 }}>
                      {crypto.symbol.toUpperCase()}
                    </Typography>
                    {crypto.market_cap_rank && (
                      <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                        Rank #{crypto.market_cap_rank}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Typography variant="h2" fontWeight="700" sx={{ mb: 3 }}>
                  {formatPrice(priceData.currentPrice)}
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  {priceData.isPositive ? (
                    <TrendingUpIcon sx={{ color: '#50E3C2', fontSize: 28 }} />
                  ) : (
                    <TrendingDownIcon sx={{ color: '#FF6B6B', fontSize: 28 }} />
                  )}
                  <Typography
                    variant="h5"
                    sx={{ color: priceData.isPositive ? '#50E3C2' : '#FF6B6B' }}
                    fontWeight="600"
                  >
                    {priceData.isPositive ? '+' : ''}
                    {priceData.change24h.toFixed(2)}%
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    24h Change
                  </Typography>
                </Box>

                {/* Price Stats */}
                <Grid container spacing={3}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                      24h Low
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {formatPrice(priceData.low24h)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                      24h Average
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {formatPrice((priceData.high24h + priceData.low24h) / 2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                      24h High
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {formatPrice(priceData.high24h)}
                    </Typography>
                  </Box>
                </Grid>
              </CardContent>
            </Card>

            {/* <Grid container sx={{ alignItems: 'stretch' }}>  Action Buttons - Now on top */}
            <Grid container
              sx={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "stretch",
              }}
              size="grow">  {/* Action Buttons - Now on top */}
              <Box display="flex" gap={2} sx={{ width: '100%' }}>
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  sx={{
                    bgcolor: 'error.main',
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                    '&:hover': {
                      bgcolor: 'error.dark',
                      boxShadow: '0 6px 16px rgba(244, 67, 54, 0.4)',
                    },
                  }}
                >
                  Sell {crypto.symbol.toUpperCase()}
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  sx={{
                    bgcolor: 'success.main',
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                    '&:hover': {
                      bgcolor: 'success.dark',
                      boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
                    },
                  }}
                >
                  Buy {crypto.symbol.toUpperCase()}
                </Button>
              </Box>

              {/* Market Statistics Card - Now full width below buttons */}
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  width: '100%', // Ensures full width
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    gutterBottom
                    sx={{ mb: 3 }}
                  >
                    Market Statistics
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={3}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2" color="text.secondary">
                        Market Cap
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {formatMarketCap(priceData.marketCap)}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2" color="text.secondary">
                        Volume (24h)
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {formatMarketCap(priceData.volume)}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2" color="text.secondary">
                        24h High
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {formatPrice(priceData.high24h)}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2" color="text.secondary">
                        24h Low
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {formatPrice(priceData.low24h)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* About Section */}
          {crypto.description?.en && (
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  fontWeight="600"
                  gutterBottom
                  sx={{ mb: 3 }}
                >
                  About {crypto.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.7,
                    display: '-webkit-box',
                    WebkitLineClamp: 8,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                  dangerouslySetInnerHTML={{
                    __html:
                      crypto.description.en.substring(0, 500) +
                      (crypto.description.en.length > 500 ? '...' : ''),
                  }}
                />
              </CardContent>
            </Card>
          )}
        </Grid>
      ) : (
        /* Mobile Layout */
        <>
          {/* Main Price Card - Mobile */}
          <Card
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              mb: 3,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar
                  src={crypto.image.large}
                  sx={{
                    width: 64,
                    height: 64,
                    border: '3px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                />
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="700">
                    {crypto.name}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.8 }}>
                    {crypto.symbol.toUpperCase()}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h3" fontWeight="700" sx={{ mb: 2 }}>
                {formatPrice(priceData.currentPrice)}
              </Typography>

              <Box display="flex" alignItems="center" gap={1} mb={3}>
                {priceData.isPositive ? (
                  <TrendingUpIcon sx={{ color: '#50E3C2' }} />
                ) : (
                  <TrendingDownIcon sx={{ color: '#FF6B6B' }} />
                )}
                <Typography
                  variant="h6"
                  sx={{ color: priceData.isPositive ? '#50E3C2' : '#FF6B6B' }}
                  fontWeight="600"
                >
                  {priceData.isPositive ? '+' : ''}
                  {priceData.change24h.toFixed(2)}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  24h Change
                </Typography>
              </Box>

              {/* Price Stats - Mobile */}
              <Grid container spacing={2}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Low
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {formatPrice(priceData.low24h)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Average
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {formatPrice((priceData.high24h + priceData.low24h) / 2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    High
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {formatPrice(priceData.high24h)}
                  </Typography>
                </Box>
              </Grid>
            </CardContent>
          </Card>

          {/* Market Data Cards - Mobile */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Market Statistics
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="body2" color="text.secondary">
                    Market Cap
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {formatMarketCap(priceData.marketCap)}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    Volume (24h)
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {formatMarketCap(priceData.volume)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {crypto.description?.en && (
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    About {crypto.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.6,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: crypto.description.en.substring(0, 300) + '...',
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Action Buttons - Mobile */}
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: 'error.main',
                borderRadius: 2,
                py: 2,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                '&:hover': {
                  bgcolor: 'error.dark',
                  boxShadow: '0 6px 16px rgba(244, 67, 54, 0.4)',
                },
              }}
            >
              Sell
            </Button>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: 'success.main',
                borderRadius: 2,
                py: 2,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  bgcolor: 'success.dark',
                  boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
                },
              }}
            >
              Buy
            </Button>
          </Box>
        </>
      )
      }
    </Box >
  );
};

export default CryptoDetail;
