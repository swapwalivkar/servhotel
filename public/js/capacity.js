$(document).ready(function() {
	
	var clusterSummary;
	var dashSumary;
	var baseurl = document.location.host;
	
	$( "#cluster-select" ).change(function() {
		
		  var selectedCluster =  $('#cluster-select').val();
		  // Ajax call for the cluster
		  $.ajax({
		        // url: "http://localhost:8080/dash/clustersummary?cluster=" +
				// selectedCluster
		        url: "https://" + baseurl + "/dash/clustersummary?cluster=" + selectedCluster
		    }).then(function(data) {
		    	// Keep the values here
		    	clusterSummary = data;
		    	console.log("Cluster Summary");
		    });
		  
		  $.ajax({
		       // url: "http://localhost:8080/dash/dashboard_cluster?cluster="
				// + selectedCluster
		        url: "https://" + baseurl + "/dash/dashboard_cluster?cluster=" + selectedCluster
		    }).then(function(data) {
		    	// Keep the values here
		    	dashSumary = data;
		    	console.log("Cluster Summary");
		    });
		});
	
	$( "#calculate" ).click(function() {
	       console.log(" Calculating the values :" );
	       var hdfsCap = clusterSummary.hdfsCap;
	       var yarnMem = clusterSummary.yarnMem;
	       var hdfsPeak = dashSumary.hdfspeak;
	       var yarnPeak = dashSumary.yarnmempeak;
	       var hdfsCapRem = (hdfsCap - hdfsPeak);
	       var yarnMemRem = (yarnMem - yarnPeak);
	       var hdfsCapReq = $("#hdfs_cap_req").val();
	       var yarnMemReq = $("#yarn_mem_req").val();
	       var hdfsCap20 = hdfsCapReq * 0.20;
	       var with20 = eval(hdfsCap20) + eval(hdfsCapReq);

	       if (eval(hdfsCapRem) > (eval(hdfsCapReq) + eval((hdfsCapReq * 0.20)))) {
	               $("#hdfs_result").html("<div class='alert alert-success'> Required HDFS capacity is avaliable</div>");


	} else {
	$("#hdfs_result").html("<div class='alert alert-danger'> Required HDFS capacity is NOT avaliable</div>");
	}
	$("#hdfs_total").html(hdfsCap);
	$("#yarn_total").html(yarnMem);
	$("#hdfs_peak").html(hdfsPeak);
	$("#yarn_peak").html(yarnPeak);
	$("#hdfs_required").html(hdfsCapReq);
	$("#yarn_required").html(yarnMemReq);
	console.log("Setting values");
	if (eval(yarnMemRem) >= eval(yarnMemReq)) {
	$("#yarn_result").html("<div class='alert alert-success'> Required YARN capacity is avaliable</div>");
	} else {
	$("#yarn_result").html("<div class='alert alert-danger'> Required YARN capacity is NOT avaliable</div>");
	}

	$("#results_div").hide().fadeIn('fast');

	});
	
	
    $.ajax({
        url: "http://localhost:8080/dash/server"
    }).then(function(data) {
      console.log(data);
      _.templateSettings.variable = "rc";
      var template = _.template(
              $( "script#option_template" ).html()
          );
      
      $.each(data, function(i, templateData) {
    	  var templateData1 = JSON.stringify(templateData);
    	  console.log("templateData1");
    	  console.log(templateData1);
    	  console.log($("#cluster-select"));
    	  $("#cluster-select").append(
                  template( templateData )
              );
    	});
    });
    
});