let express = require('express');
let app = express();
let bodyParse = require('body-parser');
let archiver = require('archiver');
let fs = require('fs');

let urlencodedParser = bodyParse.urlencoded({ extended: false });
let jsonParser = bodyParse.json();
let venv_win = fs.readFileSync('./server/venv_win.zip')
let fileArray = {};
app.use(express.static('public'));
app.enable('trust proxy');
app.listen(8000, function() {
  console.log('Listening on port 8000...');
});

app.route('/download')
  .post(jsonParser, function(request, response) {
    // receive a json file, download zip file
    urlMap = request.body;
    purifyUrl(urlMap);
    try {
      verifyUrl(urlMap);
    } catch (e) {
      response.sendStatus(400);
    }
    //generate zipfiles for windows:
    let zipFile = archiver('zip');
    let fileName = (Math.floor(Date.now() * Math.random())).toString();

    zipFile.append(JSON.stringify(urlMap), { name: 'urls.json' });
    zipFile.append(venv_win, { name: 'venv_win.zip' });
    zipFile.file('./server/unzip.exe', { name: 'unzip.exe' });
    zipFile.file('./server/util.dat', { name: 'util.dat' });
    zipFile.file('./server/RunMe.cmd', { name: 'RunMe.cmd' }).finalize();
    fileArray[fileName] = zipFile;
    //redirect to download the file
    response.send(fileName);
  });

app.route('/file/:fileName').get(function(request, response) {
  let fileName = request.params.fileName;
  console.log("User downloading: " + fileName);
  response.set({
    'Content-Type': 'application/zip',
    'Content-disposition': 'attachment; filename=' + fileName + '.zip'
  });
  fileArray[fileName].pipe(response);
  fileArray[fileName].on('finish', function() {
    fileArray[fileName] = null;
    delete fileArray[fileName];
  });
})


function verifyUrl(urlMap) {
  let validationReg = /^(http|https)\:\/\/www\.youtube\.com/;
  urlMap.forEach(url => {
    if (!validationReg.exec(url)) throw new Error('Invalid Youtube url!');
  });
  if (urlMap.length <= 0) throw new Error('No url is provided!')
}

function purifyUrl(urlMap) {
  for (let i = 0; i < urlMap.length; i++) {
    if (!urlMap[i]) {
      urlMap.slice(0, i).concat(urlMap.slice(i + 1));
    }
  }
}
