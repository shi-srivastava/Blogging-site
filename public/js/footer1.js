$(document).ready(function () {
    $(".footer1_button").hoverIntent({
        over: printover,
        out: printout,
        timeout: 600,
        
    });
    function printover() {
        console.log("Hello")
    }
    function printout() {
        console.log("Bye")
    }
});