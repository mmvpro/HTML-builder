const { stat, createReadStream, unlink, appendFile, access } = require('fs');
const { readdir} = require('fs/promises');
const { join, parse } = require('path');

const bundleLink = join(__dirname, 'project-dist', 'bundle.css');
const stylesFolder = join(__dirname,'styles');

run();

async function getAllFilesCss(folder){
  try {
    const dir = await readdir(folder);
    for(let file of dir){
      stat(join(folder,file), (error, stats)=>{
        if(error) console.error(error);
        const ext = parse(file).ext;
        if(stats.isFile(), ext==='.css'){
         
          readFileAndPush(join(folder,file));
        }
      });
    }

  } catch (error) {
    console.error(error.message);
  }
}

function readFileAndPush(path){ 
  let data = '';
  const stream = createReadStream(path, 'utf-8');   
  stream.on('data', (chank)=> data += chank);
  stream.on('end',()=> {
   
    appendFile(bundleLink, data, (error)=>{
      if(error) throw error;
    });

  });
  stream.on('error',error=>console.error(error.message));
}

function  run(){
  access(bundleLink,(err)=>{
    if(err){
      getAllFilesCss(stylesFolder);
    }else{
      unlink(bundleLink,(error)=>{
        if(error) console.error(error);
      });
  
      getAllFilesCss(stylesFolder);
    }    
  });
}