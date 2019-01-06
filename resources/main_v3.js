const margin = 50;
const width = 880;
const height = 480;

//add to the end of selrcted blocks svg element with 'axis' class and set width/height
const svg = d3.select('.chart').append('svg').attr('class', 'axis')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 880 480');
const svg2 = d3.select('.chartAllTime').append('svg').attr('class', 'axis')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 880 480')
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
/*
$.ajaxSetup({
    async: false
  });
*/

var prizesJson = [];
$.getJSON('../html/prize.json', function (json) {
    json.forEach(d => {
        prizesJson.push(d);
    });
console.log(prizesJson);
    d3.json('./scripts/data.json').then(function (data) {
        //console.log(prizesJson);
        var arr = [];
        arr = data; 
        prizesJson.sort(function(a,b){
            return Number(a.price) < Number(b.price) ? -1 : 1;
        });
        console.log(prizesJson);
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
                for (let i = 0; prizesJson.length > i; i++) {
                    if (d.All_time_fact < prizesJson[i].price) {
                        return prizesJson[i].link;
                    }
                }
            })
            .attr('x', (d) => xScale(d.Owner.name) - 20)
            .attr('y', (d) => {
                if (d.Monthly_plan > d.Fact)
                    return yScale(d.Monthly_plan) - 170;
                else
                    return yScale(d.Fact) - 180;
            }
            );
        /*          Build stroke progress */
        barGroups.append('rect')
            .attr('class', 'progressStroke')
            .attr('x', (d) => xScale(d.Owner.name))
            .attr('y', (d) => {
                if (d.Monthly_plan > d.Fact)
                    return yScale(d.Monthly_plan) - 128;
                else
                    return yScale(d.Fact) - 138;
            })
            .attr('height', 10)
            .attr('width', xScale.bandwidth());
        function multiply(a, b) {
            a * b;
        }
        multiply(3, 4);
        var percents = [];
        /*          Fill stroke progress */
        barGroups.append('rect')
            .attr('class', 'filProgress')
            .attr('x', (d) => xScale(d.Owner.name))
            .attr('y', (d) => {
                if (d.Monthly_plan > d.Fact)
                    return yScale(d.Monthly_plan) - 128;
                else
                    return yScale(d.Fact) - 138;
            })
            .attr('height', 10)
            .attr('width', (d) => {
                for (let i = 0; prizesJson.length > i; i++) {
                    if (d.All_time_fact < prizesJson[i].price) {
                        console.log(d.All_time_fact * 100 / prizesJson[i].price);
                        percents.push(d.All_time_fact * 100 / prizesJson[i].price);
                        return (xScale.bandwidth() * d.All_time_fact) / prizesJson[i].price;
                    }
                }
            }
            );
        /**               Add % to prize            */
        barGroups.append('text')
            .attr('class', 'percentToPrize')
            .text(
                (d) => {
                    for (let i = 0; prizesJson.length > i; i++) {
                        if (d.All_time_fact < prizesJson[i].price) {
                            return (d.All_time_fact * 100 / prizesJson[i].price).toString().substr(0, 2) + "%";
                        }
                    }
                }
            )
            .attr('x', (d) => xScale(d.Owner.name) + 70)
            .attr('y', (d) => {
                if (d.Monthly_plan > d.Fact)
                    return yScale(d.Monthly_plan) - 118;
                else
                    return yScale(d.Fact) - 128;
            });
        /**
         * Add "left tp prize"
         */
        barGroups.append('text')
            .attr('class', 'leftToPrize')
            .text(
                (d) => {
                    for (let i = 0; prizesJson.length > i; i++) {
                        if (d.All_time_fact < prizesJson[i].price) {
                            return "Осталось " + (prizesJson[i].price - d.All_time_fact).toString() + " до приза";
                        }
                    }
                })
            .attr('x', (d) => xScale(d.Owner.name) - 40)
            .attr('y', (d) => {
                if (d.Monthly_plan > d.Fact)
                    return yScale(d.Monthly_plan) - 104;
                else
                    return yScale(d.Fact) - 114;
            });
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

    });
});


