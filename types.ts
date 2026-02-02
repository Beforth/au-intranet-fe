
// Fixed: Added React import to resolve 'Cannot find namespace React' errors
import React from 'react';

export interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

export interface StatItem {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}

export interface Transaction {
  id: string;
  customer: string;
  email: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Canceled';
  date: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'system' | 'inventory' | 'customer';
  read: boolean;
}

export type WidgetId = 'revenue-chart' | 'goal-chart' | 'activity-table' | 'global-reach';

export interface WidgetConfig {
  id: WidgetId;
  span: 1 | 2 | 3;
}
