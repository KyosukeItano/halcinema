SET character_set_results = sjis;
SET character_set_client = sjis;

create table movie_info(
  movieId int(10) primary key auto_increment not null,
  movieName varchar(50) not null,
  director varchar(30) not null,
  `explain` varchar(400),
  `cast` varchar(100) not null,
  rating int(2) not null,
  runs char(5) not null,
  releaseDay date not null,
  isRelease int(1) not null,
  poster varchar(256) 
);


create table schedule(
  runId int(12) auto_increment not null primary key,
  cinemaId int(1) not null,
  movieId int(10) not null,
  runday date not null,
  screen int(2) not null,
  plas char(5) not null,
  seats int(4) default 0
);

create table seat(
  runId int(12) not null,
  seat char(3) not null,
  email varchar(256) not null,
  kind int(1) not null,
  `when` datetime not null,
  primary key(runId,seat)
);

insert into seat values(1,"A1","test@test.com",0,"2019-11-08 00:00:00");
insert into seat values(1,"A2","test@test.com",1,"2019-11-08 00:00:00");
insert into seat values(1,"A3","test@test.com",2,"2019-11-08 00:00:00");
insert into seat values(1,"A4","test@test.com",1,"2019-11-08 00:00:00");
insert into seat values(1,"A5","test@test.com",0,"2019-11-08 00:00:00");
insert into seat values(1,"A6","test@test.com",0,"2019-11-08 00:00:00");
insert into seat values(1,"A7","test@test.com",1,"2019-11-08 00:00:00");
insert into seat values(1,"A8","test@test.com",0,"2019-11-08 00:00:00");
insert into seat values(1,"A9","test@test.com",0,"2019-11-08 00:00:00");
insert into seat values(1,"B1","test@test.com",0,"2019-11-08 00:00:00");
insert into seat values(1,"B2","test@test.com",1,"2019-11-08 00:00:00");
insert into seat values(1,"B3","test@test.com",2,"2019-11-08 00:00:00");
insert into seat values(1,"B4","test@test.com",1,"2019-11-08 00:00:00");
insert into seat values(1,"B5","test@test.com",0,"2019-11-08 00:00:00");
insert into seat values(1,"B6","test@test.com",0,"2019-11-08 00:00:00");
insert into seat values(1,"B7","test@test.com",1,"2019-11-08 00:00:00");
insert into seat values(1,"B8","test@test.com",0,"2019-11-08 00:00:00");
insert into seat values(1,"B9","test@test.com",0,"2019-11-08 00:00:00");

insert into seat values(999,"A1","test@test.com",0,"2019-10-08 00:00:00");
insert into seat values(999,"A2","test@test.com",1,"2019-10-08 00:00:00");
insert into seat values(999,"A3","test@test.com",2,"2019-10-08 00:00:00");
insert into seat values(999,"A4","test@test.com",1,"2019-10-08 00:00:00");
insert into seat values(999,"A5","test@test.com",0,"2019-10-08 00:00:00");
insert into seat values(999,"A6","test@test.com",0,"2019-10-08 00:00:00");
insert into seat values(999,"A7","test@test.com",1,"2019-10-08 00:00:00");
insert into seat values(999,"A8","test@test.com",0,"2019-10-08 00:00:00");
insert into seat values(999,"A9","test@test.com",0,"2019-10-08 00:00:00");
insert into seat values(999,"B1","test@test.com",0,"2019-10-08 00:00:00");
insert into seat values(999,"B2","test@test.com",1,"2019-10-08 00:00:00");
insert into seat values(999,"B3","test@test.com",2,"2019-10-08 00:00:00");
insert into seat values(999,"B4","test@test.com",1,"2019-10-08 00:00:00");
insert into seat values(999,"B5","test@test.com",0,"2019-10-08 00:00:00");
insert into seat values(999,"B6","test@test.com",0,"2019-10-08 00:00:00");
insert into seat values(999,"B7","test@test.com",1,"2019-10-08 00:00:00");
insert into seat values(999,"B8","test@test.com",0,"2019-10-08 00:00:00");
insert into seat values(999,"B9","test@test.com",0,"2019-10-08 00:00:00");


insert into seat values(998,"A1","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"A2","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"A3","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"A4","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"A5","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"A6","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"A7","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"A8","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"A9","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"B1","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"B2","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"B3","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"B4","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"B5","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"B6","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"B7","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"B8","test@test.com",0,"2020-01-08 00:00:00");
insert into seat values(998,"B9","test@test.com",0,"2020-01-08 00:00:00");

create table kind(
  kind int(1) not null,
  `name` varchar(20) not null,
  `value` int(4) not null
);

insert into kind values(0,"大人",2000);
insert into kind values(1,"小・中学生",1500);
insert into kind values(2,"高齢者",1200);

create table user(
  email varchar(256) primary key not null,
  pass varchar(256) not null,
  gender int(1) not null,
  birth date not null,
  created_at date not null,
  `role` char(5) not null
);

insert into user values("admin","admin",0,"1999/12/07","2020/08/20","admin");


create table `admin`(
  `name` varchar(20) primary key not null,
  cinemaId int(1) not null
);

insert into `admin` values("admin",2);


create table cinema(
  cinemaId int(1) primary key not null,
  cinemaName varchar(5) not null
);

insert into cinema values(0,"東京");
insert into cinema values(1,"大阪");
insert into cinema values(2,"名古屋");