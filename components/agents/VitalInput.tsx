'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Activity, Heart, Droplets, Wind, Thermometer, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VitalField {
    key: string;
    label: string;
    unit: string;
    placeholder: string;
    icon: React.ElementType;
    color: string;
    normalRange: string;
}

const vitalFields: VitalField[] = [
    { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', placeholder: 'e.g. 75', icon: Heart, color: 'text-rose-500', normalRange: '60–100 bpm' },
    { key: 'systolicBP', label: 'Systolic BP', unit: 'mmHg', placeholder: 'e.g. 120', icon: Gauge, color: 'text-primary', normalRange: '90–140 mmHg' },
    { key: 'diastolicBP', label: 'Diastolic BP', unit: 'mmHg', placeholder: 'e.g. 80', icon: Gauge, color: 'text-primary', normalRange: '60–90 mmHg' },
    { key: 'bloodGlucose', label: 'Blood Glucose', unit: 'mg/dL', placeholder: 'e.g. 100', icon: Droplets, color: 'text-amber-500', normalRange: '70–130 mg/dL' },
    { key: 'spo2', label: 'SpO₂', unit: '%', placeholder: 'e.g. 98', icon: Wind, color: 'text-sky-500', normalRange: '95–100%' },
    { key: 'temperature', label: 'Temperature', unit: '°C', placeholder: 'e.g. 37', icon: Thermometer, color: 'text-orange-500', normalRange: '36.1–37.2°C' },
    { key: 'respiratoryRate', label: 'Respiratory Rate', unit: 'breaths/min', placeholder: 'e.g. 16', icon: Activity, color: 'text-violet-500', normalRange: '12–20 /min' },
];

interface VitalInputProps {
    onSubmit: (vitals: Record<string, number>) => void;
    isLoading?: boolean;
}

export function VitalInput({ onSubmit, isLoading = false }: VitalInputProps) {
    const [values, setValues] = useState<Record<string, string>>({});

    const handleChange = (key: string, value: string) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericVitals: Record<string, number> = {};
        for (const [key, val] of Object.entries(values)) {
            if (val.trim() !== '') {
                const num = parseFloat(val);
                if (!isNaN(num)) numericVitals[key] = num;
            }
        }
        if (Object.keys(numericVitals).length === 0) return;
        onSubmit(numericVitals);
    };

    const hasAnyValue = Object.values(values).some(v => v.trim() !== '');

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {vitalFields.map(({ key, label, unit, placeholder, icon: Icon, color, normalRange }) => (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Icon className={cn('w-4 h-4', color)} />
                            {label}
                        </Label>
                        <div className="relative">
                            <Input
                                id={key}
                                type="number"
                                step="any"
                                placeholder={placeholder}
                                value={values[key] || ''}
                                onChange={e => handleChange(key, e.target.value)}
                                className="pr-16 h-12 bg-card border-border/60 focus:border-primary/60 hover:border-border transition-colors"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none">
                                {unit}
                            </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">Normal: {normalRange}</p>
                    </div>
                ))}
            </div>

            <Button
                type="submit"
                disabled={!hasAnyValue || isLoading}
                className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/20 transition-all"
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <Activity className="w-5 h-5 animate-pulse" /> Analysing Vitals...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Activity className="w-5 h-5" /> Analyze Health Status
                    </span>
                )}
            </Button>
        </form>
    );
}
