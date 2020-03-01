$(document).ready(function() {
	
	console.log("document.location.host : " + document.location.host);
	var baseurl = document.location.host;
	var clusterData;
	var numClusters;
	var groupSelected = "type";
	
	$( "#groupings" ).change(function() {
		  
		  groupSelected =  $('#groupings').val();
		  console.log("Selected cluster grouping : " + groupSelected);
		  createPod(clusterData, groupSelected);
	});
	

	$('#getcsv').click(function() {
		JSONToCSVConvertor(clusterData, "Big Data Report", true);
	});
	
	//Look for Group by and arrange
	
	//By default arrange by cluster types
	

	$.ajax({
		// url: "http://localhost:8080/dash/dashboard"
		url : "https://" + baseurl + "/dash/dashboard"
	}).then(function(data) {
		clusterData = data;
		createPod(data, groupSelected);
		
	});
	
	$.ajax({
		// url: "http://localhost:8080/dash/dashboard"
		url : "https://" + baseurl + "/dash/dashboard"
	}).then(function(data) {
		numClusters = data;
		console.log(numClusters);
		$("#numClusters").html(numClusters);
		
	});

});

function createPod (data, groupSelected) {
	$("#clusters").empty();
	console.log(data);
	console.log(groupSelected);
	_.templateSettings.variable = "rc";
	var template = _.template($("script.template").html());
	var headTemplate = _.template($("script.header_template").html());
	clusterData = data;
	var groupedData; 
	if(groupSelected === 'type') {
		console.log("groupSelected " + "type");
		groupedData = _.groupBy(data, function(d){return d.type});
	} else if (groupSelected === 'version') {
		groupedData = _.groupBy(data, function(d){return d.hdpversion});
	} else {
		
	}
	
	console.log(groupedData);
	
	$.each(groupedData, function(i, tempData) {
		console.log(i);
		console.log(tempData);
		var size = tempData.length;
		var id = groupSelected + "_" + i;
		var id = id.replace(/\./g,"_");		
		//create a map for the 
		var groups = {groupId: id, groupName: i, numClusters:size};
		//console.log(groups);
		
		$("#clusters").append(headTemplate(groups));
		
	
	$.each(tempData, function(i, templateData) {

		var templateData1 = JSON.stringify(templateData);
		console.log($("#" + id).html());

		$("#" + id).append(template(templateData));
		
	}); 
	
	$("#" + id).append("</div>");
	});
	
	// Use for each here

}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
	console.log("Starting with getting the json file here");
	
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}