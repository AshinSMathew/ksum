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
        const { healthData, vitals } = await request.json();

        if (!healthData) {
            return NextResponse.json({ error: 'Health data is required' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `You are the Emergency Decision Agent for AgentCare. An elderly patient is experiencing a possible medical emergency. Based on the health monitoring data below, make autonomous emergency decisions.

Health Monitoring Analysis:
${JSON.stringify(healthData, null, 2)}

Raw Vital Signs:
${JSON.stringify(vitals, null, 2)}

Your task:
1. Evaluate the overall emergency severity
2. Determine the type of medical emergency (cardiac, respiratory, neurological, metabolic, etc.)
3. Select the most appropriate hospital type
4. Decide whether an ambulance is immediately required
5. Generate a concise emergency medical summary for first responders
6. Identify immediate actions the patient or caregiver should take RIGHT NOW

Respond in this strict JSON format:
{
  "severity": "LOW|MEDIUM|HIGH|CRITICAL",
  "severityLabel": "e.g. Moderate Emergency, Life-Threatening Emergency",
  "emergencyType": "e.g. Hypertensive Crisis, Hypoxia, Cardiac Arrhythmia",
  "ambulanceRequired": true|false,
  "ambulanceUrgency": "IMMEDIATE|WITHIN_10_MIN|WITHIN_30_MIN|NOT_REQUIRED",
  "hospitalType": "Nearest Emergency Room|Cardiac Center|General Hospital|Clinic",
  "hospitalReason": "Why this hospital type was selected",
  "immediateActions": ["Action 1 to take RIGHT NOW", "Action 2"],
  "medicalSummary": "Concise medical summary for paramedics/ER staff (2-3 sentences with key vitals and suspected condition)",
  "decisionRationale": "Brief explanation of how this decision was made",
  "estimatedTimeframeMinutes": 15
}

Be decisive and err on the side of caution — the patient is elderly and every minute counts.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const decision = JSON.parse(responseText);

        return NextResponse.json({ data: decision });
    } catch (error) {
        console.error('Emergency Decision Agent error:', error);
        return NextResponse.json({ error: 'Failed to make emergency decision' }, { status: 500 });
    }
}
