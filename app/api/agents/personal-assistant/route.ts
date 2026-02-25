import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Gemini API Key is not configured' }, { status: 500 });
    }

    try {
        const { query, context }: { query: string; context?: Record<string, unknown> } = await request.json();

        if (!query?.trim()) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: { responseMimeType: 'application/json' },
        });

        const contextStr = context ? JSON.stringify(context, null, 2) : 'No specific health context provided.';

        const prompt = `You are the Personal Assistant Agent for AgentCare, an intelligent health assistant for elderly users. You help with:
- Medication reminders and management
- Appointment scheduling and tracking
- Interpreting doctor prescriptions in simple language
- Daily health task reminders
- Answering health-related queries in a clear, elderly-friendly manner

User Health Context:
${contextStr}

User Query: "${query}"

Respond in this strict JSON format:
{
  "response": "Main response to the user's query in clear, simple language",
  "category": "medication|appointment|prescription|reminder|health_query|general",
  "actionItems": ["Specific action item 1", "Specific action item 2"],
  "urgency": "low|medium|high",
  "tips": ["Optional health tip relevant to the query"]
}

Be specific, practical, and easy to understand. Use simple words — avoid medical jargon unless explained.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsedResponse = JSON.parse(responseText);

        return NextResponse.json({ data: parsedResponse });
    } catch (error) {
        console.error('Personal Assistant Agent error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
