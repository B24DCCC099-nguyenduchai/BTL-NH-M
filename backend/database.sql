CREATE DATABASE IF NOT EXISTS `forum_app`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `forum_app`;

CREATE TABLE `Users` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `passwordHash` VARCHAR(255) NOT NULL,
  `role` ENUM('student','lecturer','admin') NOT NULL DEFAULT 'student',
  `status` ENUM('active','locked') NOT NULL DEFAULT 'active',
  `department` VARCHAR(255),
  `faculty` VARCHAR(255),
  `class` VARCHAR(255),
  `avatar` VARCHAR(255),
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Posts` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `authorId` CHAR(36) NOT NULL,
  `votes` INT NOT NULL DEFAULT 0,
  `views` INT NOT NULL DEFAULT 0,
  `answersCount` INT NOT NULL DEFAULT 0,
  `category` VARCHAR(255),
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  INDEX (`authorId`),
  CONSTRAINT `Posts_author_fk` FOREIGN KEY (`authorId`) REFERENCES `Users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Comments` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `postId` CHAR(36) NOT NULL,
  `authorId` CHAR(36) NOT NULL,
  `parentCommentId` CHAR(36),
  `content` TEXT NOT NULL,
  `votes` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  INDEX (`postId`),
  INDEX (`authorId`),
  INDEX (`parentCommentId`),
  CONSTRAINT `Comments_post_fk` FOREIGN KEY (`postId`) REFERENCES `Posts`(`id`) ON DELETE CASCADE,
  CONSTRAINT `Comments_author_fk` FOREIGN KEY (`authorId`) REFERENCES `Users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `Comments_parent_fk` FOREIGN KEY (`parentCommentId`) REFERENCES `Comments`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Tags` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `color` VARCHAR(50) DEFAULT '#7B61FF',
  `usageCount` INT DEFAULT 0,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `PostTags` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `postId` CHAR(36) NOT NULL,
  `tagId` CHAR(36) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  INDEX (`postId`),
  INDEX (`tagId`),
  CONSTRAINT `PostTags_post_fk` FOREIGN KEY (`postId`) REFERENCES `Posts`(`id`) ON DELETE CASCADE,
  CONSTRAINT `PostTags_tag_fk` FOREIGN KEY (`tagId`) REFERENCES `Tags`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Notifications` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `recipientId` CHAR(36) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `targetId` CHAR(36),
  `message` VARCHAR(255) NOT NULL,
  `read` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  INDEX (`recipientId`),
  CONSTRAINT `Notifications_recipient_fk` FOREIGN KEY (`recipientId`) REFERENCES `Users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `PostVotes` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `postId` CHAR(36) NOT NULL,
  `userId` CHAR(36) NOT NULL,
  `voteType` ENUM('up', 'down') NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  UNIQUE INDEX (`postId`, `userId`),
  INDEX (`userId`),
  CONSTRAINT `PostVotes_post_fk` FOREIGN KEY (`postId`) REFERENCES `Posts`(`id`) ON DELETE CASCADE,
  CONSTRAINT `PostVotes_user_fk` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `CommentVotes` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `commentId` CHAR(36) NOT NULL,
  `userId` CHAR(36) NOT NULL,
  `voteType` ENUM('up', 'down') NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  UNIQUE INDEX (`commentId`, `userId`),
  INDEX (`userId`),
  CONSTRAINT `CommentVotes_comment_fk` FOREIGN KEY (`commentId`) REFERENCES `Comments`(`id`) ON DELETE CASCADE,
  CONSTRAINT `CommentVotes_user_fk` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
