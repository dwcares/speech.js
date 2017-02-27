(function() {

    var hostString = "<INSERT_HOST>";
    var appRoot = "<INSERT_ROOT>";
    var endpoint = "<INSERT_ENDPOINT>"
    var uri =  `wss://${hostString}/${appRoot}${endpoint}`;

    var speech = new Speech(uri);
    window.textToDisplay = "";

    document.getElementById('toggleMic').addEventListener('click', function(e) {

        if (!speech.isListening) {
            document.body.className = "listening";

            speech.startListening(
                function(partialTxt) {
                    console.log("Parital: " + partialTxt);
                    document.getElementById('outputText').innerHTML = `<span class='full'>${textToDisplay}</span> <span class='partial'>${partialTxt}</span>`;
                }, 
                function(fullText) {
                    console.log("Full: " + fullText);
                    textToDisplay = `${textToDisplay} ${fullText}`;

                    document.getElementById('outputText').innerHTML =  `<span class='full'>${textToDisplay}</span>`;
                }, 
                function(err) {
                    document.body.className = "";
                    console.log("Error: " + err);
                }
            );

        } else {
            document.body.className = "";
            speech.stopListening();
        }

    }.bind(this));


})();

