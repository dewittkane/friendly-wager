
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
-- CREATE TABLE "user" (
--     "id" SERIAL PRIMARY KEY,
--     "username" VARCHAR (80) UNIQUE NOT NULL,
--     "password" VARCHAR (1000) NOT NULL
-- );

CREATE TABLE "user" (
	"id" SERIAL PRIMARY KEY NOT NULL,
	"email" varchar(255) UNIQUE NOT NULL,
	"first_name" varchar(30) NOT NULL,
	"last_name" varchar(30) NOT NULL,
	"is_admin" BOOLEAN NOT NULL DEFAULT 'false',
	"password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "friends" (
	"id" SERIAL PRIMARY KEY NOT NULL,
	"user1_id" INT NOT NULL REFERENCES "user",
	"user2_id" INT NOT NULL REFERENCES "user"
);

CREATE TABLE "teams" (
	"id" SERIAL PRIMARY KEY NOT NULL,
	"name" varchar(40) NOT NULL UNIQUE,
	"logo" TEXT NOT NULL,
	"odds_api_ref" varchar(40) NOT NULL UNIQUE,
	"nfl_api_ref" varchar(40) NOT NULL UNIQUE
);

CREATE TABLE "games" (
	"id" SERIAL PRIMARY KEY NOT NULL,
	"home_team_id" int NOT NULL REFERENCES "teams",
	"away_team_id" int NOT NULL REFERENCES "teams",
	"home_team_spread" DECIMAL NOT NULL,
	"away_team_spread" DECIMAL NOT NULL,
	"date" TIMESTAMP WITH TIME ZONE NOT NULL,
	"week" int NOT NULL,
	"home_team_score" int,
	"away_team_score" int,
	"game_completed" BOOLEAN NOT NULL DEFAULT 'false',
	"winning_team_id" int REFERENCES "teams"
);

CREATE TABLE "bets" (
	"id" SERIAL PRIMARY KEY NOT NULL,
	"proposers_id" int NOT NULL REFERENCES "user",
	"wager" int NOT NULL,
	"game_id" int NOT NULL REFERENCES "games",
	"proposers_team_id" int NOT NULL REFERENCES "teams",
	"accepted" BOOLEAN NOT NULL DEFAULT 'false',
	"acceptors_id" int REFERENCES "user",
	"acceptors_team_id" int REFERENCES "teams",
	"winners_id" int REFERENCES "user",
	"settled" BOOLEAN NOT NULL DEFAULT 'false'
);

--populates NFL team information
INSERT INTO "teams" ("name", "logo", "odds_api_ref", "nfl_api_ref") 
VALUES
('Falcons', 'https://seeklogo.net/wp-content/uploads/2012/12/atlanta-falcons-logo-vector.png', 'Atlanta Falcons', 'ATL'),
('Cardinals', 'https://seeklogo.net/wp-content/uploads/2014/12/Arizona-Cardinals-logo-vector.jpg', 'Arizona Cardinals', 'ARI'),
('Ravens', 'https://seeklogo.net/wp-content/uploads/2012/05/baltimore-ravens-logo-vector-01.png', 'Baltimore Ravens', 'BAL'),
('Bills', 'https://seeklogo.net/wp-content/uploads/2012/05/buffalo-bills-logo-vector-01.png', 'Buffalo Bills', 'BUF'),
('Panthers', 'https://seeklogo.net/wp-content/uploads/2012/11/carolina-panthers-logo-vector.png', 'Carolina Panthers', 'CAR'),
('Bengals', 'https://seeklogo.net/wp-content/uploads/2012/05/cincinnati-bengals-logo-vector-01.png', 'Cincinnati Bengals', 'CIN'),
('Bears', 'https://seeklogo.net/wp-content/uploads/2011/05/chicago-bears-logo-vector.png', 'Chicago Bears', 'CHI'),
('Browns', 'https://seeklogo.net/wp-content/uploads/2015/08/cleveland-browns-logo-vector-download.jpg', 'Cleveland Browns', 'CLE'),
('Cowboys', 'https://seeklogo.net/wp-content/uploads/2011/05/dallas-cowboys-logo-vector.png', 'Dallas Cowboys', 'DAL'),
('Broncos', 'https://seeklogo.net/wp-content/uploads/2012/10/denver-broncos-logo-vector.png', 'Denver Broncos', 'DEN'),
('Lions', 'https://logos-world.net/wp-content/uploads/2020/05/Detroit-Lions-logo.png', 'Detroit Lions', 'DET'),
('Packers', 'https://seeklogo.net/wp-content/uploads/2012/12/green-bay-packers-logo-vector.png', 'Green Bay Packers', 'GB'),
('Texans', 'https://seeklogo.net/wp-content/uploads/2012/11/houston-texans-logo-vector.png', 'Houston Texans', 'HOU'),
('Colts', 'https://seeklogo.net/wp-content/uploads/2015/08/indianapolis-colts-logo-vector-download.jpg', 'Indianapolis Colts', 'IND'), 
('Rams', 'https://logos-world.net/wp-content/uploads/2020/05/Los-Angeles-Rams-logo-700x394.png', 'Los Angeles Rams', 'LA'), 
('Vikings', 'https://seeklogo.net/wp-content/uploads/2012/10/minnesota-vikings-logo-vector.png', 'Minnesota Vikings', 'MIN'),
('Chiefs', 'https://seeklogo.net/wp-content/uploads/2015/08/kansas-city-chiefs-logo-vector-download.jpg', 'Kansas City Chiefs', 'KC'),
('Saints', 'https://seeklogo.net/wp-content/uploads/2012/12/new-orleans-saints-logo-vector.png', 'New Orleans Saints', 'NO'),
('Raiders', 'https://seeklogo.net/wp-content/uploads/2012/10/oakland-raiders-logo-vector.png', 'Las Vegas Raiders', 'LV'),
('Giants', 'https://seeklogo.net/wp-content/uploads/2011/05/new-york-giants-logo-vector.png', 'New York Giants', 'NYG'),
('Chargers', 'https://seeklogo.net/wp-content/uploads/2012/10/san-diego-chargers-logo-vector.png', 'Los Angeles Chargers', 'LAC'),
('Eagles', 'https://seeklogo.net/wp-content/uploads/2014/10/philadelphia-eagles-logo.png', 'Philadelphia Eagles', 'PHI'),
('Dolphins', 'https://seeklogo.net/wp-content/uploads/2015/08/miami-dolphins-vector-logo.png', 'Miami Dolphins', 'MIA'), 
('49ers', 'https://seeklogo.net/wp-content/uploads/2011/06/san-francisco-49ers-logo-vector.png', 'San Francisco 49ers', 'SF'),
('Patriots', 'https://seeklogo.net/wp-content/uploads/2014/10/new-england-patriots-logo-preview.png', 'New England Patriots', 'NE'),
('Seahawks', 'https://seeklogo.net/wp-content/uploads/2012/10/seattle-seahawks-logo-vector.png', 'Seattle Seahawks', 'SEA'),
('Jets', 'https://seeklogo.net/wp-content/uploads/2011/05/new-york-jets-logo-vector-01.png', 'New York Jets', 'NYJ'),
('Buccaneers', 'https://seeklogo.net/wp-content/uploads/2012/12/tampa-bay-buccaneers-logo-vector.png', 'Tampa Bay Buccaneers', 'TB'),
('Jaguars', 'https://seeklogo.net/wp-content/uploads/2015/08/jacksonville-jaguars-logo-vector-download.jpg', 'Jacksonville Jaguars', 'JAX'),
('Steelers', 'https://seeklogo.net/wp-content/uploads/2011/05/pittsburgh-steelers-logo-vector-01.png', 'Pittsburgh Steelers', 'PIT'),
('Washington', 'https://content.sportslogos.net/logos/7/6741/full/5727_washington_football_team-alternate-2020.png', 'Washington Football', 'WAS'),
('Titans', 'https://seeklogo.net/wp-content/uploads/2015/08/tennessee-titans-logo-vector-download.jpg', 'Tennessee Titans', 'TEN');