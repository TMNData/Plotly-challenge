//  Create function to get Deshboard by selected ID

function getDeshboard(id) {
  // read the json file to get data
  d3.json("data/samples.json").then((data)=> {

    // populate demographics information for selected test subject ID
    // ================================================================
      
      // get the metadata info for the demographic panel
      var metaData = data.metadata

      // console.log(metaData)

      // filter meta data by ID

      var filteredMetadata = metaData.filter(record => record.id === parseInt(id))[0];

       var demoGraphic = d3.select("#sample-metadata");

      // clearing initial value

      demoGraphic.html("");

      // using for each to iterate object and populate demographics information for selected test subject ID
      Object.entries(filteredMetadata).forEach((entry) => {
          demoGraphic.append("h5").text(`${entry[0]}: ${entry[1]}`);
        });

    //  prepare filter shor data for different charts
    // ===========================================================================

      // filter samples by id to change based on selectedDropdown and filter by first iteam
        
        var filteredSamples = data.samples.filter(record => record.id === id)[0];
        console.log(filteredSamples)
    
      // get value of individual object item

      var otu_ids = Object.values(filteredSamples.otu_ids)
      var sample_values = Object.values(filteredSamples.sample_values)
      var otu_labels = Object.values(filteredSamples.otu_labels)
         
    
    // using map function create aray and get value of out id, calple value and OUT labels lable a
      var samplesData = otu_ids.map((value, index) => ({
          otu_ids: value,
          sample_values: sample_values[index],
          otu_labels: otu_labels[index]
        }))
    
        console.log(samplesData)
    
    // sort sample data to get to ten 
        
        sortedSampleValue = samplesData.sort((a, b) => b.sample_values - a.sample_values)
    
    // slice sorted array to get top 10 samples and reversed it as requiremnt of plotly bar
      
        reversedSlicedSamples = sortedSampleValue.slice(0, 10).reverse();   
      
        console.log(reversedSlicedSamples)

    //  Plot Horirontal Bar
    // ============================================================================

       // Trace1 horizontal bar
        var trace1 = {
          x: reversedSlicedSamples.map(object => object.sample_values),
          // change lable formate
          y: reversedSlicedSamples.map(object => `OUT ${object.otu_ids}`),
          text: reversedSlicedSamples.map(object => object.otu_labels),
          name: "OUT",
          type: "bar",
          orientation: "h"
        };
        console.log(trace1)
        // data
        var data = [trace1];

        // Apply the group bar mode to the layout
        var layout = {
          title: "Top 10 OUT",
          margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
          }
        };

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", data, layout);


    //  Plot bubble chart
    // ===========================================================================

        var trace1 = {
          x: otu_ids,
          y: sample_values,
          mode: "markers",
          marker: {
              size: sample_values,
              // color:otu_ids
              color: [
                "rgba(14, 127, 0, .5)",
                "rgba(110, 154, 22, .5)",
                "rgba(170, 202, 42, .5)",
                "rgba(202, 209, 95, .5)",
                "rgba(210, 206, 145, .5)",
                "rgba(232, 226, 202, .5)",
                "rgba(255, 255, 255, 0)"
              ]
          },
          text:otu_labels

      };

      // set the layout for the bubble plot
      var layout_bubble = {
          xaxis:{title: "OTU ID"},
          height: 600,
          width: 1000
      };

      // creating data variable 
      var data_bubble = [trace1];

      // create the bubble plot
      Plotly.newPlot("bubble", data_bubble, layout_bubble); 




    //  Plot Dial gauge
    // ===========================================================================

        //  get Wash Frequency from metadata object
        var wfreq = filteredMetadata.wfreq
        
        // // part of data to input
        // var trace_g = {
        //   type: 'pie',
        //   showlegend: false,
        //   hole: 0.4,
        //   rotation: 90,
        //   values:[ 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        //   text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
        //   direction: 'clockwise',
        //   textinfo: 'text',
        //   textposition: 'inside',
        //   marker: {
        //     colors: [             
              
        //       "rgba(210, 206, 145, .5)",
        //       "rgba(190, 205, 72, .5)",                     
              
        //       "rgba(135, 127, 26, .5)", 
        //       "rgba(110, 154, 22, .5)",                        
        //       "rgba(50, 74, 11, .5)",              
        //       "rgba(7, 60, 10, .5)",
        //       "rgba(28, 75, 35, .7)", 
        //       "rgba(25, 60, 15, .7)",               
        //       "rgba(12, 25, 10, .7)"
              
        //     ],
        //     labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
        //     hoverinfo: 'label'
        //   }
        // }

        // // needle
        // var degrees = 50, radius = .9
        // var radians = degrees * Math.PI / 180
        // var x = -1 * radius * Math.cos(radians).wfreq
        // var y = radius * Math.sin(radians)

        // var gaugeLayout = {
        //   shapes: [{
        //     type: 'line',
        //     x0: 0.5,
        //     y0: 0.5,
        //     x1: 0.6,
        //     y1: 0.6,
        //     line: {
        //       color: 'red',
        //       width: 3
        //     }
        //   }],
        //   title: { text: `<b>Belly Button Washing Frequency</b> <br> Scrubs per week` },
        //   xaxis: {visible: false, range: [-1, 1]},
        //   yaxis: {visible: false, range: [-1, 1]}
        // }

        // var dataGauge = [trace_g]

        // Plotly.plot('gauge', dataGauge, gaugeLayout)

         //  Plot gauge
    // ===========================================================================


        var data_g = [{
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: { text: `<b>Belly Button Washing Frequency</b> <br> Scrubs per week` },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
              axis: { range: [null, 9] },
              steps: [
                  { range: [0, 1], color:"rgba(210, 206, 145, .5)"},
                  { range: [1, 2], color:"rgba(190, 205, 72, .5)"}, 
                  { range: [2, 3], color:"rgba(135, 127, 26, .5)"},
                  { range: [3, 4], color:"rgba(110, 154, 22, .5)"}, 
                  { range: [4, 5], color:"rgba(50, 74, 11, .5)"},
                  { range: [5, 6], color: "rgba(7, 60, 10, .5)"},
                  { range: [6, 7], color: "rgba(28, 75, 35, .7)"},
                  { range: [7, 8], color: "rgba(25, 60, 15, .7)"}, 
                  { range: [8, 9], color: "rgba(12, 25, 10, .7)"}
              ]
          }
      }];

      // set layout for Gauge chart
      var layout_g = {
          width: 700,
          height: 500,
          margin: { t: 20, b: 10, l: 40, r: 150 }
      };

      // plot gauge chart
      Plotly.newPlot("gauge", data_g, layout_g);



      

  });
}

// change listening function
function optionChanged(id) {
  getDeshboard(id);
}

// create  Init function for drop down menu load and intial deshboard loading

function init() {
  var selectDropdown = d3.select("#selDataset");

  d3.json("data/samples.json").then((data) => {

      // Populate Test subject ID filter dropdown value with 'names'
      data.names.forEach(function(name) {
          selectDropdown.append("option").text(name).property("value");
      });
   
      getDeshboard(data.names[0]);

  });
}

// loading of initial data
init();
