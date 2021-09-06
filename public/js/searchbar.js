const search =()=>{
    let search_div = document.getElementById("search")
    let search_item =""+ $("input[name='search_text']").val()
    let search_select =""+ $("select[name='search_select']").val()
   
    $.ajax({
      url:"/search-on-homepage",
      method:"POST",
      data:{data:search_item,filter:search_select},
      success:function(response){
       if(response!=null){
         if((search_select == "blog")){
         response.forEach(res=>{
           alert(res.title)
           let anchor = document.getElementsByTagName('a')
           let flag =0
           for(let i=0;i<anchor.length;i++){
             if(anchor[i].innerText == res.title){
               flag=1
             }
           }if(flag!=1){
            $("#search").append(
              $(document.createElement('a')).prop({
                target:'',
                href:'/demoblog/'+res._id,
                innerText: res.title
              })
            ).append(
              $(document.createElement('br'))
            )
           }
         })
       }
       else{
         response.forEach(res=>{
           let anchor = document.getElementsByTagName('a')
           let flag =0
           for(let i=0;i<anchor.length;i++){
             if(anchor[i].innerText == res.username){
               flag=1
             }
           }
           if(flag!=1){
           $("#search").append(
             $(document.createElement('a')).prop({
               target:'',
               href:'/profile/'+res._id,
               innerText: res.username
             })
           ).append(
             $(document.createElement('br'))
           )
           }
            
        })
       }
       }
       if( search_item.length ==0){
         search_div.innerHTML =''
       }
      }
    })
  }