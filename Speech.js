
(function (window) {
    function Speech(serverUri) {
        this.audioRecorder = null;
        this.isListening = false;
        this.audioSource = null;
        
        this.uri = serverUri;
    }

    Speech.prototype.startListening = function (onpartial, onfull, onerr) {
        this.stopListening();
        this.onpartial = onpartial;
        this.onfull = onfull;
        this.onerr = onerr;

        getMicrophoneStream.call(this, function(audioStream) {

            this.isListening = true;
            this.audioRecorder = new Recorder(audioStream);
            this.websocket = initWebSocket.call(this, this.uri);   

        }.bind(this), onerror);
    }

    Speech.prototype.stopListening = function () {

        if (this.isListening) {
            
            this.isListening = false;
            
            if (this.audioSource.stop) { 
                this.audioSource.stop(); 
            }
            this.audioRecorder.stop(); 

            stopWebSocket.call(this);
        }
    }

    function getMicrophoneStream(success, err) {
        
        navigator.getUserMedia = navigator.getUserMedia || 
                                 navigator.webkitGetUserMedia || 
                                 navigator.mozGetUserMedia || 
                                 navigator.msGetUserMedia;

        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        if (!(navigator.getUserMedia && window.AudioContext)) {
            err(new Error('Browser not supported: getUserMedia not found'));
        }

        this.audioContext = new AudioContext();

        navigator.getUserMedia({
            "audio": true,
        }, function(stream) {
            this.audioSource = stream;
            var inputPoint = this.audioContext.createGain();
            this.audioContext.createMediaStreamSource(this.audioSource).connect(inputPoint);

            success(inputPoint);

        }.bind(this), function (e) {
            err(new Error('Microphone access was rejected.'));
        });
    }

    function stopWebSocket() {
        var websocket = this.websocket;

        if (websocket) {
            websocket.onmessage = function() {};
            websocket.onerror = function() {};
            websocket.onclose = function() {};
            websocket.close();
        }
    }

    function initWebSocket(uri) {
        var websocket = new WebSocket(uri);

        websocket.onerror = function (event) {   
            this.onerr(event); 
            this.stopListening();
        }.bind(this);

        websocket.onopen = function () {
            this.audioRecorder.sendHeader(websocket);
            this.audioRecorder.record(websocket);
            console.log('WebSocket Connected')
        }.bind(this);

        websocket.onmessage = function (event) {
            var data = event.data.toString();

            if (data == null || data.length <= 0) {
                return;
            }
            else if (data == "Throttled" || data == "Captcha Fail") {
                console.log(data);
                this.onerr(new Error(data));
                return;
            }
            else {
            }
            if (data == null || data.length <= 0) {
                return;
            }

            var ch = data.charAt(0);
            var message = data.substring(1);
            if (ch == 'e') {
                this.onerr(new Error("API Error"));

                this.stopListening();
            }
            else {
                var text = message;
                if (ch == 'f') {
                    this.onfull(text);
                }
                else {
                    this.onpartial(text);
                }
            }
        }.bind(this);

        websocket.onclose = function (event) {
            this.stopListening();
        }.bind(this);

        return websocket;
    }

    window.Speech = Speech;
})(window);