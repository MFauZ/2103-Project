CREATE SCHEMA BlackHole;
USE Blackhole;

Create Table Locale_area(
	id INT NOT NULL AUTO_INCREMENT,
    locale_name VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE(locale_name)
    );

CREATE TABLE Locale_postal (
	id INT,
    postal_sector VARCHAR(45),
    PRIMARY KEY (id, postal_sector),
	FOREIGN KEY (id) 
	REFERENCES Locale_area(id)
    ON DELETE CASCADE
    );

CREATE TABLE Street(
	id INT NOT NULL AUTO_INCREMENT,
    street_name VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE (street_name)
	);

CREATE TABLE Location(
	id INT NOT NULL AUTO_INCREMENT,
    latitude DECIMAL(10, 9) NOT NULL, 
    longitude DECIMAL(10, 7) NOT NULL,
    stid INT,
    PRIMARY KEY (id),
    UNIQUE (latitude, longitude),
    FOREIGN KEY(stid)
		REFERENCES Street(id)
        ON DELETE CASCADE
    );

CREATE TABLE Bus_stop(
	bs_code VARCHAR(20),
    bs_name VARCHAR(255),
    bs_services VARCHAR(255),
    lid int,
    PRIMARY KEY (bs_code),
    FOREIGN KEY (lid)
		REFERENCES Location(id)
        ON DELETE CASCADE
        );
        
CREATE TABLE Hawker_centre(
	postal_code VARCHAR(6),
    lid INT, 
    hawker_name VARCHAR(255),
    PRIMARY KEY (postal_code),
    FOREIGN KEY (lid)
		REFERENCES Location(id)
        ON DELETE CASCADE
		);
	
        
CREATE TABLE School(
	postal_code VARCHAR(6),
    lid INT, 
    url VARCHAR(255),
    school_name VARCHAR(255),
    nature VARCHAR(45),
    aid_type VARCHAR(45),
    level VARCHAR(255),
    PRIMARY KEY (postal_code),
    FOREIGN KEY (lid)
		REFERENCES Location(id)
        ON DELETE CASCADE
        );

CREATE TABLE NPC(
	postal_code VARCHAR(6),
    npc_name VARCHAR(255),
    division_id INT,
    operating_hours VARCHAR(255),
    telephone VARCHAR(255),
    lid INT, 
    PRIMARY KEY (postal_code),
    FOREIGN KEY (lid)
		REFERENCES Location(id)
        ON DELETE CASCADE,
	FOREIGN KEY(division_id)
		REFERENCES NPC_Category(id)
        ON DELETE CASCADE
        );

CREATE TABLE NPC_Category(
	id INT NOT NULL AUTO_INCREMENT,
    division_name VARCHAR(255),
    UNIQUE(division_name),
    PRIMARY KEY(id)
	);
        
CREATE TABLE Residential(
	postal_code VARCHAR(6),
    lid INT, 
    block VARCHAR(45),
    year YEAR,
    floors INT,
    PRIMARY KEY (postal_code),
    FOREIGN KEY (lid)
		REFERENCES Location(id)
        ON DELETE CASCADE
        );
        
CREATE TABLE Amenity_cat(
	id INT NOT NULL AUTO_INCREMENT,
    category VARCHAR(255),
    PRIMARY KEY(id)
);

CREATE TABLE Dep_amenities(
	postal_code VARCHAR(6),
	name VARCHAR(255),
    cat_id INT,
    operating_hours VARCHAR(255),
    PRIMARY KEY (postal_code, name),
    FOREIGN KEY (cat_id)
		REFERENCES Amenity_cat(id),
	FOREIGN KEY (postal_code) 
		REFERENCES Residential(postal_code)
        ON DELETE CASCADE
        );
        
CREATE TABLE Room(
	id INT NOT NULL AUTO_INCREMENT,
    room_type VARCHAR(45),
    PRIMARY KEY(id),
    UNIQUE (room_type)
);

CREATE TABLE Resid_room(
	postal_code VARCHAR(6),
    room_id INT,
    available INT,
    sold INT,
    PRIMARY KEY(postal_code, room_id),
    FOREIGN KEY (postal_code)
		REFERENCES Residential(postal_code)
        ON DELETE CASCADE,
	FOREIGN KEY (room_id)
		REFERENCES Room(id)
        ON DELETE CASCADE
);

CREATE TABLE User(
	id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(255),
    password VARCHAR(255),
    name VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE (username),
    UNIQUE (email)
);


CREATE TABLE User_bookmarks_Location(
	uid INT,
    lid INT,
    bookmark_name VARCHAR(255),
    bookmark_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(uid, lid),
    FOREIGN KEY (uid)
		REFERENCES User(id)
        ON DELETE CASCADE,
	FOREIGN KEY (lid)
		REFERENCES Location(id)
        ON DELETE CASCADE
);

CREATE VIEW Housing AS
	SELECT l.id, l.longitude, l.latitude,r.postal_code, r.block, r.year, r.floors, la.locale_name, rr.room_id
	FROM residential r, Location l, locale_area la, locale_postal lp, room rm, resid_room rr
	WHERE r.lid = l.id
	AND la.id = lp. id 
	AND r.postal_code = rr.postal_code
	AND rr.room_id = rm.id
	AND SUBSTR(r.postal_code, 1,2) = lp.postal_sector;
  
CREATE VIEW School_distance AS
	SELECT longitude, latitude, postal_code, url, school_name, nature, aid_type, level, street_name
	FROM School s, Location l, Street st
	WHERE s.lid = l.id
	AND l.stid = st.id;
	
CREATE VIEW bus_stop_distance AS
	SELECT longitude, latitude, street_name, bs_code, bs_name
	FROM bus_stop bs, location l, street s
	WHERE bs.lid = l.id
	AND l.stid = s.id;
	
CREATE VIEW NPC_distance AS
	SELECT longitude, latitude, street_name, postal_code, npc_name, operating_hours, telephone, division_name
	FROM npc n, npc_category nc, location l, street s
	WHERE n.division_id = nc.id
	AND n.lid = l.id
	AND s.id = l.stid;
	
CREATE VIEW hawker_distance AS
	SELECT longitude, latitude, street_name, postal_code, hawker_name
	FROM hawker_centre h, location l, street s
	WHERE h.lid = l.id
	AND l.stid = s.id;


