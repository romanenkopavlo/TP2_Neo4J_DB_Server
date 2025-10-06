import neo4j from 'neo4j-driver';
let driver;

export async function initDriver(uri, username, password) {
    try {
        driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
        const serverInfo = await driver.getServerInfo();
        console.log('Connection established');
        console.log(serverInfo)
    } catch (err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`)
        await driver.close()
        return
    }
}

export function getDriver() {
    return driver
}