//function to load data
const load = async (file) => {
  let data = await d3.csv(file, ({ category, name, value }) => ({
    category: category,
    name: name,
    value: Number.parseFloat(value),
  }));
  return data;
};

//function to prepare data for waterfall chart
const prepare = (data) => {
  data[0].start = 0;
  data[0].end = data[0].value;
  data[0].color = "base";
  data[data.length - 1].start = 0;
  data[data.length - 1].end = data[data.length - 1].value;
  data[data.length - 1].color = "base";
  for (let i = 1; i < data.length - 1; i++) {
    data[i].start = data[i - 1].end;
    data[i].end = data[i].start + data[i].value;
    data[i].color = data[i].value > 0 ? "positive" : "negative";
  }
  return data;
};

const main = async () => {
  let data = await load("data.csv").then((data) => data);

  //create category drop down
  const categories = [...new Set(data.map((d) => d.category))];
  let selectedCategory;
  categories.forEach((category) => {
    document
      .querySelector("#category")
      .appendChild(
        new Option(category, category, !selectedCategory, !selectedCategory)
      );
    if (!selectedCategory) {
      selectedCategory = category;
    }
  });

  //set parameters
  const chartId = "#chart";
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  //create new waterfall chart
  const chart = new waterfallChart(
    prepare(data.filter((d) => d.category === selectedCategory)),
    chartId,
    margin,
    width,
    height
  );
  chart.update(prepare(data.filter((d) => d.category === selectedCategory)));

  //add event listener
  document.querySelector("#category").addEventListener("change", (event) => {
    category = event.target.value;
    filteredData = prepare(data.filter((d) => d.category === category));
    chart.update(filteredData);
  });
};

class waterfallChart {
  constructor(data, chartId, margin, width, height) {
    this.margin = margin;
    this.width = width;
    this.height = height;
    this.svg = d3
      .select(chartId)
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    this.x = d3.scaleBand().range([0, this.width]).padding(0.3);
    this.y = d3.scaleLinear().range([this.height, 0]);
  }

  update(data) {
    this.x.domain(data.map((d) => d.name));
    this.y.domain([0, d3.max(data, (d) => Math.max(d.start, d.end))]);

    const xAxis = (g) =>
      g
        .call(d3.axisBottom(this.x).tickSize(0))
        .call((g) => g.select(".domain").remove());
    d3.select(".axis").remove();
    const gx = this.svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${this.height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", `translate(0, 10)`);

    const color = d3
      .scaleOrdinal()
      .domain(["base", "positive", "negative"])
      .range(["#E1E1E1", "#b2e672", "#fc5c9c"]);
    const format = d3.format(",");
    //bars
    const bar = this.svg.selectAll(".bar").data(data);
    bar.exit().remove();
    bar
      .attr("x", (d) => this.x(d.name))
      .attr("width", this.x.bandwidth())
      .transition()
      .duration(1500)
      .attr("y", (d) => Math.min(this.y(d.start), this.y(d.end)))
      .attr("height", (d) => Math.max(Math.abs(this.y(0) - this.y(d.value)), 1))
      .attr("fill", (d) => color(d.color));
    bar
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => this.x(d.name))
      .attr("y", (d) => Math.min(this.y(d.start), this.y(d.end)))
      .attr("width", this.x.bandwidth())
      .attr("height", (d) => Math.max(Math.abs(this.y(0) - this.y(d.value)), 1))
      .attr("fill", (d) => color(d.color));
    //labels
    const label = this.svg.selectAll(".label").data(data);
    label.exit().remove();
    label
      .transition()
      .duration(1500)
      .text((d) => `${format(d.value)}`)
      .attr("x", (d) => this.x(d.name) + this.x.bandwidth() / 2)
      .attr("y", (d) => Math.min(this.y(d.start), this.y(d.end)) - 10);
    label
      .enter()
      .append("text")
      .attr("class", "label")
      .text((d) => `${format(d.value)}`)
      .attr("x", (d) => this.x(d.name) + this.x.bandwidth() / 2)
      .attr("y", (d) => Math.min(this.y(d.start), this.y(d.end)) - 10)
      .attr("text-anchor", "middle");
  }
}

main();
