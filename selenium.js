require("chromedriver");
const fs = require("fs");
const webdriver = require("selenium-webdriver");
const {By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const {checkWindow, uploadBaseline}  = require("./index.js")


async function sendRawScreenshot(driver){
  return new Promise(async(resolve, reject)=>{
    try {
      await driver.get("https://www.uml.edu/student-life");

      const image = await driver.takeScreenshot()

      const data = { picture: image }
      const raw = {'name':'nick'}
      //send screenshot here

      resolve("Student");
    }
    catch(error){
      console.error(error)
      reject(error)
    }
  })
}

async function takeBaseLine(){
  const driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build()

    try {
      await driver.get("https://www.uml.edu/student-life/");
      const myUML = await driver.findElement(By.xpath('//*[@id="form"]/header/div/div[2]/nav/ul/li[4]'))
      //await myUML.click()
      //await search.sendKeys("Umass Lowell Student")
      const image = await driver.takeScreenshot()

      const metaData = {
        os:'MacOSX.10.12',
        browser: 'chrome',
        url: 'uml.student.life',
        snapshotname:'initial.png',
        resolution:'900x1200'
      };

      const buffer = new Buffer(image, 'base64');
      // fs.writeFile('./umlstudentlife.png', buffer, 'binary', (err, data) => {
      //     if(err){console.log('error', err)}
      //     else {
      //       console.log("written")
      //     }
      // })
      uploadBaseline(buffer,metaData)

    } catch (error) {
      console.log(error)
    } finally {
      await driver.quit()
    }
}

async function runTest(){
  const driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build()

    try {
      await driver.get("https://www.uml.edu/student-life/");
      const myUML = await driver.findElement(By.xpath('//*[@id="form"]/header/div/div[2]/nav/ul/li[4]'))
      //await myUML.click()
      let image = await driver.takeScreenshot()
      const metaData = {
        os:'MacOSX.10.12',
        browser: 'chrome',
        url: 'uml.student.life',
        snapshotname:'clickedMyUML.png',
        resolution:'900x1200'
      };

    image = new Buffer(image, 'base64');
    checkWindow(image,metaData)
    } catch (error){
      console.log(error)
    } finally {
      await driver.quit()
    }
}




//runTest()
// uploadBaseline('asbl3ij2', {browser: 'chrome', os:'MacOSX.14.12', url: 'uml.student.life',snapshotname:'initialsnapshot', resolution:'900x1200'})

async function baseLineExample(){
  const driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build()

    try {
      await driver.get("https://www.uml.edu/student-life/");
      const search = await driver.findElement(By.xpath('//*[@id="form"]/header/div/div[2]/nav/ul/li[5]'))
      await search.click()
      //await search.sendKeys("Umass Lowell Student")
      const image = await driver.takeScreenshot()

      const metaData = {
        os:'Linux',
        browser: 'chrome',
        url: 'uml.student.life',
        snapshotname:'initial.png',
        resolution:'900x1200'
      };

      const buffer = new Buffer(image, 'base64');
      uploadBaseline(buffer,metaData)

    } catch (error) {
      console.log(error)
    } finally {
      await driver.quit()
    }
}

async function runTestExample(){
  const driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build()

    try {
      await driver.get("https://www.uml.edu/student-life/");
      const search = await driver.findElement(By.xpath('//*[@id="form"]/header/div/div[2]/nav/ul/li[5]'))
      await search.click()
      const input = await driver.findElement(By.xpath('//*[@id="form"]/header/div/div[2]/nav/ul/li[5]/uml-search-popout/div/div/div/div/div/div[2]/div/label/div[2]/input'))
      await input.sendKeys("Physics")

      let image = await driver.takeScreenshot()
      const metaData = {
        os:'Linux',
        browser: 'chrome',
        url: 'uml.student.life',
        snapshotname:'initial.png',
        resolution:'900x1200'
      };

    image = new Buffer(image, 'base64');
    checkWindow(image,metaData)
    } catch (error){
      console.log(error)
    } finally {
      await driver.quit()
    }
}



//baseLineExample()
runTestExample()
