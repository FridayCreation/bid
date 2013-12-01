var fs = require('fs');
var hat = require('hat');

exports.uploader = function(req, res, next) {
	
	console.log(req);
  var file = fs.createWriteStream( 'uploads/' + hat() + '.tmpfile');
  var fileSize = req.headers['content-length'];
  var uploadedSize = 0;
 
  req.on('data', function (chunk) {
    uploadedSize += chunk.length;
    uploadProgress = (uploadedSize/fileSize) * 100;
    res.write(Math.round(uploadProgress) + "%" + " uploaded\n" );
    var bufferStore = file.write(chunk);
    if(bufferStore == false)
      req.pause();
  })
 
  file.on('drain', function() {
    req.resume();
  })
 
  req.on('end', function() {
    res.status(200).send('Upload done!');
    res.end();
  })
	
	return next();
	
}