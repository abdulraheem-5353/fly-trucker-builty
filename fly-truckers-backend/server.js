const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());

// ✅ Route to save form data
app.post("/api/builty", (req, res) => {
  const newEntry = req.body;
  const filePath = path.join(__dirname, "data", "builty.json");

  let existing = [];

  // Read old data (if any)
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    if (fileContent) {
      existing = JSON.parse(fileContent);
    }
  }

  // Add new entry to array
  existing.push(newEntry);

  // Write updated data to file
  fs.writeFile(filePath, JSON.stringify(existing, null, 2), (err) => {
    if (err) {
      console.error("Error saving form:", err);
      return res.status(500).json({ message: "Server Error" });
    }

    res.status(200).json({ message: "Form data saved successfully" });
  });
});

// ✅ Route to get builtys by date
app.get("/api/builty/:date", (req, res) => {
  const filePath = path.join(__dirname, "data", "builty.json");
  const requestedDate = req.params.date;

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "No builty data found" });
  }

  const allData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Filter by date
  const filtered = allData.filter(entry => entry.date === requestedDate);

  if (filtered.length === 0) {
    return res.status(404).json({ message: `No builty found for ${requestedDate}` });
  }

  res.status(200).json(filtered);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});




// PDF Download
const PDFDocument = require("pdfkit");

app.get("/api/builty-pdf/:date/:index", (req, res) => {
  const filePath = path.join(__dirname, "data", "builty.json");
  const { date, index } = req.params;

  if (!fs.existsSync(filePath)) return res.status(404).send("No data");

  const allData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const filtered = allData.filter(entry => entry.date === date);

  const item = filtered[parseInt(index)];
  if (!item) return res.status(404).send("Builty not found");

  const doc = new PDFDocument();
  res.setHeader("Content-Disposition", "attachment; filename=fly-builty.pdf");
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  doc.fontSize(18).text("Fly Truckers Builty", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Bill No: ${item.billNo}`);
  doc.text(`Date: ${item.date}`);
  doc.text(`From: ${item.from}`);
  doc.text(`To: ${item.to}`);
  doc.text(`Driver: ${item.driver}`);
  doc.text(`Receiver: ${item.receiver}`);
  doc.text(`Phone: ${item.phone}`);
  doc.text(`Seal/Container: ${item.email}`);
  doc.moveDown();

  doc.fontSize(14).text("Goods:", { underline: true });
  item.goods.forEach((g, i) => {
    doc.text(`${i + 1}) ${g.qty} - ${g.details} - ${g.weight}kg - ₹${g.totalFare}`);
  });

  doc.end();
});
