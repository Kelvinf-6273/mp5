import getCollection, { LINKS_COLLECTION } from "../../lib/mongo"

export async function POST(req: Request) {
    try {
        const { alias, url } = await req.json()

        if (!alias || !url) {
            return Response.json({ error: "Need both alias and URL" })
        }

        const collection = await getCollection(LINKS_COLLECTION)

        // Check if alias exists (case-sensitive)
        const existing = await collection.findOne({ alias })
        if (existing) {
            return Response.json({ error: "That alias is already being used" })
        }

        // Insert with timestamp
        await collection.insertOne({
            alias,
            url,
            createdAt: new Date()
        })

        return Response.json({
            success: true,
            alias,
            shortUrl: `/alias/${alias}`
        })

    } catch (error) {
        console.error('Database error:', error)
        return Response.json({ error: "Something went wrong" })
    }
}

