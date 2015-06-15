
/////////////////////////////////////////////////////////////////////  
// PAGE MASTER OBJECT
// Creates the basic template for the website (menus, etc)
// And controls menu behavior
///////////////////////////////////////////////////////////////////// 
var PageMaster = function()
{

   this.x=0; // Absolute x position of menu in page
   this.y=0; // Absolute y position of menu in page
   this.width=document.documentElement.clientWidth; // Width of menu
   this.height=document.documentElement.clientHeight/10.0; // Height of menu
   this.basecolormain={r:235, g:235, b:235};
   this.basecolorsub={r:155, g:155, b:155};
   this.hovercolor={r:155, g:255, b:155}; // Color of menu text on hover

   // holder for text bounding box size
   this.maxFontSize=20;
   this.actualFontSize=this.maxFontSize; // Adjust this later
   this.nameFontFactor=1.2; // How much bigger you want name than menu headers
   this.bbox_home=new Array(this.maxFontSize+2).join('0').split('').map(parseFloat);
   this.bbox_about=new Array(this.maxFontSize+2).join('0').split('').map(parseFloat);
   this.bbox_projects=new Array(this.maxFontSize+2).join('0').split('').map(parseFloat);
   this.bbox_papers=new Array(this.maxFontSize+2).join('0').split('').map(parseFloat);
   this.bbox_name=new Array(this.maxFontSize+2).join('0').split('').map(parseFloat);

   // Add menu to page
   this.addMenu();

} // PageMaster

PageMaster.prototype = {

   //-------------------------------------------------------------------
   // Add empty menu to page
   //-------------------------------------------------------------------
   addMenu: function(){

      // Create Blank Menu SVG 
      this.svg=d3.select("body")
                 .append("svg")
                 .attr("id","svg_menu")
                 .attr("width",this.width)
                 .attr("style","position:absolute; top:"+this.x+"px; left:"+this.y+"px;");

      // Add all text and rects with opacity=0 
      var bcolor=d3.rgb(this.basecolorsub.r,this.basecolorsub.g,this.basecolorsub.b),
          hcolor=d3.rgb(this.hovercolor.r,this.hovercolor.g,this.hovercolor.b);

      this.text_home=this.svg.append("text")
                             .attr("class","menu text home")
                             .attr("text-anchor","start")
                             .attr("fill",bcolor)
                             .text("Home")
                             .attr("opacity",0.0);
      this.text_about=this.svg.append("text")
                              .attr("class","menu text about")
                              .attr("text-anchor","start")
                              .attr("fill",bcolor)
                              .text("About")
                              .attr("opacity",0.0);
      this.text_projects=this.svg.append("text")
                                 .attr("class","menu text projects")
                                 .attr("text-anchor","start")
                                 .attr("fill",bcolor)
                                 .text("Projects")
                                 .attr("opacity",0.0);
      this.text_papers=this.svg.append("text")
                               .attr("class","menu text papers")
                               .attr("text-anchor","start")
                               .attr("fill",bcolor)
                               .text("Papers")
                               .attr("opacity",0.0);

      this.rect_home=this.svg.append("rect").attr("class","menu button home").attr("opacity","0.0")
                                            .on("mouseover",function(){d3.selectAll(".menu.text.home").style("fill",hcolor);}) 
                                            .on("mouseleave",function(){d3.selectAll(".menu.text.home").style("fill",bcolor);});
      this.rect_about=this.svg.append("rect").attr("class","menu button about").attr("opacity","0.0")
                                            .on("mouseover",function(){d3.selectAll(".menu.text.about").style("fill",hcolor);}) 
                                            .on("mouseleave",function(){d3.selectAll(".menu.text.about").style("fill",bcolor);});
      this.rect_projects=this.svg.append("rect").attr("class","menu button projects").attr("opacity","0.0")
                                            .on("mouseover",function(){d3.selectAll(".menu.text.projects").style("fill",hcolor);}) 
                                            .on("mouseleave",function(){d3.selectAll(".menu.text.projects").style("fill",bcolor);});
      this.rect_papers=this.svg.append("rect").attr("class","menu button papers").attr("opacity","0.0")
                                            .on("mouseover",function(){d3.selectAll(".menu.text.papers").style("fill",hcolor);}) 
                                            .on("mouseleave",function(){d3.selectAll(".menu.text.papers").style("fill",bcolor);});

      // Add name with opacity = 0.0
      var bcolormain=d3.rgb(this.basecolormain.r,this.basecolormain.g,this.basecolormain.b);
      this.text_name=this.svg.append("text")
                             .attr("class","menu text name")
                             .style("fill",bcolormain)
                             .style("font-weight","bold")
                             .attr("text-anchor","start")
                             .attr("opacity",0.0)
                             .text("Melanie Freed");

      // Calculate bounding box sizes for all font sizes and store for future use
      // (This was necessary to avoid some strange behavior with getBBox on window resize)
      for (var fsize=this.maxFontSize;fsize>=0;fsize--) 
      {
         this.text_home.style("font-size",fsize+"px");
         this.text_about.style("font-size",fsize+"px");
         this.text_projects.style("font-size",fsize+"px");
         this.text_papers.style("font-size",fsize+"px");
         this.text_name.style("font-size",Math.round(fsize*this.nameFontFactor)+"px");

         box_home=this.text_home.node().getBBox();
         box_about=this.text_about.node().getBBox();
         box_projects=this.text_projects.node().getBBox();
         box_papers=this.text_papers.node().getBBox();
         box_name=this.text_name.node().getBBox();

         this.bbox_home[fsize]={width:box_home.width, height:box_home.height};
         this.bbox_about[fsize]={width:box_about.width, height:box_about.height};
         this.bbox_projects[fsize]={width:box_projects.width, height:box_projects.height};
         this.bbox_papers[fsize]={width:box_papers.width, height:box_papers.height};
         this.bbox_name[fsize]={width:box_name.width, height:box_name.height};
      }

      this.adjustMenu();

   }, // .addMenu

   //-------------------------------------------------------------------
   // Adjust font-size and separation of menu items
   //-------------------------------------------------------------------
   adjustMenu: function(){

      // Check if window has changed
      this.width=document.documentElement.clientWidth; // Width of menu

      // Adjust rect size
      this.svg.attr("width",this.width);

      // Adjust font size
      var fsize=this.maxFontSize, 
          height_all=this.bbox_home[fsize].height;
      this.sep=this.bbox_home[fsize].width/2.0;
      var width_all=this.bbox_home[fsize].width + this.bbox_about[fsize].width + 
                    this.bbox_projects[fsize].width + this.bbox_papers[fsize].width + this.sep*5;
      while (width_all > this.width)      
      {
         fsize--;

          height_all=this.bbox_home[fsize].height;
          this.sep=this.bbox_home[fsize].width/2.0;
          width_all=this.bbox_home[fsize].width + this.bbox_about[fsize].width + 
                    this.bbox_projects[fsize].width + this.bbox_papers[fsize].width + this.sep*5;
      }

 
      // Add name
      var xtext=this.sep,ytext=Math.round(this.bbox_name[fsize].height*3/2);
      this.text_name.attr("x",xtext).attr("y",ytext).attr("opacity",1.0).style("font-size",fsize*this.nameFontFactor+"px"); 

      // Add menu items
      ytext=ytext+Math.round(this.bbox_name[fsize].height/2)+Math.round(this.bbox_home[fsize].height);
      this.text_home.attr("x",xtext).attr("y",ytext).attr("opacity",1.0).style("font-size",fsize+"px");
      hold=this.text_home.node().getBBox();
      this.rect_home.attr("x",hold.x).attr("y",hold.y)
                    .attr("width",Math.ceil(this.bbox_home[fsize].width*1.1)).attr("height",this.bbox_home[fsize].height); 

      xtext=xtext+this.bbox_home[fsize].width+this.sep;
      this.text_about.attr("x",xtext).attr("y",ytext).attr("opacity",1.0).style("font-size",fsize+"px");
      hold=this.text_about.node().getBBox();
      this.rect_about.attr("x",hold.x).attr("y",hold.y)
                     .attr("width",Math.ceil(this.bbox_about[fsize].width*1.1)).attr("height",this.bbox_about[fsize].height);

      xtext=xtext+this.bbox_about[fsize].width+this.sep;
      this.text_projects.attr("x",xtext).attr("y",ytext).attr("opacity",1.0).style("font-size",fsize+"px");
      hold=this.text_projects.node().getBBox();
      this.rect_projects.attr("x",hold.x).attr("y",hold.y)
                        .attr("width",Math.ceil(this.bbox_projects[fsize].width*1.1)).attr("height",this.bbox_projects[fsize].height);

      xtext=xtext+this.bbox_projects[fsize].width+this.sep;
      this.text_papers.attr("x",xtext).attr("y",ytext).attr("opacity",1.0).style("font-size",fsize+"px");
      hold=this.text_papers.node().getBBox();
      this.rect_papers.attr("x",hold.x).attr("y",hold.y)
                      .attr("width",Math.ceil(this.bbox_papers[fsize].width*1.1)).attr("height",this.bbox_papers[fsize].height);

      // Set background rect height
      this.height=Math.round(ytext+this.bbox_home[fsize].height/2);
      this.svg.attr("height",this.height);      

      this.actualFontSize=fsize;

   } // .adjustMenu
}; // PageMaster.prototype

