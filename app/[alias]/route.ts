import { NextRequest, NextResponse } from 'next/server';
import getCollection, { LINKS_COLLECTION } from "../lib/mongo";

export async function GET(request: NextRequest) {
    try {
        const alias = request.nextUrl.pathname.split('/').pop() || '';

        const collection = await getCollection(LINKS_COLLECTION);
        const link = await collection.findOne({ alias });

        if (!link) {
            return NextResponse.json(
                { error: 'Short link not found' },
                { status: 404 }
            );
        }

        return NextResponse.redirect(link.url);

    } catch (error: unknown) {
        // Proper error logging
        console.error('Redirect failed:', error instanceof Error ? error.message : 'Unknown error');

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}