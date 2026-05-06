"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Pagination, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import NotificationCard from '@/components/NotificationCard';
import { fetchNotifications } from '@/lib/api';
import { Log } from '@/lib/logger';

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination and filtering state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState('All');

  useEffect(() => {
    Log("frontend", "info", "component", "All Notifications page loaded");
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        Log("frontend", "debug", "api", `Fetching all notifications: page=${page}, limit=${limit}, type=${type}`);
        const data = await fetchNotifications({ page, limit, notification_type: type });
        setNotifications(data);
        Log("frontend", "info", "api", `Successfully fetched ${data.length} notifications`);
      } catch (err) {
        setError(err.message);
        Log("frontend", "error", "api", `Error fetching notifications: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, limit, type]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 4 }}>
        All Notifications
      </Typography>

      <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap', bgcolor: 'background.paper' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter Type</InputLabel>
          <Select
            value={type}
            label="Filter Type"
            onChange={(e) => { setType(e.target.value); setPage(1); }}
          >
            <MenuItem value="All">All Types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Items per page</InputLabel>
          <Select
            value={limit}
            label="Items per page"
            onChange={(e) => { setLimit(e.target.value); setPage(1); }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
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
      ) : notifications.length === 0 ? (
        <Alert severity="info" sx={{ my: 4 }}>
          No notifications found.
        </Alert>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {notifications.map((notif) => (
              <NotificationCard key={notif.ID} notification={notif} />
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
            <Pagination 
              count={10} // The API might not return total count, we assume 10 pages for demo
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              size="large"
            />
          </Box>
        </>
      )}
    </Box>
  );
}
