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
        
        
      </tr>
    `;
}
function generateSimpleBuiltyNumber() {
  // Get the previous bilty number from localStorage
  let count = localStorage.getItem("simpleBuiltyCount");

  // If it doesn't exist, start from 1
  count = count ? parseInt(count) + 1 : 1;

  // Save the new count back to localStorage
  localStorage.setItem("simpleBuiltyCount", count);

  // Set the generated number in the input field
  document.getElementById("billNo").value = count;
}

// Call function when page loads
window.onload = function () {
  generateSimpleBuiltyNumber();
};
// Table state
let tableRows = [newRowData()];
function renderTable() {
  document.getElementById("goods-table-body").innerHTML =
    tableRows.map((row, idx) => buildRow(row, idx)).join('');
}
/* Handlers
function addRow() {
  tableRows.push(newRowData());
  renderTable();
}
function removeRow(idx) {
  tableRows.splice(idx, 1);
  if (tableRows.length === 0) tableRows.push(newRowData());
  renderTable();
}*/
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
      
      padding: 4px 8px;
      display: inline-block;
      border-bottom: 1px solid black;
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

//Data store in backend

function submitToBackend() {
  // Gather data from form
  const data = {
    billNo: document.getElementById("billNo").value,
    date: document.getElementById("date").value,
    invNo: document.getElementById("invNo").value,
    from: document.getElementById("from").value,
    to: document.getElementById("to").value,
    payable: document.getElementById("payable").value,
    receiver: document.getElementById("receiver").value,
    driver: document.getElementById("driver").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    deliveryNote: document.getElementById("deliveryNote").value,
    deliveryNote2: document.getElementById("deliveryNote2").value,
    remarks: document.getElementById("remarks").value,
    receiverSignature: document.getElementById("receiverSignature").value,
    officerSignature: document.getElementById("officerSignature").value,
    goods: tableRows // tableRows already managed in your JS
  };

  fetch("http://localhost:5000/api/builty", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((resData) => {
      alert("Form saved on backend!");
      console.log(resData);
    })
    .catch((err) => {
      alert("Failed to save form!");
      console.error(err);
    });
}

// Builty search
function searchBuiltys() {
  const date = document.getElementById("searchDate").value;
  if (!date) return alert("تاریخ منتخب کریں");

  fetch(`http://localhost:5000/api/builty/${date}`)
    .then(res => {
      if (!res.ok) throw new Error("No data found");
      return res.json();
    })
    .then(data => {
      const resultArea = document.getElementById("searchResults");
      resultArea.innerHTML = "";

      data.forEach((item, idx) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <div style="border:1px solid #000; padding:12px; margin-bottom:10px;">
            <b>بلٹی نمبر:</b> ${item.billNo} |
            <b>تاریخ:</b> ${item.date} |
            <b>ڈرائیور:</b> ${item.driver} |
            <b>وصول کنندہ:</b> ${item.receiver}
            <br />
            <button onclick="downloadBuiltyPDF(${idx}, '${item.date}')">📄 PDF ڈاؤن لوڈ کریں</button>
          </div>
        `;
        resultArea.appendChild(div);
      });
    })
    .catch(err => {
      document.getElementById("searchResults").innerHTML = "کوئی ریکارڈ نہیں ملا";
      console.error(err);
    });
}


function downloadBuiltyPDF(index, date) {
  const url = `http://localhost:5000/api/builty-pdf/${date}/${index}`;
  window.open(url, "_blank");
}


//Load Buity Function

function loadBuiltysList() {
  const date = document.getElementById("searchDate").value;
  if (!date) return alert("تاریخ منتخب کریں");

  fetch(`http://localhost:5000/api/builty/${date}`)
    .then(res => {
      if (!res.ok) throw new Error("No data found");
      return res.json();
    })
    .then(data => {
      const selector = document.getElementById("builtySelector");
      selector.innerHTML = "<b>اس تاریخ کی بلٹیز:</b><br />";

      data.forEach((item, idx) => {
        const btn = document.createElement("button");
        btn.textContent = `بلٹی نمبر: ${item.billNo} (ڈرائیور: ${item.driver})`;
        btn.className = "download-btn";
        btn.onclick = () => fillFormWithBuilty(item);
        selector.appendChild(btn);
        selector.appendChild(document.createElement("br"));
      });
    })
    .catch(err => {
      document.getElementById("builtySelector").innerHTML = "کوئی بلٹی نہیں ملی";
      console.error(err);
    });
}


//Form Fill Function

function fillFormWithBuilty(data) {
  document.getElementById("billNo").value = data.billNo || "";
  document.getElementById("date").value = data.date || "";
  document.getElementById("invNo").value = data.invNo || "";
  document.getElementById("from").value = data.from || "";
  document.getElementById("to").value = data.to || "";
  document.getElementById("payable").value = data.payable || "";
  document.getElementById("receiver").value = data.receiver || "";
  document.getElementById("driver").value = data.driver || "";
  document.getElementById("phone").value = data.phone || "";
  document.getElementById("email").value = data.email || "";
  document.getElementById("deliveryNote").value = data.deliveryNote || "";
  document.getElementById("deliveryNote2").value = data.deliveryNote2 || "";
  document.getElementById("remarks").value = data.remarks || "";
  document.getElementById("receiverSignature").value = data.receiverSignature || "";
  document.getElementById("officerSignature").value = data.officerSignature || "";

  // Table Rows
  tableRows = data.goods || [newRowData()];
  renderTable();
}
