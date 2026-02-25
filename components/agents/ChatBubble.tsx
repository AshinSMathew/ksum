import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    mood?: string;
    suggestion?: string | null;
    timestamp?: string;
}

const moodConfig: Record<string, { label: string; color: string; bg: string }> = {
    positive: { label: '😊 Positive mood detected', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
    neutral: { label: '😐 Neutral', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
    concerned: { label: '😟 Some concern detected', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
    distressed: { label: '😢 Distress detected — offering support', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800' },
};

export function ChatBubble({ role, content, mood, suggestion, timestamp }: ChatBubbleProps) {
    const isUser = role === 'user';
    const moodInfo = mood && moodConfig[mood] ? moodConfig[mood] : null;

    return (
        <div className={cn('flex gap-3 w-full', isUser ? 'flex-row-reverse' : 'flex-row')}>
            {/* Avatar */}
            <div className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm',
                isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            )}>
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-primary" />}
            </div>

            <div className={cn('flex flex-col gap-1 max-w-[78%]', isUser ? 'items-end' : 'items-start')}>
                {/* Mood indicator (only for assistant when not neutral) */}
                {!isUser && moodInfo && mood !== 'neutral' && (
                    <div className={cn('text-[11px] font-semibold px-3 py-1 rounded-full border', moodInfo.color, moodInfo.bg)}>
                        {moodInfo.label}
                    </div>
                )}

                {/* Message bubble */}
                <div className={cn(
                    'px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm',
                    isUser
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-card border border-border/60 text-foreground rounded-bl-sm'
                )}>
                    {content.split('\n').map((line, i) => (
                        <span key={i}>
                            {line}
                            {i < content.split('\n').length - 1 && <br />}
                        </span>
                    ))}
                </div>

                {/* Suggestion chip */}
                {!isUser && suggestion && (
                    <div className="text-[11px] text-primary font-semibold px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        💡 {suggestion}
                    </div>
                )}

                {/* Timestamp */}
                {timestamp && (
                    <span className="text-[10px] text-muted-foreground px-1">{timestamp}</span>
                )}
            </div>
        </div>
    );
}
