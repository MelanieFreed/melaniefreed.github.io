
/////////////////////////////////////////////////////////////////////  
// PROJECTS OBJECT
///////////////////////////////////////////////////////////////////// 
var Projects = function(PageMasterHandle,AboutPageHandle,browser)
{

   // Save browser info
   this.browser=browser;

   // Define Project Data
   this.defineProjects();

   // Properties
   this.fontSize=AboutPageHandle.fontSize-2;
   this.xoffset=0;
   this.yoffset=PageMasterHandle.height;
   this.width=document.documentElement.clientWidth; 
   this.height=document.documentElement.clientHeight-this.yoffset; 

   this.headerHeight=this.fontSize*(this.getNlines()+2);

   this.forceWidth=this.width;
   this.forceHeight=this.height-this.headerHeight;
   this.forceXoffset=0;
   this.forceYoffset=this.headerHeight;

   // Create Scale for Circle Size
   this.minNodeRadius=20;
   this.maxNodeRadius=60;
   this.createScale();

   // All paper images were made to be 300x300 pix
   this.imageSize=300; 

   // Status
   this.created=false;
   this.attached=false;

} // Projects

Projects.prototype = {

   //-------------------------------------------------------------------
   // Define information about projects
   //-------------------------------------------------------------------
   defineProjects: function(){

      this.Projects=[];
      this.Projects[0]={year: 2015, preview: "images/projects/PedestriansVsCars.png", 
                      website: "http://bl.ocks.org/MelanieFreed/raw/de8486bcc4755778098f/",
                      info: "An interactive exploration of pedestrian injuries and fatalities in New York City due to motor vehicle collisions. (2015)"};

      this.Projects[1]={year: 2015, preview: "images/projects/PredictingServices.png", 
                      website: "http://bl.ocks.org/MelanieFreed/raw/df87f34ecd3337d17fef/",
                      info: "Results of predicting health services accessed by women using a support vector machine. (2015)"};

      this.Nnodes=this.Projects.length;


      // Subject keywords for projects
      // 0: 

      this.links=[];
      this.links.push({"source":0, "target":1, "value":1});

   }, // .defineProjects



   //-------------------------------------------------------------------
   // Calculate number of lines in text
   //-------------------------------------------------------------------
   getNlines: function(){

      // Append container for paper text
      var thishandle=this;

      var hold=d3.select("body").append("svg")
                                .attr("width","0px") 
                                .attr("height","0px")
                                .append("text")
                                .attr("class","test")
                                .attr("style","font-size: "+thishandle.fontSize+"px; line-height: 1.0")
                                .attr("visibility","hidden");

      var Nlines=this.Projects.map(function(d){
                                      hold.text(d.info);
                                      return Math.ceil(hold.node().getBBox().width/(thishandle.width-thishandle.fontSize*2)); 
                                   }).reduce(function(a,b){if (a > b) return a; else return b;}); 

      // Remove temporary element
      hold.remove();

      return Nlines;

   }, // .getLines



   //-------------------------------------------------------------------
   // Create size scale for circles
   //-------------------------------------------------------------------
   createScale: function(){

      // Goal: Occupy about 25% of screen area
      var goalArea=0.25*this.forceHeight*this.forceWidth;

      // Define Scale
      var minr=this.minNodeRadius,maxr=this.minNodeRadius;
      this.rScale=d3.scale.sqrt()
                          .range([minr,maxr])
                          .domain([1998,2015]);

      // Calculate total area occupied
      var thishandle=this;
      var actualArea=this.Projects.map(function(p){return Math.PI*Math.pow(thishandle.rScale(p.year),2);})
                                  .reduce(function(a,b){return a+b;});

      // Adjust until you meet goal area
      while ((actualArea < goalArea) & (maxr < this.maxNodeRadius))
      {
         maxr++;
         thishandle.rScale.range([minr,maxr]);
         actualArea=thishandle.Projects.map(function(p){return Math.PI*Math.pow(thishandle.rScale(p.year),2);})
                                       .reduce(function(a,b){return a+b;});
      }

   }, // .createScale


   //-------------------------------------------------------------------
   // Create Page
   //-------------------------------------------------------------------
   createPage: function(){

      // Create SVG
      this.svg=d3.select("body").append("svg")
                 .attr("class","projects")
                 .attr("id","svg_projects")
                 .attr("width",this.width)
                 .attr("height",this.height)
                 .attr("style","position:absolute; top:"+this.yoffset+"px; left:"+this.xoffset+"px; "+
                               "font-size: "+this.fontSize+"px; line-height: 1.0");

      // Append container for project text
      this.svg.append("foreignObject")
              .attr("class","projects annotation")
              .attr("width",this.width-this.fontSize*2+"px")
              .attr("height",this.headerHeight+"px")
              .attr("x",this.fontSize+"px")
              .attr("y",this.fontSize+"px")
              .append("xhtml:body")
              .append("xhtml:div");

      // Create force layout
      origin={x: this.forceWidth/2+this.forceXoffset, y: this.forceHeight/2+this.forceYoffset};
      var kfactor=Math.sqrt(this.Nnodes/(this.forceWidth*this.forceHeight));
      var nodes=this.Projects, links=this.links;
      this.force=d3.layout.force()
                   .size([this.forceWidth,this.forceHeight])
                   .nodes(nodes) 
                   .links(links)
                   .linkDistance(function(d){return (d.source.r+d.target.r)*2*(1+(1/d.value));})
                   .charge(-30/kfactor) 
                   .gravity(100*kfactor) 
                   .on("tick",tick)
                   .start();

      // Create images
      this.ims=this.svg.selectAll("defs")
                       .data(this.Projects)
                       .enter()
                       .append("defs")
                       .append("pattern")
                       .attr("id",function(d,i){return "im"+i;})
                       .attr("x","0").attr("y","0").attr("height","1").attr("width","1")
                       .attr("viewBox","0 0 "+this.imageSize+" "+this.imageSize)
                       .append("image")
                       .attr("x","0px").attr("y","0px").attr("width",this.imageSize).attr("height",this.imageSize)
                       .attr("xlink:href",function(d){return d.preview});

      // Add links
      var link=this.svg.selectAll(".projects.link")
                       .data(links)
                       .enter()
                       .append("line")
                       .attr("class",function(d){return "projects link "+d.id;});

      // Add additional information to nodes
      var thishandle=this;
      for (var ii=0;ii<this.Projects.length;ii++)
      {
        this.Projects[ii].id=ii;
        this.Projects[ii].x=origin.x+Math.random()*5;
        this.Projects[ii].y=origin.y+Math.random()*5;
        this.Projects[ii].r=thishandle.rScale(thishandle.Projects[ii].year);
      }

      // Add nodes
      var node=this.svg.selectAll(".projects.node")
                       .data(nodes)
                       .enter()
                       .append("g")
                       .attr("class",function(d){return "g projects node "+d.id;})
                       .attr("id",function(d){return d.id;})
                       .call(thishandle.force.drag);

      var Tadd=1500;
      node.append("a")
          .attr("xlink:href",function(d){return d.website;})
          .attr("target","_blank")
          .append("circle")
          .attr("class","circle projects node")
          .attr("id",function(d){return "circle_projects_node_"+d.id;})
          .attr("r",1)
          .style("fill",function(d){return "url(#im"+d.id+")";})
          .transition()
          .duration(Tadd)
          .attr("r",function(d){return d.r;});

      var thishandle=this;
      d3.selectAll(".g.projects.node")
        .on("mouseover",function(d){
           // Show info
           thishandle.svg.selectAll(".projects.annotation")
                     .html(d.info);
           // Jump circle to front
           if (this.browser != "IE") this.parentNode.appendChild(this);
           // Make all other circles fade
           thishandle.svg.selectAll(".projects.node.circle")
                     .style("opacity",function(c){
                        if (c.id==d.id) return "1.0"; else return "0.1";
                     });
           // Make all lines fade
           thishandle.svg.selectAll(".projects.link")
                     .style("opacity","0.1");
        })
        .on("mouseout",function(d){
           // Remove info
           thishandle.svg.selectAll(".projects.annotation")
                     .html("");
           // Unfade circles
           thishandle.svg.selectAll(".projects.node.circle")
                     .style("opacity","1.0");
           // Unfade lines
           thishandle.svg.selectAll(".projects.link")
                     .style("opacity","1.0");

        });

      this.force.start();
   

      // Control evolution of force layout
      function tick() 
      {
         node.attr("transform",function(d){
            // Made sure nodes don't go outside viewable bounding box
            var xpos=Math.max(d.r+thishandle.forceXoffset,Math.min(thishandle.forceXoffset+thishandle.forceWidth-d.r,d.x)),
                ypos=Math.max(d.r+thishandle.forceYoffset,Math.min(thishandle.forceYoffset+thishandle.forceHeight-d.r,d.y));

            // Make sure lines know where to go
            d.x=xpos;
            d.y=ypos;

            return "translate("+xpos+","+ypos+")";
         });

         // Adjust lines
         link.attr("x1",function(d){return d.source.x;})
             .attr("y1",function(d){return d.source.y;})
             .attr("x2",function(d){return d.target.x;})
             .attr("y2",function(d){return d.target.y;});

      }

   
      // Update status
      this.created=true;
      this.attached=true;

   }, // .createPage



   //-------------------------------------------------------------------
   // Adjust to window resize
   //-------------------------------------------------------------------
   adjustPage: function(PageMasterHandle,AboutPageHandle){

      // Stop force layout
      this.force.stop();

      // Adjust properties
      this.fontSize=AboutPageHandle.fontSize-2;
      this.xoffset=0;
      this.yoffset=PageMasterHandle.height;
      this.width=document.documentElement.clientWidth; 
      this.height=document.documentElement.clientHeight-this.yoffset; 

      this.headerHeight=this.fontSize*(this.getNlines()+2);

      this.forceWidth=this.width;
      this.forceHeight=this.height-this.headerHeight;
      this.forceXoffset=0;
      this.forceYoffset=this.headerHeight;

      this.createScale();

      // Adjust elements
      this.svg.attr("width",this.width)
              .attr("height",this.height)
              .attr("style","position:absolute; top:"+this.yoffset+"px; left:"+this.xoffset+"px; "+
                               "font-size: "+this.fontSize+"px; line-height: 1.0");

      d3.selectAll(".projects.annotation")
              .attr("width",this.width-this.fontSize*2)
              .attr("height",this.headerHeight)
              .attr("x",this.fontSize)
              .attr("y",this.fontSize);

      // Update nodes
      var thishandle=this;
      for (var ii=0;ii<this.Projects.length;ii++)
      {
        thishandle.Projects[ii].r=thishandle.rScale(thishandle.Projects[ii].year);
      }
      var nodes=this.Projects, links=this.links;
      origin={x: this.forceWidth/2+this.forceXoffset, y: this.forceHeight/2+this.forceYoffset};
      var kfactor=Math.sqrt(this.Nnodes/(this.forceWidth*this.forceHeight));
      this.force.size([this.forceWidth,this.forceHeight])
                .nodes(nodes) 
                .links(links)
                .linkDistance(function(d){return (d.source.r+d.target.r)*2*(1+(1/d.value));})
                .charge(-30/kfactor) 
                .gravity(100*kfactor) 
                .on("tick",tick);

      // Control evolution of force layout
      var thishandle=this,
          node=this.svg.selectAll(".g.projects.node"),
          link=this.svg.selectAll(".projects.link");
      this.svg.selectAll(".circle.projects.node").attr("r",function(d){return d.r});
      function tick() 
      {
         node.attr("transform",function(d){
            // Made sure nodes don't go outside viewable bounding box
            var xpos=Math.max(d.r+thishandle.forceXoffset,Math.min(thishandle.forceXoffset+thishandle.forceWidth-d.r,d.x)),
                ypos=Math.max(d.r+thishandle.forceYoffset,Math.min(thishandle.forceYoffset+thishandle.forceHeight-d.r,d.y));

            // Make sure lines know where to go
            d.x=xpos;
            d.y=ypos;

            return "translate("+xpos+","+ypos+")";
         });

         // Adjust lines
         link.attr("x1",function(d){return d.source.x;})
             .attr("y1",function(d){return d.source.y;})
             .attr("x2",function(d){return d.target.x;})
             .attr("y2",function(d){return d.target.y;});
      }

      // Restart force layout
      this.force.resume();

   }, // .adjustPage


   //-------------------------------------------------------------------
   // Attach
   //-------------------------------------------------------------------
   reattach: function(){

      if (!this.attached)
      {
         document.body.appendChild(this.svgHandle);

         this.attached=true;
      }

   }, // .reattach



   //-------------------------------------------------------------------
   // Detach
   //-------------------------------------------------------------------
   detach: function(deferred){

      if (this.attached)
      {
         // Detach after transition completes
         var svg=document.getElementById("svg_projects");
         this.svgHandle=svg.parentNode.removeChild(svg);

         deferred.resolve();

         this.attached=false;
      } else deferred.resolve();
      
   } // .detach


}; // Projects.prototype

