
import getCollection, { LINKS_COLLECTION } from '../lib/mongo';

export async function GET(request: Request): Promise<Response | void> {
    try {
        const url = new URL(request.url);
        const alias = url.pathname.split('/').pop() || '';

        const collection = await getCollection(LINKS_COLLECTION);
        const link = await collection.findOne({ alias });

        if (!link) {
            console.log(`Alias not found in DB: ${alias}`);

            return new Response(JSON.stringify({ error: 'That shortened link does not exist' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log(`Redirecting ${alias} to ${link.url}`);

        return Response.redirect(link.url, 302);
    } catch (error) {
        console.error(error);

        return new Response(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
