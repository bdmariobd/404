CREATE TRIGGER `on_visit` AFTER UPDATE ON `question`
 FOR EACH ROW BEGIN
DECLARE obtained_medal int;

if NEW.views < 7 AND NEW.views = OLD.views +1 THEN
        if NEW.views = 2 THEN
            INSERT INTO user_medal (id_user,id_medal,id_question) values (NEW.id_user,5,NEW.id);
           else 
           set obtained_medal = (SELECT um.id from user_medal um join medal m on um.id_medal = m.id where id_user= NEW.id_user and id_question = NEW.id and type = 'question_visited');
           END IF;
        if NEW.views= 4 THEN
            UPDATE user_medal set id_medal= 6, date = CURRENT_TIMESTAMP() where id=obtained_medal;
        ELSEIF NEW.views = 6 THEN 
            UPDATE user_medal set id_medal= 7, date = CURRENT_TIMESTAMP() where id=obtained_medal;
        END IF;
    END IF;
    END


CREATE TRIGGER `on_question_vote_insert` AFTER INSERT ON `question_vote`
 FOR EACH ROW BEGIN
DECLARE likes INT;
    DECLARE dislikes INT;
    DECLARE votes INT;
    DECLARE had_medal int;
    DECLARE obtained_medal int;

    set likes = (SELECT COUNT(*) FROM question_vote WHERE id_question=NEW.id_question AND positive=1);
    set dislikes = (SELECT COUNT(*) FROM question_vote WHERE id_question=NEW.id_question AND positive=0);
    set votes = likes - dislikes;
    set had_medal = (select EXISTS(SELECT um.id FROM user_medal um join medal m on um.id_medal = m.id WHERE id_user= NEW.id_user and id_question=NEW.id_question and type = 'question_vote'));

    if had_medal = 0 AND votes = 1 THEN 
        INSERT INTO user_medal (id_user,id_medal,id_question) values (NEW.id_user,1,NEW.id_question);
    ELSE 
        set obtained_medal = (SELECT um.id from user_medal um join medal m on um.id_medal = m.id where id_user= NEW.id_user and id_question = NEW.id_question and type = 'question_vote');
        if votes < 1 THEN 
            DELETE from user_medal where id= obtained_medal;
        elseif votes = 1 THEN 
            UPDATE user_medal set id_medal= 1, date = CURRENT_TIMESTAMP() where id= obtained_medal;
        elseif votes >= 2 AND votes <=3 THEN 
            UPDATE user_medal set id_medal= 2, date = CURRENT_TIMESTAMP() where id= obtained_medal;
        elseif votes >= 4 AND votes<=5 THEN 
            UPDATE user_medal set id_medal= 3, date = CURRENT_TIMESTAMP() where id= obtained_medal;
        elseif votes = 6 AND NEW.positive=1 THEN 
            UPDATE user_medal set id_medal= 4, date = CURRENT_TIMESTAMP() where id= obtained_medal;
        END IF;
    END IF;
END