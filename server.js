require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.get(["/", "/index.html"], (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/about.html", (_req, res) => {
  res.sendFile(path.join(__dirname, "about.html"));
});

app.get("/style.css", (_req, res) => {
  res.sendFile(path.join(__dirname, "style.css"));
});

app.get("/index.js", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.js"));
});

app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use("/imgs", express.static(path.join(__dirname, "imgs")));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/countries", async (req, res) => {
  const name = req.query.name?.trim();

  if (!name) {
    return res.status(400).json({
      message: "A country name is required",
    });
  }

  try {
    const url = new URL("https://api.restcountries.com/countries/v5/name");

    url.searchParams.set("q", name);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.REST_COUNTRIES_API_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: data.errors?.[0]?.message || "REST Countries request failed",
      });
    }

    return res.json(data.data?.objects ?? []);
  } catch (error) {
    console.error("REST Countries request failed:", error);

    return res.status(500).json({
      message: "Unable to retrieve country information",
    });
  }
});

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
