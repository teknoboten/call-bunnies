const express = require("express");
const cors = require("cors");
// const fetch = require("node-fetch");
const cheerio = require("cheerio");

const app = express();
app.use(express.static("public"));
app.use(cors());

app.get("/jackrabbit", async (req, res) => {
  const params = new URLSearchParams(req.query);
  const jackrabbitURL = `https://app.jackrabbitclass.com/jr3.0/Openings/OpeningsJS?${params.toString()}`;

  try {
    const response = await fetch(jackrabbitURL);
    const text = await response.text();
    const match = text.match(/document\.write\('(.+)'\);/s);

    if (!match)
      return res.status(500).json({ error: "No HTML found in response" });

    const html = match[1].replace(/\\'/g, "'");
    const $ = cheerio.load(html);
    const classes = [];

    $("tbody tr").each((_, el) => {
      const row = $(el);
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000! 🚀"));
