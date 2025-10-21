import {Router} from "express"
import {getDriver} from "../neo4j.js";
import RecommendationsService from "../services/recommendations.service.js";

export const moviesRecommendations = new Router();

moviesRecommendations.get("/bygenre/:uid", async (req, res) => {
    const uid = req.params.uid;
    const driver = getDriver();
    const recService = new RecommendationsService(driver);
    const recMovies = await recService.getRecByGenre(uid);
    res.json(recMovies);
})

moviesRecommendations.get("/affinity/:uid", async (req, res) => {
    const uid = req.params.uid;
    const driver = getDriver();
    const recService = new RecommendationsService(driver);
    const recMovies = await recService.getRecAffinity(uid);
    res.json(recMovies)
})

moviesRecommendations.get("/similarity/:uid", async (req, res) => {
    const uid = req.params.uid;
    const driver = getDriver();
    const recService = new RecommendationsService(driver);
    const recMovies = await recService.getRecSimilarity(uid);
    res.json(recMovies)
})