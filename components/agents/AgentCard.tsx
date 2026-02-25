import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentCardProps {
    icon: LucideIcon;
    name: string;
    description: string;
    href: string;
    status?: 'online' | 'standby' | 'alert';
    color?: 'primary' | 'emerald' | 'amber' | 'rose' | 'violet';
    agentNumber: number;
}

const colorMap = {
    primary: {
        bg: 'bg-primary/10',
        iconColor: 'text-primary',
        border: 'hover:border-primary/40',
        badge: 'bg-primary/20 text-primary',
        btn: 'bg-primary hover:bg-primary/90',
        glow: 'from-primary/20',
    },
    emerald: {
        bg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-500',
        border: 'hover:border-emerald-500/40',
        badge: 'bg-emerald-500/20 text-emerald-500',
        btn: 'bg-emerald-600 hover:bg-emerald-700',
        glow: 'from-emerald-500/20',
    },
    amber: {
        bg: 'bg-amber-500/10',
        iconColor: 'text-amber-500',
        border: 'hover:border-amber-500/40',
        badge: 'bg-amber-500/20 text-amber-500',
        btn: 'bg-amber-600 hover:bg-amber-700',
        glow: 'from-amber-500/20',
    },
    rose: {
        bg: 'bg-rose-500/10',
        iconColor: 'text-rose-500',
        border: 'hover:border-rose-500/40',
        badge: 'bg-rose-500/20 text-rose-500',
        btn: 'bg-rose-600 hover:bg-rose-700',
        glow: 'from-rose-500/20',
    },
    violet: {
        bg: 'bg-violet-500/10',
        iconColor: 'text-violet-500',
        border: 'hover:border-violet-500/40',
        badge: 'bg-violet-500/20 text-violet-500',
        btn: 'bg-violet-600 hover:bg-violet-700',
        glow: 'from-violet-500/20',
    },
};

const statusConfig = {
    online: { dot: 'bg-emerald-500', label: 'Online' },
    standby: { dot: 'bg-amber-500', label: 'Standby' },
    alert: { dot: 'bg-rose-500 animate-pulse', label: 'Alert' },
};

export function AgentCard({ icon: Icon, name, description, href, status = 'online', color = 'primary', agentNumber }: AgentCardProps) {
    const c = colorMap[color];
    const s = statusConfig[status];

    return (
        <Link href={href} className="block">
            <Card className={cn(
                'relative overflow-hidden p-7 border border-border/50 bg-card/60 backdrop-blur transition-all duration-300 group cursor-pointer',
                'hover:shadow-2xl hover:-translate-y-1',
                c.border
            )}>
                {/* Glow */}
                <div className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0', c.glow, 'to-transparent')} />

                {/* Agent number badge */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <span className={cn('text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full', c.badge)}>
                        Agent {agentNumber}
                    </span>
                    <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-2 rounded-full', s.dot)} />
                        <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                    </div>
                </div>

                {/* Icon */}
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative z-10 transition-transform group-hover:scale-110 duration-300', c.bg)}>
                    <Icon className={cn('w-7 h-7', c.iconColor)} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3 relative z-10">{name}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6 relative z-10 text-sm">{description}</p>

                {/* CTA */}
                <Button className={cn('w-full font-bold text-white gap-2 group/btn transition-all', c.btn)}>
                    Launch Agent
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
            </Card>
        </Link>
    );
}
