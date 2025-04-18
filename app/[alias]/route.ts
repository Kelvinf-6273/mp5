import { redirect } from 'next/navigation'
import getCollection, { LINKS_COLLECTION } from '../lib/mongo'

export async function GET(request: Request): Promise<Response | void> {
    const url = new URL(request.url)
    const alias = url.pathname.split('/').pop() || ''

    const collection = await getCollection(LINKS_COLLECTION)
    const link = await collection.findOne({ alias })

    if (!link) {
        console.log(`Alias not found in DB: ${alias}`)
        return new Response('That shortened link does not exist')
    }

    console.log(`Redirecting ${alias} to ${link.url}`)
    redirect(link.url)
}
