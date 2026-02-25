import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function POST(request: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Gemini API Key is not configured' }, { status: 500 });
    }

    try {
        const { message, history }: { message: string; history: ChatMessage[] } = await request.json();

        if (!message?.trim()) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const systemPrompt = `You are the Mental Wellness Agent for AgentCare, a compassionate AI companion specifically designed to support elderly individuals. Your role is to:

1. Engage in warm, empathetic, and patient conversation
2. Detect emotional distress signals like loneliness, anxiety, sadness, or depression from the user's words
3. Provide genuine emotional support and validation
4. Suggest appropriate activities: light walks, calling family, hobbies, mindfulness, or breathing exercises
5. Encourage social connections with family and friends
6. Gently recommend professional support if needed
7. Keep responses clear and easy to understand for elderly users — avoid jargon
8. Never be dismissive of feelings; always acknowledge and validate them

EMOTIONAL TONE ANALYSIS:
- At the start of your response, add a JSON metadata block wrapped in <meta> tags: <meta>{"mood":"positive|neutral|concerned|distressed","suggestion":"brief one-line suggestion or null"}</meta>
- Then provide your full compassionate response after the meta block

Remember: You are talking to an elderly person who may be feeling vulnerable. Be a warm, caring friend.`;

        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: 'model',
                    parts: [{ text: "I understand. I'm here as the Mental Wellness Agent — a caring, compassionate companion for our elderly users. I'll always be warm, empathetic, and supportive." }],
                },
                ...history.map((msg) => ({
                    role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
                    parts: [{ text: msg.content }],
                })),
            ],
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        // Parse the meta block for emotional tone
        const metaMatch = responseText.match(/<meta>([\s\S]*?)<\/meta>/);
        let mood = 'neutral';
        let suggestion = null;
        let cleanResponse = responseText;

        if (metaMatch) {
            try {
                const metaData = JSON.parse(metaMatch[1]);
                mood = metaData.mood || 'neutral';
                suggestion = metaData.suggestion || null;
            } catch {
                // ignore parse errors
            }
            cleanResponse = responseText.replace(/<meta>[\s\S]*?<\/meta>/, '').trim();
        }

        return NextResponse.json({
            response: cleanResponse,
            mood,
            suggestion,
        });
    } catch (error) {
        console.error('Mental Wellness Agent error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
