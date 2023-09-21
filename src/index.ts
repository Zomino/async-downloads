import express from 'express';
import { v4 } from 'uuid';

const server = express();

async function longCalculation() {
    await new Promise((resolve) => {
        const delay = 1000 * 10; // 10 seconds

        setTimeout(resolve, delay);
    });

    return 'hello';
}

interface MapValue {
    done: boolean;
    result?: string;
}

const downloadMap = new Map<string, MapValue>();

server.post('/async-downloads', (req, res) => {
    const downloadId = v4();

    downloadMap.set(downloadId, { done: false });

    console.log('calling longCalculation');

    longCalculation().then((result) => {
        downloadMap.set(downloadId, { done: true, result });

        console.log('longCalculation done');
    });

    console.log('longCalculation called');

    res.status(200);
    res.send(downloadId);
});

server.get('/async-downloads/:downloadId', (req, res) => {
    const { params } = req;

    const download = downloadMap.get(params.downloadId);

    if (!download || !download.done) {
        res.sendStatus(404);
        return;
    }

    res.status(200);
    res.send(download.result);

    downloadMap.delete(params.downloadId);
});

server.listen(3000, () => { console.log('Server running at http://localhost:3000') });