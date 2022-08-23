var https = require("https");
const apiURL = `codequiz.azurewebsites.net`;
var searchText = process.argv.slice(2);

const options = {
  hostname: apiURL,
  method: "GET",
  headers: {
    Cookie: "hasCookie=true",
  },
};

const HTMLPartToTextPart = (HTMLPart) =>
  HTMLPart.toString().replace(/<[^>]+>/g, "/");

https
  .get(options, (res) => {
    let data = [];
    let answer = "";
    const headerDate =
      res.headers && res.headers.date ? res.headers.date : "no response date";
    console.log("Status Code:", res.statusCode);
    console.log("Date in Response header:", headerDate);
    res.on("data", (chunk) => {
      data.push(chunk);
    });

    res.on("end", () => {
      var cleanedDataArray = [];
      const stringHtml = HTMLPartToTextPart(data);
      const dataArray = stringHtml.split("/");
      dataArray.map((item) => {
        if (item !== "" && item !== " ") {
          cleanedDataArray.push(item);
        }
      });
      const indexOfChange = cleanedDataArray.indexOf("Change");
      // Delete Others Until First Data
      cleanedDataArray.splice(0, indexOfChange + 1);
      answer = cleanedDataArray.findIndex((item) => {
        if(item.toLocaleLowerCase().includes(searchText[0].toLocaleLowerCase())){
          return item
        }
      });

      if(answer === undefined || answer === -1){
        console.log('\n',`Your search "${searchText[0]}" did not match any items.`,'\n');
      }else{
        console.log('\n','Answer >>> ' +cleanedDataArray[answer] + ': '+ cleanedDataArray[answer+1],'\n');
      }

    });
  })
  .on("error", (err) => {
    console.log("Error: ", err.message);
  });
