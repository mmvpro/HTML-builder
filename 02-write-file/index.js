const fs = require('fs');
const path = require('path');

console.log('Please enter text: ');

const link = path.join(__dirname, './text.txt');

process.stdin.on('data',(data)=>{
  let  inputText = data.toString().trim();

  checkInputText(inputText);

  fs.appendFile(link, inputText, (err)=>{
    if(err) throw err;
  });
  
});

process.on('SIGINT', () => {
  process.exit();
});
process.on('exit',()=>{
  console.log('\nEnding of the process, Bye!');
});

function checkInputText(inputText){
  if(inputText === 'exit'){
    process.exit();
  }
}