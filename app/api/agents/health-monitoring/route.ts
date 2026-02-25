import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface VitalSigns {
    heartRate?: number;        // bpm
    systolicBP?: number;       // mmHg
    diastolicBP?: number;      // mmHg
    bloodGlucose?: number;     // mg/dL
    spo2?: number;             // percentage
    temperature?: number;      // Celsius
    respiratoryRate?: number;  // breaths/min
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
        const vitals: VitalSigns = await request.json();

        const providedVitals = Object.entries(vitals).filter(([, v]) => v !== undefined && v !== null && v !== '');
        if (providedVitals.length === 0) {
            return NextResponse.json({ error: 'At least one vital sign is required' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: { responseMimeType: 'application/json' },
        });

        const vitalsJson = JSON.stringify(vitals, null, 2);

        const prompt = `You are the Health Monitoring Agent for AgentCare. Analyze the following vital signs for an elderly patient and compare them against clinical normal ranges.

Vital Signs Provided:
${vitalsJson}

Clinical Normal Ranges (for elderly adults):
- Heart Rate: 60-100 bpm (Bradycardia <60, Tachycardia >100, Critical >150 or <40)
- Systolic BP: 90-140 mmHg (High >140, Very High >180, Critical >200)
- Diastolic BP: 60-90 mmHg (High >90, Very High >110, Critical >120)
- Blood Glucose (fasting): 70-130 mg/dL (Low <70, High >130, Critical >300 or <50)
- SpO2: 95-100% (Low <95%, Critical <90%)
- Temperature: 36.1-37.2°C (Fever >38°C, High Fever >39°C, Hypothermia <35°C)
- Respiratory Rate: 12-20 breaths/min (Critical <8 or >30)

Respond in this strict JSON format:
{
  "overallAlertLevel": "NORMAL|CAUTION|WARNING|CRITICAL",
  "requiresEmergency": true|false,
  "summary": "Brief overall health status summary in one or two sentences",
  "vitals": [
    {
      "name": "Vital Sign Name",
      "value": "value with unit",
      "status": "NORMAL|LOW|HIGH|CRITICAL",
      "statusLabel": "e.g. Normal, Slightly High, Dangerously High",
      "normalRange": "e.g. 60-100 bpm",
      "interpretation": "Brief clinical interpretation",
      "recommendation": "Specific recommendation for this vital"
    }
  ],
  "recommendations": ["Overall recommendation 1", "Overall recommendation 2"],
  "emergencyReason": "Reason for emergency if requiresEmergency is true, otherwise null"
}

Only include vitals that were provided. Be medically accurate and err on the side of caution for elderly patients.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const analysis = JSON.parse(responseText);

        return NextResponse.json({ data: analysis, vitals });
    } catch (error) {
        console.error('Health Monitoring Agent error:', error);
        return NextResponse.json({ error: 'Failed to analyze vitals' }, { status: 500 });
    }
}
