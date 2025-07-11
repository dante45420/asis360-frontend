// src/components/admin/dashboard/StatCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ icon, title, value, color = 'primary.main' }) => {
    return (
        <Card sx={{ display: 'flex', alignItems: 'center', p: 2, height: '100%' }}>
            <Box sx={{ 
                mr: 2, 
                backgroundColor: color, 
                borderRadius: '50%', 
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {React.cloneElement(icon, { sx: { color: 'common.white', fontSize: 28 } })}
            </Box>
            <Box>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {value}
                </Typography>
                <Typography color="text.secondary">
                    {title}
                </Typography>
            </Box>
        </Card>
    );
};

export default StatCard;