const { google } = require("googleapis");
const http = require("http");
const url = require("url");
const fs = require("fs");

const credentials = JSON.parse(
     fs.readFileSync("./helpers/credentials.json")
);

const { client_id, client_secret, redirect_uris } =
     credentials.installed;

const oauth2Client = new google.auth.OAuth2(
     client_id,
     client_secret,
     redirect_uris[0]
);

const SCOPES = [
     "https://mail.google.com/"
];

const authUrl = oauth2Client.generateAuthUrl({
     access_type: "offline",
     scope: SCOPES,
     prompt: "consent"
});

console.log("\nOpen this URL in your browser:\n");
console.log(authUrl);
console.log("\nWaiting for authorization...\n");

const server = http.createServer(async (req, res) => {
     try {
          console.log("Incoming request:", req.url);

          const queryParams = new URL(
               req.url,
               "http://localhost:3000"
          ).searchParams;

          const code = queryParams.get("code");

          if (!code) {
               res.end("Authorization failed.");
               return;
          }

          const { tokens } = await oauth2Client.getToken(code);

          console.log("\nREFRESH TOKEN:\n");
          console.log(tokens.refresh_token);

          res.end(
               "Authorization successful. You can close this window."
          );

          server.close();
     } catch (error) {
          console.error(error);
          res.end("Authorization failed.");
          server.close();
     }
});

server.listen(3000, () => {
     console.log("Listening on http://localhost:3000");
});