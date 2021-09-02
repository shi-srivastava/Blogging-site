const search =()=>{
    let search_div = document.getElementById("search")
    let search_item = $("input[name='r']").val()
   // alert(search_select)
    $.ajax({
      url:"/search",
      method:"POST",
      data:{data:search_item},
      success:function(response){
       if(response!=null){
         
         response.forEach(res=>{
           let anchor = document.getElementsByClassName('user-suggestion')
           let flag =0
           for(let i=0;i<anchor.length;i++){
             if(anchor[i].innerText == res.username){
               flag=1
             }
           }
           if(flag!=1){
          let btn = document.createElement('button')
          btn.classList.add("user-suggestion")
          btn.innerHTML = res.username
          btn.onclick =function(){
            document.getElementById("r").value = btn.innerHTML
          }
          $("#search").append(btn)
          let linebreak = document.createElement('br')
          $("#search").append(linebreak)


           }
            
        })
       
       }
       
       if( search_item.length ==0){
         search_div.innerHTML =''
       }
      }
    })
  }

     const socket = io.connect("http://localhost:3000")
     // const socket = io()
   let chat_div = document.getElementById("chat")
   socket.on("express-chat",data=>{
     
    chat_div.innerHTML += '<p>'+data.msg +'</p>'
   })
     
   const show_notif=()=>{
     let sender = $("input[name='sender']").val()
    $.ajax({
      url: "/get-unread",
      method:"POST",
      data:{sender:sender},
      success:function(rooms){
      rooms.forEach(room=>{
        let btn = document.getElementById(room)
        if(btn){
          if(!btn.innerHTML.includes(" *")){
            btn.innerHTML += " *"
          }
        }
      })
       
      }
    })
   }
   setInterval(show_notif,3000)
//GET SENDERS
   const get_senders =()=>{
   document.getElementById("users").innerHTML =""

 let sender = $("input[name='sender']").val()
     $.ajax({
       url:"/get-my-senders",
       method:"POST",
       data:{sender:sender},
       success:function(res){
         res.forEach(res=>{
         if(res.roomID!=undefined){
       let btn = document.createElement('button')
         btn.id = res.roomID
         if(res.sender == sender){
           btn.innerHTML =""+res.receiver
         }
         if(res.receiver == sender){
           btn.innerHTML =""+res.sender

         }


         btn.onclick = function(){
     let cur_room = document.getElementsByClassName("active_room")
     if(cur_room.length>0){
     //alert(cur_room[0].id)
   socket.emit("join-room",{room:btn.id, prev_room: cur_room[0].id})
     cur_room[0].classList.remove("active_room")

     }
    else{
   socket.emit("join-room",{room:btn.id, prev_room: "nothing"})

    }
     document.getElementById(btn.id).classList.add("active_room")

     let send_btn = document.getElementsByClassName("send")
     send_btn[0].id = btn.id
   chat_div.innerHTML =""
   if(btn.innerHTML.includes(" *")){
    let a = btn.innerHTML
    a = a.replace(" *","")
    btn.innerHTML = a
   }
   let val = ""+btn.innerHTML

   $("label[for='receiver']").html(val)

    //AJAX
    $.ajax({
     url:"/get-chats",
     method:"POST",
     data:{roomID:btn.id},
     success:function(data){
      (data).forEach(msg=>{
       for(let i=0;i<msg.chats.length;i++){
         if(msg.chats[i].data != undefined){
          if(msg.chats[i].username == sender){
         chat_div.innerHTML += '<p style="margin-left:100px;">'+msg.chats[i].data+'</p>'
        }
        if(msg.chats[i].username != sender){
         chat_div.innerHTML += '<p >'+msg.chats[i].data+'</p>'

        }
       }
       }
       
        
      })
     }
   })
    //
     
   }

   document.getElementById("users").prepend(btn)
   let linebreak = document.createElement("br")
   document.getElementById("users").prepend(linebreak)
       }
     }
         )}
     })
   }

   window.onload = get_senders()
 const create_new_chat =()=>{
 let sender = $("input[name='sender']").val()

   let receiver = $("input[name='r']").val()
   // alert(receiver)

   $.ajax({
     url:"/get-room-id",
     method:"POST",
     data:{sender:sender,r:receiver},
     success:function(id){
      window.location.href = window.location
     }

   })
  
 }

 const on_post =(btn)=>{
   let sender = $("input[name='sender']").val()
   let receiver = $("input[name='r']").val()
   let msg = $("input[name='input msg']").val()
  let isRead = 0
   socket.emit("get-clients-no",btn.id)
   socket.on("get-clients-no",data=>{
     if(data==1){
     $.ajax({
     url:"/send-msg",
     method:"POST",
     data:{msg:msg,sender:sender,roomID:btn.id, receiver:receiver,isRead:1},
     success:function(){
       alert("done "+isRead)
     }
   })
     }
     else{
       $.ajax({
     url:"/send-msg",
     method:"POST",
     data:{msg:msg,sender:sender,roomID:btn.id, receiver:receiver,isRead:0},
     success:function(){
       alert("done "+isRead)
       
     }
   })
     }
   })
   
   
   // $.ajax({
   //   url:"/send-msg",
   //   method:"POST",
   //   data:{msg:msg,sender:sender,roomID:btn.id, receiver:receiver,isRead:isRead},
   //   success:function(){
       
   //   }
   // })
   
   socket.emit("express-chat",{roomID:btn.id,msg:msg})
   
   chat_div.innerHTML += '<p style="margin-left:100px;">' +msg+'</p>'
 }
 const show_chat =()=>{
   let send_btn = document.getElementsByClassName("send")

   let btn = send_btn[0]
   let sender = $("input[name='sender']").val()
   let i=0
   $.ajax({
     url:"/get-chats",
     method:"POST",
     data:{roomID:btn.id},
     success:function(data){
      (data).forEach(msg=>{
       for(let i=0;i<msg.chats.length;i++){
         if(msg.chats[i].data != undefined){
          if(msg.chats[i].username == sender){
         chat_div.innerHTML += '<p style="margin-left:100px;">'+msg.chats[i].data+'</p>'
        }
        if(msg.chats[i].username != sender){
         chat_div.innerHTML += '<p >'+msg.chats[i].data+'</p>'

        }
       }
       }
       
        
      })
     }
   })
   
 }