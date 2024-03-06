function waitforme(millisec) { 
    return new Promise(resolve => { 
        setTimeout(() => { resolve('') }, millisec); 
    }) 
} 
  
async function check(requestURL, link) {
	var res = "пум-пум-пу~у~ум";
	let secs = 0;
    while (res != "Completed Data Refresh") {
        await waitforme(1000); 
        
        sendr(requestURL).then(function(value){
        	res = value['value'][0]['LastStatus'];
        })
        secs++;
        console.log("current status: "+res);

        if (res.includes('Data Refresh failed')) {
		    break;
		} 
    } 
    console.log("check finished!");

    // var status = "";
    // var iconpath = "";
    // if res == "Completed Data Refresh" {
    // 	status = "Панель успешно обновлена!";
    // 	iconpath = '1.png';
    // } else {
    // 	status = "Панель не обновлена!";
    // 	iconpath = '1.png';
    // }

	chrome.notifications.create({
	    type: 'basic',
	    iconUrl: "1.png",//iconpath,
	    title: link.split("/")[link.split("/").length - 1],
	    message: secs.toString() + res,//status,
	    priority: 2
	}) 
} 
  
function sendr(url){
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url)
		xhr.onload = () => {
			if (xhr.status >= 400) {
				reject(JSON.parse(xhr.response))
			} else {
				resolve(JSON.parse(xhr.response))
			}
		}
		xhr.onerror = () => {
			reject(xhr.response)
		}
		xhr.send()
	})
}

function logURL(requestDetails) { 
    //console.log(`request: ${requestDetails.url}`);
    if (requestDetails.url.includes("/Model.Execute")) {
		
		chrome.notifications.create({
	    type: 'basic',
	    iconUrl: "1.png",//iconpath,
	    title: "PBI",
	    message: "Обновление панели началось!",//status,
	    priority: 2
		}) 

		chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
		    let name = tabs[0].url.split("listcaching_pbi")[1].split("?")[0];
		    path = "path='"+name+"'";
			var requestURL = "http://SV-PowerBi-loc/reports/api/v2.0/PowerBIReports(" + path + ")/CacheRefreshPlans"
			//alert(path);
			check(requestURL,  decodeURIComponent(name));
		});

    }  
}

chrome.webRequest.onBeforeRequest.addListener( 
    logURL, 
    { urls: ["<all_urls>"] } 
);