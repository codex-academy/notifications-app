-- DDL
create table notifications(
	id integer primary key AUTOINCREMENT,
	first_name text not null,
	book_count integer default 0,
	days_due_in integer default 0
);