const margin = 50;
const width = 880;
const height = 280;

//add to the end of selrcted blocks svg element with 'axis' class and set width/height
const svg = d3.select('.chart').append('svg').attr('class', 'axis')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 880 280');
const svg2 = d3.select('.chartAllTime').append('svg').attr('class', 'axis')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 880 280')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');
const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);
const chart2 = svg2.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

var prizes = [
    {
        name: 'iMac',
        link: 'https://www.doyoucopy.nl/wp-content/uploads/2018/03/webteksten-laten-verbeteren.png',
        price: 70000
    },
    {
        name: 'Car',
        link: 'http://pngimg.com/uploads/citroen/citroen_PNG82.png',
        price: 160000
    },
    {
        name: 'Apartment',
        link: 'http://ubksg.ru/a1.png',
        price: 300000
    }
];

//load data
d3.json('./scripts/data.json').then(function (data) {
    var arr = new Array();
    arr = data;
    arr.data.forEach(d => {
    });
    arr.data.sort(function (a, b) {
        return a.Fact > b.Fact ? -1 : 1;
    });
    /*      Create y-axis       */
    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(arr.data, (d) => {
            if (d.Fact > d.Monthly_plan)
                return d.Fact + 10000;
            else
                return d.Monthly_plan + 10000;
        })]);
    var yAxis = d3.axisLeft(yScale).ticks(5);
    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', "translate(" + margin + "," + margin + ")")
        .call(yAxis);


    /*      Create x-axis       */
    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(arr.data.map((d) => { return d.Owner.name }))
        .padding(0.6);
    svg.append('g')
        .attr('transform', `translate(50, ${height + margin})`)
        .attr('class', 'x-axis')
        .call(d3.axisBottom(xScale));

    /*      Build facts columns */
    const barGroups = chart.selectAll()
        .data(arr.data)
        .enter()
        .append('g');
    barGroups
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => xScale(d.Owner.name))
        .attr('y', (d) => yScale(d.Fact))
        .attr('height', (d) => height - yScale(d.Fact))
        .attr('width', xScale.bandwidth());
    barGroups.append('text')
        .attr('class', 'planCompleatedText')
        .text((d) => {
            return (((d.Fact * 100) / d.Monthly_plan).toString().substr(0, 5) + "%");

        })
        .attr('x', (d) => xScale(d.Owner.name) + 6)
        .attr('y', (d) => yScale(d.Fact) - 4);
    /*            Add prize images             */
    var prizeImages = barGroups.append('image')
        .attr('class', 'prizeImage')
        .attr('width', 117)
        .attr('height', 40)
        .attr('xlink:href', (d) => {
            if (d.All_time_fact < prizes[0].price) {
                return prizes[0].link;
            }
            else if (d.All_time_fact < prizes[1].price) {
                return prizes[1].link;
            }
            else if (d.All_time_fact < prizes[2].price) {
                return prizes[2].link;
            }
        })
        .attr('x', (d) => xScale(d.Owner.name) - 20)
        .attr('y', (d) => {
            if (d.Monthly_plan > d.Fact)
                return yScale(d.Monthly_plan) - 70;
            else
                return yScale(d.Fact) - 80;
        }
        );
    /*          Build stroke progress */
    barGroups.append('rect')
        .attr('class', 'progressStroke')
        .attr('x', (d) => xScale(d.Owner.name))
        .attr('y', (d) => {
            if (d.Monthly_plan > d.Fact)
                return yScale(d.Monthly_plan) - 28;
            else
                return yScale(d.Fact) - 38;
        })
        .attr('height', 10)
        .attr('width', xScale.bandwidth());

    /*          Fill stroke progress */
    barGroups.append('rect')
        .attr('class', 'filProgress')
        .attr('x', (d) => xScale(d.Owner.name))
        .attr('y', (d) => {
            if (d.Monthly_plan > d.Fact)
                return yScale(d.Monthly_plan) - 28;
            else
                return yScale(d.Fact) - 38;
        })
        .attr('height', 10)
        //.attr('width', xScale.bandwidth());
        .attr('width', (d) => {
            if (d.All_time_fact < prizes[0].price) {
                return (xScale.bandwidth() * d.All_time_fact) / prizes[0].price;
            }
            else if (d.All_time_fact < prizes[1].price) {
                return (xScale.bandwidth() * d.All_time_fact) / prizes[1].price;
            }
            else if (d.All_time_fact < prizes[2].price) {
                return (xScale.bandwidth() * d.All_time_fact) / prizes[2].price;
            }
        }
        )

    /* Build plans columns */
    const strokeBars = chart.selectAll()
        .data(arr.data)
        .enter()
        .append('g');
    strokeBars.append('rect')
        .attr('class', 'barStroke')
        .attr('x', (d) => xScale(d.Owner.name))
        .attr('y', (d) => yScale(d.Monthly_plan))
        .attr('height', (d) => height - yScale(d.Monthly_plan))
        .attr('width', xScale.bandwidth());

    /*          Create pize y-axis     
  const yScale2 = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(prizes, (d) => {
          return d.price;
      })]);
  var yAxis2 = d3.axisLeft(yScale2).ticks(0);
  svg2.append('g')
      .attr('class', 'y-axis')
      .attr('transform', "translate(" + margin + "," + margin + ")")
      .call(yAxis2); */


    /*              Add prizes         
    var iMac = [
        svg2.append('image')
            .attr('xlink:href', prizes[0].link)
            .attr('width', 117)
            .attr('height', 40)
            .attr('x', -45)
            .attr('y', yScale2(prizes[0].price)),
        svg2.append('text')
            .attr('class', 'prizePrice')
            .text(prizes[0].price)
            .attr('y', yScale2(prizes[0].price) + 52)
        //.attr('x', 15)
    ];


    var car = [
        svg2.append('image')
            .attr('xlink:href', prizes[1].link)
            .attr('width', 117)
            .attr('height', 40)
            .attr('x', -45)
            .attr('y', yScale2(prizes[1].price)),
        svg2.append('text')
            .attr('class', 'prizePrice')
            .text(prizes[1].price)
            .attr('y', yScale2(prizes[1].price) + 52)
            .attr('x', -10)
    ];
    var apartment = [
        svg2.append('image')
            .attr('xlink:href', prizes[2].link)
            .attr('width', 117)
            .attr('height', 40)
            .attr('x', -45)
            .attr('y', yScale2(prizes[2].price)),
        svg2.append('text')
            .attr('class', 'prizePrice')
            .text(prizes[2].price)
            .attr('y', yScale2(prizes[2].price) + 52)
            .attr('x', -10)
    ];
*/

    /*          Create prize lines for each employee    
    var barLines = chart2.selectAll()
        .data(arr.data)
        .enter()
        .append('g');
    barLines
        .append('line')
        .attr('class', 'barLines')
        .attr('x1', (d) => {
            return xScale(d.Owner.name);
        })
        .attr('y1', (d) => yScale2(d.All_time_fact))
        .attr('y2', (d) => yScale2(d.All_time_fact))
        .attr('x2', d => xScale(d.Owner.name) + xScale.bandwidth());
    barLines.append('text')
        .attr('class', 'prizeLineText')
        .text(
            (d) => {
                if (d.All_time_fact < prizes[0].price) {
                    console.log(d.All_time_fact);
                    return ("До приза " + (prizes[0].price - d.All_time_fact).toString());
                }
                else if (d.All_time_fact < prizes[1].price) {
                    console.log(prizes[1].price - d.All_time_fact);
                    return ("До приза " + (prizes[1].price - d.All_time_fact).toString());
                }
                else if (d.All_time_fact < prizes[2].price) {
                    console.log(prizes[2].price - d.All_time_fact);
                    return ("До приза " + (prizes[2].price - d.All_time_fact).toString());
                }
                else {
                    return (" Все пирзы получено!");
                }
            }
        )
        .attr('x', (d) => xScale(d.Owner.name) - 10)
        .attr('y', (d) => yScale2(d.All_time_fact) - 10);  
        */

});