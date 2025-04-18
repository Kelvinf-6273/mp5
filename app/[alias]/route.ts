import { redirect } from 'next/navigation'
import getCollection, { LINKS_COLLECTION } from '../lib/mongo'

export async function GET(request: Request, { params }: { params: { alias: string } }) {
    const collection = await getCollection(LINKS_COLLECTION)
    const link = await collection.findOne({ alias: params.alias })

    if (!link) {
        console.log(`Alias not found in DB: ${params.alias}`)
        return new Response('That shortened link does not exist')
    }

    console.log(`Redirecting ${params.alias} to ${link.url}`)
    redirect(link.url)
}
