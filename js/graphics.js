         function decreaseHealth(player){ //player is an integer; either 1 or 2
            if(player == 1){
               $("#firstInnerBar")[0].style.width = parseFloat($("#firstInnerBar")[0].style.width) - 5 + "%";
               if(parseFloat($("#firstInnerBar")[0].style.width) > 75){
                  $("#firstInnerBar")[0].style.backgroundColor = "#00CC99";
               } else if(parseFloat($("#firstInnerBar")[0].style.width) > 30){
                  $("#firstInnerBar")[0].style.backgroundColor = "orange";
               } else {
                  $("#firstInnerBar")[0].style.backgroundColor = "red";
                  if(parseFloat($("#firstInnerBar")[0].style.width) == 0){
                     $(".textbox")[0].innerHTML = "<h1>YOU LOSE!</h1>";
                  }
               }
               
            } else {
               $("#secondInnerBar")[0].style.width = parseFloat($("#secondInnerBar")[0].style.width) - 5 + "%";
               if(parseFloat($("#secondInnerBar")[0].style.width) > 75){
                  $("#secondInnerBar")[0].style.backgroundColor = "#00CC99";
               } else if(parseFloat($("#secondInnerBar")[0].style.width) > 30){
                  $("#secondInnerBar")[0].style.backgroundColor = "orange";
               } else {
                  $("#secondInnerBar")[0].style.backgroundColor = "red";
               }
               }
            }

         function updateProgress(player){
            if(player == 1){
               if(parseFloat($("#progress1")[0].innerText) < 100)
                  $("#progress1")[0].innerText = parseFloat($("#progress1")[0].innerText) + 10 + "%";
            } else {
               if(parseFloat($("#progress2")[0].innerText) < 100)
                  $("#progress2")[0].innerText = parseFloat($("#progress2")[0].innerText) + 10 + "%";
            }
         }
