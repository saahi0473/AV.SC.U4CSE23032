"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import EventIcon from '@mui/icons-material/Event';
import GradeIcon from '@mui/icons-material/Grade';
import CircleIcon from '@mui/icons-material/Circle';

export default function NotificationCard({ notification, onRead }) {
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const seenIds = JSON.parse(localStorage.getItem('seenIds') || '[]');
    if (!seenIds.includes(notification.ID)) {
      setIsNew(true);
      // Mark as seen after rendering
      const updatedSeenIds = [...seenIds, notification.ID];
      localStorage.setItem('seenIds', JSON.stringify(updatedSeenIds));
      if (onRead) onRead(notification.ID);
    }
  }, [notification.ID, onRead]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'Placement': return 'success';
      case 'Event': return 'warning';
      case 'Result': return 'info';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Placement': return <BusinessCenterIcon fontSize="small" />;
      case 'Event': return <EventIcon fontSize="small" />;
      case 'Result': return <GradeIcon fontSize="small" />;
      default: return null;
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        position: 'relative',
        bgcolor: isNew ? 'rgba(124, 58, 237, 0.05)' : 'background.paper',
        borderLeft: isNew ? '4px solid' : '1px solid',
        borderColor: isNew ? 'primary.main' : 'divider',
        opacity: isNew ? 1 : 0.75,
      }}
    >
      <CardContent sx={{ pb: '16px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              icon={getTypeIcon(notification.Type)} 
              label={notification.Type} 
              color={getTypeColor(notification.Type)} 
              size="small" 
              sx={{ fontWeight: 600 }}
            />
            {isNew && (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', fontSize: '0.75rem', fontWeight: 700 }}>
                <CircleIcon sx={{ fontSize: 8, mr: 0.5 }} /> NEW
              </Box>
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {new Date(notification.Timestamp).toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
}
