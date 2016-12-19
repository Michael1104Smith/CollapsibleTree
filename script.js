function unflatten(arr) {
  var tree1 = [],
      mappedArr = {},
      arrElem,
      mappedElem; 

  // First map the nodes of the array to an object -> create a hash table.
  for(var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id]['children'] = [];
  }


  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      // If the element is not at the root level, add it to its parent array of children.
      if (mappedElem.parentid) {
        mappedArr[mappedElem['parentid']]['children'].push(mappedElem);
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree1.push(mappedElem);
      }
    }
  }
  return tree1;
} 

function BenchMarkInit(){

	var _ExtensionName = 'CollapsibleTree';

	var jsFiles = [];
    jsFiles.push('Extensions/' + _ExtensionName + '/d3.v3.min.js');
    // jsFiles.push('Extensions/' + _ExtensionName + '/js/CollapsibleTree.js');

    for (var i = 0; i < jsFiles.length; i++) {

    	var url = Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only' + '&name=' + jsFiles[i];

    	Qva.LoadScript(url,function(){
    		Qva.AddExtension("CollapsibleTree",function(){

			    var _LoadUrl = Qva.Remote + '?public=only' + '&name=';

			    // Define one or more styles sheets to be used within the extension
			    var cssFiles = [];
			    cssFiles.push('Extensions/' + _ExtensionName + '/CollapsibleTree.css');
			    for (var i = 0; i < cssFiles.length; i++) {
			    	var url = Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only' + '&name=' + cssFiles[i];
			    	Qva.LoadCSS(url);
			    }

				var html = '';
				html += '<div id="graph"></div>';
			    this.Element.innerHTML = html;

				var margin = {top: 20, right: 120, bottom: 20, left: 120},
				    width = 800 - margin.right - margin.left,
				    height = 600 - margin.top - margin.bottom;

				var i = 0,
				    duration = 750,
				    root;

				var tree = d3.layout.tree()
				    .size([height, width]);

				var diagonal = d3.svg.diagonal()
				    .projection(function(d) { return [d.y, d.x]; });
			    var svg = d3.select("#graph").append("svg")
				    .attr("width", width + margin.right + margin.left)
				    .attr("height", height + margin.top + margin.bottom)
				  	.append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				var linksStr = this.Layout.Text1.text;
				var linksArr = linksStr.split(/\s+/);
				var nodesStr = this.Layout.Text2.text;
				var nodesArr = nodesStr.split(/\s+/);

				var arr = [];
				var flagArr = [];
				var i;

				for(i = 0; i < nodesArr.length; i++){
					flagArr.push(false);
				}

				for(i = 0; i < linksArr.length; i++){
					var idArr = linksArr[i].split(',');
					flagArr[parseInt(idArr[1])-1] = true;
				}

				for(i = 0; i < nodesArr.length; i++){
					if(flagArr[i] == false){
						var nodeArr = nodesArr[i].split(',');
						var objTmp = {'id':nodeArr[0], 'parentid':0, 'Name':nodeArr[1], 'Gender':nodeArr[2], 'Salary':nodeArr[3]};
						arr.push(objTmp);
					}
				}

				for(i = 0; i < linksArr.length; i++){
					var idArr = linksArr[i].split(',');
					var nodeArr = nodesArr[idArr[1]-1].split(',');
					var objTmp = {'id':idArr[1], 'parentid':idArr[0], 'Name':nodeArr[1], 'Gender':nodeArr[2], 'Salary':nodeArr[3]};
					arr.push(objTmp);
				}
				tree1 = unflatten(arr);

				var flare = tree1[0];

				  root = flare;
				  root.x0 = height / 2;
				  root.y0 = 0;

				  function collapse(d) {
				    if (d.children) {
				      d._children = d.children;
				      d._children.forEach(collapse);
				      d.children = null;
				    }
				  }

				  root.children.forEach(collapse);
				  update(root);

				 d3.select(self.frameElement).style("height", "800px");

				function update(source) {

				  // Compute the new tree layout.
				  var nodes = tree.nodes(root).reverse(),
				      links = tree.links(nodes);

				  // Normalize for fixed-depth.
				  nodes.forEach(function(d) { d.y = d.depth * 180; });

				  // Update the nodes…
				  var node = svg.selectAll("g.node")
				      .data(nodes, function(d) { return d.id || (d.id = ++i); });

				  // Enter any new nodes at the parent's previous position.
				  var nodeEnter = node.enter().append("g")
				      .attr("class", "node")
				      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
				      .on("click", click);

				  nodeEnter.append("circle")
				      .attr("r", 1e-6)
				      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

				  nodeEnter.append("text")
				      .attr("x", function(d) { return d.children || d._children ? 0 : 0; })
				      .attr("dy", "2em")
				      .attr("text-anchor", function(d) { return d.children || d._children ? "middle" : "middle"; })
				      .text(function(d) { return d.Name; })
				      .style("fill-opacity", 1e-6);

				  // Transition nodes to their new position.
				  var nodeUpdate = node.transition()
				      .duration(duration)
				      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

				  nodeUpdate.select("circle")
				      .attr("r", 4.5)
				      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

				  nodeUpdate.select("text")
				      .style("fill-opacity", 1);

				  // Transition exiting nodes to the parent's new position.
				  var nodeExit = node.exit().transition()
				      .duration(duration)
				      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
				      .remove();

				  nodeExit.select("circle")
				      .attr("r", 1e-6);

				  nodeExit.select("text")
				      .style("fill-opacity", 1e-6);

				  // Update the links…
				  var link = svg.selectAll("path.link")
				      .data(links, function(d) { return d.target.id; });

				  // Enter any new links at the parent's previous position.
				  link.enter().insert("path", "g")
				      .attr("class", "link")
				      .attr("d", function(d) {
				        var o = {x: source.x0, y: source.y0};
				        return diagonal({source: o, target: o});
				      });

				  // Transition links to their new position.
				  link.transition()
				      .duration(duration)
				      .attr("d", diagonal);

				  // Transition exiting nodes to the parent's new position.
				  link.exit().transition()
				      .duration(duration)
				      .attr("d", function(d) {
				        var o = {x: source.x, y: source.y};
				        return diagonal({source: o, target: o});
				      })
				      .remove();

				  // Stash the old positions for transition.
				  nodes.forEach(function(d) {
				    d.x0 = d.x;
				    d.y0 = d.y;
				  });
				}

				// Toggle children on click.
				function click(d) {
				  if (d.children) {
				    d._children = d.children;
				    d.children = null;
				  } else {
				    d.children = d._children;
				    d._children = null;
				  }
				  update(d);
				}
			});
    	});
    }
}
BenchMarkInit();