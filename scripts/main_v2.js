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
        name: 'iPhone',
        link: 'http://www.pngmart.com/files/7/IPhone-PNG-Background-Image.png',
        x: 0,
        y: 10,
        price: 35000
    },
    {
        name: 'iMac',
        link: 'https://www.doyoucopy.nl/wp-content/uploads/2018/03/webteksten-laten-verbeteren.png',
        x: 0,
        y: 20,
        price: 140000
    },
    {
        name: 'Car',
        link: 'http://pngimg.com/uploads/citroen/citroen_PNG82.png',
        x: 0,
        y: 30,
        price: 300000
    },
];

//load data
d3.json('./scripts/data.json').then(function (data) {
    var arr = new Array();
    arr = data;
    
    arr.data.forEach(d => {
    });
 
   arr.data.sort(function(a, b){
    return a.Fact > b.Fact?-1:1;
    });
    /*      Create y-axis       */
    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(arr.data, (d) => {
            if (d.Fact > d.Monthly_plan)
                return d.Fact + 1000;
            else
                return d.Monthly_plan + 1000;
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
        .call(d3.axisBottom(xScale));

        /*      dashed grid      */
    chart.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft()
        .scale(yScale)
        .tickSize(-width, 0, 0)
        .tickFormat(''));

    /*      Make fill column */
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

    

    /**          Add Plan line         */
    const planLine = chart.selectAll()
        .data(arr.data)
        .enter()
        .append('g');
    planLine.append("line")
        .attr('class', 'planLine')
        .attr("x1", 0)
        .attr("y1", (d) => yScale(d.Monthly_plan))
        .attr('x2', width)
        .attr('y2', (d) => yScale(d.Monthly_plan));

    /*              Prizes x-axis        */
    const xScale2 = d3.scaleBand()
        .range([0, width])
        .domain(arr.data.map((d) => { return d.Owner.name }))
        .padding(0.6);
    /*  svg2.append('g')
          .attr('transform', `translate(50, ${height + margin})`)
          .call(d3.axisBottom(xScale2));
  
      /*          Create pize y-axis      */
    const yScale2 = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(prizes, (d) => {
            return d.price;
        })]);
    var yAxis2 = d3.axisLeft(yScale2).ticks(0);
    svg2.append('g')
        .attr('class', 'y-axis')
        .attr('transform', "translate(" + margin + "," + margin + ")")
        .call(yAxis2);


    /*              Add prizes imaes         */
    var iPhone = svg2.append('image')
        .attr('xlink:href', prizes[0].link)
        .attr('width', 117)
        .attr('height', 60)
        .attr('x', -15)
        .attr('y', yScale2(prizes[0].price));
    var iMac = svg2.append('image')
        .attr('xlink:href', prizes[1].link)
        .attr('width', 117)
        .attr('height', 60)
        .attr('x', -15)
        .attr('y', yScale2(prizes[1].price));
    var car = svg2.append('image')
        .attr('xlink:href', function(){return '../img/citroen_PNG82.png'})
        .attr('width', 117)
        .attr('height', 60)
        .attr('x', -15)
        .attr('y', yScale2(prizes[2].price));


    /*          Create pize lines for each employee      */
    const barLines = chart2.selectAll()
        .data(arr.data)
        .enter()
        .append('g');
    barLines
        .append('line')
        .attr('class', 'barLines')
        .attr('x1', (d) =>{
            console.log(xScale(d.Owner.name)+ 'x1');
            return xScale(d.Owner.name);
            
        })
        .attr('y1', (d) => yScale2(d.All_time_fact))
        .attr('y2', (d) => yScale2(d.All_time_fact))
        .attr('x2', d=>xScale(d.Owner.name) + xScale.bandwidth());
        
        console.log(xScale.bandwidth()+ 'x2');
});