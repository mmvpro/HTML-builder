const { access } = require('node:fs');
const { mkdir, readdir, copyFile,  unlink } = require('node:fs/promises');
const { join } = require('node:path');

makeDirectory().catch(console.error);
getAllFilesAndCopy();
cleanDir();

async function makeDirectory() {
  const fileCopy = join(__dirname, 'files-Copy');
  const dirCreation = await mkdir(fileCopy, { recursive: true });
  return dirCreation;
}

async function copyF( source, destination){
  try {
    await copyFile(source, destination);

  } catch {
    console.error('The file could not be copied');
  }
} 

async function getAllFilesAndCopy(){
  try {
    const filesFolder = await readdir(join(__dirname, 'files'));
        
    for(const file of filesFolder){
      const source = join(__dirname,'files', file);
      const destination = join(__dirname, 'files-Copy',file);
            
      copyF(source,destination);
    }
  } catch (error) {
    console.error(error);
  }    
}

async function cleanDir(){
  try {
    const filesCopy = await readdir(join(__dirname,'files-Copy'));
    
    for(const file of filesCopy){
      access(join(__dirname,'files', file),(err)=>{
        
        if(err){
          unlink(join(__dirname,'files-Copy',file), (error)=>{
            if(error) console.error(error);
          });
        }
      }); 
    }
  } catch (error) {
    console.error(error);
  }  
}
