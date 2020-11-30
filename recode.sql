SET SESSION FOREIGN_KEY_CHECKS=0;

/* Drop Tables */

DROP TABLE IF EXISTS class_join;
DROP TABLE IF EXISTS compile;
DROP TABLE IF EXISTS question_result;
DROP TABLE IF EXISTS question_result_relation;
DROP TABLE IF EXISTS question;
DROP TABLE IF EXISTS state;
DROP TABLE IF EXISTS test;
DROP TABLE IF EXISTS class;
DROP TABLE IF EXISTS User;




/* Create Tables */

CREATE TABLE class
(
	class_code varchar(10) NOT NULL,
	class_name varchar(10) NOT NULL,
	class_teacher_name varchar(10) NOT NULL,
	PRIMARY KEY (class_code)
);


CREATE TABLE class_join
(
	user_email varchar(30) NOT NULL,
	class_code varchar(10) NOT NULL,
	PRIMARY KEY (user_email, class_code)
);


CREATE TABLE compile
(
	user_email varchar(30) NOT NULL,
	compile_code text,
	compile_result text,
	question_id int NOT NULL
);


CREATE TABLE question
(
	question_id int NOT NULL AUTO_INCREMENT,
	question_name varchar(50) NOT NULL,
	question_score int NOT NULL,
	question_content text NOT NULL,
	test_id int NOT NULL,
	PRIMARY KEY (question_id)
);


CREATE TABLE question_result
(
	user_email varchar(30) NOT NULL,
	question_score int NOT NULL
);


CREATE TABLE question_result_relation
(
	question_id int NOT NULL,
	user_email varchar(30) NOT NULL,
	UNIQUE (user_email)
);


CREATE TABLE state
(
	user_email varchar(30) NOT NULL,
	test_id int NOT NULL,
	retake int NOT NULL,
	mic_caution int NOT NULL,
	eye_caution int NOT NULL,
	test_validation boolean NOT NULL,
	test_start_time date NOT NULL,
	test_end_time date NOT NULL,
	score int NOT NULL
);


CREATE TABLE test
(
	class_code varchar(10) NOT NULL,
	test_id int NOT NULL AUTO_INCREMENT,
	test_name varchar(10) NOT NULL,
	test_start date NOT NULL,
	test_end date NOT NULL,
	test_wait date NOT NULL,
	caution varchar(100) NOT NULL,
	retake int NOT NULL,
	test_shuffle boolean NOT NULL,
	escape boolean NOT NULL,
	test_lang varchar(10) NOT NULL,
	test_status int NOT NULL,
	PRIMARY KEY (test_id)
);


CREATE TABLE User
(
	user_email varchar(30) NOT NULL,
	name varchar(15) NOT NULL,
	user_password varchar(15) NOT NULL,
	phone_number varchar(15) NOT NULL,
	teacher boolean NOT NULL,
	PRIMARY KEY (user_email),
	UNIQUE (user_email)
)charset = utf8;



/* Create Foreign Keys */

ALTER TABLE class_join
	ADD FOREIGN KEY (class_code)
	REFERENCES class (class_code)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE test
	ADD FOREIGN KEY (class_code)
	REFERENCES class (class_code)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE compile
	ADD FOREIGN KEY (question_id)
	REFERENCES question (question_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE question_result_relation
	ADD FOREIGN KEY (question_id)
	REFERENCES question (question_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE question_result
	ADD FOREIGN KEY (user_email)
	REFERENCES question_result_relation (user_email)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE question
	ADD FOREIGN KEY (test_id)
	REFERENCES test (test_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE state
	ADD FOREIGN KEY (test_id)
	REFERENCES test (test_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE class_join
	ADD FOREIGN KEY (user_email)
	REFERENCES User (user_email)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE compile
	ADD FOREIGN KEY (user_email)
	REFERENCES User (user_email)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE question_result_relation
	ADD FOREIGN KEY (user_email)
	REFERENCES User (user_email)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE state
	ADD FOREIGN KEY (user_email)
	REFERENCES User (user_email)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;



