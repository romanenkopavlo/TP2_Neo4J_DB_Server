export default class RatingService {
    driver;

    constructor(driver) {
        this.driver = driver;
    }

    async createOne(user_id, movie_id, score) {
        const session = this.driver.session();
        try {
            return await session.executeWrite((tx) => {
                return tx.run(
                    `
                    MATCH (u:User {userId: $user_id})
                    MATCH (m:Movie {movieId: $movie_id})
                    MERGE (u)-[r:RATED]->(m) SET r.score = $score
                    RETURN r
                    `,
                    {user_id, movie_id, score})
            });
        } catch (err) {
            console.log(err)
            console.log(err.message);
        } finally {
            await session.close()
        }
    }
}