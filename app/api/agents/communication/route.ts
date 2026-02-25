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
        const { emergencyDecision, patientName } = await request.json();

        if (!emergencyDecision) {
            return NextResponse.json({ error: 'Emergency decision data is required' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: { responseMimeType: 'application/json' },
        });

        const name = patientName || 'the patient';
        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const prompt = `You are the Communication Agent for AgentCare. An emergency has been detected for an elderly patient. Based on the emergency decision below, generate appropriate notification messages for all relevant parties.

Emergency Decision Summary:
${JSON.stringify(emergencyDecision, null, 2)}

Patient Name: ${name}
Time: ${timestamp}

Generate the following notification messages — each should be clear, urgent, and contain all critical information:

1. FAMILY/GUARDIAN MESSAGE: SMS/WhatsApp style message to notify the family. Should be brief, alarming enough to prompt immediate action, include the patient's status, what is happening, and what they should do.

2. HOSPITAL MESSAGE: Professional notification to the hospital emergency department. Should include: patient name, emergency type, severity, vital signs summary, estimated arrival time, and required preparations.

3. AMBULANCE DISPATCH MESSAGE: Clear dispatch message with patient location placeholder, patient condition, vital signs, and any special instructions for paramedics.

Respond in this strict JSON format:
{
  "familyMessage": {
    "recipient": "Family/Guardian",
    "subject": "Message subject",
    "message": "Full message body",
    "urgencyLevel": "URGENT|CRITICAL|IMMEDIATE",
    "channel": "SMS/WhatsApp"
  },
  "hospitalMessage": {
    "recipient": "Emergency Department",
    "subject": "Message subject",
    "message": "Full message body",
    "urgencyLevel": "URGENT|CRITICAL|IMMEDIATE",
    "channel": "Phone/System"
  },
  "ambulanceMessage": {
    "recipient": "Ambulance Dispatch",
    "subject": "Message subject",
    "message": "Full message body",
    "urgencyLevel": "URGENT|CRITICAL|IMMEDIATE",
    "channel": "Radio/Phone"
  },
  "notificationSent": true,
  "timestamp": "${timestamp}",
  "summary": "Brief status of all notifications"
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const notifications = JSON.parse(responseText);

        return NextResponse.json({ data: notifications });
    } catch (error) {
        console.error('Communication Agent error:', error);
        return NextResponse.json({ error: 'Failed to generate notifications' }, { status: 500 });
    }
}
