
#INSERT DATA FOR STREET(HDB)
LOAD DATA INFILE 'D:/SIT/Year 2/2103 - Information Management/Playground/final/blackholeSQL/residential_1_nov.txt' 
IGNORE INTO TABLE Street 
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n' 
IGNORE 1 LINES 
(@postal, @blk, @street, @floors, @year_build, @one_room, @two_room, @three_room, 
@four_room, @five_room, @exec_room, @multi_room, @studio_room, @latitude, @longitude)
SET street_name=@street;


#INSERT DATA FOR LOCATION(HDB)
LOAD DATA INFILE 'D:/SIT/Year 2/2103 - Information Management/Playground/final/blackholeSQL/residential_1_nov.txt'  
IGNORE INTO TABLE Location 
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n' 
IGNORE 1 LINES 
(@postal, @blk, @street, @floors, @year_build, @one_room, @two_room, @three_room, 
@four_room, @five_room, @exec_room, @multi_room, @studio_room, @latitude, @longitude)
set id=NULL, latitude=@latitude, longitude=@longitude, stid = (SELECT id FROM Street WHERE street_name = @street LIMIT 1) ;


#INSERT DATA FOR Residential(HDB)
LOAD DATA INFILE 'D:/SIT/Year 2/2103 - Information Management/Playground/final/hdb_residential.csv' 
INTO TABLE Residential 
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n' 
IGNORE 1 LINES 
(@postal, @blk, @street, @floors, @year_build, @one_room, @two_room, @three_room, 
@four_room, @five_room, @exec_room, @multi_room, @studio_room, @latitude, @longitude)
SET postal_code=@postal, block = @blk, year = @year_build, floors = @floors, 
lid = (SELECT id FROM blackhole.location WHERE latitude = @latitude and longitude = @longitude);


#INSERT DATA FOR ROOM(HDB)
INSERT INTO Room(room_type) VALUES ("One Room"), ("Two Rooms"), ("Three Rooms"), ("Four Rooms"), 
("Five Rooms"), ("Exec Rooms"), ("Multi Rooms"), ("Studio Rooms");


#INSERT DATA FOR Resid_Room(HDB)
LOAD DATA INFILE 'D:/SIT/Year 2/2103 - Information Management/Playground/final/blackholeSQL/residential_rooms.txt' 
IGNORE INTO TABLE resid_room
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n' 
IGNORE 1 LINES 
(@postal, @sold, @room) 
SET postal_code= (SELECT postal_code FROM residential WHERE postal_code = @postal),
room_id = (SELECT id FROM room WHERE room_type = @room),
sold = @sold;


#INSERT DATA FOR Street(School)
LOAD DATA INFILE 'D:/SIT/Year 2/2103 - Information Management/Playground/final/school_data.txt' 
IGNORE INTO TABLE Street 
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n' 
IGNORE 1 LINES 
(@postal, @school_name, @email, @street, @aid, @nature, @level, @latitude, @longitude)
SET street_name=@street;


#INSERT DATA For Location(School)
LOAD DATA INFILE 'D:/SIT/Year 2/2103 - Information Management/Playground/final/school_data.txt' 
INTO TABLE Location 
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n' 
IGNORE 1 LINES 
(@postal, @school_name, @email, @street, @aid, @nature, @level, @latitude, @longitude)
set id=NULL, latitude=@latitude, longitude=@longitude, stid = (SELECT id FROM Street WHERE street_name = @street LIMIT 1) ;


#INSERT DATA For School(School)
LOAD DATA INFILE 'D:/SIT/Year 2/2103 - Information Management/Playground/final/school_data.txt' 
INTO TABLE School 
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n' 
IGNORE 1 LINES 
(@postal, @school_name, @email, @street, @aid, @nature, @level, @latitude, @longitude)
SET postal_code=@postal, url=@email, school_name=@school_name, nature = @nature, aid_type=@aid, level=@level,
lid = (SELECT id FROM blackhole.location WHERE latitude = @latitude and longitude = @longitude);

#INSERT DATA FOR UNDER BLOCK HAWKER
LOAD DATA INFILE 'D:/SIT/Year 2/2103 - Information Management/Playground/try this/hawker.txt' 
INTO TABLE dep_amenities
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n' 
IGNORE 1 LINES 
(@postal, @latitude, @longitude, @name)
SET postal_code=@postal, cat_id=1, name = @name


#INSERT DATA FOR STANDALONE HAWKER INTO STREET
LOAD DATA INFILE 'D:/SIT/Year 2/2103 - Information Management/Playground/try this/hawker_centre.csv' 
IGNORE INTO TABLE street
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n' 
IGNORE 1 LINES 
(@postal, @latitude, @longitude, @name, @street)
SET street_name=@street ;

#INSERT DATA FOR STANDALONE HAWKER INTO Location
LOAD DATA INFILE 'D:/SIT/Year 2/2103 - Information Management/Playground/try this/hawker_centre.csv' 
IGNORE INTO TABLE Location
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n' 
IGNORE 1 LINES 
(@postal, @latitude, @longitude, @name, @street)
set id=NULL, latitude=@latitude, longitude=@longitude, stid = (SELECT id FROM Street WHERE street_name = @street LIMIT 1) ;



#INSERT DATA FOR STANDALONE HAWKER HAWKER
LOAD DATA INFILE 'D:/SIT/Year 2/2103 - Information Management/Playground/try this/hawker_centre.csv' 
INTO TABLE hawker_centre
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n' 
IGNORE 1 LINES 
(@postal, @latitude, @longitude, @name, @street)
set postal_code = @postal, 
lid = (SELECT id FROM blackhole.location WHERE latitude = @latitude and longitude = @longitude),
hawker_name = @name



#INSERT DATA FOR BUSSTOPS Location, street
LOAD DATA INFILE 'D:/SIT/Year 2/2103 - Information Management/Playground/Final/blackholeSQL/bus_stop.csv' 
IGNORE INTO TABLE Street 
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n' 
IGNORE 1 LINES 
(@lat, @bs_code, @bs_name, @long, @street)
SET street_name=@street;


#INSERT DATA FOR BUSSTOPS Location, street
LOAD DATA INFILE 'D:/SIT/Year 2/2103 - Information Management/Playground/Final/blackholeSQL/bus_stop.csv' 
IGNORE INTO TABLE Location 
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n' 
IGNORE 1 LINES 
(@lat, @bs_code, @bs_name, @long, @street)
set id=NULL, latitude=@lat, longitude=@long, stid = (SELECT id FROM Street WHERE street_name = @street LIMIT 1) ;


#INSERT DATA FOR BUSSTOPS
LOAD DATA INFILE 'D:/SIT/Year 2/2103 - Information Management/Playground/Final/blackholeSQL/bus_stop.csv'
INTO TABLE bus_stop
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n' 
IGNORE 1 LINES 
(@lat, @bs_code, @bs_name, @long, @street)
set bs_name=@bs_name, bs_code = @bs_code, lid = (SELECT id FROM blackhole.location WHERE latitude = @lat and longitude = @long);


#Postal Area Details
#https://www.ura.gov.sg/realEstateIIWeb/resources/misc/list_of_postal_districts.htm