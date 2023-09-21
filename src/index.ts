import express from 'express';

import asyncDownloads from './asyncDownloads';

const server = express();

async function delayedAsyncCalculation(delay: number) {
    await new Promise((resolve) => {
        setTimeout(resolve, delay);
    });

    return 'hello async';
}

function delayedBlockingCalculation(delay: number) {
    const startTime = Date.now();
    let currentTime;

    do {
        currentTime = Date.now();
    } while (currentTime - startTime < delay);

    return 'hello';
}

server.post('/async-downloads', (req, res) => {
    // const downloadId = asyncDownloads.startTask(() => delayedAsyncCalculation(1000 * 10));
    const downloadId = asyncDownloads.startTask(() => delayedBlockingCalculation(1000 * 10));

    console.log(downloadId);

    res.status(200);
    res.send(downloadId);
});

server.get('/async-downloads/:downloadId', (req, res) => {
    const { params } = req;

    try {
        const result = asyncDownloads.getTaskResult(params.downloadId);

        res.status(200);
        res.send(result);
    } catch (error) {
        if (error instanceof asyncDownloads.TaskNotFound) {
            res.sendStatus(404);
        } else {
            throw error;
        }
    }
});

server.listen(3000, () => { console.log('Server running at http://localhost:3000') });