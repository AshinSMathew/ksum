'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ReportsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Medical Reports</h2>
                    <p className="text-muted-foreground">Manage and view your laboratory results</p>
                </div>
                <Button className="h-12 px-6 text-lg font-bold gap-2 shadow-lg hover:shadow-primary/20 transition-all">
                    <Plus className="w-5 h-5" />
                    Upload New Report
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="md:col-span-3 p-8 shadow-xl border-border/50 bg-card/50 backdrop-blur">
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input className="pl-12 h-14 text-lg bg-background/50" placeholder="Search reports by test name or date..." />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-4 px-4 font-bold text-foreground">Date</th>
                                    <th className="text-left py-4 px-4 font-bold text-foreground">Test Name</th>
                                    <th className="text-left py-4 px-4 font-bold text-foreground">Result</th>
                                    <th className="text-left py-4 px-4 font-bold text-foreground">Status</th>
                                    <th className="text-right py-4 px-4 font-bold text-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { date: '10 Feb 2026', test: 'Blood Sugar', result: '110 mg/dL', status: 'Normal' },
                                    { date: '10 Feb 2026', test: 'Cholesterol', result: '220 mg/dL', status: 'High' },
                                    { date: '05 Jan 2026', test: 'Blood Pressure', result: '120/80 mmHg', status: 'Normal' },
                                ].map((report, idx) => (
                                    <tr key={idx} className="border-b border-border group hover:bg-secondary/30 transition-colors">
                                        <td className="py-5 px-4 text-foreground font-medium">{report.date}</td>
                                        <td className="py-5 px-4 text-foreground font-bold">{report.test}</td>
                                        <td className="py-5 px-4 text-foreground">{report.result}</td>
                                        <td className="py-5 px-4">
                                            <span
                                                className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase ${report.status === 'Normal'
                                                        ? 'bg-primary/20 text-primary'
                                                        : 'bg-destructive/20 text-destructive'
                                                    }`}
                                            >
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-4 text-right">
                                            <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10">View Details</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card className="p-8 shadow-xl border-border/50 bg-linear-to-b from-primary/10 to-transparent flex flex-col items-center text-center justify-center">
                    <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mb-6">
                        <FileText className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                    <p className="text-muted-foreground mb-6">Our AI can help you understand your reports in simple terms.</p>
                    <Button variant="outline" className="w-full font-bold h-12">Analyze with AI</Button>
                </Card>
            </div>
        </div>
    );
}
