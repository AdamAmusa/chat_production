import { createClient } from "@deepgram/sdk";
import { configDotenv } from 'dotenv';
import { LiveTranscriptionEvents } from "@deepgram/sdk";



configDotenv();
const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);
let keepAlive;


const setupDeepgramConnection = (ws) => {
    const deepgram = deepgramClient.listen.live({
        language: "en",
        punctuate: true,
        smart_format: true,
        model: "nova",
    });
    if (keepAlive) clearInterval(keepAlive);
    keepAlive = setInterval(() => {
        console.log("deepgram: keepalive");
        deepgram.keepAlive();
    }, 10 * 1000);

    deepgram.addListener(LiveTranscriptionEvents.Open, async () => {
        console.log("deepgram: connected");
    
        deepgram.addListener(LiveTranscriptionEvents.Transcript, (data) => {
          console.log("deepgram: packet received");
          console.log("deepgram: transcript received");
          console.log("socket: transcript sent to client");
          ws.send(JSON.stringify(data));
        });
    
        deepgram.addListener(LiveTranscriptionEvents.Close, async () => {
          console.log("deepgram: disconnected");
          clearInterval(keepAlive);
          deepgram.finish();
        });
    
        deepgram.addListener(LiveTranscriptionEvents.Error, async (error) => {
          console.log("deepgram: error received");
          console.error(error);
        });
    
        deepgram.addListener(LiveTranscriptionEvents.Warning, async (warning) => {
          console.log("deepgram: warning received");
          console.warn(warning);
        });
    
        deepgram.addListener(LiveTranscriptionEvents.Metadata, (data) => {
          console.log("deepgram: packet received");
          console.log("deepgram: metadata received");
          console.log("ws: metadata sent to client");
          ws.send(JSON.stringify({ metadata: data }));
        });
      });  
      return deepgram;
}

export const connectToDeepgram = (wss) => {  
wss.on("connection", (ws) => {
    console.log("socket: client connected");
    let deepgram = setupDeepgramConnection(ws);
  
    ws.on("message", (message) => {
      console.log("socket: client data received");
  
      if (deepgram.getReadyState() === 1 /* OPEN */) {
        console.log("socket: data sent to deepgram");
        deepgram.send(message);
      } else if (deepgram.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */) {
        console.log("socket: data couldn't be sent to deepgram");
        console.log("socket: retrying connection to deepgram");
        /* Attempt to reopen the Deepgram connection */
        deepgram.finish();
        deepgram.removeAllListeners();
        deepgram = setupDeepgramConnection(ws);
      } else {
        console.log("socket: data couldn't be sent to deepgram");
      }
    });
  
    ws.on("close", () => {
      console.log("socket: client disconnected");
      if (deepgram) {
        console.log("deepgram: disconnecting");
        deepgram.finish(); // Properly close the Deepgram connection
        deepgram.removeAllListeners(); // Remove all listeners to avoid memory leaks
        deepgram = null;
    }
    if (keepAlive) {
        clearInterval(keepAlive); // Clear the keepAlive interval
        keepAlive = null;
    }
    });
  });
}

