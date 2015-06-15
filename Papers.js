
/////////////////////////////////////////////////////////////////////  
// PAPERS OBJECT
///////////////////////////////////////////////////////////////////// 
var Papers = function(PageMasterHandle,AboutPageHandle)
{
   // Define Paper Data
   this.definePapers();

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

} // Papers

Papers.prototype = {

   //-------------------------------------------------------------------
   // Define information about papers
   //-------------------------------------------------------------------
   definePapers: function(){

      this.Papers=[];
      this.Papers[0]={year: 1998, preview: "images/papers/Ernst_etal_JNM_1998.png", 
                      website: "http://jnm.snmjournals.org/content/39/4/689.long",
                      info: "Health hazards of radiation exposure in the context of brain imaging research: special consideration for children by Ernst, Freed, Zametkin (J Nucl Med 1998; 39:689-698)"};

      this.Papers[1]={year: 2001, preview: "images/papers/Oliversen_etal_2001_JGeophysRes.png", 
                      website: "http://onlinelibrary.wiley.com/doi/10.1029/2000JA002507/abstract",
                      info: "Sunlit Io atmospheric [O I] 6300A emission and the plasma torus by Oliversen et al. (J Geophys Res 2001; 106:26183-26193)"};

      this.Papers[2]={year: 2003, preview: "images/papers/Freed_etal_2003_ApJ.png", 
                      website: "http://iopscience.iop.org/0004-637X/584/1/453/fulltext/",
                      info: "Discovery of a tight brown dwarf companion to the low-mass star LHS 2397a by Freed, Close, Siegler (ApJ 2003; 584:453-458)"};

      this.Papers[3]={year: 2003, preview: "images/papers/Close_etal_2003_ApJ.png", 
                      website: "http://iopscience.iop.org/0004-637X/587/1/407/fulltext/",
                      info: "Detection of nine M8.0-L0.5 binaries: the very low mass binary population and its implications for brown dwarf and very low mass star formation by Close et al. (ApJ 2003; 587:407-422)"};

      this.Papers[4]={year: 2003, preview: "images/papers/Siegler_etal_2003_ApJ.png", 
                      website: "http://iopscience.iop.org/0004-637X/598/2/1265/fulltext/",
                      info: "An adaptive optics survey of M6.0-M7.5 stars: discovery of three very low mass binary systems including two probable Hyades members by Siegler et al. (ApJ 2003; 598:1265-1276)"};

      this.Papers[5]={year: 2006, preview: "images/papers/Hinz_etal_2006_ApJ.png", 
                      website: "http://iopscience.iop.org/0004-637X/653/2/1486/fulltext/",
                      info: "Thermal infrared constraint to a planetary companion of Vega with the MMT adaptive optics system by Hinz et al. (ApJ 2006; 653:1486-1492)"};

      this.Papers[6]={year: 2008, preview: "images/papers/Freed_etal_2008_MedPhys.png", 
                      website: "http://www.ncbi.nlm.nih.gov/pmc/articles/PMC2575412/",
                      info: "A prototype instrument for single pinhole small animal adaptive SPECT imaging by Freed et al. (Med Phys 2008; 35:1912-1925)"};

      this.Papers[7]={year: 2008, preview: "images/papers/Barrett_etal_2008_IEEETMI.png", 
                      website: "http://www.ncbi.nlm.nih.gov/pmc/articles/PMC2575754/",
                      info: "Adaptive SPECT by Barrett et al. (IEEE TMI 2008; 27:775-788)"};

      this.Papers[8]={year: 2009, preview: "images/papers/Badano_etal_2009_IEEETMI.png", 
                      website: "http://ieeexplore.ieee.org/xpl/articleDetails.jsp?arnumber=4703241",
                      info: "Effect of oblique x-ray incidence in flat-panel computed tomography of the breast by Badano et al. (IEEE TMI 2009; 28:696-702)"};

      this.Papers[9]={year: 2009, preview: "images/papers/Kenworthy_etal_2009_ApJ.png", 
                      website: "http://iopscience.iop.org/0004-637X/697/2/1928/article",
                      info: "MMT/AO 5 micron imaging constraints on the existence of giant planets orbiting Fomalhaut at ~13-40 AU by Kenworthy et al. (ApJ 2009; 697:1928-1933)"};

      this.Papers[10]={year: 2009, preview: "images/papers/Freed_etal_2009_MedPhys.png", 
                      website: "http://www.ncbi.nlm.nih.gov/pmc/articles/PMC2773454/",
                      info: "Experimental validation of Monte Carlo (MANTIS) simulated x-ray response of columnar CsI scintillator screens by Freed et al. (Med Phys 2009; 36:4944-4956)"};

      this.Papers[11]={year: 2010, preview: "images/papers/Freed_etal_2010_MedPhys.png", 
                      website: "http://www.ncbi.nlm.nih.gov/pmc/articles/PMC2885940/",
                      info: "A fast, angle-dependent, analytical model of CsI detector response for optimization of 3D x-ray breast imaging systems by Freed, Park, Badano (Med Phys 2010; 37:2593-2605)"};

      this.Papers[12]={year: 2011, preview: "images/papers/Freed_etal_2011a_MedPhys.png", 
                      website: "http://www.ncbi.nlm.nih.gov/pmc/articles/PMC3033878/",
                      info: "An anthropomorphic phantom for quantitative evaluation of breast MRI by Freed et al. (Med Phys 2011; 38:743-753)"};

      this.Papers[13]={year: 2011, preview: "images/papers/Badano_etal_2011_MedPhys.png", 
                      website: "http://scitation.aip.org/content/aapm/journal/medphys/38/4/10.1118/1.3567497",
                      info: "Oblique incidence effects in direct x-ray detectors: a first-order approximation using a physics-based analytical model by Badano, Freed, Fang (Med Phys 2011; 38:2095-2098)"};

      this.Papers[14]={year: 2011, preview: "images/papers/Freed_etal_2011_PMB.png", 
                      website: "http://iopscience.iop.org/0031-9155/56/12/005/",
                      info: "X-ray properties of an anthropomorphic breast phantom for MRI and x-ray imaging by Freed et al. (Phys Med Biol 2011; 56:3513-3533)"};

      this.Papers[15]={year: 2011, preview: "images/papers/Freed_etal_2011b_MedPhys.png", 
                      website: "http://www.ncbi.nlm.nih.gov/pmc/articles/PMC3195376/",
                      info: "Development and characterization of a dynamic lesion phantom for the quantitative evaluation of dynamic contrast-enhanced MRI by Freed et al. (Med Phys 2011; 38:5601-5611)"};

      this.Papers[16]={year: 2012, preview: "images/papers/Freed_etal_2012_MRM.png", 
                      website: "http://onlinelibrary.wiley.com/doi/10.1002/mrm.23234/abstract;jsessionid=21188479414D5FDFF5135B47F24317B4.f02t04",
                      info: "Effect of protocol parameters on contrast agent washout curve separability in breast dynamic contrast enhanced MRI: a simulation study by Freed (MRM 2012; 68:516-522)"};

      this.Papers[17]={year: 2013, preview: "images/papers/Hariharan_etal_2013_PMB.png", 
                      website: "http://www.ncbi.nlm.nih.gov/pmc/articles/PMC3733695/",
                      info: "Use of computational fluid dynamics in the design of dynamic contrast enhanced imaging phantoms by Hariharan, Freed, Myers (Phys Med Biol 2013; 58:6369-6391)"};

      this.Papers[18]={year: 2013, preview: "images/papers/Raman_etal_2013_JCMagnReson.png", 
                      website: "http://iopscience.iop.org/0031-9155/58/18/6369/",
                      info: "Modified look-locker inversion recovery T1 mapping indices: assesssment of accuracy and reproducibility between magnetic resonance scanners by Raman et al. (J Cardiovasc Mag Res 2013; 15:64"};

      this.Papers[19]={year: 2015, preview: "images/papers/Freed_Kim_2015_MRM.png", 
                      website: "http://www.sciencedirect.com/science/article/pii/S0730725X14002914",
                      info: "Simulation study of the effect of golden-angle KWIC with generalized kinetic model analysis on diagnostic accuracy for lesion discrimination by Freed and Kim (MRI 2015; 33:86-94)"};

      this.Nnodes=this.Papers.length;


      // Subject keywords for papers
      // 0: medical
      // 1: astro, spectra, solar system
      // 2: astro, images, binaries
      // 3: astro, images, binaries
      // 4: astro, images, binaries
      // 5: astro, images, binaries, instrumentation
      // 6: medical, images, instrumentation, SPECT
      // 7: medical, images, instrumentation, SPECT
      // 8: medical, images, x-ray, detector, simulation
      // 9: astro, images, binaries, instrumentation
      // 10: medical, images, x-ray, detector, instrumentation, simulation
      // 11: medical, images, x-ray, detector, simulation
      // 12: medical, images, MRI, phantom
      // 13: medical, images, x-ray, detector, simulation
      // 14: medical, images, x-ray, MRI, phantom
      // 15: medical, images, MRI, phantom, dynamic
      // 16: medical, images, MRI, simulation, dynamic
      // 17: medical, simulation, dynamic
      // 18: medical, images, MRI, phantom
      // 19: medical, images, MRI, simulation

      this.links=[];
      this.links.push({"source":0, "target":6, "value":1});
      this.links.push({"source":0, "target":7, "value":1});
      this.links.push({"source":0, "target":8, "value":1});
      this.links.push({"source":0, "target":10, "value":1});
      this.links.push({"source":0, "target":11, "value":1});
      this.links.push({"source":0, "target":12, "value":1});
      this.links.push({"source":0, "target":13, "value":1});
      this.links.push({"source":0, "target":14, "value":1});
      this.links.push({"source":0, "target":15, "value":1});
      this.links.push({"source":0, "target":16, "value":1});
      this.links.push({"source":0, "target":17, "value":1});
      this.links.push({"source":0, "target":18, "value":1});
      this.links.push({"source":0, "target":19, "value":1});

      this.links.push({"source":1, "target":2, "value":1});
      this.links.push({"source":1, "target":3, "value":1});
      this.links.push({"source":1, "target":4, "value":1});
      this.links.push({"source":1, "target":5, "value":1});
      this.links.push({"source":1, "target":9, "value":1});

      this.links.push({"source":2, "target":3, "value":3});
      this.links.push({"source":2, "target":4, "value":3});
      this.links.push({"source":2, "target":5, "value":3});
      this.links.push({"source":2, "target":6, "value":1});
      this.links.push({"source":2, "target":7, "value":1});
      this.links.push({"source":2, "target":8, "value":1});
      this.links.push({"source":2, "target":9, "value":3});
      this.links.push({"source":2, "target":10, "value":1});
      this.links.push({"source":2, "target":11, "value":1});
      this.links.push({"source":2, "target":12, "value":1});
      this.links.push({"source":2, "target":13, "value":1});
      this.links.push({"source":2, "target":14, "value":1});
      this.links.push({"source":2, "target":15, "value":1});
      this.links.push({"source":2, "target":16, "value":1});
      this.links.push({"source":2, "target":18, "value":1});
      this.links.push({"source":2, "target":19, "value":1});

      this.links.push({"source":3, "target":4, "value":3});
      this.links.push({"source":3, "target":5, "value":3});
      this.links.push({"source":3, "target":6, "value":1});
      this.links.push({"source":3, "target":7, "value":1});
      this.links.push({"source":3, "target":8, "value":1});
      this.links.push({"source":3, "target":9, "value":3});
      this.links.push({"source":3, "target":10, "value":1});
      this.links.push({"source":3, "target":11, "value":1});
      this.links.push({"source":3, "target":12, "value":1});
      this.links.push({"source":3, "target":13, "value":1});
      this.links.push({"source":3, "target":14, "value":1});
      this.links.push({"source":3, "target":15, "value":1});
      this.links.push({"source":3, "target":16, "value":1});
      this.links.push({"source":3, "target":18, "value":1});
      this.links.push({"source":3, "target":19, "value":1});

      this.links.push({"source":4, "target":5, "value":3});
      this.links.push({"source":4, "target":6, "value":1});
      this.links.push({"source":4, "target":7, "value":1});
      this.links.push({"source":4, "target":8, "value":1});
      this.links.push({"source":4, "target":9, "value":3});
      this.links.push({"source":4, "target":10, "value":1});
      this.links.push({"source":4, "target":11, "value":1});
      this.links.push({"source":4, "target":12, "value":1});
      this.links.push({"source":4, "target":13, "value":1});
      this.links.push({"source":4, "target":14, "value":1});
      this.links.push({"source":4, "target":15, "value":1});
      this.links.push({"source":4, "target":16, "value":1});
      this.links.push({"source":4, "target":18, "value":1});
      this.links.push({"source":4, "target":19, "value":1});

      this.links.push({"source":5, "target":6, "value":2});
      this.links.push({"source":5, "target":7, "value":2});
      this.links.push({"source":5, "target":8, "value":1});
      this.links.push({"source":5, "target":9, "value":4});
      this.links.push({"source":5, "target":10, "value":2});
      this.links.push({"source":5, "target":11, "value":1});
      this.links.push({"source":5, "target":12, "value":1});
      this.links.push({"source":5, "target":13, "value":1});
      this.links.push({"source":5, "target":14, "value":1});
      this.links.push({"source":5, "target":15, "value":1});
      this.links.push({"source":5, "target":16, "value":1});
      this.links.push({"source":5, "target":18, "value":1});
      this.links.push({"source":5, "target":19, "value":1});

      this.links.push({"source":6, "target":7, "value":4});
      this.links.push({"source":6, "target":8, "value":2});
      this.links.push({"source":6, "target":9, "value":2});
      this.links.push({"source":6, "target":10, "value":3});
      this.links.push({"source":6, "target":11, "value":2});
      this.links.push({"source":6, "target":12, "value":2});
      this.links.push({"source":6, "target":13, "value":2});
      this.links.push({"source":6, "target":14, "value":2});
      this.links.push({"source":6, "target":15, "value":2});
      this.links.push({"source":6, "target":16, "value":2});
      this.links.push({"source":6, "target":18, "value":2});
      this.links.push({"source":6, "target":19, "value":2});

      this.links.push({"source":7, "target":8, "value":2});
      this.links.push({"source":7, "target":9, "value":2});
      this.links.push({"source":7, "target":10, "value":3});
      this.links.push({"source":7, "target":11, "value":2});
      this.links.push({"source":7, "target":12, "value":2});
      this.links.push({"source":7, "target":13, "value":2});
      this.links.push({"source":7, "target":14, "value":2});
      this.links.push({"source":7, "target":15, "value":2});
      this.links.push({"source":7, "target":16, "value":2});
      this.links.push({"source":7, "target":18, "value":2});
      this.links.push({"source":7, "target":19, "value":2});

      this.links.push({"source":8, "target":9, "value":1});
      this.links.push({"source":8, "target":10, "value":5});
      this.links.push({"source":8, "target":11, "value":5});
      this.links.push({"source":8, "target":12, "value":2});
      this.links.push({"source":8, "target":13, "value":5});
      this.links.push({"source":8, "target":14, "value":3});
      this.links.push({"source":8, "target":15, "value":2});
      this.links.push({"source":8, "target":16, "value":3});
      this.links.push({"source":8, "target":17, "value":2});
      this.links.push({"source":8, "target":18, "value":2});
      this.links.push({"source":8, "target":19, "value":3});

      this.links.push({"source":9, "target":10, "value":2});
      this.links.push({"source":9, "target":11, "value":1});
      this.links.push({"source":9, "target":12, "value":1});
      this.links.push({"source":9, "target":13, "value":1});
      this.links.push({"source":9, "target":14, "value":1});
      this.links.push({"source":9, "target":15, "value":1});
      this.links.push({"source":9, "target":16, "value":1});
      this.links.push({"source":9, "target":18, "value":1});
      this.links.push({"source":9, "target":19, "value":1});

      this.links.push({"source":10, "target":11, "value":5});
      this.links.push({"source":10, "target":12, "value":2});
      this.links.push({"source":10, "target":13, "value":5});
      this.links.push({"source":10, "target":14, "value":3});
      this.links.push({"source":10, "target":15, "value":2});
      this.links.push({"source":10, "target":16, "value":3});
      this.links.push({"source":10, "target":17, "value":2});
      this.links.push({"source":10, "target":18, "value":2});
      this.links.push({"source":10, "target":19, "value":3});

      this.links.push({"source":11, "target":12, "value":2});
      this.links.push({"source":11, "target":13, "value":5});
      this.links.push({"source":11, "target":14, "value":3});
      this.links.push({"source":11, "target":15, "value":2});
      this.links.push({"source":11, "target":16, "value":3});
      this.links.push({"source":11, "target":17, "value":2});
      this.links.push({"source":11, "target":18, "value":2});
      this.links.push({"source":11, "target":19, "value":3});

      this.links.push({"source":12, "target":13, "value":2});
      this.links.push({"source":12, "target":14, "value":4});
      this.links.push({"source":12, "target":15, "value":4});
      this.links.push({"source":12, "target":16, "value":3});
      this.links.push({"source":12, "target":17, "value":1});
      this.links.push({"source":12, "target":18, "value":4});
      this.links.push({"source":12, "target":19, "value":3});

      this.links.push({"source":13, "target":14, "value":3});
      this.links.push({"source":13, "target":15, "value":2});
      this.links.push({"source":13, "target":16, "value":3});
      this.links.push({"source":13, "target":17, "value":2});
      this.links.push({"source":13, "target":18, "value":2});
      this.links.push({"source":13, "target":19, "value":3});

      this.links.push({"source":14, "target":15, "value":4});
      this.links.push({"source":14, "target":16, "value":3});
      this.links.push({"source":14, "target":17, "value":1});
      this.links.push({"source":14, "target":18, "value":4});
      this.links.push({"source":14, "target":19, "value":3});

      this.links.push({"source":15, "target":16, "value":4});
      this.links.push({"source":15, "target":17, "value":2});
      this.links.push({"source":15, "target":18, "value":4});
      this.links.push({"source":15, "target":19, "value":3});

      this.links.push({"source":16, "target":17, "value":3});
      this.links.push({"source":16, "target":18, "value":3});
      this.links.push({"source":16, "target":19, "value":4});

      this.links.push({"source":17, "target":18, "value":1});
      this.links.push({"source":17, "target":19, "value":1});

      this.links.push({"source":18, "target":19, "value":3});

   }, // .definePapers



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

      var Nlines=this.Papers.map(function(d){
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
      var actualArea=this.Papers.map(function(p){return Math.PI*Math.pow(thishandle.rScale(p.year),2);})
                                .reduce(function(a,b){return a+b;});

      // Adjust until you meet goal area
      while ((actualArea < goalArea) & (maxr < this.maxNodeRadius))
      {
         maxr++;
         thishandle.rScale.range([minr,maxr]);
         actualArea=thishandle.Papers.map(function(p){return Math.PI*Math.pow(thishandle.rScale(p.year),2);})
                                     .reduce(function(a,b){return a+b;});
      }

   }, // .createScale


   //-------------------------------------------------------------------
   // Create Page
   //-------------------------------------------------------------------
   createPage: function(){

      // Create SVG
      this.svg=d3.select("body").append("svg")
                 .attr("class","papers")
                 .attr("id","svg_papers")
                 .attr("width",this.width)
                 .attr("height",this.height)
                 .attr("style","position:absolute; top:"+this.yoffset+"px; left:"+this.xoffset+"px; "+
                               "font-size: "+this.fontSize+"px; line-height: 1.0");

      // Append container for paper text
      this.svg.append("foreignObject")
              .attr("class","papers annotation")
              .attr("width",this.width-this.fontSize*2+"px")
              .attr("height",this.headerHeight+"px")
              .attr("x",this.fontSize+"px")
              .attr("y",this.fontSize+"px")
              .append("xhtml:body")
              .append("xhtml:div");


      // Create force layout
      origin={x: this.forceWidth/2+this.forceXoffset, y: this.forceHeight/2+this.forceYoffset};
      var kfactor=Math.sqrt(this.Nnodes/(this.forceWidth*this.forceHeight));
      var nodes=this.Papers, links=this.links;
      this.force=d3.layout.force()
                   .size([this.forceWidth,this.forceHeight])
                   .nodes(nodes) 
                   .links(links)
                   .linkDistance(function(d){return (d.source.r+d.target.r)*2*(1+(1/d.value));})
                   .charge(-30/kfactor) //-30/kfactor)
                   .gravity(100*kfactor) //100*kfactor)
                   .on("tick",tick)
                   .start();

      // Create images
      this.ims=this.svg.selectAll("defs")
                       .data(this.Papers)
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
      var link=this.svg.selectAll(".papers.link")
                       .data(links)
                       .enter()
                       .append("line")
                       .attr("class",function(d){return "papers link "+d.id;});

      // Add additional information to nodes
      var thishandle=this;
      for (var ii=0;ii<this.Papers.length;ii++)
      {
        thishandle.Papers[ii].id=ii;
        thishandle.Papers[ii].x=origin.x+Math.random()*5;
        thishandle.Papers[ii].y=origin.y+Math.random()*5;
        thishandle.Papers[ii].r=thishandle.rScale(thishandle.Papers[ii].year);
      }

      // Add nodes
      var node=this.svg.selectAll(".papers.node")
                       .data(nodes)
                       .enter()
                       .append("g")
                       .attr("class",function(d){return "g papers node "+d.id;})
                       .attr("id",function(d){return d.id;})
                       .call(thishandle.force.drag);

      var Tadd=1500;
      node.append("a")
          .attr("xlink:href",function(d){return d.website;})
          .attr("target","_blank")
          .append("circle")
          .attr("class","circle papers node")
          .attr("id",function(d){return "circle_papers_node_"+d.id;})
          .attr("r",1)
          .style("fill",function(d){return "url(#im"+d.id+")";})
          .transition()
          .duration(Tadd)
          .attr("r",function(d){return d.r;});

      var thishandle=this;
      d3.selectAll(".g.papers.node")
        .on("mouseover",function(d){
           // Show info
           thishandle.svg.selectAll(".papers.annotation")
                     .html(d.info);
           // Jump circle to front
           this.parentNode.appendChild(this);
           // Make all other circles fade
           thishandle.svg.selectAll(".papers.node.circle")
                     .style("opacity",function(c){
                        if (c.id==d.id) return "1.0"; else return "0.1";
                     });
           // Make all lines fade
           thishandle.svg.selectAll(".papers.link")
                     .style("opacity","0.1");
        })
        .on("mouseout",function(d){
           // Remove info
           thishandle.svg.selectAll(".papers.annotation")
                     .html("");
           // Unfade circles
           thishandle.svg.selectAll(".papers.node.circle")
                     .style("opacity","1.0");
           // Unfade lines
           thishandle.svg.selectAll(".papers.link")
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

      d3.selectAll(".papers.annotation")
              .attr("width",this.width-this.fontSize*2)
              .attr("height",this.headerHeight)
              .attr("x",this.fontSize)
              .attr("y",this.fontSize);

      // Update nodes
      var thishandle=this;
      for (var ii=0;ii<this.Papers.length;ii++)
      {
        thishandle.Papers[ii].r=thishandle.rScale(thishandle.Papers[ii].year);
      }
      var nodes=this.Papers, links=this.links;
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
          node=this.svg.selectAll(".g.papers.node"),
          link=this.svg.selectAll(".papers.link");
      this.svg.selectAll(".circle.papers.node").attr("r",function(d){return d.r});
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
         var svg=document.getElementById("svg_papers");
         this.svgHandle=svg.parentNode.removeChild(svg);

         deferred.resolve();

         this.attached=false;
      } else deferred.resolve();
      
   } // .detach


}; // Papers.prototype

