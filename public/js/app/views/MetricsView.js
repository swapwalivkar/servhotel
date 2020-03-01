define([ 'jquery', 'underscore', 'backbone', 'd3', 'd3pie','jqueryui',
		'app/models/HDFSCapColl', 'text!templates/MetricsTmpl.html' ], function($, _,
		Backbone, d3, d3pie, jqueryui, HDFSCapColl, MetricsTmpl) {

	var HomeView = Backbone.View.extend({
		el : $(".container-fluid"),
		template : _.template(MetricsTmpl),
		clusterList : null,
		option_tmpl : "<option value='<%= cluster_name %>'><%= cluster_name_dashboard %></option>",
		hostRowTemplate : '<tr><td style="border-top: 0px;"><div><%= name %> </div></td> <td><div><%= activedate %></div></td></tr>',
		compRowTemplate : '<tr><td style="border-top: 0px;"><div><%= hostname %> </div></td> <td><div><%= componentname %></div></td><td><div><%= activedate %></div></td></tr>',
		servRowTemplate : '<tr><td style="border-top: 0px;"><div><%= servicename %> </div></td><td><div><%= activedate %></div></td></tr>',
		itemCount : -1,
		pageId : "",
		model : "",
		acitivity : "",
		initialize : function(options) {
			var self = this;
			this.collection = new HDFSCapColl();
			this.router = options.router;
			this.render();
		},
		render : function() {
			console.log(this.$el);
			this.$el.html(this.template());
			//Get HDFS capacity data
			this.clusterList = new Backbone.Collection({});
			this.clusterList.url = '/dash/clusters';
			self = this;
			this.clusterList.fetch({
				add : true,
				success : function() {
					self.populateCluster();
				}
			});
			//The cluster should be based on the selection
		},
		populateCluster : function() {
			var self = this;
			var optionTemplateSrc = this.$el.find("#option_template").html();
			this.clusterList.forEach(function(model) {
				var html = _.template(self.option_tmpl, model.attributes);
				self.$el.find("#clusters").append(html);
			});
		},
		createHDFSlineChart: function() {
			var labels = [];
			var usedData = [];
			var c_total_minus_10 = [];
			var totalData = [];
			self = this;
			this.hdfsMetrics.forEach(function(model) {
				console.log(model.get("clusterName"));
				$("#metrics_hdfs_bar").empty();
				labels.push(model.get("timerecorded"));
				usedData.push(Math.round((model.get("used1")* 0.0009765625) * 100) / 100);
				c_total_minus_10.push(Math.round((model.get("freespace90") * 0.0009765625) * 100) / 100);
				totalData.push(Math.round((model.get("totalspace") * 0.0009765625) * 100) / 100);
				console.log((model.get("hdfsUsedSpace") * 0.0009765625));
			});
			
			var clusterData = {"datasets": [{ fill: false,borderColor: "rgba(75,192,192,1)","label":"Used Space" ,"pointStrokeColor":"#fff", "data":usedData},{fill: false,borderColor: "#e17000","pointStrokeColor":"#fff", "label":"Free Space(90%)" ,"data":c_total_minus_10},{ fill: false,borderColor: "#58a021","label":"Total Space" ,"pointStrokeColor":"#fff", "data":totalData}],"labels":labels};
			
			var in_data = JSON.stringify(clusterData);
			require(['js/libs/Chart.js'], function(chartjs){
				console.log(clusterData);
				console.log(in_data);
				var ctx = $("#hdfs_line").get(0).getContext("2d");
				var hdfsLine = new Chart(ctx, {
				    type: 'line',
				    data: clusterData,
				    options: {scaleBeginAtZero:true, animation: false}
				});
				})
		},
		
		createYARNMemlineChart: function(clusterData) {
			//var clusterName = "HDP01";
			var labels = [];
			var maxAllocated = [];
			var avgAllocated = [];
			var totalAllocation = [];
			self = this;
			this.yarnMemMetrics.forEach(function(model) {
				console.log(model.get("clusterName"));
				$("#metrics_hdfs_bar").empty();
				labels.push(model.get("c_timestamp"));
				maxAllocated.push(model.get("c_max_allocatedmb") * 0.0009765625);
				avgAllocated.push(model.get("c_avg_allocatedmb") * 0.0009765625);
				totalAllocation.push(model.get("c_total") * 0.0009765625);
				console.log(model.get("hdfsUsedSpace"));
			});
			
			var clusterData = {"datasets": [{ fill: false,borderColor: "rgba(75,192,192,1)","label":"Max Alo (GB)" ,"pointStrokeColor":"#fff", "data":maxAllocated},{fill: false,borderColor: "#e17000","pointStrokeColor":"#fff", "label":"Avg Alo (GB)" ,"data":avgAllocated},{ fill: false,borderColor: "#58a021","label":"Total Alo (GB)" ,"pointStrokeColor":"#fff", "data":totalAllocation}],"labels":labels};

			var in_data = JSON.stringify(clusterData);
			require(['js/libs/Chart.js'], function(chartjs){
				console.log(clusterData);
				console.log(in_data);
				var ctx1 = $("#yarn_mem_line").get(0).getContext("2d");
				var yarn_mem_line = new Chart(ctx1, {
				    type: 'line',
				    data: clusterData,
				    options: {scaleBeginAtZero:true, animation: false}
				});
				})
		},
		
		createYARNConlineChart: function(clusterData) {
			//var clusterName = "HDP01";
			var labels = [];
			var avgAllocated = [];
			var maxPending = [];
			var avgPending = [];
			self = this;
			this.yarnConMetrics.forEach(function(model) {
				console.log(model.get("clusterName"));
				$("#metrics_hdfs_bar").empty();
				labels.push(model.get("c_timestamp"));
				avgAllocated.push(model.get("c_avg_allocatedcontainers"));
				maxPending.push(model.get("c_max_pendingcontainers"));
				avgPending.push(model.get("c_avg_pendingcontainers"));
				console.log(model.get("hdfsUsedSpace"));
			});
			
			var clusterData = {"datasets": [{ fill: false,borderColor: "rgba(75,192,192,1)","label":"Avg Allocated" ,"pointStrokeColor":"#fff", "data":avgAllocated},{fill: false,borderColor: "#e17000","pointStrokeColor":"#fff", "label":"Max Pending" ,"data":maxPending},{ fill: false,borderColor: "#58a021","label":"Avg Pending" ,"pointStrokeColor":"#fff", "data":avgPending}],"labels":labels};
			
			var in_data = JSON.stringify(clusterData);
			require(['js/libs/Chart.js'], function(chartjs){
				console.log(clusterData);
				console.log(in_data);
				//var ctx2 = $("#yarn_con_line");
				var ctx2 = $("#yarn_con_line").get(0).getContext("2d");
				var yarn_con_line = new Chart(ctx2, {
				    type: 'line',
				    data: clusterData,
				    options: {scaleBeginAtZero:true, animation: false, maintainAspectRatio: true, responsive: true}
				});
				})
		},
		
		events : {
			'change #clusters' : 'selectCluster',
			'click #active_tabs li' : 'toggleTabContent',
		},
		selectCluster : function(event) {
			console.log(" Cluster is selected ");
			this.selectedCluster = $('#clusters option:selected').text();
			console.log(this.selectedCluster);
			this.hdfsMetrics = new Backbone.Collection({});
			this.hdfsMetrics.url = '/dash/cluster_hdfs_Metrics?cluster=' + this.selectedCluster;
			self = this;
			this.hdfsMetrics.fetch({
				add : true,
				success : function() {
					self.createHDFSlineChart();
				}
			});
			
			this.yarnMemMetrics = new Backbone.Collection({});
			this.yarnMemMetrics.url = '/dash/cluster_yarn_mem_Metrics?cluster=' + this.selectedCluster;
			self = this;
			this.yarnMemMetrics.fetch({
				add : true,
				success : function() {
					self.createYARNMemlineChart();
					console.log("Got the data");
				}
			});
			
			this.yarnConMetrics = new Backbone.Collection({});
			this.yarnConMetrics.url = '/dash/cluster_yarn_con_Metrics?cluster=' + this.selectedCluster;
			self = this;
			this.yarnConMetrics.fetch({
				add : true,
				success : function() {
					self.createYARNConlineChart();
					console.log("Got the data");
				}
			});
			
			//Populate hosts
			this.clusterHosts = new Backbone.Collection({});
			this.clusterHosts.url = '/dash/cluster_hosts?cluster=' + this.selectedCluster;
			self = this;
			this.clusterHosts.fetch({
				add : true,
				success : function() {
					self.addClusterHosts();
					console.log("Got the data");
				}
			});
			
			//Populate Services
			this.clusterServices = new Backbone.Collection({});
			this.clusterServices.url = '/dash/cluster_services?cluster=' + this.selectedCluster;
			self = this;
			this.clusterServices.fetch({
				add : true,
				success : function() {
					self.addClusterServices();
					console.log("Got the data");
				}
			});
			
			this.clusterHostComp = new Backbone.Collection({});
			this.clusterHostComp.url = '/dash/cluster_host_services?cluster=' + this.selectedCluster;
			self = this;
			this.clusterHostComp.fetch({
				add : true,
				success : function() {
					self.addHostComp();
					console.log("Got the data");
				}
			});
			
			
			$("#metrics").show();
			
		},
		addClusterHosts : function(event) {
			var self = this;
			this.clusterHosts.forEach(function(model) {
				var template = _.template(self.hostRowTemplate, {
					name : model.attributes.name,
					activedate : model.attributes.activedate
				});
				$("#tbodyhosts").append(template);
			});
		},
		addClusterServices:function(event) {
			var self = this;
			this.clusterHostComp.forEach(function(model) {
				var template = _.template(self.servRowTemplate, {
					servicename : model.attributes.servicename,
					activedate : model.attributes.activedate
				});
				$("#tbodyhostserv").append(template);
			});
		},
		addHostComp : function(event) {
			var self = this;
			this.clusterServices.forEach(function(model) {
				var template = _.template(self.servRowTemplate, {
					hostname : model.attributes.hostname,
					componentname : model.attributes.componentname,
					activedate : model.attributes.activedate
				});
				$("#tbodyserv").append(template);
			});
		},
		
		toggleTabContent : function(event) {
			/*console.log("toggleTabContent");
			event.preventDefault();
			$(event.target).parent().addClass("active");
			$(event.target).parent().siblings().removeClass("active");
			var tab = $(event.target).attr("dum");*/
			
			

			// Switching the tabs
			event.preventDefault();
			$(event.target).parent().addClass("active");
			$(event.target).parent().siblings().removeClass("active");
			var tab = $(event.target).attr("dum");
			var remtab =  tab;
			var tes = '#' + tab;
			$(".tab-pane").not(remtab).removeClass("active");
			$(".tab-pane").not(remtab).hide();
			$(tes).show();
			$(tes).addClass("active");
			//Check the tab
			console.log("The tab is : " + tab);
			
		
			
		},
		populateClusters : function() {
			
			//What all data is needed here 
			//1) Host details with all metrics for the host
			//2) Yarn memory and container details 
			//4) Metrics can be more dynamic where in user can select what type of metrics are needed
			//3) HDFS details 
			//4) Any 3 party details
			var self = this;
			console.log(this.activityList);
			this.clusterList = new Backbone.Collection({url: '/clusters',});
			this.clusterList.url = '/dash/clusters';
			self = this;
			this.clusterList.fetch({
				add : true,
				success : function() {
					self.createDashBoard();
				}
			});
			
			this.activityList.forEach(function(model) {
				var template = _.template(optionTmpl, {
					cluster_name : model.attributes.cluster_name,
					value : model.attributes.value
				});
				$("#main-activity").append(template);
			});
		},
		close : function() {
			console.log("Is this closed here");
			this.unbind();
			// this.remove();
		}

	});
	return HomeView;
});
