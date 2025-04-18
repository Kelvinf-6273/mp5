import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import getCollection, { LINKS_COLLECTION } from '../lib/mongo'

export async function GET(
    request: NextRequest,
    { params }: { params: { alias: string } }
) {
    try {
        const collection = await getCollection(LINKS_COLLECTION)
        const link = await collection.findOne({ alias: params.alias })

        if (!link) {
            console.log(`Alias not found: ${params.alias}`)
            return NextResponse.json(
                { error: 'Short link not found' },
                { status: 404 }
            )
        }

        console.log(`Redirecting ${params.alias} to ${link.url}`)
        return NextResponse.redirect(link.url)
    } catch (error) {
        console.error('Redirect error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}