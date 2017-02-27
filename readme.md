# Speech.js - JavaScript support for continuous speech recognition

![Speech.js Animation](img/speechjs.gif)

Speech.js provides continuous speech recognition from JavaScript using a WebSocket endpoint usually provided for native Speech Recognition API SDKs (e.g. iOS, Windows, Android). The purpose of this project was to demonstrate how to implement real-time continuous recognition using a WebSocket API instead of using a REST endpoint. 

> Note: This example requires a WebSocket endpoint that supports unauthenticated connections as the HTML5 WebSocket implementation doesn't currently allow arbitrary "X-*" headers.

## Code Example

```javascript
var uri =  `wss://${hostString}/${appRoot}${endpoint}`;
var speech = new Speech({serverUri: uri});

speech.startListening(
    function(partialTxt) {
        console.log("Parital: " + partialTxt);
    }, 
    function(fullText) {
        console.log("Full: " + fullText);
    }, 
    function(err) {
        document.body.className = "";
        console.log("Error: " + err);
    }
);

setTimeout(speech.stopListening, 20000);

```

## Installation

To install, reference `recorder.js` and `Speech.js` in your project

```
<script src="recorder.js" type="text/javascript"></script>
<script src="Speech.js" type="text/javascript"></script>
```

## API Reference

#### Speech(options)
  
  - `serverUri` _(String)_
  - **Returns** `Speech`

  Creates a new `Speech` object for a given  server URI.

#### speech.isListening

  _(bool)_ Current status of continuous recognition and microphone.

````javascript
if (speech.isListening) 
  console.log("Listening!");
````

#### speech.startListening(onPartial, onFull, onError)
  
  - `onPartial` _(Function)_
  - `onFull` _(Function)_
  - `onError` _(String)_

  Starts listening to the microphone and reporting continuous recognition results.

````javascript
speech.startListening(onPartial, onFull, onError)
````

#### onPartial(partialResult)
`partialResult` _(String)_
  
  The partially recognized result returned from the server while the user is speaking. This result is likely to change while the user continues to speak until they pause. Returned for each word spoken, not appropriate for scenarios beyond transcription given frequency and low confidence of results returned. 

````javascript
 var onPartial = function(partialTxt) {
    console.log("Parital: " + partialTxt);
}
````

#### onFull(fullResult)
`fullResult` _(String)_

  The fully recognized result returned from the server after the user paused long enough for the server to return a confident result. Appropriate for use for further processing, e.g. call a REST API.

````javascript
 var onFull = function(fullText) {
    console.log("Full: " + fullText);
}
````

#### onError(error)
`error` _(Error)_

  An error prevented recognition from continuing (e.g. browser doesn't support getusermedia, user declined microphone access).

````javascript
 var onError = function(error) {
    console.log("Error: " + error);
}
````

#### speech.stopListening()
  
  Close the WebSocket and stop listening to the microphone.

````javascript
speech.stopListening()
````

## Contributors
This project was implemented by technical mentors during [HackIllinois](http://hackillinois.org), the University of Illinois Urbana-Champaign, student-led hackathon.

* David Washington [@dwcares](http://twitter.com/dwcares)
* Hao Luo [@dwcares](http://twitter.com/howlowck)
* Rachel Weil [@partytimeHXLNT](http://twitter.com/partytimeHXLNT)