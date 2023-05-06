const path = require('path');
const fs =  require('fs');
const myPath = path.join(__dirname, './text.txt');
const readableStream = fs.createReadStream(myPath,'utf-8');
let data = '';
readableStream.on('data', function(chank){
  data += chank;
});
readableStream.on('end', function(){
  console.log(data);
});
