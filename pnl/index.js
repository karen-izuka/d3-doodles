const load = async () => {
  const data = await d3.csv("data.csv", ({ name, FY18, FY19, FY20, FY21 }) => ({
    name: name,
    "FY-18": Number.parseFloat(FY18),
    "FY-19": Number.parseFloat(FY19),
    "FY-20": Number.parseFloat(FY20),
    "FY-21": Number.parseFloat(FY21),
  }));
  return data;
};

const generateTableHead = (table, data) => {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
};

const generateTable = (table, data) => {
  const format_01 = d3.format("$,.0f");
  const format_02 = d3.format(".0%");
  for (let el of data) {
    let row = table.insertRow();
    for (key in el) {
      let cell = row.insertCell();
      if (typeof el[key] !== "number") {
        let text = document.createTextNode(`${el[key]}`);
        cell.appendChild(text);
      } else {
        if (el.name === "Gross Margin" || el.name === "Op Margin") {
          let text = document.createTextNode(`${format_02(el[key])}`);
          cell.appendChild(text);
        } else {
          let text = document.createTextNode(`${format_01(el[key])}`);
          cell.appendChild(text);
        }
      }
    }
  }
};

const main = async () => {
  const data = await load();
  let table = document.querySelector("table");
  let headers = Object.keys(data[0]);
  generateTableHead(table, headers);
  generateTable(table, data);
};

main();