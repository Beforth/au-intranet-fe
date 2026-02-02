
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { DASHBOARD_STATS } from '../constants';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TransactionTable } from '../components/ui/TransactionTable';
import { RevenueChart, SalesTargetChart } from '../components/ui/ChartsSection';
import { Download, Layout as LayoutIcon, Check, Bell, Activity, RefreshCw } from 'lucide-react';
import { WidgetConfig, WidgetId, AppNotification } from '../types';
import { PageLayout } from '../components/layout/PageLayout';

const DEFAULT_LAYOUT: WidgetConfig[] = [
    { id: 'revenue-chart', span: 2 },
    { id: 'goal-chart', span: 1 },
    { id: 'activity-table', span: 2 },
    { id: 'global-reach', span: 1 },
];

export const DashboardPage: React.FC = () => {
    const { showToast, isDemoActive, simulateDemo, clearDemo } = useApp();
    const [isExporting, setIsExporting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [layout, setLayout] = useState<WidgetConfig[]>(() => {
        try {
            const saved = localStorage.getItem('dashboard-layout');
            return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
        } catch (e) {
            return DEFAULT_LAYOUT;
        }
    });

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        localStorage.setItem('dashboard-layout', JSON.stringify(layout));
    }, [layout]);

    const toggleResize = (id: WidgetId) => {
        setLayout(prev => prev.map(w => {
            if (w.id === id) {
                const nextSpan = (w.span % 3) + 1 as 1 | 2 | 3;
                return { ...w, span: nextSpan };
            }
            return w;
        }));
    };

    const handleDragStart = (index: number) => {
        if (!isEditMode) return;
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const handleDrop = (index: number) => {
        if (draggedIndex === null) return;
        const newOrder = [...layout];
        const itemToMove = newOrder[draggedIndex];
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(index, 0, itemToMove);
        setLayout(newOrder);
        setDraggedIndex(null);
    };

    const renderWidget = (config: WidgetConfig) => {
        const commonProps = {
            isDraggable: isEditMode,
            showHandle: isEditMode,
            onDragStart: () => handleDragStart(layout.indexOf(config)),
            onDragOver: handleDragOver,
            onDrop: () => handleDrop(layout.indexOf(config)),
            onResize: () => toggleResize(config.id),
            className: `${config.span === 1 ? 'col-span-1' : config.span === 2 ? 'col-span-2' : 'col-span-3'} 
                  ${isEditMode ? 'ring-2 ring-dashed ring-slate-200' : ''}`
        };

        switch (config.id) {
            case 'revenue-chart':
                return (
                    <Card key={config.id} {...commonProps} title="Revenue Stream" description="Fiscal performance tracking.">
                        <RevenueChart />
                    </Card>
                );
            case 'goal-chart':
                return (
                    <Card key={config.id} {...commonProps} title="Goal Progress" description="Quarterly targets achievement.">
                        <SalesTargetChart />
                    </Card>
                );
            case 'activity-table':
                return (
                    <Card key={config.id} {...commonProps} title="Recent Activity" description="Latest verified system events." className={`${commonProps.className} p-0`} maxHeight="none">
                        <TransactionTable />
                    </Card>
                );
            case 'global-reach':
                return (
                    <Card key={config.id} {...commonProps} title="Global Reach" description="Operational distribution.">
                        <div className="space-y-6">
                            {[
                                { region: 'Americas', val: 75 },
                                { region: 'EMEA', val: 45 },
                                { region: 'APAC', val: 32 },
                                { region: 'LATAM', val: 18 },
                            ].map((item) => (
                                <div key={item.region} className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
                                        <span>{item.region}</span>
                                        <span className="text-slate-900">{item.val}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-[var(--primary)] h-full rounded-full transition-all duration-1000" style={{ width: `${item.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                );
            default:
                return null;
        }
    };

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            showToast('Enterprise data exported successfully');
        }, 1500);
    };



    const actions = (
        <>
            {isDemoActive ? (
                <Button
                    variant="outline"
                    size="sm"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                    onClick={clearDemo}
                    leftIcon={<RefreshCw size={14} />}
                >
                    Flush Demo
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    onClick={simulateDemo}
                    leftIcon={<Activity size={14} />}
                >
                    Simulate Demo
                </Button>
            )}
            <Button
                variant={isEditMode ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                    setIsEditMode(!isEditMode);
                    if (isEditMode) showToast('Dashboard configuration saved', 'success');
                    else showToast('Layout unlocked.', 'info');
                }}
                leftIcon={isEditMode ? <Check size={14} /> : <LayoutIcon size={14} />}
            >
                {isEditMode ? 'Save Layout' : 'Customize Dashboard'}
            </Button>
            <Button
                size="sm"
                onClick={handleExport}
                isLoading={isExporting}
                leftIcon={<Download size={14} />}
            >
                Export CSV
            </Button>
        </>
    );

    return (
        <PageLayout
            title="Enterprise Overview"
            description="Monitoring real-time operational status and metrics."
            actions={actions}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: 'var(--ui-gap)' }}>
                {DASHBOARD_STATS.map((stat) => (
                    <StatCard key={stat.label} stat={stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 transition-all duration-300" style={{ gap: 'var(--ui-gap)' }}>
                {layout.map(config => renderWidget(config))}
            </div>
        </PageLayout>
    );
};
