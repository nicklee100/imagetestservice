const pixelMatch = require('pixelmatch');
const fs = require('fs');
const PNG = require('pngjs').PNG;

const amazonCompareScreenshots = (image1, image2) => {
  // fs.writeFile('images/currupt1.png', image1, 'binary', function(err){
  //   if(err) console.error(err)
  //   else console.log('writen');
  // })
  return new Promise ((resolve, reject) => {
    const doneReading = () => {
      if(++filesRead < 2) return;

      const diff = new PNG({width: img1.width, height: img1.height})
      const numDiffPixels = pixelMatch(img1.data,img2.data,diff.data, img1.width, img1.height, {threshold:0.3});
      diff.pack().pipe(fs.createWriteStream('awsdiff.png'));
      console.log(numDiffPixels);
      resolve()
    }
    const img1 = new PNG().parse(image1,doneReading)
    const img2 = new PNG().parse(image2,doneReading)
    let filesRead = 0;
  })
}

const amazonCompareScreenshotsToBase64 = (image1, image2) => {
  // fs.writeFile('images/currupt1.png', image1, 'binary', function(err){
  //   if(err) console.error(err)
  //   else console.log('writen');
  // })
  return new Promise ((resolve, reject) => {
    const doneReading = () => {
      if(++filesRead < 2) return;

      const diff = new PNG({width: img1.width, height: img1.height})
      const numDiffPixels = pixelMatch(img1.data,img2.data,diff.data, img1.width, img1.height, {threshold:0.3});

      diff.pack()
      var chunks = [];
      diff.on('data', function(chunk) {
        chunks.push(chunk);
        console.log('chunk:', chunk.length);
        });
      diff.on('end', function() {
           var result = Buffer.concat(chunks);
           console.log('final result:', result.length);
             fs.writeFile('diffresult.png', result, 'binary', function(err){
               if(err) console.error(err)
               else console.log('writen');
             })
           resolve(result)
        });


    }
    const img1 = new PNG().parse(image1,doneReading)
    const img2 = new PNG().parse(image2,doneReading)
    let filesRead = 0;
  })
}

module.exports = amazonCompareScreenshotsToBase64
