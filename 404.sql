-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-11-2021 a las 23:39:08
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `404`
--
CREATE DATABASE IF NOT EXISTS `404` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `404`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `answer`
--

DROP TABLE IF EXISTS `answer`;
CREATE TABLE IF NOT EXISTS `answer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `likes` int(11) NOT NULL DEFAULT 0,
  `disikes` int(11) NOT NULL DEFAULT 0,
  `user_id` int(11) NOT NULL,
  `body` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `answer_questionfk` (`question_id`),
  KEY `answer_userfk` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `answer`
--

TRUNCATE TABLE `answer`;
--
-- Volcado de datos para la tabla `answer`
--

INSERT INTO `answer` (`id`, `question_id`, `active`, `date`, `likes`, `disikes`, `user_id`, `body`) VALUES
(1, 1, 1, '2021-11-09', 0, 0, 5, 'La propiedad position sirve para posicionar un elemento dentro de la página. Sin embargo,\r\ndependiendo de cual sea la propiedad que usemos, el elemento tomará una referencia u otra\r\npara posicionarse respecto a ella.\r\nLos posibles valores que puede adoptar la propiedad position son: static | relative | absolute |\r\nfixed | inherit | initial.'),
(2, 2, 1, '2021-11-09', 0, 0, 6, 'La pseudoclase :nth-child() selecciona los hermanos que cumplan cierta condición definida en\r\nla fórmula an + b. a y b deben ser números enteros, n es un contador. El grupo an representa\r\nun ciclo, cada cuantos elementos se repite; b indica desde donde empezamos a contar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `answer_vote`
--

DROP TABLE IF EXISTS `answer_vote`;
CREATE TABLE IF NOT EXISTS `answer_vote` (
  `id_answer` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `positive` tinyint(1) NOT NULL,
  KEY `answervote_answerfk` (`id_answer`),
  KEY `answervote_userfk` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `answer_vote`
--

TRUNCATE TABLE `answer_vote`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medal`
--

DROP TABLE IF EXISTS `medal`;
CREATE TABLE IF NOT EXISTS `medal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `metal` enum('gold','silver','bronze') NOT NULL,
  `merit` int(11) NOT NULL,
  `type` enum('question_vote','answer_vote','question_visited') NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `medal`
--

TRUNCATE TABLE `medal`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `question`
--

DROP TABLE IF EXISTS `question`;
CREATE TABLE IF NOT EXISTS `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `title` varchar(100) NOT NULL,
  `body` varchar(1000) NOT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `likes` int(11) NOT NULL DEFAULT 0,
  `dislikes` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `question_userfk` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `question`
--

TRUNCATE TABLE `question`;
--
-- Volcado de datos para la tabla `question`
--

INSERT INTO `question` (`id`, `id_user`, `active`, `title`, `body`, `views`, `date`, `likes`, `dislikes`) VALUES
(1, 1, 1, '¿Cual es la diferencia entre position: relative, position: absolute y position: fixed?', 'Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página. Soy bobo y voy a repetir lo mismo otra vez: Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página.', 0, '2021-11-08 23:00:00', 0, 0),
(2, 2, 1, '¿Cómo funciona exactamente nth-child?', 'No acabo de comprender muy bien que hace exactamente y qué usos prácticos puede tener.', 0, '2021-11-08 23:00:00', 0, 0),
(3, 3, 1, 'Diferencias entre == y === (comparaciones en JavaScript)', 'Siempre he visto que en JavaScript hay:\r\nasignaciones =\r\ncomparaciones == y ===\r\nCreo entender que == hace algo parecido a comparar el valor de la variable y el === también\r\ncompara el tipo (como un equals de java).', 0, '2021-11-08 23:00:00', 0, 0),
(4, 4, 1, 'Problema con asincronismo en Node\r\n', 'Soy nueva en Node... Tengo una modulo que conecta a una BD de postgres por medio de pgnode. En eso no tengo problemas. Mi problema es que al llamar a ese modulo, desde otro\r\nmodulo, y despues querer usar los datos que salieron de la BD me dice undefined... Estoy casi\r\nseguro que es porque la conexion a la BD devuelve una promesa, y los datos no estan\r\ndisponibles al momento de usarlos', 0, '2021-11-08 23:00:00', 0, 0),
(5, 5, 1, '¿Qué es la inyección SQL y cómo puedo evitarla?', 'He encontrado bastantes preguntas en StackOverflow sobre programas o formularios web que\r\nguardan información en una base de datos (especialmente en PHP y MySQL) y que contienen\r\ngraves problemas de seguridad relacionados principalmente con la inyección SQL.\r\nNormalmente dejo un comentario y/o un enlace a una referencia externa, pero un comentario\r\nno da mucho espacio para mucho y sería positivo que hubiera una referencia interna en SOes\r\nsobre el tema así que decidí escribir esta pregunta.', 0, '2021-11-08 23:00:00', 0, 0),
(6, 1, 1, 'Prueba', 'dsfgsdfg', 0, '2021-11-23 23:00:00', 0, 0),
(7, 1, 1, 'Pregunta', 'erestonto o que\r\n\r\ne', 0, '2021-11-23 23:00:00', 0, 0),
(8, 1, 1, 'gg', 'fgsdf\r\n', 0, '2021-11-23 23:00:00', 0, 0),
(9, 1, 1, 'Estoy probando', 'No se\r\n\r\n\r\n\r\n\r\n\r\nertetewrtwertwert', 0, '2021-11-23 23:00:00', 0, 0),
(10, 1, 1, 'dfgsdfg', 'sdfgsdfg', 0, '2021-11-24 22:37:54', 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `question_tag`
--

DROP TABLE IF EXISTS `question_tag`;
CREATE TABLE IF NOT EXISTS `question_tag` (
  `id_question` int(11) NOT NULL,
  `id_tag` int(11) NOT NULL,
  KEY `questiontag_questionfk` (`id_question`),
  KEY `questiontag_tagfk` (`id_tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `question_tag`
--

TRUNCATE TABLE `question_tag`;
--
-- Volcado de datos para la tabla `question_tag`
--

INSERT INTO `question_tag` (`id_question`, `id_tag`) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 3),
(4, 4),
(5, 5),
(5, 6),
(2, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `question_vote`
--

DROP TABLE IF EXISTS `question_vote`;
CREATE TABLE IF NOT EXISTS `question_vote` (
  `id_question` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `positive` tinyint(1) NOT NULL,
  KEY `questionvote_answerfk` (`id_question`),
  KEY `questionvote_userfk` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `question_vote`
--

TRUNCATE TABLE `question_vote`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tag`
--

DROP TABLE IF EXISTS `tag`;
CREATE TABLE IF NOT EXISTS `tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `tag`
--

TRUNCATE TABLE `tag`;
--
-- Volcado de datos para la tabla `tag`
--

INSERT INTO `tag` (`id`, `name`) VALUES
(1, 'css'),
(2, 'css3'),
(7, 'html'),
(3, 'JavaScript'),
(5, 'mysql'),
(4, 'nodejs'),
(6, 'sql');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `email` varchar(100) NOT NULL,
  `pass` varchar(100) NOT NULL,
  `image` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `reputation` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `user`
--

TRUNCATE TABLE `user`;
--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `date`, `email`, `pass`, `image`, `name`, `active`, `reputation`) VALUES
(1, '2021-11-09', 'nico@404.es', '1234', 'nico.png', 'Nico', 1, 1),
(2, '2021-11-09', 'roberto@404.es', '1234', 'roberto.png', 'Roberto', 1, 1),
(3, '2021-11-09', 'sfg@404.es', '1234', 'sfg.png', 'SFG', 1, 1),
(4, '2021-11-09', 'marta@404.es', '1234', 'marta.png', 'Marta', 1, 1),
(5, '2021-11-09', 'lucas@404.es', '1234', 'lucas.png', 'Lucas', 1, 1),
(6, '2021-11-09', 'emy@404.es', '1234', 'emy.png', 'Emy', 1, 1),
(7, '2021-11-16', 'user@user.es', '666666', 'juanito', 'user', 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_medal`
--

DROP TABLE IF EXISTS `user_medal`;
CREATE TABLE IF NOT EXISTS `user_medal` (
  `id_user` int(11) NOT NULL,
  `id_medal` int(11) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  KEY `usermedal_medalfk` (`id_medal`),
  KEY `usermedal_userlfk` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `user_medal`
--

TRUNCATE TABLE `user_medal`;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `answer`
--
ALTER TABLE `answer`
  ADD CONSTRAINT `answer_questionfk` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `answer_userfk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `answer_vote`
--
ALTER TABLE `answer_vote`
  ADD CONSTRAINT `answervote_answerfk` FOREIGN KEY (`id_answer`) REFERENCES `answer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `answervote_userfk` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `question_userfk` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `question_tag`
--
ALTER TABLE `question_tag`
  ADD CONSTRAINT `questiontag_questionfk` FOREIGN KEY (`id_question`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontag_tagfk` FOREIGN KEY (`id_tag`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `question_vote`
--
ALTER TABLE `question_vote`
  ADD CONSTRAINT `questionvote_answerfk` FOREIGN KEY (`id_question`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questionvote_userfk` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `user_medal`
--
ALTER TABLE `user_medal`
  ADD CONSTRAINT `usermedal_medalfk` FOREIGN KEY (`id_medal`) REFERENCES `medal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usermedal_userlfk` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
