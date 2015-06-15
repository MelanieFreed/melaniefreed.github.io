
/////////////////////////////////////////////////////////////////////  
// TREEDRAWING
// Draws canvas with Pythagorean Trees
///////////////////////////////////////////////////////////////////// 
var TreeDrawing = function(pagetop,browser)
{
   // Set default
   this.pagetop=pagetop || 0;
   this.browser=browser;

   // Monitor status
   this.created=false;
   this.attached=false;

   // Some constants
   this.dtor=Math.PI/180.0; // To convert degrees to radians
   this.rtod=180.0/Math.PI; // To convert radians to degrees


   // Tree Properties
   this.treeProperties={
      maxNorders: 7, // Max number of orders to display
                    // = number of orders to calculate
                    // You may adjust down for display
                    // to keep things fast
      minBaseWidth: 0.5, // Smallest Tree to Draw in Pixels
      basecolor: {r:0 ,g:100 ,b:0 } // Base color of trees
   }; 


   // Properties for parameter calculations
   this.Param={
      minAlpha:1.0, // minimum alpha angle [degrees]
      maxAlpha:89.0, // maximum alpha angle [degrees]
      Nleaves:Math.pow(2,this.treeProperties.maxNorders+1)-1, // Number of leaves in tree
      width:1.0 // width of base 
   }; 
   // Calculate Parameters
   this.calcParams();


   // Set home canvas size to entire viewable area of screen
   this.canvasParams={
      x: 0,
      y: this.pagetop,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight-this.pagetop
   };
   this.createCanvas();


   // Create empty arrays to store tree coordinates so you can adjust properly later
   this.xTrees=[];
   this.yTrees=[];   
   this.wTrees=[];   
   this.bTrees=[];   
   this.Ntrees=0;      
   // Draw a forest of trees on the canvas
   this.addForest();

   
   // Anytime the mouse moves in the home, adjust the trees
   // But only in Chrome, otherwise it will be too slow
   if (this.browser == "Chrome")
   {
      var thishandle=this; // Because this will be reset to canvas inside next line of code
      this.listener_mousemove=function(event){thishandle.adjustTrees(event);}
      this.canvas.addEventListener("mousemove",thishandle.listener_mousemove);      
   }

   // Redraw canvas (use, for example, when window resizes)
   this.redrawCanvas();         

} // TreeDrawing


TreeDrawing.prototype = {
 
   //-------------------------------------------------------------------
   // Calculate leaf colors for each order
   //-------------------------------------------------------------------
   calcLeafColors: function(){
      this.leafcolors=[];
      var slope=155/(this.treeProperties.Norders+1);
      //var rint=138,gint=154,bint=91;
      var rint=this.treeProperties.basecolor.r,
          gint=this.treeProperties.basecolor.g,
          bint=this.treeProperties.basecolor.b;
      for (var ii=0;ii<=this.treeProperties.Norders;ii++)
      {
         this.leafcolors[ii]={r:Math.round(rint+ii*slope), 
                              g:Math.round(gint+ii*slope), 
                              b:Math.round(bint+ii*slope)};
      }
   }, // TreeDrawing.calcLeafColors



   //-------------------------------------------------------------------
   // Create canvas and get context
   //-------------------------------------------------------------------
   createCanvas: function(){
      this.canvas=document.body.appendChild(document.createElement("canvas"));
      this.canvas.id="canvas_tree";
      this.canvas.style.position="absolute";
      this.canvas.style.top=this.canvasParams.y+"px";
      this.canvas.style.left=this.canvasParams.x+"px";
      this.canvas.width=this.canvasParams.width;
      this.canvas.height=this.canvasParams.height;
      this.context=this.canvas.getContext("2d");

      this.created=true;
      this.attached=true;
   }, // TreeDrawing.createCanvas



   //-------------------------------------------------------------------
   // Add forest of trees
   //-------------------------------------------------------------------
   addForest: function(){

      // Figure out where to draw trees
      this.calcPoints();

      // Figure out colors
      this.calcLeafColors();

      // Draw the line
      this.drawLine();

      // Add trees
      this.addTrees();

   }, // TreeDrawing.addForest



   //-------------------------------------------------------------------
   // Calculate points where you will draw trees
   //-------------------------------------------------------------------
   calcPoints: function(){

      // Logarithmic spiral 
      // r=a*exp(b*theta)
      // x(t)=r(t)cos(t) = a*exp(b*t)*cos(t)
      // y(t)=r(t)sin(t) = a*exp(b*t)*sin(t)
      // http://bl.ocks.org/fabiovalse/dfcd8104a79aed092af1

      // Put an upper limit on width of leaf
      var adjustedwidth=this.canvasParams.width; 
      if (adjustedwidth > this.canvasParams.height*1.25) adjustedwidth=this.canvasParams.height*1.25;

      // a is confounded with b, so just fix it to 1.0
      this.aspiral=1.0; // a is confounded with b, so just fix it to 1.0
      // fix the number of turns in the spiral to fix its appearance
      this.tmaxspiral=2.60*2*Math.PI;
      // calculate beginning position of spiral
      this.x0=this.aspiral;
      this.y0=0;
      // pick where you want start of spiral to be on page
      this.xstart=adjustedwidth*3/4;
      this.ystart=this.canvasParams.height/2;
      // pick where you want end of spiral to be on page
      this.xend=adjustedwidth/6;
      this.yend=0;
      // calculate rough parameters
      this.xoff=this.xstart-this.x0;
      this.yoff=this.ystart-this.y0;
      this.yscale=1;
      this.xscale=((this.xend-this.xoff)/(this.yend-this.yoff))*Math.tan(this.tmaxspiral);
      this.bspiral=(1/this.tmaxspiral)*Math.log((this.yend-this.yoff)/(this.yscale*Math.sin(this.tmaxspiral)))

      // Calculate locations of points
      this.points=[];           
      var hold,xhold,yhold,mnx,mxx,mny,mxy;
      for (var tt=0;tt<this.tmaxspiral;tt=tt+0.1)
      {
         hold=this.aspiral*Math.exp(this.bspiral*tt);
         xhold=hold*Math.cos(tt)*this.xscale+this.xoff;
         yhold=hold*Math.sin(tt)*this.yscale+this.ystart;
         if (tt == 0) 
         {
            mnx=xhold; mxx=xhold; mny=yhold; mxy=yhold;
         }
         else
         {
            if (xhold < mnx) mnx=xhold;
            if (xhold > mxx) mxx=xhold;
            if (yhold < mny) mny=yhold;
            if (yhold > mxy) mxy=yhold;
         }
         this.points.push({x:xhold,y:yhold});
      } 
      // Adjust xscale/yscale based on size of spiral
      this.xscale=this.xscale*(adjustedwidth*3/4)/(mxx-mnx);
      this.yscale=this.yscale*(this.canvasParams.height*3/4)/(mxy-mny);

      // Recalculate points
      this.points=[];           
      var hold,xhold,yhold;
      for (var tt=0;tt<this.tmaxspiral;tt=tt+0.1)
      {
         hold=this.aspiral*Math.exp(this.bspiral*tt);
         xhold=hold*Math.cos(tt)*this.xscale+this.xoff;
         yhold=hold*Math.sin(tt)*this.yscale+this.ystart;
         this.points.push({x:xhold,y:yhold});
      } 
      // Make sure entire tree fits on screen
      this.treeProperties.maxTreeWidth=(mnx-5)/(this.treeProperties.maxNorders+1);  

      // Adjust point spacing to 1/3 width of tree = 2L
      var spc=Math.sqrt(Math.pow((this.points[this.points.length-1].x-this.points[this.points.length-2].x),2)+
              Math.pow((this.points[this.points.length-1].y-this.points[this.points.length-2].y),2));
      var tspc=0.1*(this.treeProperties.maxTreeWidth*2)/spc;

      // Recalculate points
      this.points=[];           
      var hold,xhold,yhold,mnx,mxx,mny,mxy;
      for (var tt=0;tt<this.tmaxspiral;tt=tt+tspc)
      {
         hold=this.aspiral*Math.exp(this.bspiral*tt);
         xhold=hold*Math.cos(tt)*this.xscale+this.xoff;
         yhold=hold*Math.sin(tt)*this.yscale+this.ystart;
         if (tt == 0) 
         {
            mnx=xhold; mxx=xhold; mny=yhold; mxy=yhold;
         }
         else
         {
            if (xhold < mnx) mnx=xhold;
            if (xhold > mxx) mxx=xhold;
            if (yhold < mny) mny=yhold;
            if (yhold > mxy) mxy=yhold;
         }
         this.points.push({x:xhold,y:yhold});
      } 

      // Update the number of orders so you don't slow things down too much
      this.calcNorders();

      // Update tree width
      this.treeProperties.maxTreeWidth=(mnx-5)/(this.treeProperties.Norders+1);  

      // Translate points on line to path points to draw thick line
      this.pathpoints=[];
      var wsegment=0,deltax=0,deltay=0,cang=0,sang=0;

      this.pathpoints.push({x:this.points[this.points.length-1].x,y:this.points[this.points.length-1].y});
      for (var ii=this.points.length-1;ii>0;ii--) 
      {
         // Calculate angle to next point
         deltax=this.points[ii-1].x-this.points[ii].x;
         deltay=this.points[ii-1].y-this.points[ii].y;
         cang=2*Math.PI-Math.atan2(deltay,deltax);
         sang=Math.PI/4-cang;
         if (ii == (this.points.length-1))
         {
            wsegment=this.treeProperties.maxTreeWidth/4;
            scl=Math.sqrt(Math.pow(deltax,2)+Math.pow(deltay,2))/2;
         }
         else wsegment=this.treeProperties.maxTreeWidth*(Math.sqrt(Math.pow(deltax,2)+Math.pow(deltay,2))/2)/scl/4;

         if (wsegment > this.treeProperties.minBaseWidth) 
            this.pathpoints.push({x:this.points[ii].x+(wsegment/2)*Math.cos(sang),y:this.points[ii].y+(wsegment/2)*Math.sin(sang)});
      }
      if (wsegment > this.treeProperties.minBaseWidth) this.pathpoints.push({x:this.points[0].x,y:this.points[0].y});

      for (var ii=0;ii<this.points.length-1;ii++) 
      {
         // Calculate angle to next point
         deltax=this.points[ii+1].x-this.points[ii].x;
         deltay=this.points[ii+1].y-this.points[ii].y;
         cang=2*Math.PI-Math.atan2(deltay,deltax);
         sang=Math.PI/4-cang;
         wsegment=this.treeProperties.maxTreeWidth*(Math.sqrt(Math.pow(deltax,2)+Math.pow(deltay,2))/2)/scl/4;
         if (wsegment > this.treeProperties.minBaseWidth) 
            this.pathpoints.push({x:this.points[ii].x+(wsegment/2)*Math.cos(sang),y:this.points[ii].y+(wsegment/2)*Math.sin(sang)});
      }

      // Calculate angle to next point
      ii=this.points.length-1;
      deltax=this.points[ii-1].x-this.points[ii].x;
      deltay=this.points[ii-1].y-this.points[ii].y;
      cang=2*Math.PI-Math.atan2(deltay,deltax);
      sang=Math.PI/4-cang;
      wsegment=this.treeProperties.maxTreeWidth*(Math.sqrt(Math.pow(deltax,2)+Math.pow(deltay,2))/2)/scl/4;
      if (wsegment > this.treeProperties.minBaseWidth) 
         this.pathpoints.push({x:this.points[ii].x+(wsegment/2)*Math.cos(sang),y:this.points[ii].y+(wsegment/2)*Math.sin(sang)});


   }, // TreeDrawing.calcPoints



   //-------------------------------------------------------------------
   // Calculate number of orders to display for trees
   //-------------------------------------------------------------------
   calcNorders: function(){

      // Use 4 orders for 800 trees, 7 orders for 300 trees
      // Do linear model, max 7, min 4
      var Ntrees=this.points.length;
      var slope=(7-4)/(300-800), intercept=7-slope*300;
      this.treeProperties.Norders=Math.floor(slope*Ntrees+intercept);
      if (this.treeProperties.Norders < 4) this.treeProperties.Norders=4;
      if (this.treeProperties.Norders > 7) this.treeProperties.Norders=7;

   }, // TreeDrawing.calcNorders



   //-------------------------------------------------------------------
   // Draw line on canvas from (x,y) points
   //-------------------------------------------------------------------
   drawLine: function(){
      // Draw the line

      this.context.beginPath();
      this.context.moveTo(this.pathpoints[0].x,this.pathpoints[0].y);
      for (var ii=0;ii<this.pathpoints.length;ii++) this.context.lineTo(this.pathpoints[ii].x,this.pathpoints[ii].y);
      this.context.fillStyle="rgb("+this.treeProperties.basecolor.r+","+this.treeProperties.basecolor.g+","+this.treeProperties.basecolor.b+")";
      this.context.fill();
      this.context.closePath();

   }, // TreeDrawing.drawLine



   //-------------------------------------------------------------------
   // Display trees
   //-------------------------------------------------------------------
   addTrees: function(){

      // Add Pythagoras trees
      var dx,dy,xTree,yTree,wTree,thTree,scl;
      for (var ii=this.points.length-1;ii>0;ii--)
      {
         dx=this.points[ii].x-this.points[ii-1].x;
         dy=this.points[ii].y-this.points[ii-1].y;
         xTree=this.points[ii].x+dx/2;
         yTree=this.points[ii].y+dy/2;
         if (ii == (this.points.length-1))
         {
            wTree=this.treeProperties.maxTreeWidth;
            scl=Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))/2;
         }
         else wTree=this.treeProperties.maxTreeWidth*(Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))/2)/scl;

         // Only draw trees if they're not too small
         // This will help make things more responsive
         if (wTree >= this.treeProperties.minBaseWidth)
         { 
            thTree=Math.atan(dy/dx);
            xTree=xTree-dx/2;
            yTree=yTree-dy/2;
            if (dx < 0) thTree=thTree+Math.PI;
            // Alternate side of curves that tree appears on
            if (ii % 2 == 0) 
            {
               xTree=xTree+dx/2;
               yTree=yTree+dy/2;
               thTree=thTree+Math.PI;
            } 

            // Add tree
            this.addTree(ii,xTree,yTree,wTree,thTree,45*this.dtor);
         
            // Save tree coordinates (even ones you don't draw)
            this.xTrees[this.Ntrees]=xTree;
            this.yTrees[this.Ntrees]=yTree;   
            this.wTrees[this.Ntrees]=wTree;   
            this.bTrees[this.Ntrees]=thTree;   
            this.Ntrees++;      
         }
      }

   }, // TreeDrawing.addTrees



   //-------------------------------------------------------------------
   // Calculate parameters for trees
   //-------------------------------------------------------------------
   calcParams: function(){
      // Initalize Array of Values You Want to Calculate
      this.treeParams=new Array(this.Param.maxAlpha-this.Param.minAlpha+2).join('0').split('').map(parseFloat);

      // Fill it 
      for (var ii=this.Param.minAlpha;ii<=this.Param.maxAlpha;ii++)
      {
         // Zero-fill 2nd dimension
         this.treeParams[ii]=new Array(this.Param.Nleaves+1).join('0').split('').map(parseFloat);
         var jj=0, xx=0, yy=0;
         this.calcParamsHelper(ii,jj,xx,yy,this.Param.width,0,0);
      }

   }, // TreeDrawing.calcParams



   //-------------------------------------------------------------------
   // Helper to calculate parameters for a given leaf (recursive)
   //-------------------------------------------------------------------
   calcParamsHelper: function(ialpha,ileaf,xx,yy,ww,beta,order){
      if (order <= this.treeProperties.maxNorders)
      {
         var Nbefore=ileaf-(Math.pow(2,order)-1),
             Nafter=Math.pow(2,order)-Nbefore-1,
             ileafnext=ileaf+Nafter+2*Nbefore+1;

         this.treeParams[ialpha][ileaf]=[ialpha,ileaf,xx,yy,ww,beta,ileafnext];

         // Calculate parameters
         var alpha=ialpha*this.dtor;
         var wwr=ww*Math.sin(alpha), wwl=wwr/Math.tan(alpha);             
 
         var rc=this.rcoords(0,ww,beta);
         var xxl=xx+rc[0], yyl=yy+rc[1];

         var dxxr=wwl*Math.cos(alpha), dyyr=wwl*Math.sin(alpha);
         rc=this.rcoords(dxxr,ww+dyyr,beta);
         var xxr=xx+rc[0], yyr=yy+rc[1];
               
         this.calcParamsHelper(ialpha,ileafnext,xxr,yyr,wwr,beta-((Math.PI/2)-alpha),order+1); // right
         this.calcParamsHelper(ialpha,ileafnext+1,xxl,yyl,wwl,beta+alpha,order+1); // left

      }
   }, // TreeDrawing.calcParamsHelper



   //-------------------------------------------------------------------
   // Add a single Pythagoras tree
   //-------------------------------------------------------------------
   addTree: function(treeid,xx,yy,ww,beta,alpha)
   {
      // Add base leaf, then tree will grow by itself
      this.addLeaf(treeid,0,xx,yy,ww,beta,alpha,0);
   }, // TreeDrawing.addTree



   //-------------------------------------------------------------------
   // Add a single leaf to a single tree (recursive)
   //-------------------------------------------------------------------
   addLeaf: function(treeid,leafid,xx,yy,ww,beta,alpha,order)
   {

      if (order <= this.treeProperties.Norders)
      {
         // Get stored parameters
         var params=this.treeParams[Math.round(alpha*this.rtod)][leafid];

         var xnew=Math.round(params[2]*ww+xx),
             ynew=Math.round(params[3]*ww+yy),
             wnew=Math.round(params[4]*ww), 
             bnew=params[5],
             ileafnext=params[6]; 

         this.drawRect(wnew,xnew,ynew,bnew,xx,yy,beta,order); 
  
         if (order < this.treeProperties.Norders) // Add next leaves
         {               
            this.addLeaf(treeid,ileafnext,xx,yy,ww,beta,alpha,order+1); // right
            this.addLeaf(treeid,ileafnext+1,xx,yy,ww,beta,alpha,order+1); // left
         }
      }
   }, // TreeDrawing.addLeaf



   //-------------------------------------------------------------------
   // Save rect to "custom" element
   //   at location (xx,yy) with width ww
   //   rotated by angle around (xx,yy) CW in radians
   //   rotated by angle2 around (xx2,yy2) CW in radians
   //-------------------------------------------------------------------
   drawRect: function(ww,xx,yy,angle,xx2,yy2,angle2,order)
   {
      // Get values of first transformation matrix
      // Rotation of entire tree about its origin
      var s2=Math.sin(angle2),c2=Math.cos(angle2),
          a00=c2,a10=-s2,a20=-xx2*c2+yy2*s2+xx2,
          a01=s2,a11=c2, a21=-xx2*s2-yy2*c2+yy2,
          a02=0,a12=0,a22=1;
      // Now for second transformation matrix
      // Rotation of leaf about its own origin
      var s1=Math.sin(angle),c1=Math.cos(angle),
          b00=c1,b10=-s1,b20=-xx*c1+yy*s1+xx,
          b01=s1,b11=c1, b21=-xx*s1-yy*c1+yy,
          b02=0,b12=0,b22=1;
      // Now multiply them together to get
      // one transformation matrix
      var aa=a00*b00+a10*b01+a20*b02,
          bb=a01*b00+a11*b01+a21*b02,
          cc=a00*b10+a10*b11+a20*b12,
          dd=a01*b10+a11*b11+a21*b12,
          ee=a00*b20+a10*b21+a20*b22,
          ff=a01*b20+a11*b21+a21*b22;

      // Draw on the canvas
      this.context.fillStyle="rgb("+this.leafcolors[order].r+","+this.leafcolors[order].g+","+this.leafcolors[order].b+")";
      this.context.setTransform(aa,bb,cc,dd,ee,ff); 
      this.context.fillRect(xx,yy,ww,ww); 
   }, // TreeDrawing.drawRect



   //-------------------------------------------------------------------
   // adjustTrees
   // Event listener for mousemove
   //-------------------------------------------------------------------
   adjustTrees: function(event)
   {
      // Get Mouse Position
      var xmc=event.clientX-this.canvasParams.x, ymc=event.clientY-this.canvasParams.y; 

      // Clear Canvas
      this.context.setTransform(1,0,0,1,0,0);
      this.context.clearRect(0,0,this.canvasParams.width,this.canvasParams.height);
      // Add line back
      this.drawLine();

      for (var ii=0;ii<this.Ntrees;ii++)
      {
         // Get position of mouse and base leaf
         var xx=this.xTrees[ii],
             yy=this.yTrees[ii],
             ww=this.wTrees[ii],
             bb=this.bTrees[ii];

         var rmc=this.rcoords(xmc-xx,ymc-yy,-bb); rmc[0]=rmc[0]+xx; rmc[1]=rmc[1]+yy;

         var xhold=rmc[0]-(xx+ww/2);
         var yhold=rmc[1]-yy;
         var newalpha=Math.atan(xhold/yhold);
         newalpha=((Math.PI/2)-newalpha)/2.0;
         if (newalpha < (1*this.dtor)) newalpha=1*this.dtor;
         if (newalpha > (89*this.dtor)) newalpha=89*this.dtor;

         // Redraw Tree
         this.addTree(ii,xx,yy,ww,bb,newalpha);
      }  
   }, // TreeDrawing.adjustTrees



   //-------------------------------------------------------------------
   // Rotate coordinates in 2D
   //-------------------------------------------------------------------
   rcoords: function(xx,yy,theta)
   {
      var cth=Math.cos(theta),sth=Math.sin(theta);
      return [xx*cth-yy*sth,xx*sth+yy*cth];
   }, // TreeDrawing.rcoords



   //-------------------------------------------------------------------
   // Redraw canvas
   //-------------------------------------------------------------------
   redrawCanvas: function()
   {
      // Adjust canvas size
      this.canvasParams.width=document.documentElement.clientWidth;
      this.canvasParams.height=document.documentElement.clientHeight-this.pagetop;

      this.canvas.width=this.canvasParams.width;
      this.canvas.height=this.canvasParams.height;
      this.context=this.canvas.getContext("2d");

      // Empty tree coordinate arrays
      this.xTrees=[];
      this.yTrees=[];   
      this.wTrees=[];   
      this.bTrees=[];   
      this.Ntrees=0;      

      // Draw a forest of trees on the canvas
      this.addForest();

      // Add browser warning
      if (this.browser != "Chrome") this.addBrowserWarning(); 

   }, // TreeDrawing.redrawCanvas



   //-------------------------------------------------------------------
   // Add browser warning
   //-------------------------------------------------------------------
   addBrowserWarning: function()
   {
      this.context.setTransform(1,0,0,1,0,0);
      var fsize=Math.round(this.canvasParams.height/50);
      this.context.font=fsize+"px Noto Sans";
      this.context.textAlign="end";
      this.context.fillStyle="rgb(25,25,25)";
      this.context.fillText("Please use Chrome for interactivity.",this.canvasParams.width-5,this.canvasParams.height-fsize-5);
   }, // TreeDrawing.addBrowserWarning



   //-------------------------------------------------------------------
   // Detach canvas
   //-------------------------------------------------------------------
   detach: function(deferred)
   {
      if (this.attached)
      {
         // Fade canvas
         var thishandle=this;
         d3.selectAll("#canvas_tree")
           .transition()
           .duration(500)
           .ease("linear")
           .style("opacity",0.0)
           .each("end",function(){
              // Detach after transition completes
              var canv=document.getElementById("canvas_tree");
              thishandle.canvasHandle=canv.parentNode.removeChild(canv);
              deferred.resolve();
           });
         this.attached=false;
      } else deferred.resolve();

   }, // TreeDrawing.detach



   //-------------------------------------------------------------------
   // Reattach canvas
   //-------------------------------------------------------------------
   reattach: function()
   {
      if (!this.attached)
      {
         // Attach (before menu so it doesn't overlap)
         var men=document.getElementById("svg_menu");
         document.body.insertBefore(this.canvasHandle,men);

         // Load Opacity
         d3.selectAll("#canvas_tree")
           .transition()
           .duration(500)
           .ease("linear")
           .style("opacity",1.0);

         this.attached=true;
      }

   } // TreeDrawing.reattach


}; // TreeDrawing.prototype





