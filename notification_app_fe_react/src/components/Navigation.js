"use client";

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <NotificationsIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Campus Notifications
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            component={Link} 
            href="/" 
            variant={pathname === '/' ? 'contained' : 'text'}
            color="primary"
            startIcon={<NotificationsIcon />}
          >
            All Notifications
          </Button>
          <Button 
            component={Link} 
            href="/priority" 
            variant={pathname === '/priority' ? 'contained' : 'text'}
            color="primary"
            startIcon={<InboxIcon />}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
