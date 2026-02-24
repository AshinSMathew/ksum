'use client';

import { Card } from '@/components/ui/card';
import { Activity, Heart, FileText, CheckCircle2 } from 'lucide-react';

export default function HealthSummaryPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-bold">Health Summary</h2>
                <p className="text-muted-foreground">Snapshot of your vital health metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Blood Pressure', value: '120/80', status: 'Normal', icon: Heart, trend: 'stable' },
                    { label: 'Blood Sugar', value: '110 mg/dL', status: 'Normal', icon: Activity, trend: 'stable' },
                    { label: 'Cholesterol', value: '220 mg/dL', status: 'High', icon: FileText, trend: 'increasing' },
                ].map((metric, idx) => (
                    <Card key={idx} className="p-10 hover:shadow-2xl transition-all border-none bg-card hover:bg-card/80 group rounded-[40px]">
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <metric.icon className="w-8 h-8 text-primary" />
                            </div>
                            <span
                                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${metric.status === 'Normal'
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}
                            >
                                {metric.status}
                            </span>
                        </div>
                        <p className="text-muted-foreground font-bold text-lg mb-2">{metric.label}</p>
                        <p className="text-4xl font-black text-foreground">{metric.value}</p>
                        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            Trend: <span className="text-primary italic">{metric.trend}</span>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-10 shadow-xl border-border/50 bg-card/50 backdrop-blur rounded-[40px]">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Health Insights</h3>
                </div>
                <div className="bg-secondary/30 p-8 rounded-3xl border border-primary/10">
                    <p className="text-xl text-foreground leading-relaxed italic">
                        "Jane, your overall health indicators continue to show positive stability. Your blood pressure has been consistently within the target range for the past three months. We recommend maintaining your current walking routine and focusing on low-sodium dietary choices to help manage your cholesterol levels which are slightly elevated."
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-accent" />
                        <div>
                            <p className="font-bold">Dr. Sarah Johnson</p>
                            <p className="text-sm text-muted-foreground">Chief Medical Officer</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
