-- run as owner

drop table newfile cascade constraints;
drop sequence newfile_seq;

create table newfile (
  id          number(10)    not null,
  name        varchar2(70)  not null,
  key         varchar2(500) not null,
  issued      number(1)     DEFAULT 0 NOT NULL,
  reserved    number(1)     DEFAULT 0 NOT NULL,
  created     timestamp     not null,
  creator     varchar2(50)  not null,
  updated     timestamp     null,
  updator     varchar2(50)  null,
  primary key (id)
);

create sequence newfile_seq
  start with 1;

grant select on newfile to license_ro_role;
grant select, insert, update, delete on newfile to license_rw_role;
grant select on newfile_seq to license_rw_role;



