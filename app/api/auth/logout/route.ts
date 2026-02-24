import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Clear the authToken cookie by setting its expiry to the past
    response.cookies.set('authToken', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });

    return response;
}
