CREATE TRIGGER `on_visit` AFTER UPDATE ON `question`
 FOR EACH ROW BEGIN
DECLARE obtained_medal int;

if NEW.views < 7 AND NEW.views = OLD.views +1 THEN
        if NEW.views = 2 THEN
            INSERT INTO user_medal (id_user,id_medal,id_question) values (NEW.id_user,5,NEW.id);
           else 
           set obtained_medal = (SELECT um.id from user_medal um join medal m on um.id_medal = m.id where id_question = NEW.id and type = 'question_visited');
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

    DECLARE medal_winner int;

    set likes = (SELECT COUNT(*) FROM question_vote WHERE id_question=NEW.id_question AND positive=1);
    set dislikes = (SELECT COUNT(*) FROM question_vote WHERE id_question=NEW.id_question AND positive=0);
    set votes = likes - dislikes;
    set had_medal = (select EXISTS(SELECT um.id FROM user_medal um join medal m on um.id_medal = m.id WHERE id_question=NEW.id_question and type = 'question_vote'));
    set medal_winner = (select q.id_user from question q where NEW.id_question=q.id);

    IF NEW.positive=1 THEN 
        UPDATE `user` set reputation=reputation +10 where id=medal_winner;
    ELSE
        IF (SELECT reputation from `user` where id=medal_winner) - 2 < 1 THEN
                    UPDATE `user` set reputation=1 where id=medal_winner;
        else
        UPDATE `user` set reputation=reputation -2 where id=medal_winner;
        end if;
    END if;

    if had_medal = 0 THEN 
        if votes = 1 then
            INSERT INTO user_medal (id_user,id_medal,id_question) values (medal_winner,1,NEW.id_question);
        end if;
    ELSE 
        set obtained_medal = (SELECT um.id from user_medal um join medal m on um.id_medal = m.id where id_question = NEW.id_question and type = 'question_vote');
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


CREATE TRIGGER `on_question_vote_update` AFTER UPDATE ON `question_vote`
 FOR EACH ROW BEGIN
DECLARE likes INT;
    DECLARE dislikes INT;
    DECLARE votes INT;
    DECLARE had_medal int;
    DECLARE obtained_medal int;
        DECLARE medal_winner int;


    set likes = (SELECT COUNT(*) FROM question_vote WHERE id_question=NEW.id_question AND positive=1);
    set dislikes = (SELECT COUNT(*) FROM question_vote WHERE id_question=NEW.id_question AND positive=0);
    set votes = likes - dislikes;
    set had_medal = (select EXISTS(SELECT um.id FROM user_medal um join medal m on um.id_medal = m.id WHERE id_question=NEW.id_question and type = 'question_vote'));
set medal_winner = (select q.id_user from question q where NEW.id_question=q.id);


IF NEW.positive=1 THEN 
        UPDATE `user` set reputation=reputation +12 where id=medal_winner;
    ELSE
        IF (SELECT reputation from `user` where id=medal_winner) - 12 < 1 THEN
                    UPDATE `user` set reputation=1 where id=medal_winner;
        else
        UPDATE `user` set reputation=reputation -12 where id=medal_winner;
        end if;
    END if;
    
        if had_medal = 0 THEN 
        if votes = 1 then
            INSERT INTO user_medal (id_user,id_medal,id_question) values (medal_winner,1,NEW.id_question);
        elseif votes >= 2 AND votes <=3 THEN 
            INSERT INTO user_medal (id_user,id_medal,id_question) values (medal_winner,2,NEW.id_question);
        end if;
    ELSE 
        set obtained_medal = (SELECT um.id from user_medal um join medal m on um.id_medal = m.id where id_question = NEW.id_question and type = 'question_vote');
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


CREATE TRIGGER `on_answer_vote_insert` AFTER INSERT ON `answer_vote`
FOR EACH ROW BEGIN
DECLARE likes INT;
    DECLARE dislikes INT;
    DECLARE votes INT;
    DECLARE had_medal int;
    DECLARE obtained_medal int;

    DECLARE medal_winner int;

    set likes = (SELECT COUNT(*) FROM answer_vote WHERE id_answer=NEW.id_answer AND positive=1);
    set dislikes = (SELECT COUNT(*) FROM answer_vote WHERE id_answer=NEW.id_answer AND positive=0);
    set votes = likes - dislikes;
    set had_medal = (select EXISTS(SELECT um.id FROM user_medal um join medal m on um.id_medal = m.id WHERE id_answer=NEW.id_answer and type = 'answer_vote'));
    set medal_winner = (select q.user_id from answer q where NEW.id_answer=q.id);

IF NEW.positive=1 THEN 
        UPDATE `user` set reputation=reputation +10 where id=medal_winner;
    ELSE
        IF (SELECT reputation from `user` where id=medal_winner) - 2 < 1 THEN
                    UPDATE `user` set reputation=1 where id=medal_winner;
        else
        UPDATE `user` set reputation=reputation -2 where id=medal_winner;
        end if;
    END if;
    if had_medal = 0 THEN 
        if votes = 2 then
            INSERT INTO user_medal (id_user,id_medal,id_answer) values (medal_winner,8,NEW.id_answer);
        end if;
    ELSE 
        set obtained_medal = (SELECT um.id from user_medal um join medal m on um.id_medal = m.id where id_answer = NEW.id_answer and type = 'answer_vote');
        if votes < 2 THEN 
            DELETE from user_medal where id= obtained_medal;
        elseif votes >= 2 AND votes <=3 THEN 
            UPDATE user_medal set id_medal= 8, date = CURRENT_TIMESTAMP() where id= obtained_medal;
        elseif votes >= 4 AND votes<=5 THEN 
            UPDATE user_medal set id_medal= 9, date = CURRENT_TIMESTAMP() where id= obtained_medal;
        elseif votes = 6 AND NEW.positive=1 THEN 
            UPDATE user_medal set id_medal= 10, date = CURRENT_TIMESTAMP() where id= obtained_medal;
        END IF;
    END IF;
END


CREATE TRIGGER `on_answer_vote_update` AFTER UPDATE ON `answer_vote`
 FOR EACH ROW BEGIN
DECLARE likes INT;
    DECLARE dislikes INT;
    DECLARE votes INT;
    DECLARE had_medal int;
    DECLARE obtained_medal int;
        DECLARE medal_winner int;


    set likes = (SELECT COUNT(*) FROM answer_vote WHERE id_answer=NEW.id_answer AND positive=1);
    set dislikes = (SELECT COUNT(*) FROM answer_vote WHERE id_answer=NEW.id_answer AND positive=0);
    set votes = likes - dislikes;
    set had_medal = (select EXISTS(SELECT um.id FROM user_medal um join medal m on um.id_medal = m.id WHERE id_answer=NEW.id_answer and type = 'answer_vote'));
set medal_winner = (select q.user_id from answer q where NEW.id_answer=q.id);

IF NEW.positive=1 THEN 
        UPDATE `user` set reputation=reputation +12 where id=medal_winner;
    ELSE
        IF (SELECT reputation from `user` where id=medal_winner) - 12 < 1 THEN
                    UPDATE `user` set reputation=1 where id=medal_winner;
        else
        UPDATE `user` set reputation=reputation -12 where id=medal_winner;
        end if;
    END if;
    if had_medal = 0 THEN 
        if votes >= 2 AND votes <=3 THEN 
            INSERT INTO user_medal (id_user,id_medal,id_answer) values (medal_winner,8,NEW.id_answer);
        end if;
    ELSE 
        set obtained_medal = (SELECT um.id from user_medal um join medal m on um.id_medal = m.id where id_answer = NEW.id_answer and type = 'answer_vote');
        if votes < 2 THEN 
            DELETE from user_medal where id= obtained_medal;
        elseif votes >= 2 AND votes <=3 THEN 
            UPDATE user_medal set id_medal= 8, date = CURRENT_TIMESTAMP() where id= obtained_medal;
        elseif votes >= 4 AND votes<=5 THEN 
            UPDATE user_medal set id_medal= 9, date = CURRENT_TIMESTAMP() where id= obtained_medal;
        elseif votes = 6 AND NEW.positive=1 THEN 
            UPDATE user_medal set id_medal= 10, date = CURRENT_TIMESTAMP() where id= obtained_medal;
        END IF;
    END IF;
END