'use strict';
try{
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
}
catch(e){
    console.error(e);
        $('.no-browser-support').show();
        $('.app').hide();
    }
// Text area
var noteTextarea = $('#note-textarea');
//Instructions
var instructions = $('#recording-instructions');
var noteContent = '';
var redirectURL;
// Voice Recognintion
recognition.continuous = false;
recognition.onresult = function(event){
    var current = event.resultIndex;
    var transcript = event.results[current][0].transcript;
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
    if(!mobileRepeatBug){
        noteContent += transcript;
        noteTextarea.val(noteContent);
        window.location.href=redirectURL+'?q='+noteContent;
    }
};
recognition.onstart = function(){
    instructions.text('Voice recognition activated. Try speaking into the microphone.');
}
recognition.onspeechend = function(){
    instructions.text('You were quite for a while so voice recognition turned itself off.');
}
recognition.onerror = function(event){
     if(event.error == 'no-speech'){
        instructions.text('No speech was detected. Try again.');
     };
}
//App Button and input
//start button click
$('#start-record-btn').on('click',function(e){
    e.preventDefault();
    redirectURL = $(this).data('url');
    recognition.start();
});