const { mkdir, readdir, copyFile, createReadStream, createWriteStream, rm, readFile } = require('fs');
const { join, extname } = require('path');

let filesCss = [];
const curFolder = join(__dirname, 'assets');
const copyFolder = join(__dirname, 'project-dist', 'assets');


mkdir(join(__dirname, 'project-dist'), { recursive: true, force: true }, error => {
  if (error) throw error;
});

mkdir(join(__dirname, 'project-dist', 'assets'), { recursive: true, force: true }, error => {
  if (error) throw error;
});
copyDirectory (curFolder,copyFolder);

const w = createWriteStream(
  join(__dirname, '/project-dist', 'style.css'),(error) => {
    if (error) return console.error(error);
  },
);

readdir(join(__dirname, 'styles'), { withFileTypes: true }, (error, files) => {
  if (error) throw error;

  for(let file of files){
    const cur = join(__dirname, 'styles',file.name);
    if (file.isFile()) {
      if(extname(cur)==='.css'){
        let read = createReadStream(cur, 'utf8');
        read.on('error', error => {
          if (error) throw error;
        });
        read.on('data', (chunk) => {
          filesCss.push(chunk);
        });
        read.on('end', () => {
          w.write(filesCss.pop().trim());
          w.write('\n\n');
        });
      }
    }
  }
}); 

const template = join(__dirname, 'template.html');
const indexHTML = join(__dirname, 'project-dist', 'index.html');
copyFile(template, indexHTML, (error) => {
  if (error) {
    return console.error(error);
  }
});

readFile(template, 'utf-8', (error, data) => {
  if (error) console.log(error);

  let templateData = data;
  const tags = data.match(/{{\w+}}/gm);

  for (let tag of tags) {
    const path = join(__dirname, 'components', `${tag.slice(2, -2)}.html`,
    );

    readFile(path, 'utf-8', (error, dataTag) => {
      if (error) console.error(error);

      templateData = templateData.replace(tag, dataTag);

      rm(indexHTML, { recursive: true, force: true }, (error) => {
        if (error) {
          return console.error(error);
        }
        const index = createWriteStream(indexHTML);
        index.write(templateData);
      });
    });
  }
});
function copyDirectory(directory ,directoryCopy){
  readdir(join(directory), { withFileTypes: true },(error, files) => {
    if (error) throw error;

    for(let file of files){
      const dir = join(directory, file.name);
      const dirCopy = join(directoryCopy, file.name);
      
      if (file.isDirectory()) {
        mkdir(dirCopy, { recursive: true, force: true }, error => {
          if (error) throw error;
        });
        copyDirectory(dir, dirCopy);
      }
      if (file.isFile()) {
        copyFile(dir,dirCopy, (error) => {
          if (error) throw error;
        });
      }
    }
  }
  );
}