-- run as owner
alter table ISSUE modify OLDSERIALKEY VARCHAR2(50);
alter table ISSUE modify SERIALKEY VARCHAR2(500);
