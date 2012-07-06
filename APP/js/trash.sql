
create table rf_usquad_t
(
	id number(38,0) not null enable,
	user_id number(38,0),
	sport_id number(38,0),
	competition_id number(38,0),
	name varchar2(200 byte),
	nickname varchar2(50 byte),
	start_round_id number(38,0),
	favorite_cgroup_id number(38,0),
	favorite_chattel_id number(38,0),
	insert_dtime date default sysdate,
	audit_dtime date default sysdate,
	bye_squad varchar2(1 byte) default 'n',
	extra_trades number(38,0),
	constraint usquad_t_pk primary key (id)
		using index pctfree 10 initrans 2 maxtrans 255 compute statistics
		storage(initial 65536 next 1048576 minextents 1 maxextents 2147483645
		pctincrease 0 freelists 1 freelist groups 1 buffer_pool default
)
;

create or replace trigger "fantasy"."usquad_biur"
before insert or update
on usquad_t
for each row
begin -- $revision: 1.2 $
	if (inserting) then
		if (:new.id) is null then
			select usquad_seq.nextval
			into :new.id
			from dual;
		end if;
	end if;

	if (updating) then
		:new.audit_dtime := sysdate;
	end if;
end usquad_biur;
/
alter trigger "fantasy"."usquad_biur" enable
;

create sequence user_seq
minvalue 1 maxvalue 999999999999999999999999999
increment by 1 start with 58656 nocache noorder nocycle
;









constraint "user_email" unique ("email") enable
