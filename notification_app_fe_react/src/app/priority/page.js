"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, Paper, Badge, IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationCard from '@/components/NotificationCard';
import { fetchNotifications } from '@/lib/api';
import { Log } from '@/lib/logger';

export default function PriorityNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [topN, setTopN] = useState(10);
  const [type, setType] = useState('All');
  
  // Track unseen count manually just for UI feedback
  const [unseenCount, setUnseenCount] = useState(0);

  const loadData = async (isRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      Log("frontend", "debug", "api", `Fetching priority notifications: type=${type}`);
      // Priority box fetches all from recent and filters client side or server side
      // Let's fetch a large enough set (e.g., 50) and sort client-side, since API doesn't do priority sorting
      const data = await fetchNotifications({ page: 1, limit: 100, notification_type: type });
      
      setNotifications(data);
      Log("frontend", "info", "api", `Successfully fetched ${data.length} notifications for priority inbox`);
      
      if (isRefresh) {
        Log("frontend", "info", "component", "Priority Inbox refreshed manually");
      }
    } catch (err) {
      setError(err.message);
      Log("frontend", "error", "api", `Error fetching priority notifications: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Log("frontend", "info", "component", "Priority Notifications page loaded");
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]); // Re-fetch on type change

  const TYPE_WEIGHT = {
    Placement: 3,
    Result: 2,
    Event: 1,
  };

  const getWeight = (typeStr) => TYPE_WEIGHT[typeStr] || 0;

  const priorityNotifications = useMemo(() => {
    const sorted = [...notifications].sort((a, b) => {
      const weightDiff = getWeight(b.Type) - getWeight(a.Type);
      if (weightDiff !== 0) return weightDiff;
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });
    
    return sorted.slice(0, topN);
  }, [notifications, topN]);

  useEffect(() => {
    // Calculate unseen among priority ones
    const seenIds = JSON.parse(localStorage.getItem('seenIds') || '[]');
    let unseen = 0;
    priorityNotifications.forEach(n => {
      if (!seenIds.includes(n.ID)) unseen++;
    });
    setUnseenCount(unseen);
  }, [priorityNotifications]);

  const handleRead = (id) => {
    setUnseenCount(prev => Math.max(0, prev - 1));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'text.primary', display: 'flex', alignItems: 'center', gap: 2 }}>
          Priority Inbox
          {unseenCount > 0 && (
            <Badge badgeContent={unseenCount} color="primary" sx={{ ml: 2 }} />
          )}
        </Typography>
        <Tooltip title="Refresh Notifications">
          <IconButton color="primary" onClick={() => loadData(true)} sx={{ bgcolor: 'rgba(124, 58, 237, 0.1)' }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap', bgcolor: 'background.paper' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Show Top</InputLabel>
          <Select
            value={topN}
            label="Show Top"
            onChange={(e) => setTopN(e.target.value)}
          >
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter Type</InputLabel>
          <Select
            value={type}
            label="Filter Type"
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="All">All Types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 4 }}>
          Failed to load notifications: {error}
        </Alert>
      ) : priorityNotifications.length === 0 ? (
        <Alert severity="info" sx={{ my: 4 }}>
          No priority notifications found.
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {priorityNotifications.map((notif) => (
            <NotificationCard key={notif.ID} notification={notif} onRead={handleRead} />
          ))}
        </Box>
      )}
    </Box>
  );
}
