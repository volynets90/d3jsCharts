const margin = 50;
const width = 880;
const height = 480;

//add to the end of selrcted blocks svg element with 'axis' class and set width/height
const svg = d3.select('.chart').append('svg').attr('class', 'axis')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 880 480');
const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);
/*
$.ajaxSetup({
    async: false
  });
*/

console.log('click!');
$.ajax({
    url: "./record_data.php",
    type: 'POST',
    success: function () {
        console.log("data from api load");
        var prizesJson = [];
        $.getJSON('./prize.json', function (json) {
            json.forEach(d => {
                prizesJson.push(d);
            });
            console.log("prize load");
            d3.json('./scripts/data.json').then(function (data) {
                var arr = [];
                arr = data;
                console.log("data from json file load");
                prizesJson.sort(function (a, b) {
                    return Number(a.price) < Number(b.price) ? -1 : 1;
                });
                arr.data.sort(function (a, b) {
                    return a.fact_dohod > b.fact_dohod ? -1 : 1;
                });
                /*      Create y-axis       */
                const yScale = d3.scaleLinear()
                    .range([height, 0])
                    .domain([0, d3.max(arr.data, (d) => {
                        if (d.fact_dohod > d.student_plan)
                            return d.fact_dohod + 10000;
                        else
                            return d.student_plan + 10000;
                    })]);
                var yAxis = d3.axisLeft(yScale).ticks(5);
                svg.append('g')
                    .attr('class', 'y-axis')
                    .attr('transform', "translate(" + margin + "," + margin + ")")
                    .call(yAxis);


                /*      Create x-axis       */
                const xScale = d3.scaleBand()
                    .range([0, width])
                    .domain(arr.data.map((d) => { return d.sotrudnik.name }))
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
                    .attr('x', (d) => xScale(d.sotrudnik.name))
                    .attr('y', (d) => yScale(d.fact_dohod))
                    .attr('height', (d) => height - yScale(d.fact_dohod))
                    .attr('width', xScale.bandwidth())
                    .on('mouseenter', function () {
                        console.log("enter");
                        d3.select(this.barGroups).append('text')
                            .attr('class', 'hoverText')
                            .text('teest')
                            .attr('x', (d) => xScale(d.sotrudnik.name) + 6)
                            .attr('y', (d) => yScale(d.fact_dohod) - 4);
                    })
                    .on('mouseleave', function () {
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .attr('opacity', 1)
                        chart.selectAll('.hoverText').remove()
                    });
                barGroups.append('text')
                    .attr('class', 'planCompleatedText')
                    .text((d) => {
                        if (d.student_plan != null) {
                            return (((d.fact_dohod * 100) / d.student_plan).toString().substr(0, 5) + "%");
                        }


                    })
                    .attr('x', (d) => xScale(d.sotrudnik.name) + 6)
                    .attr('y', (d) => yScale(d.fact_dohod) - 4);
                /*            Add prize images             */
                var prizeImages = barGroups.append('image')
                    .attr('class', 'prizeImage')
                    .attr('width', 117)
                    .attr('height', 40)
                    .attr('xlink:href', (d) => {
                        for (let i = 0; prizesJson.length > i; i++) {
                            if (d.sum_total < prizesJson[i].price) {
                                return prizesJson[i].link;
                            }
                        }
                    })
                    .attr('x', (d) => xScale(d.sotrudnik.name) - 20)
                    .attr('y', (d) => {
                        if (d.student_plan > d.fact_dohod)
                            return yScale(d.student_plan) - 170;
                        else
                            return yScale(d.fact_dohod) - 180;
                    }
                    );
                /*          Build stroke progress */
                barGroups.append('rect')
                    .attr('class', 'progressStroke')
                    .attr('x', (d) => xScale(d.sotrudnik.name))
                    .attr('y', (d) => {
                        if (d.student_plan > d.fact_dohod)
                            return yScale(d.student_plan) - 128;
                        else
                            return yScale(d.fact_dohod) - 138;
                    })
                    .attr('height', 10)
                    .attr('width', xScale.bandwidth());


                var percents = [];
                /*          Fill stroke progress */
                barGroups.append('rect')
                    .attr('class', 'filProgress')
                    .attr('x', (d) => xScale(d.sotrudnik.name))
                    .attr('y', (d) => {
                        if (d.student_plan > d.fact_dohod)
                            return yScale(d.student_plan) - 128;
                        else
                            return yScale(d.fact_dohod) - 138;
                    })
                    .attr('height', 10)
                    .attr('width', (d) => {
                        for (let i = 0; prizesJson.length > i; i++) {
                            if (d.sum_total < prizesJson[i].price) {
                                console.log(d.sum_total * 100 / prizesJson[i].price);
                                percents.push(d.sum_total * 100 / prizesJson[i].price);
                                return (xScale.bandwidth() * d.sum_total) / prizesJson[i].price;
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
                                if (d.sum_total < prizesJson[i].price) {
                                    return (d.sum_total * 100 / prizesJson[i].price).toString().substr(0, 2) + "%";
                                }
                            }
                        }
                    )
                    .attr('x', (d) => {
                        console.log(xScale(d.sotrudnik.name));
                        return xScale(d.sotrudnik.name) + xScale.bandwidth() + 4;
                    })
                    .attr('y', (d) => {
                        if (d.student_plan > d.fact_dohod)
                            return yScale(d.student_plan) - 118;
                        else
                            return yScale(d.fact_dohod) - 128;
                    });
                /**
                 * Add "left tp prize"
                 */
                barGroups.append('text')
                    .attr('class', 'leftToPrize')
                    .text(
                        (d) => {
                            for (let i = 0; prizesJson.length > i; i++) {
                                if (d.sum_total < prizesJson[i].price) {
                                    return "Осталось " + (prizesJson[i].price - d.sum_total).toString() + " до приза";
                                }
                            }
                        })
                    .attr('x', (d) => xScale(d.sotrudnik.name) - 40)
                    .attr('y', (d) => {
                        if (d.student_plan > d.fact_dohod)
                            return yScale(d.student_plan) - 104;
                        else
                            return yScale(d.fact_dohod) - 114;
                    });
                /* Build plans columns */
                const strokeBars = chart.selectAll()
                    .data(arr.data)
                    .enter()
                    .append('g');
                strokeBars.append('rect')
                    .attr('class', 'barStroke')
                    .attr('x', (d) => xScale(d.sotrudnik.name))
                    .attr('y', (d) => yScale(d.student_plan))
                    .attr('height', (d) => height - yScale(d.student_plan))
                    .attr('width', xScale.bandwidth())
                    .on('mouseenter', function (actual, i) {
                        console.log("enter");
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .attr('opacity', 0.9)
                    })
                    .on('mouseleave', function () {
                        console.log("leave");
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .attr('opacity', 1)
                    });

            });
        });
    }
});


