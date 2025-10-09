import {int} from "neo4j-driver";
import {toNativeTypes} from "./utils.js";

export default class MovieService {
    driver;

    constructor(driver) {
        this.driver = driver;
    }

    async all(skip = 0, limit = 6) {
        const session = this.driver.session();
        try {
            const res = await session.executeRead((tx) =>
                tx.run(
                    "MATCH (m:Movie) RETURN m SKIP $skip LIMIT $limit",
                    {skip: int(skip), limit: int(limit)}
                )
            );
            return res.records.map((row) => toNativeTypes(row.get("m")));
        } catch (err) {
            console.log(err)
            console.log(err.message);
        } finally {
            await session.close()
        }
    }

    async getOne(imdbId, skip = 0, limit = 6) {
        const session = this.driver.session();
        try {
            const res = await session.executeRead((tx) =>
                tx.run(
                    "MATCH (m:Movie {imdbId: $imdbId})-[r:RATED]-(u:User) with m, avg(r.rating) as rating RETURN m{ .*, rating } as movie SKIP $skip LIMIT $limit", {imdbId, skip: int(skip), limit: int(limit)}
                )
            );

            return toNativeTypes(res.records[0].get("movie"));
        } finally {
            await session.close()
        }
    }
}