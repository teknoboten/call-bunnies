const express = require("express");
const cors = require("cors");
// const fetch = require("node-fetch");
const cheerio = require("cheerio");

const app = express();
app.use(cors());

app.get("/jackrabbit", async (req, res) => {
  try {
    console.log("Fetching Jackrabbit data...");

    const response = await fetch(
      "https://app.jackrabbitclass.com/jr3.0/Openings/OpeningsJS?OrgID=554798"
    );

    const text = await response.text(); // Get the raw JavaScript response

    // Extract HTML from document.write
    const htmlMatch = text.match(/document\.write\('(.+)'\);/s);
    if (!htmlMatch) {
      throw new Error("Could not extract HTML from JavaScript response.");
    }

    const html = htmlMatch[1].replace(/\\'/g, "'"); // Fix escaped quotes

    // Load the extracted HTML into cheerio
    const $ = cheerio.load(html);
    let classes = [];

    $("tbody tr").each((_, element) => {
      const row = $(element);
      classes.push({
        register: row.find('td[data-title="Register"] a').attr("href"),
        class: row.find('th[data-title="Class"]').text().trim(),
        description: row.find('td[data-title="Description"]').text().trim(),
        days: row.find('td[data-title="Days"]').text().trim(),
        times: row.find('td[data-title="Times"]').text().trim(),
        ages: row.find('td[data-title="Ages"]').text().trim(),
        openings: row.find('td[data-title="Openings"]').text().trim(),
        startDate: row.find('td[data-title="Class Starts"]').text().trim(),
        endDate: row.find('td[data-title="Class Ends"]').text().trim(),
        session: row.find('td[data-title="Session"]').text().trim(),
        tuition: row.find('td[data-title="Tuition"]').text().trim(),
      });
    });

    res.json({ classes });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000! 🚀"));
