import {toNativeTypes} from "../utils.js";

export default class RecommendationsService {
    driver;

    constructor(driver) {
        this.driver = driver;
    }

    async getRecByGenre(userId) {
        const session = this.driver.session();
        try {
            const res = await session.executeRead((tx) =>
                tx.run(
                    "MATCH (u:User {userId: $userId})-[r:RATED]->(m:Movie),\n" +
                    "(m)-[:IN_GENRE]->(g:Genre)<-[:IN_GENRE]-(rec:Movie)\n" +
                    "WHERE r.rating >= 2.5 AND NOT EXISTS{ (u)-[:RATED]->(rec) }\n" +
                    "WITH rec, g.name as genre, count(*) AS count\n" +
                    "WITH rec, collect([genre, count]) AS scoreComponents\n" +
                    "RETURN { title: rec.title, score: reduce(s=0,x in scoreComponents | s+x[1]) } AS recom \n" +
                    "ORDER BY recom.score DESC LIMIT 10", {userId}
                )
            );

            return res.records.map((row) => toNativeTypes(row.get("recom")));
        } finally {
            await session.close()
        }
    }

    async getRecAffinity(userId) {
        const session = this.driver.session();
        try {
            const res = await session.executeRead((tx) =>
                tx.run(
                    "MATCH (u:User {userId: $userId})-[r:RATED]->(fav:Movie)\n" +
                    "WHERE r.rating > 2.5\n" +
                    "WITH u, fav\n" +
                    "ORDER BY r.rating DESC\n" +
                    "LIMIT 1\n" +
                    "MATCH (fav)<-[r2:RATED]-(other:User)\n" +
                    "WHERE r2.rating > 2.5 AND other <> u\n" +
                    "MATCH (other)-[r3:RATED]->(rec:Movie)\n" +
                    "WHERE r3.rating > 2.5 AND NOT EXISTS { (u)-[:RATED]->(rec) }\n" +
                    "WITH rec, rec.title as recTitle, COUNT(DISTINCT other) AS usersWhoAlsoWatched\n" +
                    "ORDER BY usersWhoAlsoWatched DESC\n" +
                    "LIMIT 25\n" +
                    "RETURN rec{ .*, title: recTitle, users: usersWhoAlsoWatched } AS recom", {userId}
                )
            );

            return res.records.map((row) => toNativeTypes(row.get("recom")));
        } finally {
            await session.close()
        }
    }

    async getRecSimilarity(userId) {
        const session = this.driver.session();
        try {
            const res = await session.executeRead((tx) =>
                tx.run(
                    "MATCH (u:User {userId: $userId})-[r1:RATED]->\n" +
                    "(:Movie)<-[r2:RATED]-(peer:User)\n" +
                    "WHERE abs(r1.rating-r2.rating) < 2 // similarly rated\n" +
                    "WITH distinct u, peer\n" +
                    "MATCH (peer)-[r3:RATED]->(rec:Movie)\n" +
                    "WHERE r3.rating > 3\n" +
                    "AND NOT EXISTS { (u)-[:RATED]->(rec) }\n" +
                    "WITH rec, count(*) as freq, avg(r3.rating) as rating\n" +
                    "RETURN rec{.*, rating: rating, freq: freq} AS recom\n" +
                    "ORDER BY rating DESC, freq DESC\n" +
                    "LIMIT 25", {userId}
                )
            );

            return res.records.map((row) => toNativeTypes(row.get("recom")));
        } finally {
            await session.close()
        }
    }
}