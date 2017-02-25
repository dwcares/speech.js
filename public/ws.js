var websocket = null;
var textDisplay = "";


function startWebSocketForMic() {
    stopWebSocket();
    stopRecording();

    /// TODO: Hack to get around restrictions of Akamai on websocket.
    var hostString = "cog-web-wu.azurewebsites.net";
    // if (window.location.port != "80" && window.location.port != "") {
    //     hostString = hostString.concat(":").concat(window.location.port);
    // }

    var appRoot = 'cognitive-services';
    // var uri = 'wss://' + hostString + '/' + appRoot + '/ws/speechtotextdemo?language=en-US&g_Recaptcha_Response=null&isNeedVerify=false';
    var uri = "wss://websockets.platform.bing.com/ws/speech/recognize"
    websocket = getWebSocket(uri);
    websocket.onopen = function () {
        audioRecorder.sendHeader(websocket);
        audioRecorder.record(websocket);
        console.log('ws connected')
    };
}

function getWebSocket(uri) {
    console.log('uri', uri);
    websocket = new WebSocket(uri);
    websocket.onerror = function (event) {    
        stopRecording();
        websocket.close();
    };

    websocket.onmessage = function (event) {
        var data = event.data.toString();
        if (data == null || data.length <= 0) {
            return;
        }
        else if (data == "Throttled" || data == "Captcha Fail") {
            console.log(data);
            // reCaptchaSdk.ProcessReCaptchaStateCode(data, 'reCaptcha-Speech2Text-demo');
            stopSounds();
            return;
        }
        else {
            // reCaptchaSdk.RemoveReCaptcha();
        }
        if (data == null || data.length <= 0) {
            return;
        }

        var ch = data.charAt(0);
        var message = data.substring(1);
        if (ch == 'e') {
            stopRecording();
        }
        else {
            var text = textDisplay + message;
            if (ch == 'f') {
                textDisplay = text + " ";
                console.log('Full return:', text)
            }
            else {
                console.log('Partial return:', text)
            }
            
        }
    };

    websocket.onclose = function (event) {
        stopRecording();
    };

    return websocket;
}