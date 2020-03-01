$(document).ready(function() {
	 var selectedCluster = window.location.search.substring(1);
	 console.log(" Query " + selectedCluster);
	var baseurl = document.location.host;
	var projects;
	var services;
	var components;
	var hosts;
	$.ajax({
		// url: "http://localhost:8080/dash/dashboard"
		url : "https://" + baseurl + "/dash/clusterHosts?cluster=" + selectedCluster
	}).then(function(data) {
		hosts = data;
		console.log(projects);
	});
	
	$.ajax({
		// url: "http://localhost:8080/dash/dashboard"
		url : "https://" + baseurl + "/dash/clusterServices?cluster=" + selectedCluster
	}).then(function(data) {
		services = data;
		console.log(services);
	});
	
	$.ajax({
		// url: "http://localhost:8080/dash/dashboard"
		url : "https://" + baseurl + "/dash/clusterComponents?cluster=" + selectedCluster
		
	}).then(function(data) {
		components = data;
		console.log(components);
		
	});
	
	$.ajax({
		// url: "http://localhost:8080/dash/dashboard"
		url : "https://" + baseurl + "/dash/clusterProjects?cluster=" + selectedCluster
	}).then(function(data) {
		projects = data;
		console.log(components);
		
	});
	
	
});

