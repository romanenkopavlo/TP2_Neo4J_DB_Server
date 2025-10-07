import {int} from "neo4j-driver";
import {toNativeTypes} from "./utils.js";

export default class MovieService {
    driver;

    constructor(driver) {
        this.driver = driver;
    }

    async all(skip = 0, limit = 6) {
        const session = this.driver.session();
        console.log(skip, limit)
        try {
            const res = await session.executeRead((tx) =>
            tx.run("MATCH (m:Movie) RETURN m SKIP $skip LIMIT $limit"), {
                skip: int(skip), limit: int(limit),
            });
            return res.records.map((row) => toNativeTypes(row.get("m")));
        } finally {
            await session.close()
        }
    }

    async getOne(imdbId) {
        const session = this.driver.session();
        try {
            const res = await session.executeRead((tx) =>
                tx.run("MATCH (m:Movie {imdbId: $imdbId}) RETURN m SKIP $skip LIMIT $limit"), { imdbId });
            return toNativeTypes(res.records[0].get("m"))
        } finally {
            await session.close()
        }
    }
}