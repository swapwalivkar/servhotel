$(document).ready(function() {
	 var selectedCluster = window.location.search.substring(1);
	 console.log(" Query " + selectedCluster);
		var baseurl = document.location.host;
	 
	 //Host metrics for cluster
	  $.ajax({
	       // url: "http://localhost:8080/dash/cluster_hostcpu_Metrics?" + selectedCluster
	        url: "https://" + baseurl + "/dash/cluster_hostcpu_Metrics?cluster=" + selectedCluster
	    }).then(function(data) {
	    	//Keep the values here
	    	clusterSummary = data;
	    	console.log("Cluster Summary");
	    	$("#metrics_head").html(data[0].displayClusterName + " Metrics");
	    	
	    	//var clusterName = "HDP01";
	    	var labels = [];
	    	var peakCPU = [];
	    	var avgCPU = [];
	    	self = this;
	    	data.forEach(function(model) {
	    		console.log(model.displayClusterName);
	    		//$("#metrics_hdfs_bar").empty();
	    		labels.push(model.metricsDate);
	    		peakCPU.push(model.hostCPUPeak);
	    		avgCPU.push(model.hostCPUAvg);
	    		console.log(model.hdfsUsedSpace);
	    	});
	    	

	    	var clusterData = {"datasets": [{ fill: false,borderColor: "rgba(75,192,192,1)","label":"Avg CPU" ,"pointStrokeColor":"#fff", "data":avgCPU},{fill: false,borderColor: "#e17000","pointStrokeColor":"#fff", "label":"Peak CPU" ,"data":peakCPU}],"labels":labels};

	    	var in_data = JSON.stringify(clusterData);
	    		console.log(clusterData);
	    		console.log(in_data);
	    		var ctx1 = $("#cpu_line").get(0).getContext("2d");
	    		var yarn_mem_line = new Chart(ctx1, {
	    		    type: 'line',
	    		    data: clusterData,
	    		    options: {scaleBeginAtZero:true, animation: false}
	    		});
	    });
	  
	  
	//HDFS metrics for cluster
	  $.ajax({
	       // url: "http://localhost:8080/dash/cluster_hdfs_Metrics?" + selectedCluster
	        url: "https://" + baseurl + "/dash/cluster_hdfs_Metrics?cluster=" + selectedCluster
	    }).then(function(data) {
	    	//Keep the values here
	    	clusterSummary = data;
	    	var labels = [];
	    	var usedData = [];
	    	var peakUsed = [];
	    	var totalData = [];
	    	self = this;
	    	data.forEach(function(model) {
	    		console.log(model.displayClusterName);
	    		//$("#metrics_hdfs_bar").empty();
	    		labels.push(model.metricsDate);
	    		usedData.push(model.hdfsAvg);
	    		peakUsed.push(model.hdfsPeak);
	    		totalData.push(model.hdfsTotal);
	    		console.log(model.hdfsAvg);
	    	});
	    	
	    	var clusterData = {"datasets": [{ fill: false,borderColor: "rgba(75,192,192,1)","label":"Avg Used Space" ,"pointStrokeColor":"#fff", "data":usedData},{fill: false,borderColor: "#e17000","pointStrokeColor":"#fff", "label":"Peak Used Space" ,"data":peakUsed},{ fill: false,borderColor: "#58a021","label":"Total Space" ,"pointStrokeColor":"#fff", "data":totalData}],"labels":labels};
	    	
	    	var in_data = JSON.stringify(clusterData);
	    		console.log(clusterData);
	    		console.log(in_data);
	    		var ctx = $("#hdfs_line").get(0).getContext("2d");
	    		var hdfsLine = new Chart(ctx, {
	    		    type: 'line',
	    		    data: clusterData,
	    		    options: {scaleBeginAtZero:true, animation: false}
	    		});
	    });
	  
	//YARN metrics for cluster
	  $.ajax({
	       // url: "http://localhost:8080/dash/cluster_yarn_mem_Metrics?" + selectedCluster
	       url: "https://" + baseurl + "/dash/cluster_yarn_mem_Metrics?cluster=" + selectedCluster
	    }).then(function(data) {
	    	//Keep the values here
	    	console.log("Yarn Data");
	    	console.log(data);
	    	var labels = [];
	    	var maxAllocated = [];
	    	var avgAllocated = [];
	    	var totalAllocation = [];
	    	self = this;
	    	data.forEach(function(model) {
	    		console.log(model.displayClusterName);
	    	//	$("#metrics_hdfs_bar").empty();
	    		labels.push(model.metricsDate);
	    		maxAllocated.push(model.yarnMemPeak);
	    		avgAllocated.push(model.yarnMemAvg);
	    		totalAllocation.push(model.yarnMemTotal);
	    	});
	    	
	    	var clusterData = {"datasets": [{ fill: false,borderColor: "rgba(75,192,192,1)","label":"Avg Alo (GB)" ,"pointStrokeColor":"#fff", "data":avgAllocated},{fill: false,borderColor: "#e17000","pointStrokeColor":"#fff", "label":"Peak Alo (GB)" ,"data":maxAllocated},{ fill: false,borderColor: "#58a021","label":"Total Mem (GB)" ,"pointStrokeColor":"#fff", "data":totalAllocation}],"labels":labels};

	    	var in_data = JSON.stringify(clusterData);
	    	//require(['js/libs/Chart.js'], function(chartjs){
	    		console.log(clusterData);
	    		console.log(in_data);
	    		//var ctx1 = $("#yarn_mem_line").get(0).getContext("2d");
	    		var ctx1 = document.getElementById("yarn_mem_line");
	    		var yarn_mem_line = new Chart(ctx1, {
	    		    type: 'line',
	    		    data: clusterData,
	    		    options: {scaleBeginAtZero:true, animation: false}
	    		});
	    		
	    });	  
	  
	  //Function to convert a json to csv
	  //Needs to be seen how this would be invoked
	  
});

