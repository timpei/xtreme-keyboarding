var startgame = false;

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


var stage = new Kinetic.Stage({
        container: 'firstBox',
        width: 900,
        height: 300,
      });

var circleLayer = new Kinetic.Layer();
var circle = new Kinetic.Circle({
        x: 1,
        y: 1,
        radius: 100,
        stroke: 'red'
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

     
  var generatedString = "Ever since the Griffin, a foot-long ship built by the French explorer Rene-Robert Cavelier, Sieur de La Salle, in his quest to find the mouth of the Mississippi River, disappeared somewhere on the Great Lakes three years ago, people have been searching for its resting place.Ever since the Griffin, a foot-long ship built by the French explorer Rene-Robert Cavelier, Sieur de La Salle, in his quest to find the mouth of the Mississippi River, disappeared somewhere on the Great Lakes three hundred years ago, people have been searching for its resting place.";
    
      var layer = new Kinetic.Layer();
      var canvases = document.getElementsByTagName("canvas");

          var xmult = 0;
          var ymult = 0;

//your text
//for each character in the string/block of test, create a canvas element thing
      for(var n = 0; n < generatedString.length; n++) {        
  
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
             y: ymult * 20,
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
var layer2 = new Kinetic.Layer();

for(var n = 0; n < generatedString.length; n++) {        
  
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
             y: ymult2 * 20,
            fill: 'black',
            text: generatedString[i],
            name: 'text',
            fontSize: 20,
            fontFamily: 'Courier',  //maybe Inconsolata
          });
        layer2.add(text);
      }

      stage.add(layer2);

var cur = 0;
      var clear = false;

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

     // function wave(n) {
          var wave = new Kinetic.Animation(function(frame) {
          var time = frame.time;
          var n = cur;
          var word = alltext[0];
          word.setX(amplitude * Math.sin(frame.time * 2 * Math.PI / period) + centerX);
        }, layer);
      //}  //end of wave function
      


      var alltext = stage.get('.text');
      var numincorrect = 0;
//look for keypress and check if key press is equal to current character
             $(document).keypress(function(evt){
              evt.preventDefault()
               var keynum = evt.keyCode;
               var typed = String.fromCharCode(keynum);
               
               if(typed == generatedString.charAt(0)) {
                //change the color of the current character to green if correct 
                   correct.start();
                   correct.stop();
                  generatedString = generatedString.substring(1);
                  //console.log(generatedString); 
               }
               else {
                //wave.start();
                  numincorrect++;
                console.log('Incorrect: ' + numincorrect);
              }

            }); 
 });  //end of event listener
