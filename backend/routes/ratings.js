import {Router} from "express"
import {getDriver} from "../neo4j.js";
import RatingService from "../ratings.service.js";

export const moviesRatings = new Router();

moviesRatings.post("/", async (req, res) => {
    const {userID: user_id, movieId: movie_id, rating: score} = req.body;

    if (!user_id || !movie_id || !score) {
        res.status(400).send("user_id, movie_id and score are required");
    }

    const driver = getDriver();
    const ratingService = new RatingService(driver);
    const response = await ratingService.createOne(user_id, movie_id, score);

    console.log(response.records[0]?.get("r"));

    return response.json({
        message: `Le film ${movie_id} a désormais une note personnelle de ${score}`
    });
})