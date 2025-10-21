import {Router} from "express"
import {getDriver} from "../neo4j.js";
import MovieService from "../services/movies.service.js";

export const moviesRouter = new Router();

moviesRouter.get("/", async (req, res) => {
    let limit = 6;
    let skip = 0;

    const driver = getDriver();
    const movieService = new MovieService(driver);
    const movies = await movieService.all(skip, limit);
    res.json(movies);
})

moviesRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const driver = getDriver();
    const movieService = new MovieService(driver);
    const movie = await movieService.getOne(id);
    res.json(movie);
})