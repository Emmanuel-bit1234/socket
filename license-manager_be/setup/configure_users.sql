-- run as sys
DROP USER license_owner CASCADE;
DROP USER license_user CASCADE;
DROP USER license_read CASCADE;
DROP ROLE license_rw_role;
DROP ROLE license_ro_role;

-- schema owner
CREATE USER license_owner IDENTIFIED BY license_owner
DEFAULT TABLESPACE users
TEMPORARY TABLESPACE temp
QUOTA UNLIMITED ON users;

GRANT CONNECT, CREATE TABLE, CREATE SEQUENCE, CREATE TRIGGER TO license_owner;

-- app user
CREATE USER license_user IDENTIFIED BY license_user
DEFAULT TABLESPACE users
TEMPORARY TABLESPACE temp;

GRANT CONNECT TO license_user;

-- read user
CREATE USER license_read IDENTIFIED BY license_read
DEFAULT TABLESPACE users
TEMPORARY TABLESPACE temp;

GRANT CONNECT TO license_read;

-- roles
CREATE ROLE license_rw_role;
CREATE ROLE license_ro_role;

GRANT license_rw_role TO license_user;
GRANT license_ro_role TO license_read;

-- app user default schema
CREATE OR REPLACE TRIGGER license_user.after_logon_trg
AFTER LOGON ON license_user.SCHEMA
  BEGIN
    DBMS_APPLICATION_INFO.set_module(USER, 'Initialized');
    EXECUTE IMMEDIATE 'ALTER SESSION SET CURRENT_SCHEMA = license_owner';
  END;
/

-- app read default schema
CREATE OR REPLACE TRIGGER license_read.after_logon_trg
AFTER LOGON ON license_read.SCHEMA
  BEGIN
    DBMS_APPLICATION_INFO.set_module(USER, 'Initialized');
    EXECUTE IMMEDIATE 'ALTER SESSION SET CURRENT_SCHEMA = license_owner';
  END;
/