import { NextRequest, NextResponse } from 'next/server';
import getCollection, { LINKS_COLLECTION } from "../../lib/mongo";

export async function POST(request: NextRequest) {
    try {
        const { alias, url } = await request.json();

        // Validate input
        if (!alias || !url) {
            return NextResponse.json(
                { error: "Both alias and URL are required" },
                { status: 400 }
            );
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { error: "Invalid URL format" },
                { status: 400 }
            );
        }

        const collection = await getCollection(LINKS_COLLECTION);
        const existing = await collection.findOne({ alias });
        if (existing) {
            return NextResponse.json(
                { error: "Alias already in use" },
                { status: 409 }
            );
        }

        await collection.insertOne({
            alias,
            url,
            createdAt: new Date(),
            clicks: 0
        });

        const baseUrl = request.nextUrl.origin;
        return NextResponse.json({
            success: true,
            alias,
            shortUrl: `${baseUrl}/alias/${alias}`
        });

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}