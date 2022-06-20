CREATE DATABASE IF NOT EXISTS `erb-app-test`;

GRANT ALL ON `erb-app-test`.* TO 'erb-app' @'%';

CREATE DATABASE IF NOT EXISTS `erb-app-v1`;

GRANT ALL ON `erb-app-v1`.* TO 'erb-app' @'%';