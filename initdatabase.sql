create table users (
	id int not null primary key,
	username VARCHAR(255) unique not null,
	email VARCHAR(255) unique not null,
	password VARCHAR(255) unique not null
);

create table tasks (
	id int not null primary key,
	title VARCHAR(255) not null,
	content text not null,
	deadline timestamp not null,
	progress int default 0 not null,
	status varchar(255) not null,
	user_id int not null
);
