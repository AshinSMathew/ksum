'use client';

import { Card } from '@/components/ui/card';
import { Activity, Calendar, FileText, Heart } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Welcome Banner */}
            <Card className="p-8 bg-linear-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20 shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />
                <div className="space-y-3 relative">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">Welcome back, Jane!</h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                        Your health profile is looking stable today. Here's a quick look at your recent metrics and upcoming schedule.
                    </p>
                </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Reports', value: '12', icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Last Checkup', value: '12 Jan 2026', icon: Calendar, color: 'text-accent', bg: 'bg-accent/10' },
                    { label: 'Upcoming', value: '5 Mar 2026', icon: Heart, color: 'text-primary', bg: 'bg-primary/10' },
                ].map((stat, idx) => (
                    <Card
                        key={idx}
                        className="p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-border/50 bg-card/50 backdrop-blur"
                    >
                        <div className="flex justify-center mb-6">
                            <div className={`p-5 rounded-2xl ${stat.bg} shadow-inner`}>
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            </div>
                        </div>
                        <p className="text-muted-foreground font-medium text-lg mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <Card className="p-8 shadow-xl border-border/50 bg-card/50 backdrop-blur">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-foreground">Recent Activity</h3>
                    <button className="text-primary font-semibold hover:underline">View all</button>
                </div>
                <div className="space-y-4">
                    {[
                        { date: '10 Feb 2026', action: 'Blood Sugar Test', result: '110 mg/dL', trend: 'stable' },
                        { date: '8 Feb 2026', action: 'Cholesterol Check', result: '220 mg/dL', trend: 'high' },
                        { date: '5 Feb 2026', action: 'Blood Pressure', result: '120/80 mmHg', trend: 'normal' },
                    ].map((activity, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-5 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-all group border border-transparent hover:border-primary/10"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <div>
                                    <p className="font-bold text-foreground text-lg">{activity.action}</p>
                                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-foreground">{activity.result}</p>
                                <p className={`text-xs font-semibold uppercase tracking-wider ${activity.trend === 'high' ? 'text-destructive' : 'text-primary'
                                    }`}>
                                    {activity.trend}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
