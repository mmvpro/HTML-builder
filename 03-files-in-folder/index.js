const fs = require('fs');
const { readdir }  = require('fs/promises');
const path = require('path');

const secretFolderLink = path.join(__dirname, './secret-folder/');

getAllFiles();

async function getAllFiles(){
  try {
    const secretFolder = await readdir(secretFolderLink);
    
    for(const file of secretFolder){
      
      const link = path.join(secretFolderLink,file); 
      fs.stat(link,(error,stats)=>{
        if(error) throw error;
        if(stats.isFile()){
          const p = path.parse(file);
          console.log(`${p.name} - ${p.ext.substring(1)} - ${stats.size} bytes`);
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}