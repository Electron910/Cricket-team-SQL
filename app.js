const express = require("express");
const path = require("path");

const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");
const db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  getAllPlayersQuery = `
    SELECT *
    FROM 
    cricket_team
    ORDER BY 
    player_id
    `;
  const playersArr = await db.all(getAllPlayersQuery);
  response.send(playersArr);
});

//Post player
app.post("/players/", async (request, response) => {
  const playerTableBody = request.body;
  const { player_id, player_name, jersey_number, role } = playerTableBody;
  const postNewPlayer = `
    INSERT INTO cricket_team
    (player_id, player_name, jersey_number, role)
    VALUES 
    (
        ${player_id},
        ${player_name},
        ${jersey_number},
        ${role}
    );
    `;

  const dbResponse = await db.run(postNewPlayer);
  response.send("Player Added to Team");
});

//Get Details based on player ID
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerDetails = `
    SELECT *
    FROM cricket_team
    WHERE
    player_id = ${playerId};
    `;
  const playerDet = await db.get(getPlayerDetails);
  response.send(playerDet);
});

//Put player details in existing ones
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;
  const updatePlayer = `
    UPDATE cricket_team
    SET
    player_name = ${player_name},
    jersey_number = ${jersey_number},
    role = ${role}
    WHERE 
    player_id = ${player_id};
    `;
  const updating = await db.run(updatePlayer);
  response.send("Player Details Updated");
});

//Delete a certain player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayer = `
    DELETE FROM 
    cricket_team
    WHERE
    player_id = ${player_id};
    `;
  const deletion = await db.run(deletePlayer);
  response.send("Player Removed");
});

module.exports = app;
