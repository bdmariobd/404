CREATE TRIGGER `on_visit` AFTER UPDATE ON `question`
 FOR EACH ROW if NEW.views < 7 AND NEW.views = OLD.views +1 THEN
        if NEW.views = 2 THEN
            INSERT INTO user_medal (id_user,id_medal,id_question) values (NEW.id_user,5,NEW.id);
        elseif NEW.views= 4 THEN
            UPDATE user_medal set id_medal= 6, date = CURRENT_TIMESTAMP() where id_user = NEW.id_user and id_question= NEW.id;
        ELSEIF NEW.views = 6 THEN 
            UPDATE user_medal set id_medal= 7, date = CURRENT_TIMESTAMP() where id_user = NEW.id_user and id_question= NEW.id;
        END IF;
    END IF


CREATE TRIGGER `on_question_vote_insert` AFTER INSERT ON `question_vote`
 FOR EACH ROW BEGIN
DECLARE likes INT;
    DECLARE dislikes INT;
    DECLARE votes INT;
    DECLARE had_medal int;
    set likes = (SELECT COUNT(*) FROM question_vote WHERE id_question=NEW.id_question AND positive=1);
    set dislikes = (SELECT COUNT(*) FROM question_vote WHERE id_question=NEW.id_question AND positive=0);
    set votes = likes - dislikes;
    set votes = (SELECT COUNT(*) as had_medal from user_medal WHERE id_user = NEW.id_user AND id_question = NEW.id_question);

    if votes = 1 THEN 
        IF had_medal>0 THEN 
            UPDATE user_medal set id_medal= 1, date = CURRENT_TIMESTAMP() where id_question= NEW.id_question;
        ELSE 
            INSERT INTO user_medal (id_user,id_medal,id_question) values (NEW.id_user,1,NEW.id_question);
        END IF;
    elseif votes >= 2 OR votes <=3 THEN 
        UPDATE user_medal set id_medal= 2, date = CURRENT_TIMESTAMP() where  id_question= NEW.id_question;
    elseif votes >= 4 OR votes<=5 THEN 
        UPDATE user_medal set id_medal= 3, date = CURRENT_TIMESTAMP() where id_medal= 2 AND id_question= NEW.id_question;
    elseif votes = 6 THEN 
        UPDATE user_medal set id_medal= 4, date = CURRENT_TIMESTAMP() where id_medal= 3 AND id_question= NEW.id_question;
    END IF;
END