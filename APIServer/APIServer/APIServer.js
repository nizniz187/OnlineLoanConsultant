const Http = require("http");
const FS = require("fs");
const QS = require("querystring");

const hostname = "127.0.0.1";
const port = "1234";
const DefaultQid = "1";

const server = Http.createServer((req, resp)=>{
	console.log("A request has been received.");
	
	console.log("Parsing Request Data");
	let postData = "", params = null;
	req.addListener("data", (postDataChunk)=>postData += postDataChunk);
	req.addListener("end", ()=>params = QS.parse(postData));

	console.log("Page Reading..." + req.url);
	let fileStream = null;
	if(req.url == "/GetQuestion"){
		FS.readFile("Questions.json", "utf-8", (err, data) => {
			if(err){
				resp.writeHead(999, {"Content-Type": "text/html"});
				console.log(err);
				return resp.end("<h1>Unexpected Error</h1>");
			}

			data = JSON.parse(data);
			let qid = params && params.qid ? params.qid : DefaultQid;
			let result = data.find((q)=>{ return q.id == qid; });

			resp.setHeader("Access-Control-Allow-Origin", "*");
			resp.writeHead(200, {"Content-Type": "application/json"});
			resp.write(JSON.stringify(result));
			resp.end();
		});
	}else{
		resp.writeHead(404, {"Content-Type": "text/html"});
		return resp.end("<h1>Page Not Found</h1>");
	}
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

function getQuestionById(data, qid) {
	if(!data || !qid) { return null; }
	
}