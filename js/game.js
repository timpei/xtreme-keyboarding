var singlePlayer = true;
var startgame = false;
var playerPos = 0;  //ABSOLUTE POSITION IN THE TEXT
var oppPos = 0; //what player sees as the opp's pos
var playerHealth = 10;
var counter = 0;


countDown = function() {
          function printBoard(str){
            $(".countdownText").text(str);
          }
          
          var i = 5;

          setInterval(function(){
            if (i == 0) {
              printBoard('0');
            }
            else if (i == -1) {
              printBoard('');
              startgame = true;
              return;
            }
            else {
              printBoard(i);
            }
            i--;
          }, 1000);
          console.log(startgame);
}


//oppPosIndex is the position in the block (not for all blocks)
var updateOpp = function(oppPosIndex) {
  if(oppPosIndex > oppPos) {
    for(var n=oppPos; n < oppPosIndex; n++) {
      word = alltextOpp[n];
      word.setFill('green');
      word.setFontStyle('bold italic');
    alltextOpp[oppPosIndex].setFill('red');
    }
  }
}

var stage = new Kinetic.Stage({
        container: 'firstBox',
        width: 900,
        height: 300,
      });

var circleLayer = new Kinetic.Layer();
var circle = new Kinetic.Circle({
        x: 1,
        y: 1,
        radius: 1,
      });

stage.add(circleLayer);

var waiting = new Kinetic.Animation(function(frame) {
       if(startgame)
          circle.fire('mousedown');
      }, circleLayer);

waiting.start();

circle.on('mousedown touchstart', function() {
waiting.stop();
 console.log('pressdown');
     
  updateblock = function() {  
      var x = playerPos;
      console.log('x: ' + x);
      for(var n = 0; n < numInBlock; n++) {    
        word = alltext[n];
        word.setText(generatedString[n]);
        if(n==0) {
          word.setFill('red');
          console.log('red block');
        }
        else {
          word.setFill('black');
          console.log('turn black');
          word.setFontStyle('normal');
        } 
        x++;
        //word.setFontStye('normal');
      }
      cur=0;
      $('.progressText')[0].innerText = parseFloat($('.progressText')[0].innerText) + 1;
    }
var generatedStringOrig = "I am a knight. To be precise, I am the Sun Knight of the Church of the God of Light. The Church of the God of Light worships and serves the God of Light, and it is one of the three largest religions on this continent. But although it may only be ranked third in terms of size, if we’re talking in terms of history, then there is no other religious organization that can compare with the Church of the God of Light. As everyone knows, the Church of the God of Light consists of the Holy Temple and the Sanctuary of Light, which are organized along militaristic and clerical lines respectively. Naturally, I am a knight of the Holy Temple, of which the twelve captains of the holy knights are a part, and whose positions are passed down through the generations. Since ancient times, each captain of the holy knights has led a company of knights. For example, I am the Sun Knight, so I should be leading the Sun Knight Company. However, the chances of war breaking out are extremely low during these peaceful times. Without wars, the knight companies cannot mobilize; if the knight companies cannot mobilize, then they cannot plunder, pillage, or ransack under the cover of the chaos of war…! In any case, at the current moment the Holy Temple is unable to afford the upkeep for twelve full companies of knights. Thus, they decided to simply put together all the knights instead and form a Holy Temple Company, which can be further divided into twelve platoons. As for which platoon reports to me, it’s obviously the Sun Knight Platoon. The original Sun Knight Company may have shrunk into the Sun Knight Platoon, but of all captains of the holy knights, this change has the least impact on me. That’s because as the leader of the Twelve Holy Knights, I am naturally the commander of the entire Holy Temple Company. As long as I am a company commander, who cares if it’s the Sun Knight Company or the Holy Temple Company, right?";

  var generatedString = generatedStringOrig;
    
      var layer = new Kinetic.Layer();
      var canvases = document.getElementsByTagName("canvas");

          var xmult = 0;
          var ymult = 0;

            var numLines = 5;
            var numChar = 24;
            var numInBlock = numLines * numChar;

//your text
//for each character in the string/block of test, create a canvas element thing
      for(var n = 0; n < numInBlock; n++) {        
  
          //every time maxchar is reached, make a new line
          if( (n+1)%25 == 0 ) {
              xmult = 1;
              ymult++;
          }
          else {
              xmult++;
          }
          var i = n;
          var color;
          var style;
          if(n == 0) {
            color = 'red';
            style = 'bold italic';
          }
          else {
            color = 'black';
            style = 'normal';
          }
            
          var text = new Kinetic.Text({
             x: xmult * 13,
             y: ymult * 40,
            fill: color,
            text: generatedString[i],
            name: 'text',
            fontSize: 20,
            fontFamily: 'Courier',  //maybe Inconsolata
            fontStyle: style
          });
        layer.add(text);
        console.log('text added');
      }

      stage.add(layer);

 var xmult2 = 0;
var ymult2 = 0;

//opponent's text
if(singlePlayer == false) {
var layer2 = new Kinetic.Layer();

for(var n = 0; n < numInBlock; n++) {        
  
          //every time maxchar is reached, make a new line
          if( (n+1)%25 == 0 ) {
              xmult2 = 1;
              ymult2++;
          }
          else {
              xmult2++;
          }
          var i = n;
          var text = new Kinetic.Text({
             x: xmult2 * 13 + 460,
             y: ymult2 * 40,
            fill: 'black',
            text: generatedString[i],
            name: 'text',
            fontSize: 20,
            fontFamily: 'Courier',  //maybe Inconsolata
          });
        layer2.add(text);
      }

      stage.add(layer2);
  }
//end of the opponent's text
var alltextOpp = stage.get('.text');  //an array of opp's current block char


    var cur = 0;
      

      var correct = new Kinetic.Animation(function(frame) {
        var word = alltext[cur];  
        word.setFill('green');
        if(cur == 0)
          word.setFontStyle('bold italic');

        if(cur<alltext.length) {
          var word2 = alltext[cur+1];
          word2.setFill('red');
          word2.setFontStyle('bold italic');
        }
        cur++;
      }, layer );
      
      var alltext = stage.get('.text');
      var numincorrect = 0;

//look for keypress and check if key press is equal to current character
             $(document).keypress(function(evt){
              evt.preventDefault()
               var keynum = evt.keyCode;
               var typed = String.fromCharCode(keynum);
               
               if(typed == generatedString.charAt(0)) {
                //change the color of the current character to green if correct 
                   if(playerPos%(numInBlock-1) == 0 && playerPos > 0) {
                     //layer.clear();  //
                      updateblock();
                        console.log("end of blocK");
                    }


                   correct.start();
                   correct.stop();
                  generatedString = generatedString.substring(1);
                  counter++;
                  //console.log(generatedString); 
                  playerPos++;
               }
               else {
                //wave.start();
                  numincorrect++;
                console.log('Incorrect: ' + numincorrect);
                counter = 0;
                decreaseHealth(1);
                // data should include:

      data = { 'block': '', 'index': playerPos, 'health': playerHealth};
      //sendGameStatusMessage(data);
                 }
                 console.log($(".comboText")[0].innerText);
                 $(".comboBox")[0].innerText = counter;


            }); 
 });  //end of event listener

