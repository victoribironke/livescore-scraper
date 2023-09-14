require("dotenv").config();

const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const { signInWithEmailAndPassword } = require("firebase/auth");
const { setDoc, doc } = require("firebase/firestore");
const { auth, db } = require("./firebase/firebase");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

const tableData = {};

const getFormattedData = async (page) => {
  const leagueTable = await page.evaluate(
    (selector) =>
      Array.from(document.querySelectorAll(selector), (e) => {
        const gameData = Array.from(
          e.getElementsByTagName("td"),
          (e) => e.textContent
        );
        const name = e.id.split("__")[0];

        return {
          name,
          played: gameData[2],
          wins: gameData[3],
          draws: gameData[4],
          losses: gameData[5],
          goalsFor: gameData[6],
          goalsAgainst: gameData[7],
          goalsDiff: gameData[8],
          points: gameData[9],
        };
      }),
    "tr"
  );

  return leagueTable;
};

app.get("/", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const getAndSaveLeague = async (url, name) => {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("tr");
    const data = await getFormattedData(page);

    tableData[name] = data;
  };

  try {
    await getAndSaveLeague(
      "https://www.livescore.com/en/football/england/premier-league/table/",
      "premier_league"
    );
    await getAndSaveLeague(
      "https://www.livescore.com/en/football/spain/laliga/table/",
      "la_liga"
    );
    await getAndSaveLeague(
      "https://www.livescore.com/en/football/italy/serie-a/table/",
      "serie_a"
    );
    await getAndSaveLeague(
      "https://www.livescore.com/en/football/germany/bundesliga/table/",
      "bundesliga"
    );
    await getAndSaveLeague(
      "https://www.livescore.com/en/football/france/ligue-1/table/",
      "ligue_1"
    );
    await browser.close();

    await signInWithEmailAndPassword(
      auth,
      "ibikidsfc56@gmail.com",
      "astrounaut"
    );

    await setDoc(doc(db, "admin", "data"), {
      bundesliga: tableData.bundesliga,
      la_liga: tableData.la_liga,
      ligue_1: tableData.ligue_1,
      premier_league: tableData.premier_league,
      serie_a: tableData.serie_a,
    });

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e, success: false });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
