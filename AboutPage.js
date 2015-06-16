
/////////////////////////////////////////////////////////////////////  
// ABOUT PAGE OBJECT
///////////////////////////////////////////////////////////////////// 
var AboutPage = function(PageMasterHandle,TreeDrawingHandle)
{
   // Properties
   this.xoffset=0;
   this.yoffset=PageMasterHandle.height;
   this.maxWidth=500; // Max width of text on page
   this.Margin=PageMasterHandle.sep; // Align with menu in PageMaster
   this.fontSize=Math.round(PageMasterHandle.actualFontSize*0.8);
   this.imageSize=this.fontSize*1.20;

   // Tree Properties
   this.Ntrees=TreeDrawingHandle.Ntrees;
   this.Nleaves=TreeDrawingHandle.Ntrees*TreeDrawingHandle.Param.Nleaves;

   // Status
   this.created=false;
   this.attached=false;

} // AboutPage

AboutPage.prototype = {

   //-------------------------------------------------------------------
   // Create Page
   //-------------------------------------------------------------------
   createPage: function(){

      // Create base group
      this.width=document.documentElement.clientWidth-this.xoffset; 
      if (this.width > this.maxWidth) this.width=this.maxWidth;
      this.height=document.documentElement.clientHeight-this.yoffset;

      // Create container
      this.group=d3.select("body").append("g")
                   .attr("class","about")
                   .attr("id","g_about")
                   .attr("style","position:absolute; top:"+this.yoffset+"px; left:"+this.xoffset+"px; "+
                                 "width: "+this.width+"px; "+
                                 "font-size: "+this.fontSize+"px");

      // Add text
      this.text1="I am currently an Associate Research Scientist at the New York University School of Medicine, where I use medical imaging data to improve cancer detection and treatment.  I have also worked as a consultant supporting business operations at Freed Engineering and in research positions working with medical and astronomical data at a university in South America, the U.S. Food and Drug Administration, the University of Arizona, NASA, and the National Institutes of Health. <br><br>"+
                      "I am interested in extracting insights from data to tackle practical problems and I enjoy creating products and tools that have real impact. <br><br>"+
                      "<div style=\"line-height: 200%;\">Find me on <br>"+
                      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href=\"https://www.linkedin.com/in/melaniefreed\" target=\"_blank\"><img src=\"images/logos/LinkedInLogo_2C_21px_R.png\" alt=\"LinkedIn\" height=\"";
      this.text2="px\"></a><br>"+
                      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href=\"https://twitter.com/MelanieFreedNYC\" target=\"_blank\"><img src=\"images/logos/Twitter_logo_blue_sm.png\" alt=\"Twitter\" height=\"";
      this.text3="px\">@MelanieFreedNYC</a><br>"+
                      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href=\"https://github.com/MelanieFreed\" target=\"_blank\"><img src=\"images/logos/GitHub_Logo_sm.png\" alt=\"GitHub\" height=\"";
      this.text4="px\"></a></div><br>"+
                      "This website is hosted on GitHub and takes advantage of Google Fonts.  The design on the home page is a squashed <a href=\"http://en.wikipedia.org/wiki/Logarithmic_spiral\" target=\"_blank\">logarithmic spiral</a> forest of <a href=\"http://en.wikipedia.org/wiki/Pythagoras_tree_%28fractal%29\" target=\"_blank\">Pythagoras trees</a>.  There are ";

      this.text5=" trees with a total of ";
      this.text6=" leaves.  To keep the design responsive with so many elements, pure JavaScript was used to manipulate a canvas and the number of orders used to draw the trees was adjusted based on the window size and the number of trees drawn.  Note: Interactivity is currently only available for Chrome.  <br><br>  The Projects and Papers sections of this website show some of my work.  Projects have been completed using business-friendly technology (JavaScript, d3.js, Python).  Papers are academic research publications that discuss work completed using primarily IDL, C++, scientific computing clusters, Matlab, and LaTeX.  <br><br>  Both sections are presented as a force-directed graph layout with preview images as the nodes.  The link distance indicates how closely related two nodes are by subject matter and the node size is scaled by year of completion.  <br><br>  Hover over nodes for more information and click to reach the corresponding project or paper.";
      this.group.append("p")
                .attr("class","about text")
                .attr("style","margin: "+this.Margin+"px "+this.Margin+"px "+this.Margin+"px "+this.Margin+"px;") 
                .html(this.text1+this.imageSize+this.text2+this.imageSize+this.text3+Math.round(this.imageSize*1.4)+this.text4+this.Ntrees+this.text5+this.Nleaves+this.text6);

      this.created=true;
      this.attached=true;

   }, // .createPage

   //-------------------------------------------------------------------
   // Adjust to window resize
   //-------------------------------------------------------------------
   adjustPage: function(PageMasterHandle,TreeDrawingHandle){

      // Adjust properties
      this.yoffset=PageMasterHandle.height;
      this.Margin=PageMasterHandle.sep; // Align with menu in PageMaster
      this.fontSize=Math.round(PageMasterHandle.actualFontSize*0.8);
      this.imageSize=this.fontSize*1.20;

      this.Ntrees=TreeDrawingHandle.Ntrees;
      this.Nleaves=TreeDrawingHandle.Ntrees*TreeDrawingHandle.Param.Nleaves;

      // Adjust base group
      this.width=document.documentElement.clientWidth-this.xoffset; 
      if (this.width > this.maxWidth) this.width=this.maxWidth;
      this.height=document.documentElement.clientHeight-this.yoffset;

      this.group.attr("style","position:absolute; top:"+this.yoffset+"px; left:"+this.xoffset+"px; "+
                              "width: "+this.width+"px; "+
                              "font-size: "+this.fontSize+"px")

      // Adjust text margins
      this.group.selectAll(".about.text")
                .attr("style","margin: "+this.Margin+"px "+this.Margin+"px "+this.Margin+"px "+this.Margin+"px;")
                .html(this.text1+this.imageSize+this.text2+this.imageSize+this.text3+(this.imageSize*1.5)+this.text4+this.Ntrees+this.text5+this.Nleaves+this.text6);
                

   }, // .adjustPage


   //-------------------------------------------------------------------
   // Attach
   //-------------------------------------------------------------------
   reattach: function(){

      if (!this.attached)
      {
         document.body.appendChild(this.ggHandle);

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
         var gg=document.getElementById("g_about");
         this.ggHandle=gg.parentNode.removeChild(gg);

         deferred.resolve();

         this.attached=false;
      } else deferred.resolve();
      
   } // .detach



}; // AboutPage.prototype

