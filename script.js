// Initial row for the table
function newRowData() {
  return { qty: '', details: '', weight: '', totalFare: '', advanceFare: '', balanceFare: '', paidTo: '' };
}
function buildRow(row, idx) {
  return `
      <tr>
        <td><input name="qty" value="${row.qty}" oninput="tableChange(${idx}, 'qty', this.value)" /></td>
        <td><input name="details" value="${row.details}" oninput="tableChange(${idx}, 'details', this.value)" /></td>
        <td><input name="weight" value="${row.weight}" oninput="tableChange(${idx}, 'weight', this.value)" /></td>
        <td><input name="totalFare" value="${row.totalFare}" oninput="tableChange(${idx}, 'totalFare', this.value)" /></td>
        <td><input name="advanceFare" value="${row.advanceFare}" oninput="tableChange(${idx}, 'advanceFare', this.value)" /></td>
        <td><input name="balanceFare" value="${row.balanceFare}" oninput="tableChange(${idx}, 'balanceFare', this.value)" /></td>
        <td><input name="paidTo" value="${row.paidTo}" oninput="tableChange(${idx}, 'paidTo', this.value)" /></td>
        <td><button class="remove-btn" onclick="removeRow(${idx})">✖</button></td>
      </tr>
    `;
}
// Table state
let tableRows = [newRowData()];
function renderTable() {
  document.getElementById("goods-table-body").innerHTML =
    tableRows.map((row, idx) => buildRow(row, idx)).join('');
}
// Handlers
function addRow() {
  tableRows.push(newRowData());
  renderTable();
}
function removeRow(idx) {
  tableRows.splice(idx, 1);
  if (tableRows.length === 0) tableRows.push(newRowData());
  renderTable();
}
function tableChange(idx, field, value) {
  tableRows[idx][field] = value;
}
// Initial render
renderTable();

// DOWNLOAD BUTTON
function downloadImage() {
  // Optionally hide buttons before snapshot
  document.querySelector('.buttons-area').style.visibility = 'hidden';
  html2canvas(document.getElementById('form-container'), {
    scale: 2, // high-res for print/gallery
    useCORS: true,
    backgroundColor: "#fff"
  })
    .then(function (canvas) {
      let link = document.createElement('a');
      link.download = 'fly-truckers-form.png';
      link.href = canvas.toDataURL("image/png");
      link.click();
      document.querySelector('.buttons-area').style.visibility = ''; // restore
    })
    .catch(function () {
      alert("Download failed, please try again.");
      document.querySelector('.buttons-area').style.visibility = '';
    });
}
function replaceInputsWithText() {
  const inputs = document.querySelectorAll('input');

  inputs.forEach(inp => {
    const value = inp.value || ' '; // Avoid empty collapse
    const span = document.createElement('span');

    span.textContent = value;
    span.className = 'input-as-text';

    // Set explicit styles to match input appearance
    span.style.cssText = `
      border-bottom: 1px solid black;
      padding: 4px 8px;
      display: inline-block;
      min-width: ${inp.offsetWidth}px;
      font-size: ${window.getComputedStyle(inp).fontSize};
      font-family: ${window.getComputedStyle(inp).fontFamily};
      line-height: ${window.getComputedStyle(inp).lineHeight};
      height: ${inp.offsetHeight}px;
      box-sizing: border-box;
      direction: ${inp.style.direction || 'rtl'};
    `;

    inp.style.display = 'none'; // hide input
    inp.parentNode.insertBefore(span, inp);
  });
}

function restoreInputs() {
  document.querySelectorAll('.input-as-text').forEach(span => {
    let inp = span.previousElementSibling;
    if (inp && inp.tagName === "INPUT") {
      inp.style.display = '';
      span.remove();
    }
  });
}

function downloadImage() {
  document.querySelector('.buttons-area').style.visibility = 'hidden';
  replaceInputsWithText(); // step 1: show as text

  html2canvas(document.getElementById('form-container'), {
    scale: 2,
    useCORS: true,
    backgroundColor: "#fff"
  })
    .then(function (canvas) {
      let link = document.createElement('a');
      link.download = 'fly-truckers-form.png';
      link.href = canvas.toDataURL("image/png");
      link.click();
      restoreInputs(); // step 2: restore inputs
      document.querySelector('.buttons-area').style.visibility = '';
    })
    .catch(function () {
      restoreInputs();
      alert("Download failed, please try again.");
      document.querySelector('.buttons-area').style.visibility = '';
    });
}

function addRow() {
  const tbody = document.getElementById("goods-table-body");
  const row = document.createElement("tr");
  for (let i = 0; i < 6; i++) {
    const td = document.createElement("td");
    td.innerHTML = '<input type="text" style="width:100%">';
    row.appendChild(td);
  }
  tbody.appendChild(row);
}

