import express from 'express';
import {initDriver, getDriver} from './neo4j.js';
import {URI, USERNAME, PASSWORD} from './constants.js'

let driver;
const app = express();
app.use(express.json());
app.use(express.static('public'))

const port = 3000;

app.get('/', async (req, res) => {
    res.send('Hello World!');
})

app.listen(port, async () => {
    await initDriver(URI, USERNAME, PASSWORD);
    driver = getDriver();
    console.log(`Example app listening on port ${port}`);
})