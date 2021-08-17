CREATE TABLE `user` (
  `user_id` int,
  `username` varchar(20),
  `first_name` varchar(20),
  `last_name` varchar(20),
  `password` char(60),
  `type` enum('consultant','doctor','admin'),
  PRIMARY KEY (`user_id`),
  UNIQUE (`username`)
);

ALTER TABLE `user` AUTO_INCREMENT = 100;

CREATE TABLE `ward` (
  `ward_id` int,
  `ward_name` varchar(20),
  `consultant_id` int,
  `min_docs` int,
  `morning_start` time,
  `day_start` time,
  `night_start` time,
  PRIMARY KEY (`ward_id`),
  UNIQUE (`ward_name`),
  FOREIGN KEY (`consultant_id`) REFERENCES `user`(`user_id`)
);

ALTER TABLE `ward` AUTO_INCREMENT = 100;

CREATE TABLE `doctor` (
  `user_id` int,
  `ward_id` int,
  `work_hrs` int,
  FOREIGN KEY (`ward_id`) REFERENCES `ward`(`ward_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`)
);

CREATE TABLE `registration` (
  `req_id` int,
  `username` varchar(20),
  `first_name` varchar(20),
  `last_name` varchar(20),
  `password` char(60),
  `type` enum('consultant','doctor'),
  PRIMARY KEY (`req_id`)
);

ALTER TABLE `registration` AUTO_INCREMENT = 100;

CREATE TABLE `roster` (
  `ward_id` int,
  `year` int,
  `month` int,
  `roster` json,
  FOREIGN KEY (`ward_id`) REFERENCES `ward`(`ward_id`)
);

CREATE TABLE `leave` (
  `doctor_id` int,
  `date` datetime,
  `status` enum('pending','approved','rejected'),
  FOREIGN KEY (`doctor_id`) REFERENCES `doctor`(`user_id`)
);

CREATE TABLE `issue` (
  `doctor_id` int,
  `message` text,
  `date` date,
  `status` binary,
  FOREIGN KEY (`doctor_id`) REFERENCES `doctor`(`user_id`)
);