import { NextResponse } from 'next/server'
import getCollection, { LINKS_COLLECTION } from '../lib/mongo'

export async function GET(
    request: Request,
    { params }: { params: { alias: string } }
) {
    const collection = await getCollection(LINKS_COLLECTION)
    const link = await collection.findOne({ alias: params.alias })

    if (!link) {
        console.log(`Alias not found: ${params.alias}`)

        return NextResponse.redirect(new URL('/', request.url))
    }

    console.log(`Redirecting ${params.alias} to ${link.url}`)

    return NextResponse.redirect(link.url)
}