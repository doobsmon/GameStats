import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "../components/App";
import App2 from "../components/App2";
import Home from "../components/Home";
import Players from "../components/Players";
import Games from "../components/Games";
import Nav from "../components/Nav";
import AddGame from "../components/AddGame";
import ViewGame from "../components/ViewGame";
const { pool, gotPool } = require("./queries");
const bodyParser = require("body-parser");
const server = express();

const urlEncodedParser = bodyParser.urlencoded({ extended: false });

server.use(express.static("dist"));

// server.get("/getData", (request, response) => {
//   console.log('server.get("/getData")');

//   pool.query("SELECT * FROM data", (err, res) => {
//     if (err) return console.log(err);
//     console.log(JSON.stringify(res.rows));
//     response.json(res.rows);
//   });
// });

// server.get("/getData2", (request, response) => {
//   console.log('server.get("/getData2")');
//   let out = [{ number1: 69, number2: 81 }];
//   console.log(JSON.stringify(out));
//   response.json(out);
// });

server.get("/getPlayers", (request, response, next) => {
  console.log('server.get("/getPlayers")');
  gotPool.query("SELECT * FROM players ORDER BY players.id", (err, res) => {
    if (err) return console.log(err);
    //console.log(JSON.stringify(res.rows));
    response.json(res.rows);
  });
});

server.get("/getGames", (request, response, next) => {
  console.log('server.get("/getGames")');
  gotPool.query(
    "SELECT id, name, notes,finalround, winner,  year, month, day, lannister, greyjoy, stark, arryn, baratheon, targaryen, dorn, tyrell FROM games_v1 ORDER BY games_v1.id",
    (err, res) => {
      if (err) return console.log(err);
      //console.log(JSON.stringify(res.rows));
      response.json(res.rows);
    }
  );
});

server.get("/getGames/:id", (request, response, next) => {
  console.log('server.get("/getGames/' + request.params.id + '")');
  gotPool.query(
    "SELECT * FROM games_v1 WHERE games_v1.id=$1 ",
    [request.params.id],
    (err, res) => {
      if (err) return console.log(err);
      //console.log("RES.ROWS = " + JSON.stringify(res.rows));
      response.json(res.rows);
    }
  );
});

server.get("/getGamesCount", (request, response, next) => {
  console.log('server.get("/getGamesCount")');
  gotPool.query("SELECT COUNT(*) FROM games_v1", (err, res) => {
    if (err) return console.log(err);
    //console.log(JSON.stringify(res.rows));
    response.json(res.rows);
  });
});

server.get("/", (request, response, next) => {
  console.log('server.get("/")');

  const initialMarkup = ReactDOMServer.renderToString(<Nav />);

  response.send(`
      <html>
        <head>
        <title>Sample React App</title>
        </head>
        <body>
          <div id="mountNode">${initialMarkup}</div>
          <script src="/main.js"></script>
        </body>
      </html>
      `);
});

server.get("/players", (request, response, next) => {
  console.log('server.get("/players")');

  const initialMarkup = ReactDOMServer.renderToString(<Nav />);

  response.send(`
      <html>
        <head>
        <title>Sample React App</title>
        </head>
        <body>
          <div id="mountNode">${initialMarkup}</div>
          <script src="/main.js"></script>
        </body>
      </html>
      `);
});

server.post("/addPlayer", urlEncodedParser, (request, response, next) => {
  console.log(
    'server.get("/addPlayer") with name ' +
      request.body.permanentName +
      " / " +
      request.body.displayName +
      " and id " +
      request.body.playerId
  );
  gotPool.query(
    `INSERT INTO players(id, name, displayName) VALUES($1, $2, $3);`,
    [
      request.body.playerId,
      request.body.permanentName,
      request.body.displayName
    ],
    (err, res) => {
      if (err) return console.log(err);
    }
  );
  response.redirect("/players");
});

server.post(
  "/updatePlayerName",
  urlEncodedParser,
  (request, response, next) => {
    console.log(
      'server.get("/updatePlayerName") with name ' +
        request.body.playersNewName +
        " and id " +
        request.body.playerId
    );
    gotPool.query(
      `UPDATE players SET displayname=$1 WHERE id=$2`,
      [request.body.playersNewName, request.body.playerId],
      (err, res) => {}
    );
    response.redirect("/players");
  }
);

server.get("/games", (request, response, next) => {
  console.log('server.get("/")');

  const initialMarkup = ReactDOMServer.renderToString(<Nav />);

  response.send(`
      <html>
        <head>
        <title>Sample React App</title>
        </head>
        <body>
          <div id="mountNode">${initialMarkup}</div>
          <script src="/main.js"></script>
        </body>
      </html>
      `);
});

server.get("/addGame", (request, response, next) => {
  console.log('server.get("/")');

  const initialMarkup = ReactDOMServer.renderToString(<Nav />);

  response.send(`
      <html>
        <head>
        <title>Sample React App</title>
        </head>
        <body>
          <div id="mountNode">${initialMarkup}</div>
          <script src="/main.js"></script>
        </body>
      </html>
      `);
});

server.get("/viewGame/:id", (request, response, next) => {
  console.log("server.get/viewGame/" + request.params.id);
  console.log("id is: " + request.params.id);

  const initialMarkup = ReactDOMServer.renderToString(<Nav />);

  response.send(`
      <html>
        <head>
        <title>Sample React App</title>
        </head>
        <body>
          <div id="mountNode">${initialMarkup}</div>
          <script src="/main.js"></script>
        </body>
      </html>
      `);
});

server.post(
  "/addGameToDatabase",
  urlEncodedParser,
  (request, response, next) => {
    let gameInfo = JSON.parse(request.body.gameInfo);

    console.log(
      'server.get("/addGameToDatabase") with gameInfo: ' +
        request.body.gameInfo +
        " and gameData: " +
        request.body.gameData
    );

    gotPool.query(
      `INSERT INTO games_v1 (id, name, notes, finalround, winner, day, month, year, lannister, greyjoy, stark, arryn, baratheon, targaryen, dorn, tyrell, gamedata) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
      [
        gameInfo.gameId,
        gameInfo.name,
        gameInfo.gameNotes,
        gameInfo.finalRound,
        gameInfo.winner,
        gameInfo.day,
        gameInfo.month,
        gameInfo.year,
        gameInfo.lannisterId,
        gameInfo.greyjoyId,
        gameInfo.starkId,
        gameInfo.arrynId,
        gameInfo.baratheonId,
        gameInfo.targaryenId,
        gameInfo.dornId,
        gameInfo.tyrellId,
        request.body.gameData
      ],
      (err, res) => {
        if (err) console.log(err);
      }
    );

    response.redirect("/games");
  }
);

server.post("/testJSON", urlEncodedParser, (request, response, next) => {
  console.log(
    'server.get("/testJSON") with name ' +
      request.body.lannisterFiefdoms1 +
      " and id " +
      request.body.dornPlayer
  );

  const round1 = {
    lannister: {
      fiefdoms: request.body.lannisterFiefdoms1,
      sword: request.body.lannisterSword1,
      raven: request.body.lannisterRaven1,
      supply: request.body.lannisterSupply1,
      boats: request.body.lannisterBoats1,
      footmen: request.body.lannisterFootmen1,
      knights: request.body.lannisterKnights1,
      siege: request.body.lannisterSiege1,
      strongholds: request.body.lannisterStrongholds1,
      castles: request.body.lannisterCastles1,
      territories: request.body.lannisterTerritories1
    },
    greyjoy: {
      fiefdoms: request.body.greyjoyFiefdoms1,
      sword: request.body.greyjoySword1,
      raven: request.body.greyjoyRaven1,
      supply: request.body.greyjoySupply1,
      boats: request.body.greyjoyBoats1,
      footmen: request.body.greyjoyFootmen1,
      knights: request.body.greyjoyKnights1,
      siege: request.body.greyjoySiege1,
      strongholds: request.body.greyjoyStrongholds1,
      castles: request.body.greyjoyCastles1,
      territories: request.body.greyjoyTerritories1
    },
    stark: {
      fiefdoms: request.body.starkFiefdoms1,
      sword: request.body.starkSword1,
      raven: request.body.starkRaven1,
      supply: request.body.starkSupply1,
      boats: request.body.starkBoats1,
      footmen: request.body.starkFootmen1,
      knights: request.body.starkKnights1,
      siege: request.body.starkSiege1,
      strongholds: request.body.starkStrongholds1,
      castles: request.body.starkCastles1,
      territories: request.body.starkTerritories1
    },
    arryn: {
      fiefdoms: request.body.arrynFiefdoms1,
      sword: request.body.arrynSword1,
      raven: request.body.arrynRaven1,
      supply: request.body.arrynSupply1,
      boats: request.body.arrynBoats1,
      footmen: request.body.arrynFootmen1,
      knights: request.body.arrynKnights1,
      siege: request.body.arrynSiege1,
      strongholds: request.body.arrynStrongholds1,
      castles: request.body.arrynCastles1,
      territories: request.body.arrynTerritories1
    },
    baratheon: {
      fiefdoms: request.body.baratheonFiefdoms1,
      sword: request.body.baratheonSword1,
      raven: request.body.baratheonRaven1,
      supply: request.body.baratheonSupply1,
      boats: request.body.baratheonBoats1,
      footmen: request.body.baratheonFootmen1,
      knights: request.body.baratheonKnights1,
      siege: request.body.baratheonSiege1,
      strongholds: request.body.baratheonStrongholds1,
      castles: request.body.baratheonCastles1,
      territories: request.body.baratheonTerritories1
    },
    targaryen: {
      fiefdoms: request.body.targaryenFiefdoms1,
      sword: request.body.targaryenSword1,
      raven: request.body.targaryenRaven1,
      supply: request.body.targaryenSupply1,
      boats: request.body.targaryenBoats1,
      footmen: request.body.targaryenFootmen1,
      knights: request.body.targaryenKnights1,
      siege: request.body.targaryenSiege1,
      strongholds: request.body.targaryenStrongholds1,
      castles: request.body.targaryenCastles1,
      territories: request.body.targaryenTerritories1
    },
    dorn: {
      fiefdoms: request.body.dornFiefdoms1,
      sword: request.body.dornSword1,
      raven: request.body.dornRaven1,
      supply: request.body.dornSupply1,
      boats: request.body.dornBoats1,
      footmen: request.body.dornFootmen1,
      knights: request.body.dornKnights1,
      siege: request.body.dornSiege1,
      strongholds: request.body.dornStrongholds1,
      castles: request.body.dornCastles1,
      territories: request.body.dornTerritories1
    },
    tyrell: {
      fiefdoms: request.body.tyrellFiefdoms1,
      sword: request.body.tyrellSword1,
      raven: request.body.tyrellRaven1,
      supply: request.body.tyrellSupply1,
      boats: request.body.tyrellBoats1,
      footmen: request.body.tyrellFootmen1,
      knights: request.body.tyrellKnights1,
      siege: request.body.tyrellSiege1,
      strongholds: request.body.tyrellStrongholds1,
      castles: request.body.tyrellCastles1,
      territories: request.body.tyrellTerritories1
    }
  };

  const round2 = {
    lannister: {
      fiefdoms: request.body.lannisterFiefdoms2,
      sword: request.body.lannisterSword2,
      raven: request.body.lannisterRaven2,
      supply: request.body.lannisterSupply2,
      boats: request.body.lannisterBoats2,
      footmen: request.body.lannisterFootmen2,
      knights: request.body.lannisterKnights2,
      siege: request.body.lannisterSiege2,
      strongholds: request.body.lannisterStrongholds2,
      castles: request.body.lannisterCastles2,
      territories: request.body.lannisterTerritories2
    },
    greyjoy: {
      fiefdoms: request.body.greyjoyFiefdoms2,
      sword: request.body.greyjoySword2,
      raven: request.body.greyjoyRaven2,
      supply: request.body.greyjoySupply2,
      boats: request.body.greyjoyBoats2,
      footmen: request.body.greyjoyFootmen2,
      knights: request.body.greyjoyKnights2,
      siege: request.body.greyjoySiege2,
      strongholds: request.body.greyjoyStrongholds2,
      castles: request.body.greyjoyCastles2,
      territories: request.body.greyjoyTerritories2
    },
    stark: {
      fiefdoms: request.body.starkFiefdoms2,
      sword: request.body.starkSword2,
      raven: request.body.starkRaven2,
      supply: request.body.starkSupply2,
      boats: request.body.starkBoats2,
      footmen: request.body.starkFootmen2,
      knights: request.body.starkKnights2,
      siege: request.body.starkSiege2,
      strongholds: request.body.starkStrongholds2,
      castles: request.body.starkCastles2,
      territories: request.body.starkTerritories2
    },
    arryn: {
      fiefdoms: request.body.arrynFiefdoms2,
      sword: request.body.arrynSword2,
      raven: request.body.arrynRaven2,
      supply: request.body.arrynSupply2,
      boats: request.body.arrynBoats2,
      footmen: request.body.arrynFootmen2,
      knights: request.body.arrynKnights2,
      siege: request.body.arrynSiege2,
      strongholds: request.body.arrynStrongholds2,
      castles: request.body.arrynCastles2,
      territories: request.body.arrynTerritories2
    },
    baratheon: {
      fiefdoms: request.body.baratheonFiefdoms2,
      sword: request.body.baratheonSword2,
      raven: request.body.baratheonRaven2,
      supply: request.body.baratheonSupply2,
      boats: request.body.baratheonBoats2,
      footmen: request.body.baratheonFootmen2,
      knights: request.body.baratheonKnights2,
      siege: request.body.baratheonSiege2,
      strongholds: request.body.baratheonStrongholds2,
      castles: request.body.baratheonCastles2,
      territories: request.body.baratheonTerritories2
    },
    targaryen: {
      fiefdoms: request.body.targaryenFiefdoms2,
      sword: request.body.targaryenSword2,
      raven: request.body.targaryenRaven2,
      supply: request.body.targaryenSupply2,
      boats: request.body.targaryenBoats2,
      footmen: request.body.targaryenFootmen2,
      knights: request.body.targaryenKnights2,
      siege: request.body.targaryenSiege2,
      strongholds: request.body.targaryenStrongholds2,
      castles: request.body.targaryenCastles2,
      territories: request.body.targaryenTerritories2
    },
    dorn: {
      fiefdoms: request.body.dornFiefdoms2,
      sword: request.body.dornSword2,
      raven: request.body.dornRaven2,
      supply: request.body.dornSupply2,
      boats: request.body.dornBoats2,
      footmen: request.body.dornFootmen2,
      knights: request.body.dornKnights2,
      siege: request.body.dornSiege2,
      strongholds: request.body.dornStrongholds2,
      castles: request.body.dornCastles2,
      territories: request.body.dornTerritories2
    },
    tyrell: {
      fiefdoms: request.body.tyrellFiefdoms2,
      sword: request.body.tyrellSword2,
      raven: request.body.tyrellRaven2,
      supply: request.body.tyrellSupply2,
      boats: request.body.tyrellBoats2,
      footmen: request.body.tyrellFootmen2,
      knights: request.body.tyrellKnights2,
      siege: request.body.tyrellSiege2,
      strongholds: request.body.tyrellStrongholds2,
      castles: request.body.tyrellCastles2,
      territories: request.body.tyrellTerritories2
    }
  };

  const round3 = {
    lannister: {
      fiefdoms: request.body.lannisterFiefdoms3,
      sword: request.body.lannisterSword3,
      raven: request.body.lannisterRaven3,
      supply: request.body.lannisterSupply3,
      boats: request.body.lannisterBoats3,
      footmen: request.body.lannisterFootmen3,
      knights: request.body.lannisterKnights3,
      siege: request.body.lannisterSiege3,
      strongholds: request.body.lannisterStrongholds3,
      castles: request.body.lannisterCastles3,
      territories: request.body.lannisterTerritories3
    },
    greyjoy: {
      fiefdoms: request.body.greyjoyFiefdoms3,
      sword: request.body.greyjoySword3,
      raven: request.body.greyjoyRaven3,
      supply: request.body.greyjoySupply3,
      boats: request.body.greyjoyBoats3,
      footmen: request.body.greyjoyFootmen3,
      knights: request.body.greyjoyKnights3,
      siege: request.body.greyjoySiege3,
      strongholds: request.body.greyjoyStrongholds3,
      castles: request.body.greyjoyCastles3,
      territories: request.body.greyjoyTerritories3
    },
    stark: {
      fiefdoms: request.body.starkFiefdoms3,
      sword: request.body.starkSword3,
      raven: request.body.starkRaven3,
      supply: request.body.starkSupply3,
      boats: request.body.starkBoats3,
      footmen: request.body.starkFootmen3,
      knights: request.body.starkKnights3,
      siege: request.body.starkSiege3,
      strongholds: request.body.starkStrongholds3,
      castles: request.body.starkCastles3,
      territories: request.body.starkTerritories3
    },
    arryn: {
      fiefdoms: request.body.arrynFiefdoms3,
      sword: request.body.arrynSword3,
      raven: request.body.arrynRaven3,
      supply: request.body.arrynSupply3,
      boats: request.body.arrynBoats3,
      footmen: request.body.arrynFootmen3,
      knights: request.body.arrynKnights3,
      siege: request.body.arrynSiege3,
      strongholds: request.body.arrynStrongholds3,
      castles: request.body.arrynCastles3,
      territories: request.body.arrynTerritories3
    },
    baratheon: {
      fiefdoms: request.body.baratheonFiefdoms3,
      sword: request.body.baratheonSword3,
      raven: request.body.baratheonRaven3,
      supply: request.body.baratheonSupply3,
      boats: request.body.baratheonBoats3,
      footmen: request.body.baratheonFootmen3,
      knights: request.body.baratheonKnights3,
      siege: request.body.baratheonSiege3,
      strongholds: request.body.baratheonStrongholds3,
      castles: request.body.baratheonCastles3,
      territories: request.body.baratheonTerritories3
    },
    targaryen: {
      fiefdoms: request.body.targaryenFiefdoms3,
      sword: request.body.targaryenSword3,
      raven: request.body.targaryenRaven3,
      supply: request.body.targaryenSupply3,
      boats: request.body.targaryenBoats3,
      footmen: request.body.targaryenFootmen3,
      knights: request.body.targaryenKnights3,
      siege: request.body.targaryenSiege3,
      strongholds: request.body.targaryenStrongholds3,
      castles: request.body.targaryenCastles3,
      territories: request.body.targaryenTerritories3
    },
    dorn: {
      fiefdoms: request.body.dornFiefdoms3,
      sword: request.body.dornSword3,
      raven: request.body.dornRaven3,
      supply: request.body.dornSupply3,
      boats: request.body.dornBoats3,
      footmen: request.body.dornFootmen3,
      knights: request.body.dornKnights3,
      siege: request.body.dornSiege3,
      strongholds: request.body.dornStrongholds3,
      castles: request.body.dornCastles3,
      territories: request.body.dornTerritories3
    },
    tyrell: {
      fiefdoms: request.body.tyrellFiefdoms3,
      sword: request.body.tyrellSword3,
      raven: request.body.tyrellRaven3,
      supply: request.body.tyrellSupply3,
      boats: request.body.tyrellBoats3,
      footmen: request.body.tyrellFootmen3,
      knights: request.body.tyrellKnights3,
      siege: request.body.tyrellSiege3,
      strongholds: request.body.tyrellStrongholds3,
      castles: request.body.tyrellCastles3,
      territories: request.body.tyrellTerritories3
    }
  };

  const round4 = {
    lannister: {
      fiefdoms: request.body.lannisterFiefdoms4,
      sword: request.body.lannisterSword4,
      raven: request.body.lannisterRaven4,
      supply: request.body.lannisterSupply4,
      boats: request.body.lannisterBoats4,
      footmen: request.body.lannisterFootmen4,
      knights: request.body.lannisterKnights4,
      siege: request.body.lannisterSiege4,
      strongholds: request.body.lannisterStrongholds4,
      castles: request.body.lannisterCastles4,
      territories: request.body.lannisterTerritories4
    },
    greyjoy: {
      fiefdoms: request.body.greyjoyFiefdoms4,
      sword: request.body.greyjoySword4,
      raven: request.body.greyjoyRaven4,
      supply: request.body.greyjoySupply4,
      boats: request.body.greyjoyBoats4,
      footmen: request.body.greyjoyFootmen4,
      knights: request.body.greyjoyKnights4,
      siege: request.body.greyjoySiege4,
      strongholds: request.body.greyjoyStrongholds4,
      castles: request.body.greyjoyCastles4,
      territories: request.body.greyjoyTerritories4
    },
    stark: {
      fiefdoms: request.body.starkFiefdoms4,
      sword: request.body.starkSword4,
      raven: request.body.starkRaven4,
      supply: request.body.starkSupply4,
      boats: request.body.starkBoats4,
      footmen: request.body.starkFootmen4,
      knights: request.body.starkKnights4,
      siege: request.body.starkSiege4,
      strongholds: request.body.starkStrongholds4,
      castles: request.body.starkCastles4,
      territories: request.body.starkTerritories4
    },
    arryn: {
      fiefdoms: request.body.arrynFiefdoms4,
      sword: request.body.arrynSword4,
      raven: request.body.arrynRaven4,
      supply: request.body.arrynSupply4,
      boats: request.body.arrynBoats4,
      footmen: request.body.arrynFootmen4,
      knights: request.body.arrynKnights4,
      siege: request.body.arrynSiege4,
      strongholds: request.body.arrynStrongholds4,
      castles: request.body.arrynCastles4,
      territories: request.body.arrynTerritories4
    },
    baratheon: {
      fiefdoms: request.body.baratheonFiefdoms4,
      sword: request.body.baratheonSword4,
      raven: request.body.baratheonRaven4,
      supply: request.body.baratheonSupply4,
      boats: request.body.baratheonBoats4,
      footmen: request.body.baratheonFootmen4,
      knights: request.body.baratheonKnights4,
      siege: request.body.baratheonSiege4,
      strongholds: request.body.baratheonStrongholds4,
      castles: request.body.baratheonCastles4,
      territories: request.body.baratheonTerritories4
    },
    targaryen: {
      fiefdoms: request.body.targaryenFiefdoms4,
      sword: request.body.targaryenSword4,
      raven: request.body.targaryenRaven4,
      supply: request.body.targaryenSupply4,
      boats: request.body.targaryenBoats4,
      footmen: request.body.targaryenFootmen4,
      knights: request.body.targaryenKnights4,
      siege: request.body.targaryenSiege4,
      strongholds: request.body.targaryenStrongholds4,
      castles: request.body.targaryenCastles4,
      territories: request.body.targaryenTerritories4
    },
    dorn: {
      fiefdoms: request.body.dornFiefdoms4,
      sword: request.body.dornSword4,
      raven: request.body.dornRaven4,
      supply: request.body.dornSupply4,
      boats: request.body.dornBoats4,
      footmen: request.body.dornFootmen4,
      knights: request.body.dornKnights4,
      siege: request.body.dornSiege4,
      strongholds: request.body.dornStrongholds4,
      castles: request.body.dornCastles4,
      territories: request.body.dornTerritories4
    },
    tyrell: {
      fiefdoms: request.body.tyrellFiefdoms4,
      sword: request.body.tyrellSword4,
      raven: request.body.tyrellRaven4,
      supply: request.body.tyrellSupply4,
      boats: request.body.tyrellBoats4,
      footmen: request.body.tyrellFootmen4,
      knights: request.body.tyrellKnights4,
      siege: request.body.tyrellSiege4,
      strongholds: request.body.tyrellStrongholds4,
      castles: request.body.tyrellCastles4,
      territories: request.body.tyrellTerritories4
    }
  };

  const round5 = {
    lannister: {
      fiefdoms: request.body.lannisterFiefdoms5,
      sword: request.body.lannisterSword5,
      raven: request.body.lannisterRaven5,
      supply: request.body.lannisterSupply5,
      boats: request.body.lannisterBoats5,
      footmen: request.body.lannisterFootmen5,
      knights: request.body.lannisterKnights5,
      siege: request.body.lannisterSiege5,
      strongholds: request.body.lannisterStrongholds5,
      castles: request.body.lannisterCastles5,
      territories: request.body.lannisterTerritories5
    },
    greyjoy: {
      fiefdoms: request.body.greyjoyFiefdoms5,
      sword: request.body.greyjoySword5,
      raven: request.body.greyjoyRaven5,
      supply: request.body.greyjoySupply5,
      boats: request.body.greyjoyBoats5,
      footmen: request.body.greyjoyFootmen5,
      knights: request.body.greyjoyKnights5,
      siege: request.body.greyjoySiege5,
      strongholds: request.body.greyjoyStrongholds5,
      castles: request.body.greyjoyCastles5,
      territories: request.body.greyjoyTerritories5
    },
    stark: {
      fiefdoms: request.body.starkFiefdoms5,
      sword: request.body.starkSword5,
      raven: request.body.starkRaven5,
      supply: request.body.starkSupply5,
      boats: request.body.starkBoats5,
      footmen: request.body.starkFootmen5,
      knights: request.body.starkKnights5,
      siege: request.body.starkSiege5,
      strongholds: request.body.starkStrongholds5,
      castles: request.body.starkCastles5,
      territories: request.body.starkTerritories5
    },
    arryn: {
      fiefdoms: request.body.arrynFiefdoms5,
      sword: request.body.arrynSword5,
      raven: request.body.arrynRaven5,
      supply: request.body.arrynSupply5,
      boats: request.body.arrynBoats5,
      footmen: request.body.arrynFootmen5,
      knights: request.body.arrynKnights5,
      siege: request.body.arrynSiege5,
      strongholds: request.body.arrynStrongholds5,
      castles: request.body.arrynCastles5,
      territories: request.body.arrynTerritories5
    },
    baratheon: {
      fiefdoms: request.body.baratheonFiefdoms5,
      sword: request.body.baratheonSword5,
      raven: request.body.baratheonRaven5,
      supply: request.body.baratheonSupply5,
      boats: request.body.baratheonBoats5,
      footmen: request.body.baratheonFootmen5,
      knights: request.body.baratheonKnights5,
      siege: request.body.baratheonSiege5,
      strongholds: request.body.baratheonStrongholds5,
      castles: request.body.baratheonCastles5,
      territories: request.body.baratheonTerritories5
    },
    targaryen: {
      fiefdoms: request.body.targaryenFiefdoms5,
      sword: request.body.targaryenSword5,
      raven: request.body.targaryenRaven5,
      supply: request.body.targaryenSupply5,
      boats: request.body.targaryenBoats5,
      footmen: request.body.targaryenFootmen5,
      knights: request.body.targaryenKnights5,
      siege: request.body.targaryenSiege5,
      strongholds: request.body.targaryenStrongholds5,
      castles: request.body.targaryenCastles5,
      territories: request.body.targaryenTerritories5
    },
    dorn: {
      fiefdoms: request.body.dornFiefdoms5,
      sword: request.body.dornSword5,
      raven: request.body.dornRaven5,
      supply: request.body.dornSupply5,
      boats: request.body.dornBoats5,
      footmen: request.body.dornFootmen5,
      knights: request.body.dornKnights5,
      siege: request.body.dornSiege5,
      strongholds: request.body.dornStrongholds5,
      castles: request.body.dornCastles5,
      territories: request.body.dornTerritories5
    },
    tyrell: {
      fiefdoms: request.body.tyrellFiefdoms5,
      sword: request.body.tyrellSword5,
      raven: request.body.tyrellRaven5,
      supply: request.body.tyrellSupply5,
      boats: request.body.tyrellBoats5,
      footmen: request.body.tyrellFootmen5,
      knights: request.body.tyrellKnights5,
      siege: request.body.tyrellSiege5,
      strongholds: request.body.tyrellStrongholds5,
      castles: request.body.tyrellCastles5,
      territories: request.body.tyrellTerritories5
    }
  };

  const round6 = {
    lannister: {
      fiefdoms: request.body.lannisterFiefdoms6,
      sword: request.body.lannisterSword6,
      raven: request.body.lannisterRaven6,
      supply: request.body.lannisterSupply6,
      boats: request.body.lannisterBoats6,
      footmen: request.body.lannisterFootmen6,
      knights: request.body.lannisterKnights6,
      siege: request.body.lannisterSiege6,
      strongholds: request.body.lannisterStrongholds6,
      castles: request.body.lannisterCastles6,
      territories: request.body.lannisterTerritories6
    },
    greyjoy: {
      fiefdoms: request.body.greyjoyFiefdoms6,
      sword: request.body.greyjoySword6,
      raven: request.body.greyjoyRaven6,
      supply: request.body.greyjoySupply6,
      boats: request.body.greyjoyBoats6,
      footmen: request.body.greyjoyFootmen6,
      knights: request.body.greyjoyKnights6,
      siege: request.body.greyjoySiege6,
      strongholds: request.body.greyjoyStrongholds6,
      castles: request.body.greyjoyCastles6,
      territories: request.body.greyjoyTerritories6
    },
    stark: {
      fiefdoms: request.body.starkFiefdoms6,
      sword: request.body.starkSword6,
      raven: request.body.starkRaven6,
      supply: request.body.starkSupply6,
      boats: request.body.starkBoats6,
      footmen: request.body.starkFootmen6,
      knights: request.body.starkKnights6,
      siege: request.body.starkSiege6,
      strongholds: request.body.starkStrongholds6,
      castles: request.body.starkCastles6,
      territories: request.body.starkTerritories6
    },
    arryn: {
      fiefdoms: request.body.arrynFiefdoms6,
      sword: request.body.arrynSword6,
      raven: request.body.arrynRaven6,
      supply: request.body.arrynSupply6,
      boats: request.body.arrynBoats6,
      footmen: request.body.arrynFootmen6,
      knights: request.body.arrynKnights6,
      siege: request.body.arrynSiege6,
      strongholds: request.body.arrynStrongholds6,
      castles: request.body.arrynCastles6,
      territories: request.body.arrynTerritories6
    },
    baratheon: {
      fiefdoms: request.body.baratheonFiefdoms6,
      sword: request.body.baratheonSword6,
      raven: request.body.baratheonRaven6,
      supply: request.body.baratheonSupply6,
      boats: request.body.baratheonBoats6,
      footmen: request.body.baratheonFootmen6,
      knights: request.body.baratheonKnights6,
      siege: request.body.baratheonSiege6,
      strongholds: request.body.baratheonStrongholds6,
      castles: request.body.baratheonCastles6,
      territories: request.body.baratheonTerritories6
    },
    targaryen: {
      fiefdoms: request.body.targaryenFiefdoms6,
      sword: request.body.targaryenSword6,
      raven: request.body.targaryenRaven6,
      supply: request.body.targaryenSupply6,
      boats: request.body.targaryenBoats6,
      footmen: request.body.targaryenFootmen6,
      knights: request.body.targaryenKnights6,
      siege: request.body.targaryenSiege6,
      strongholds: request.body.targaryenStrongholds6,
      castles: request.body.targaryenCastles6,
      territories: request.body.targaryenTerritories6
    },
    dorn: {
      fiefdoms: request.body.dornFiefdoms6,
      sword: request.body.dornSword6,
      raven: request.body.dornRaven6,
      supply: request.body.dornSupply6,
      boats: request.body.dornBoats6,
      footmen: request.body.dornFootmen6,
      knights: request.body.dornKnights6,
      siege: request.body.dornSiege6,
      strongholds: request.body.dornStrongholds6,
      castles: request.body.dornCastles6,
      territories: request.body.dornTerritories6
    },
    tyrell: {
      fiefdoms: request.body.tyrellFiefdoms6,
      sword: request.body.tyrellSword6,
      raven: request.body.tyrellRaven6,
      supply: request.body.tyrellSupply6,
      boats: request.body.tyrellBoats6,
      footmen: request.body.tyrellFootmen6,
      knights: request.body.tyrellKnights6,
      siege: request.body.tyrellSiege6,
      strongholds: request.body.tyrellStrongholds6,
      castles: request.body.tyrellCastles6,
      territories: request.body.tyrellTerritories6
    }
  };

  const round7 = {
    lannister: {
      fiefdoms: request.body.lannisterFiefdoms7,
      sword: request.body.lannisterSword7,
      raven: request.body.lannisterRaven7,
      supply: request.body.lannisterSupply7,
      boats: request.body.lannisterBoats7,
      footmen: request.body.lannisterFootmen7,
      knights: request.body.lannisterKnights7,
      siege: request.body.lannisterSiege7,
      strongholds: request.body.lannisterStrongholds7,
      castles: request.body.lannisterCastles7,
      territories: request.body.lannisterTerritories7
    },
    greyjoy: {
      fiefdoms: request.body.greyjoyFiefdoms7,
      sword: request.body.greyjoySword7,
      raven: request.body.greyjoyRaven7,
      supply: request.body.greyjoySupply7,
      boats: request.body.greyjoyBoats7,
      footmen: request.body.greyjoyFootmen7,
      knights: request.body.greyjoyKnights7,
      siege: request.body.greyjoySiege7,
      strongholds: request.body.greyjoyStrongholds7,
      castles: request.body.greyjoyCastles7,
      territories: request.body.greyjoyTerritories7
    },
    stark: {
      fiefdoms: request.body.starkFiefdoms7,
      sword: request.body.starkSword7,
      raven: request.body.starkRaven7,
      supply: request.body.starkSupply7,
      boats: request.body.starkBoats7,
      footmen: request.body.starkFootmen7,
      knights: request.body.starkKnights7,
      siege: request.body.starkSiege7,
      strongholds: request.body.starkStrongholds7,
      castles: request.body.starkCastles7,
      territories: request.body.starkTerritories7
    },
    arryn: {
      fiefdoms: request.body.arrynFiefdoms7,
      sword: request.body.arrynSword7,
      raven: request.body.arrynRaven7,
      supply: request.body.arrynSupply7,
      boats: request.body.arrynBoats7,
      footmen: request.body.arrynFootmen7,
      knights: request.body.arrynKnights7,
      siege: request.body.arrynSiege7,
      strongholds: request.body.arrynStrongholds7,
      castles: request.body.arrynCastles7,
      territories: request.body.arrynTerritories7
    },
    baratheon: {
      fiefdoms: request.body.baratheonFiefdoms7,
      sword: request.body.baratheonSword7,
      raven: request.body.baratheonRaven7,
      supply: request.body.baratheonSupply7,
      boats: request.body.baratheonBoats7,
      footmen: request.body.baratheonFootmen7,
      knights: request.body.baratheonKnights7,
      siege: request.body.baratheonSiege7,
      strongholds: request.body.baratheonStrongholds7,
      castles: request.body.baratheonCastles7,
      territories: request.body.baratheonTerritories7
    },
    targaryen: {
      fiefdoms: request.body.targaryenFiefdoms7,
      sword: request.body.targaryenSword7,
      raven: request.body.targaryenRaven7,
      supply: request.body.targaryenSupply7,
      boats: request.body.targaryenBoats7,
      footmen: request.body.targaryenFootmen7,
      knights: request.body.targaryenKnights7,
      siege: request.body.targaryenSiege7,
      strongholds: request.body.targaryenStrongholds7,
      castles: request.body.targaryenCastles7,
      territories: request.body.targaryenTerritories7
    },
    dorn: {
      fiefdoms: request.body.dornFiefdoms7,
      sword: request.body.dornSword7,
      raven: request.body.dornRaven7,
      supply: request.body.dornSupply7,
      boats: request.body.dornBoats7,
      footmen: request.body.dornFootmen7,
      knights: request.body.dornKnights7,
      siege: request.body.dornSiege7,
      strongholds: request.body.dornStrongholds7,
      castles: request.body.dornCastles7,
      territories: request.body.dornTerritories7
    },
    tyrell: {
      fiefdoms: request.body.tyrellFiefdoms7,
      sword: request.body.tyrellSword7,
      raven: request.body.tyrellRaven7,
      supply: request.body.tyrellSupply7,
      boats: request.body.tyrellBoats7,
      footmen: request.body.tyrellFootmen7,
      knights: request.body.tyrellKnights7,
      siege: request.body.tyrellSiege7,
      strongholds: request.body.tyrellStrongholds7,
      castles: request.body.tyrellCastles7,
      territories: request.body.tyrellTerritories7
    }
  };

  const round8 = {
    lannister: {
      fiefdoms: request.body.lannisterFiefdoms8,
      sword: request.body.lannisterSword8,
      raven: request.body.lannisterRaven8,
      supply: request.body.lannisterSupply8,
      boats: request.body.lannisterBoats8,
      footmen: request.body.lannisterFootmen8,
      knights: request.body.lannisterKnights8,
      siege: request.body.lannisterSiege8,
      strongholds: request.body.lannisterStrongholds8,
      castles: request.body.lannisterCastles8,
      territories: request.body.lannisterTerritories8
    },
    greyjoy: {
      fiefdoms: request.body.greyjoyFiefdoms8,
      sword: request.body.greyjoySword8,
      raven: request.body.greyjoyRaven8,
      supply: request.body.greyjoySupply8,
      boats: request.body.greyjoyBoats8,
      footmen: request.body.greyjoyFootmen8,
      knights: request.body.greyjoyKnights8,
      siege: request.body.greyjoySiege8,
      strongholds: request.body.greyjoyStrongholds8,
      castles: request.body.greyjoyCastles8,
      territories: request.body.greyjoyTerritories8
    },
    stark: {
      fiefdoms: request.body.starkFiefdoms8,
      sword: request.body.starkSword8,
      raven: request.body.starkRaven8,
      supply: request.body.starkSupply8,
      boats: request.body.starkBoats8,
      footmen: request.body.starkFootmen8,
      knights: request.body.starkKnights8,
      siege: request.body.starkSiege8,
      strongholds: request.body.starkStrongholds8,
      castles: request.body.starkCastles8,
      territories: request.body.starkTerritories8
    },
    arryn: {
      fiefdoms: request.body.arrynFiefdoms8,
      sword: request.body.arrynSword8,
      raven: request.body.arrynRaven8,
      supply: request.body.arrynSupply8,
      boats: request.body.arrynBoats8,
      footmen: request.body.arrynFootmen8,
      knights: request.body.arrynKnights8,
      siege: request.body.arrynSiege8,
      strongholds: request.body.arrynStrongholds8,
      castles: request.body.arrynCastles8,
      territories: request.body.arrynTerritories8
    },
    baratheon: {
      fiefdoms: request.body.baratheonFiefdoms8,
      sword: request.body.baratheonSword8,
      raven: request.body.baratheonRaven8,
      supply: request.body.baratheonSupply8,
      boats: request.body.baratheonBoats8,
      footmen: request.body.baratheonFootmen8,
      knights: request.body.baratheonKnights8,
      siege: request.body.baratheonSiege8,
      strongholds: request.body.baratheonStrongholds8,
      castles: request.body.baratheonCastles8,
      territories: request.body.baratheonTerritories8
    },
    targaryen: {
      fiefdoms: request.body.targaryenFiefdoms8,
      sword: request.body.targaryenSword8,
      raven: request.body.targaryenRaven8,
      supply: request.body.targaryenSupply8,
      boats: request.body.targaryenBoats8,
      footmen: request.body.targaryenFootmen8,
      knights: request.body.targaryenKnights8,
      siege: request.body.targaryenSiege8,
      strongholds: request.body.targaryenStrongholds8,
      castles: request.body.targaryenCastles8,
      territories: request.body.targaryenTerritories8
    },
    dorn: {
      fiefdoms: request.body.dornFiefdoms8,
      sword: request.body.dornSword8,
      raven: request.body.dornRaven8,
      supply: request.body.dornSupply8,
      boats: request.body.dornBoats8,
      footmen: request.body.dornFootmen8,
      knights: request.body.dornKnights8,
      siege: request.body.dornSiege8,
      strongholds: request.body.dornStrongholds8,
      castles: request.body.dornCastles8,
      territories: request.body.dornTerritories8
    },
    tyrell: {
      fiefdoms: request.body.tyrellFiefdoms8,
      sword: request.body.tyrellSword8,
      raven: request.body.tyrellRaven8,
      supply: request.body.tyrellSupply8,
      boats: request.body.tyrellBoats8,
      footmen: request.body.tyrellFootmen8,
      knights: request.body.tyrellKnights8,
      siege: request.body.tyrellSiege8,
      strongholds: request.body.tyrellStrongholds8,
      castles: request.body.tyrellCastles8,
      territories: request.body.tyrellTerritories8
    }
  };

  const round9 = {
    lannister: {
      fiefdoms: request.body.lannisterFiefdoms9,
      sword: request.body.lannisterSword9,
      raven: request.body.lannisterRaven9,
      supply: request.body.lannisterSupply9,
      boats: request.body.lannisterBoats9,
      footmen: request.body.lannisterFootmen9,
      knights: request.body.lannisterKnights9,
      siege: request.body.lannisterSiege9,
      strongholds: request.body.lannisterStrongholds9,
      castles: request.body.lannisterCastles9,
      territories: request.body.lannisterTerritories9
    },
    greyjoy: {
      fiefdoms: request.body.greyjoyFiefdoms9,
      sword: request.body.greyjoySword9,
      raven: request.body.greyjoyRaven9,
      supply: request.body.greyjoySupply9,
      boats: request.body.greyjoyBoats9,
      footmen: request.body.greyjoyFootmen9,
      knights: request.body.greyjoyKnights9,
      siege: request.body.greyjoySiege9,
      strongholds: request.body.greyjoyStrongholds9,
      castles: request.body.greyjoyCastles9,
      territories: request.body.greyjoyTerritories9
    },
    stark: {
      fiefdoms: request.body.starkFiefdoms9,
      sword: request.body.starkSword9,
      raven: request.body.starkRaven9,
      supply: request.body.starkSupply9,
      boats: request.body.starkBoats9,
      footmen: request.body.starkFootmen9,
      knights: request.body.starkKnights9,
      siege: request.body.starkSiege9,
      strongholds: request.body.starkStrongholds9,
      castles: request.body.starkCastles9,
      territories: request.body.starkTerritories9
    },
    arryn: {
      fiefdoms: request.body.arrynFiefdoms9,
      sword: request.body.arrynSword9,
      raven: request.body.arrynRaven9,
      supply: request.body.arrynSupply9,
      boats: request.body.arrynBoats9,
      footmen: request.body.arrynFootmen9,
      knights: request.body.arrynKnights9,
      siege: request.body.arrynSiege9,
      strongholds: request.body.arrynStrongholds9,
      castles: request.body.arrynCastles9,
      territories: request.body.arrynTerritories9
    },
    baratheon: {
      fiefdoms: request.body.baratheonFiefdoms9,
      sword: request.body.baratheonSword9,
      raven: request.body.baratheonRaven9,
      supply: request.body.baratheonSupply9,
      boats: request.body.baratheonBoats9,
      footmen: request.body.baratheonFootmen9,
      knights: request.body.baratheonKnights9,
      siege: request.body.baratheonSiege9,
      strongholds: request.body.baratheonStrongholds9,
      castles: request.body.baratheonCastles9,
      territories: request.body.baratheonTerritories9
    },
    targaryen: {
      fiefdoms: request.body.targaryenFiefdoms9,
      sword: request.body.targaryenSword9,
      raven: request.body.targaryenRaven9,
      supply: request.body.targaryenSupply9,
      boats: request.body.targaryenBoats9,
      footmen: request.body.targaryenFootmen9,
      knights: request.body.targaryenKnights9,
      siege: request.body.targaryenSiege9,
      strongholds: request.body.targaryenStrongholds9,
      castles: request.body.targaryenCastles9,
      territories: request.body.targaryenTerritories9
    },
    dorn: {
      fiefdoms: request.body.dornFiefdoms9,
      sword: request.body.dornSword9,
      raven: request.body.dornRaven9,
      supply: request.body.dornSupply9,
      boats: request.body.dornBoats9,
      footmen: request.body.dornFootmen9,
      knights: request.body.dornKnights9,
      siege: request.body.dornSiege9,
      strongholds: request.body.dornStrongholds9,
      castles: request.body.dornCastles9,
      territories: request.body.dornTerritories9
    },
    tyrell: {
      fiefdoms: request.body.tyrellFiefdoms9,
      sword: request.body.tyrellSword9,
      raven: request.body.tyrellRaven9,
      supply: request.body.tyrellSupply9,
      boats: request.body.tyrellBoats9,
      footmen: request.body.tyrellFootmen9,
      knights: request.body.tyrellKnights9,
      siege: request.body.tyrellSiege9,
      strongholds: request.body.tyrellStrongholds9,
      castles: request.body.tyrellCastles9,
      territories: request.body.tyrellTerritories9
    }
  };

  const round10 = {
    lannister: {
      fiefdoms: request.body.lannisterFiefdoms10,
      sword: request.body.lannisterSword10,
      raven: request.body.lannisterRaven10,
      supply: request.body.lannisterSupply10,
      boats: request.body.lannisterBoats10,
      footmen: request.body.lannisterFootmen10,
      knights: request.body.lannisterKnights10,
      siege: request.body.lannisterSiege10,
      strongholds: request.body.lannisterStrongholds10,
      castles: request.body.lannisterCastles10,
      territories: request.body.lannisterTerritories10
    },
    greyjoy: {
      fiefdoms: request.body.greyjoyFiefdoms10,
      sword: request.body.greyjoySword10,
      raven: request.body.greyjoyRaven10,
      supply: request.body.greyjoySupply10,
      boats: request.body.greyjoyBoats10,
      footmen: request.body.greyjoyFootmen10,
      knights: request.body.greyjoyKnights10,
      siege: request.body.greyjoySiege10,
      strongholds: request.body.greyjoyStrongholds10,
      castles: request.body.greyjoyCastles10,
      territories: request.body.greyjoyTerritories10
    },
    stark: {
      fiefdoms: request.body.starkFiefdoms10,
      sword: request.body.starkSword10,
      raven: request.body.starkRaven10,
      supply: request.body.starkSupply10,
      boats: request.body.starkBoats10,
      footmen: request.body.starkFootmen10,
      knights: request.body.starkKnights10,
      siege: request.body.starkSiege10,
      strongholds: request.body.starkStrongholds10,
      castles: request.body.starkCastles10,
      territories: request.body.starkTerritories10
    },
    arryn: {
      fiefdoms: request.body.arrynFiefdoms10,
      sword: request.body.arrynSword10,
      raven: request.body.arrynRaven10,
      supply: request.body.arrynSupply10,
      boats: request.body.arrynBoats10,
      footmen: request.body.arrynFootmen10,
      knights: request.body.arrynKnights10,
      siege: request.body.arrynSiege10,
      strongholds: request.body.arrynStrongholds10,
      castles: request.body.arrynCastles10,
      territories: request.body.arrynTerritories10
    },
    baratheon: {
      fiefdoms: request.body.baratheonFiefdoms10,
      sword: request.body.baratheonSword10,
      raven: request.body.baratheonRaven10,
      supply: request.body.baratheonSupply10,
      boats: request.body.baratheonBoats10,
      footmen: request.body.baratheonFootmen10,
      knights: request.body.baratheonKnights10,
      siege: request.body.baratheonSiege10,
      strongholds: request.body.baratheonStrongholds10,
      castles: request.body.baratheonCastles10,
      territories: request.body.baratheonTerritories10
    },
    targaryen: {
      fiefdoms: request.body.targaryenFiefdoms10,
      sword: request.body.targaryenSword10,
      raven: request.body.targaryenRaven10,
      supply: request.body.targaryenSupply10,
      boats: request.body.targaryenBoats10,
      footmen: request.body.targaryenFootmen10,
      knights: request.body.targaryenKnights10,
      siege: request.body.targaryenSiege10,
      strongholds: request.body.targaryenStrongholds10,
      castles: request.body.targaryenCastles10,
      territories: request.body.targaryenTerritories10
    },
    dorn: {
      fiefdoms: request.body.dornFiefdoms10,
      sword: request.body.dornSword10,
      raven: request.body.dornRaven10,
      supply: request.body.dornSupply10,
      boats: request.body.dornBoats10,
      footmen: request.body.dornFootmen10,
      knights: request.body.dornKnights10,
      siege: request.body.dornSiege10,
      strongholds: request.body.dornStrongholds10,
      castles: request.body.dornCastles10,
      territories: request.body.dornTerritories10
    },
    tyrell: {
      fiefdoms: request.body.tyrellFiefdoms10,
      sword: request.body.tyrellSword10,
      raven: request.body.tyrellRaven10,
      supply: request.body.tyrellSupply10,
      boats: request.body.tyrellBoats10,
      footmen: request.body.tyrellFootmen10,
      knights: request.body.tyrellKnights10,
      siege: request.body.tyrellSiege10,
      strongholds: request.body.tyrellStrongholds10,
      castles: request.body.tyrellCastles10,
      territories: request.body.tyrellTerritories10
    }
  };

  gotPool.query(
    `INSERT INTO games (lannister,greyjoy,stark,arryn,baratheon,targaryen,dorn,tyrell,winner,notes,round1,round2,round3,round4,round5,round6,round7,round8,round9,round10,id, year, month, day ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20, 0, 2019, 6,11)`,
    [
      request.body.lannisterPlayer,
      request.body.greyjoyPlayer,
      request.body.starkPlayer,
      request.body.arrynPlayer,
      request.body.baratheonPlayer,
      request.body.targaryenPlayer,
      request.body.dornPlayer,
      request.body.tyrellPlayer,
      request.body.winner,
      request.body.notes,
      JSON.stringify({ round1 }),
      JSON.stringify({ round2 }),
      JSON.stringify({ round3 }),
      JSON.stringify({ round4 }),
      JSON.stringify({ round5 }),
      JSON.stringify({ round6 }),
      JSON.stringify({ round7 }),
      JSON.stringify({ round8 }),
      JSON.stringify({ round9 }),
      JSON.stringify({ round10 })
      // ...round1,
      // ...round2,
      // ...round3,
      // ...round4,
      // ...round5,
      // ...round6,
      // ...round7,
      // ...round8,
      // ...round9,
      // ...round10
    ],
    (err, res) => {}
  );
  response.redirect("/games");
});

server.listen(4040, () => console.log("Server is running..."));
