import { Logout as LogoutIcon } from '@mui/icons-material';
import { Button, IconButton, Tooltip } from '@mui/material';
import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LogoutButtonProps {
    variant?: 'button' | 'icon';
}

const LogoutButton: FunctionComponent<LogoutButtonProps> = ({ variant = 'button' }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (variant === 'icon') {
        return (
            <Tooltip title="Logout">
                <IconButton
                    onClick={handleLogout}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': {
                            color: 'error.main',
                            backgroundColor: 'rgba(244, 67, 54, 0.04)',
                        },
                    }}
                >
                    <LogoutIcon />
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                borderColor: 'error.main',
                color: 'error.main',
                '&:hover': {
                    borderColor: 'error.dark',
                    backgroundColor: 'rgba(244, 67, 54, 0.04)',
                },
            }}
        >
            Logout
        </Button>
    );
};

export default LogoutButton;
