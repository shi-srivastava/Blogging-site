const get_notif =()=>{
    $.ajax({
        url:"/get-notif-status",
        method:"GET",
        success:function(doc){
            // alert(doc[0].notif_status)
            if(doc[0].notif_status==1){
                $("#notif_div").html('YES')
            }
            else{
                
                $("#notif_div").html('No')

            }
        }
    })
}
setInterval(get_notif,3000)