
import { AppNotification, Transaction } from './types';

export const DEMO_ORDERS = [
    { id: '#ORD-9901', customer: 'Global Tech Corp', product: 'Enterprise License', amount: '$45,000.00', status: 'Delivered', date: 'Oct 20, 2023' },
    { id: '#ORD-9902', customer: 'Cyberdyne Systems', product: 'AI Core Module', amount: '$82,500.00', status: 'Processing', date: 'Oct 21, 2023' },
    { id: '#ORD-9903', customer: 'Wayne Enterprises', product: 'Security Suite', amount: '$12,400.00', status: 'Shipped', date: 'Oct 22, 2023' },
    { id: '#ORD-9904', customer: 'Stark Industries', product: 'Power Grid OS', amount: '$250,000.00', status: 'Processing', date: 'Oct 23, 2023' },
    { id: '#ORD-9905', customer: 'Umbrella Corp', product: 'Bio-Research Tool', amount: '$5,200.00', status: 'Canceled', date: 'Oct 24, 2023' },
];

export const DEMO_CUSTOMERS = [
    { id: 'CUST-301', name: 'Alice Thompson', role: 'Security Analyst', company: 'Global Tech Corp', email: 'alice@globaltech.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=alice' },
    { id: 'CUST-302', name: 'Bob Richards', role: 'DevOps Lead', company: 'Cyberdyne Systems', email: 'bob@cyberdyne.io', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=bob' },
    { id: 'CUST-303', name: 'Charlie Prince', role: 'Asset Manager', company: 'Wayne Enterprises', email: 'c.prince@wayne.com', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=charlie' },
    { id: 'CUST-304', name: 'Diana Prince', role: 'Gov Relations', company: 'Justice Solutions', email: 'diana@themyscira.gov', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=diana' },
    { id: 'CUST-305', name: 'Edward Nigma', role: 'Logic Expert', company: 'Enigma Logic', email: 'riddler@arkham.city', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=edward' },
];

export const DEMO_NOTIFICATIONS: AppNotification[] = [
    { id: 'd1', title: 'Wholesale Lead', message: 'New inquiry from Stark Industries for 500 licenses.', time: '1m ago', type: 'customer', read: false },
    { id: 'd2', title: 'System Latency', message: 'APAC Region server node reporting 450ms lag.', time: '5m ago', type: 'system', read: false },
    { id: 'd3', title: 'Stock Liquidation', message: 'Batch #B-202 has been cleared from inventory.', time: '10m ago', type: 'inventory', read: true },
    { id: 'd4', title: 'Revenue Spike', message: 'Daily revenue exceeded target by 45%.', time: '1h ago', type: 'order', read: false },
];

export const DEMO_TRANSACTIONS: Transaction[] = [
    { id: 'T-101', customer: 'Bruce Wayne', email: 'bruce@wayne.com', amount: '$5,000.00', status: 'Completed', date: '2023-10-25' },
    { id: 'T-102', customer: 'Peter Parker', email: 'peter@dailybugle.com', amount: '$120.00', status: 'Pending', date: '2023-10-26' },
    { id: 'T-103', customer: 'Tony Stark', email: 'tony@stark.com', amount: '$1,200,500.00', status: 'Completed', date: '2023-10-27' },
];
