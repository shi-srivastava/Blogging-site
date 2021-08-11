$(document).ready(function () {
    function beInactive() {
        $('.vertical-nav .slide.two').removeClass('active').addClass('inactive');
        $('.vertical-nav .slide.one').addClass('active').removeClass('inactive');
    }

    $(".navigation").hover(beInactive);
    
    $(".vertical-nav.hover").hoverIntent({
        over: beWide,
        out: beNarrow,
        timeout: 600
    });
    
    function beWide() {
        $(this).addClass("wide").removeClass("narrow");
        
        document.getElementById("move_when_expanded_content").style.marginLeft = "180px";
        document.getElementById("move_when_expanded_top_bar").style.marginLeft = "180px";
    }
    
    function beNarrow() {
        $(this).removeClass("wide").addClass("narrow");
        
        document.getElementById("move_when_expanded_content").style.marginLeft = "0px";
        
        document.getElementById("move_when_expanded_top_bar").style.marginLeft = "0px";
        beInactive();
    }

    $('#apps-switch .button').click(function () {
        $('.slide.two').toggleClass('active').toggleClass('inactive');
        $('.slide.one').toggleClass('active').toggleClass('inactive');
    });
});