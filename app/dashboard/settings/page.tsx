'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User, Bell, Eye, Lock, Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-bold">Settings</h2>
                <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile Settings */}
                    <Card className="p-10 shadow-xl border-border/50 bg-card/50 backdrop-blur rounded-[40px]">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold">Personal Information</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-foreground/70 uppercase tracking-widest px-1">Full Name</label>
                                <Input defaultValue="Jane Doe" className="h-14 text-lg bg-background/50 border-border/50" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-foreground/70 uppercase tracking-widest px-1">Email Address</label>
                                <Input defaultValue="jane.doe@example.com" className="h-14 text-lg bg-background/50 border-border/50" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-foreground/70 uppercase tracking-widest px-1">Phone Number</label>
                                <Input defaultValue="+1 (555) 123-4567" className="h-14 text-lg bg-background/50 border-border/50" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-foreground/70 uppercase tracking-widest px-1">Date of Birth</label>
                                <Input type="date" className="h-14 text-lg bg-background/50 border-border/50" />
                            </div>
                        </div>
                        <Button className="mt-10 h-14 px-8 text-lg font-bold gap-2 shadow-lg">
                            <Save className="w-5 h-5" />
                            Save Changes
                        </Button>
                    </Card>

                    {/* Security Settings */}
                    <Card className="p-10 shadow-xl border-border/50 bg-card/50 backdrop-blur rounded-[40px]">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <Lock className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold">Security</h3>
                        </div>
                        <p className="text-muted-foreground mb-8 font-medium">Manage your password and authentication methods.</p>
                        <Button variant="outline" className="h-12 px-6 font-bold rounded-xl">Change Password</Button>
                    </Card>
                </div>

                <div className="space-y-8">
                    {/* Notifications */}
                    <Card className="p-10 shadow-xl border-border/50 bg-card/50 backdrop-blur rounded-[40px]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <Bell className="w-6 h-6 text-primary" />
                            </div>
                            <h4 className="text-xl font-bold">Notifications</h4>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Health Alerts', enabled: true },
                                { label: 'Appointment Reminders', enabled: true },
                                { label: 'System Updates', enabled: false },
                            ].map((s, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-secondary/30 p-4 rounded-2xl">
                                    <span className="font-bold">{s.label}</span>
                                    <div className={`w-12 h-7 rounded-full transition-colors cursor-pointer ${s.enabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full m-1 transition-transform ${s.enabled ? 'translate-x-5' : ''}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Display */}
                    <Card className="p-10 shadow-xl border-border/50 bg-card/50 backdrop-blur rounded-[40px]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <Eye className="w-6 h-6 text-primary" />
                            </div>
                            <h4 className="text-xl font-bold">Appearance</h4>
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-2xl">
                                <span className="font-bold">High Contrast</span>
                                <div className="w-12 h-7 rounded-full bg-muted-foreground/30 cursor-pointer">
                                    <div className="w-5 h-5 bg-white rounded-full m-1" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <span className="font-bold px-1">Text Size</span>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button variant="outline" className="font-bold">Small</Button>
                                    <Button className="font-bold">Default</Button>
                                    <Button variant="outline" className="font-bold">Large</Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
