"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Clock, Plus, Loader2 } from 'lucide-react';

export default function AppointmentsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [appointments, setAppointments] = useState<any[]>([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('/api/appointments');
                const data = await response.json();
                if (response.ok) {
                    setAppointments(data.appointments);
                }
            } catch (error) {
                console.error('Failed to fetch appointments:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Appointments</h2>
                    <p className="text-muted-foreground">Manage your medical schedule</p>
                </div>
                <Button className="h-12 px-6 text-lg font-bold gap-2 shadow-lg hover:shadow-primary/20 transition-all">
                    <Plus className="w-5 h-5" />
                    Book Appointment
                </Button>
            </div>

            <div className="grid gap-6">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    </div>
                ) : appointments.length > 0 ? (
                    appointments.map((appt, idx) => (
                        <Card
                            key={idx}
                            className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-2xl transition-all border-border/50 bg-card/50 backdrop-blur rounded-[32px] group relative overflow-hidden"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary group-hover:w-3 transition-all" />
                            <div className="flex items-start gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex flex-col items-center justify-center text-primary border border-primary/20">
                                    <span className="text-xs font-black uppercase tracking-tighter">{appt.month || '---'}</span>
                                    <span className="text-3xl font-black">{appt.day || '--'}</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{appt.doctor}</h3>
                                    <p className="text-lg font-semibold text-foreground/80">{appt.type}</p>
                                    <div className="flex flex-wrap gap-4 text-muted-foreground font-medium pt-2">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-primary" />
                                            {appt.time}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            {appt.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <Button variant="outline" className="flex-1 md:flex-none h-12 px-6 font-bold rounded-xl">Reschedule</Button>
                                <Button variant="ghost" className="flex-1 md:flex-none h-12 px-6 font-bold text-destructive hover:bg-destructive/10 rounded-xl">Cancel</Button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="p-20 text-center border-dashed border-2 bg-secondary/10 rounded-[40px]">
                        <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-foreground mb-2">No Upcoming Appointments</h3>
                        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                            You don't have any appointments scheduled at the moment.
                        </p>
                        <Button className="h-14 px-10 text-xl font-bold rounded-2xl">
                            Schedule a Consultation
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
}
