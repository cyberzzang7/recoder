DROP TABLE IF EXISTS `student`;

CREATE TABLE `student` (
	`s_email`	VARCHAR(100)	NOT NULL,
	`s_name`	VARCHAR(100)	NOT NULL,
	`s_password`	VARCHAR(100)	NOT NULL,
	`s_phone`	VARCHAR(20)	NOT NULL
);

DROP TABLE IF EXISTS `class`;

CREATE TABLE `class` (
	`class_code`	VARCHAR(100)	NOT NULL,
	`t_email`	VARCHAR(100)	NOT NULL,
	`class_name`	VARCHAR(100)	NOT NULL
);

DROP TABLE IF EXISTS `user_relation_class`;

CREATE TABLE `user_relation_class` (
	`s_email`	VARCHAR(100)	NOT NULL,
	`class_code`	VARCHAR(100)	NOT NULL	COMMENT '선생님은 계정 생성시 하나의 클래스 초대코드 제공'
);

DROP TABLE IF EXISTS `teacher`;

CREATE TABLE `teacher` (
	`t_email`	VARCHAR(100)	NOT NULL,
	`t_name`	VARCHAR(100)	NOT NULL,
	`t_password`	VARCHAR(100)	NOT NULL,
	`t_phone`	VARCHAR(20)	NOT NULL
);

DROP TABLE IF EXISTS `test`;

CREATE TABLE `test` (
	`test_id`	BIGINT	NOT NULL	COMMENT '시험 고유 번호',
	`class_code`	VARCHAR(100)	NOT NULL,
	`test_name`	VARCHAR(100)	NOT NULL,
	`test_start`	Date	NOT NULL,
	`test_end`	Date	NOT NULL,
	`test_wait`	Date	NOT NULL,
	`test_caution`	Text	NULL,
	`test_retake`	TINYINT	NOT NULL,
	`test_shuffle`	Enum('Y','N')	NOT NULL,
	`test_escape`	Enum('Y','N')	NOT NULL	COMMENT '시험장 이탈 허용',
	`test_lang`	VARCHAR(100)	NOT NULL,
	`test_status`	TINYINT	NOT NULL	COMMENT '1,2,3,4 시험시작, 진행중, 미응시, 결과보기'
);

DROP TABLE IF EXISTS `test_relation_question`;

CREATE TABLE `test_relation_question` (
	`test_id`	BIGINT	NOT NULL	COMMENT '시험 고유 번호',
	`question_id`	BIGINT	NOT NULL
);

DROP TABLE IF EXISTS `question`;

CREATE TABLE `question` (
	`question_id`	BIGINT	NOT NULL,
	`question_name`	VARCHAR(100)	NOT NULL,
	`question_score`	TINYINT	NOT NULL,
	`question_text`	Text	NOT NULL
);

DROP TABLE IF EXISTS `question_result`;

CREATE TABLE `question_result` (
	`s_email`	VARCHAR(100)	NOT NULL,
	`question_id`	BIGINT	NOT NULL,
	`test_id`	BIGINT	NOT NULL	COMMENT '시험 고유 번호',
	`question_grade`	TINYINT	NOT NULL,
	`compile_code`	Text	NULL,
	`compile_result`	Text	NULL
);

DROP TABLE IF EXISTS `state`;

CREATE TABLE `state` (
	`test_id`	BIGINT	NOT NULL	COMMENT '시험 고유 번호',
	`s_email`	VARCHAR(100)	NOT NULL,
	`s_retake`	TINYINT	NOT NULL,
	`mic_caution`	TINYINT	NOT NULL,
	`eye_caution`	TINYINT	NOT NULL,
	`test_validation`	Boolean	NOT NULL,
	`test_start_time`	Date	NOT NULL,
	`test_end_time`	Date	NOT NULL,
	`total_score`	Int	NOT NULL
);

DROP TABLE IF EXISTS `log_data`;

CREATE TABLE `log_data` (
	`test_id`	BIGINT	NOT NULL	COMMENT '시험 고유 번호',
	`name`	VARCHAR(100)	NOT NULL,
	`in`	Date	NOT NULL,
	`out`	Date	NOT NULL,
	`device`	VARCHAR(100)	NOT NULL
);

ALTER TABLE `student` ADD CONSTRAINT `PK_STUDENT` PRIMARY KEY (
	`s_email`
);

ALTER TABLE `class` ADD CONSTRAINT `PK_CLASS` PRIMARY KEY (
	`class_code`,
	`t_email`
);

ALTER TABLE `user_relation_class` ADD CONSTRAINT `PK_USER_RELATION_CLASS` PRIMARY KEY (
	`s_email`,
	`class_code`
);

ALTER TABLE `teacher` ADD CONSTRAINT `PK_TEACHER` PRIMARY KEY (
	`t_email`
);

ALTER TABLE `test` ADD CONSTRAINT `PK_TEST` PRIMARY KEY (
	`test_id`,
	`class_code`
);

ALTER TABLE `test_relation_question` ADD CONSTRAINT `PK_TEST_RELATION_QUESTION` PRIMARY KEY (
	`test_id`,
	`question_id`
);

ALTER TABLE `question` ADD CONSTRAINT `PK_QUESTION` PRIMARY KEY (
	`question_id`
);

ALTER TABLE `question_result` ADD CONSTRAINT `PK_QUESTION_RESULT` PRIMARY KEY (
	`s_email`,
	`question_id`,
	`test_id`
);

ALTER TABLE `state` ADD CONSTRAINT `PK_STATE` PRIMARY KEY (
	`test_id`,
	`s_email`
);

ALTER TABLE `log_data` ADD CONSTRAINT `PK_LOG_DATA` PRIMARY KEY (
	`test_id`
);

ALTER TABLE `class` ADD CONSTRAINT `FK_teacher_TO_class_1` FOREIGN KEY (
	`t_email`
)
REFERENCES `teacher` (
	`t_email`
);

ALTER TABLE `user_relation_class` ADD CONSTRAINT `FK_student_TO_user_relation_class_1` FOREIGN KEY (
	`s_email`
)
REFERENCES `student` (
	`s_email`
);

ALTER TABLE `user_relation_class` ADD CONSTRAINT `FK_class_TO_user_relation_class_1` FOREIGN KEY (
	`class_code`
)
REFERENCES `class` (
	`class_code`
);

ALTER TABLE `test` ADD CONSTRAINT `FK_class_TO_test_1` FOREIGN KEY (
	`class_code`
)
REFERENCES `class` (
	`class_code`
);

ALTER TABLE `test_relation_question` ADD CONSTRAINT `FK_test_TO_test_relation_question_1` FOREIGN KEY (
	`test_id`
)
REFERENCES `test` (
	`test_id`
);

ALTER TABLE `test_relation_question` ADD CONSTRAINT `FK_question_TO_test_relation_question_1` FOREIGN KEY (
	`question_id`
)
REFERENCES `question` (
	`question_id`
);

ALTER TABLE `question_result` ADD CONSTRAINT `FK_student_TO_question_result_1` FOREIGN KEY (
	`s_email`
)
REFERENCES `student` (
	`s_email`
);

ALTER TABLE `question_result` ADD CONSTRAINT `FK_question_TO_question_result_1` FOREIGN KEY (
	`question_id`
)
REFERENCES `question` (
	`question_id`
);

ALTER TABLE `question_result` ADD CONSTRAINT `FK_test_TO_question_result_1` FOREIGN KEY (
	`test_id`
)
REFERENCES `test` (
	`test_id`
);

ALTER TABLE `state` ADD CONSTRAINT `FK_test_TO_state_1` FOREIGN KEY (
	`test_id`
)
REFERENCES `test` (
	`test_id`
);

ALTER TABLE `state` ADD CONSTRAINT `FK_student_TO_state_1` FOREIGN KEY (
	`s_email`
)
REFERENCES `student` (
	`s_email`
);

ALTER TABLE `log_data` ADD CONSTRAINT `FK_test_TO_log_data_1` FOREIGN KEY (
	`test_id`
)
REFERENCES `test` (
	`test_id`
);


INSERT INTO `test`(`class_code`, `test_name`, `test_start`, `test_end`, `test_wait`, `test_caution`, `test_retake`, `test_shuffle`, `test_escape`, `test_lang`, `test_status`) VALUES ("805760","JavaScript","2021-02-01 17:00","2021-02-01 18:00","300","123456","1","1","1","Java","1")



ALTER TABLE question MODIFY question_id INT NOT NULL AUTO_INCREMENT;



SELECT t.test_name, (select count(*) from test_relation_question where test_id=t.test_id) as questioncount ,t.test_start,t.test_end,t.test_status FROM test t WHERE t.class_code="876414"