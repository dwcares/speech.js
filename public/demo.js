(function() {

    var hostString = '';
    var appRoot = '';
    var endpoint = ''
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
            console.log("Error: " + err);
        }
    );

    setTimeout(speech.stopListening, 20000);

})();

