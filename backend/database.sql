SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `CommentVotes`;
DROP TABLE IF EXISTS `PostVotes`;
DROP TABLE IF EXISTS `SavedPosts`;
DROP TABLE IF EXISTS `Notifications`;
DROP TABLE IF EXISTS `PostTags`;
DROP TABLE IF EXISTS `Comments`;
DROP TABLE IF EXISTS `Posts`;
DROP TABLE IF EXISTS `Tags`;
DROP TABLE IF EXISTS `Users`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE DATABASE IF NOT EXISTS `forum_app`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `forum_app`;

CREATE TABLE `Users` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `passwordHash` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'lecturer', 'admin') NOT NULL DEFAULT 'student',
  `status` ENUM('active', 'locked') NOT NULL DEFAULT 'active',
  `department` VARCHAR(255),
  `faculty` VARCHAR(255),
  `class` VARCHAR(255),
  `avatar` VARCHAR(255),
  `darkMode` BOOLEAN NOT NULL DEFAULT FALSE,
  `notifications` BOOLEAN NOT NULL DEFAULT TRUE,
  `bio` TEXT,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  INDEX `idx_users_email` (`email`)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

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
  INDEX `idx_posts_authorId` (`authorId`),
  INDEX `idx_posts_title` (`title`),
  INDEX `idx_posts_createdAt` (`createdAt`),
  INDEX `idx_posts_votes` (`votes`),
  INDEX `idx_posts_views` (`views`),
  CONSTRAINT `Posts_author_fk`
    FOREIGN KEY (`authorId`)
    REFERENCES `Users`(`id`)
    ON DELETE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Comments` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `postId` CHAR(36) NOT NULL,
  `authorId` CHAR(36) NOT NULL,
  `parentCommentId` CHAR(36),
  `content` TEXT NOT NULL,
  `votes` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  INDEX `idx_comments_postId` (`postId`),
  INDEX `idx_comments_authorId` (`authorId`),
  INDEX `idx_comments_parentCommentId` (`parentCommentId`),
  INDEX `idx_comments_createdAt` (`createdAt`),
  CONSTRAINT `Comments_post_fk`
    FOREIGN KEY (`postId`)
    REFERENCES `Posts`(`id`)
    ON DELETE CASCADE,
  CONSTRAINT `Comments_author_fk`
    FOREIGN KEY (`authorId`)
    REFERENCES `Users`(`id`)
    ON DELETE CASCADE,
  CONSTRAINT `Comments_parent_fk`
    FOREIGN KEY (`parentCommentId`)
    REFERENCES `Comments`(`id`)
    ON DELETE SET NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Tags` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `color` VARCHAR(50) DEFAULT '#7B61FF',
  `usageCount` INT DEFAULT 0,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  INDEX `idx_tags_name` (`name`)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `PostTags` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `postId` CHAR(36) NOT NULL,
  `tagId` CHAR(36) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  UNIQUE KEY `unique_post_tag` (`postId`, `tagId`),
  INDEX `idx_posttags_postId` (`postId`),
  INDEX `idx_posttags_tagId` (`tagId`),
  CONSTRAINT `PostTags_post_fk`
    FOREIGN KEY (`postId`)
    REFERENCES `Posts`(`id`)
    ON DELETE CASCADE,
  CONSTRAINT `PostTags_tag_fk`
    FOREIGN KEY (`tagId`)
    REFERENCES `Tags`(`id`)
    ON DELETE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Notifications` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `recipientId` CHAR(36) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `targetId` CHAR(36),
  `message` VARCHAR(255) NOT NULL,
  `read` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  INDEX `idx_notifications_recipientId` (`recipientId`),
  CONSTRAINT `Notifications_recipient_fk`
    FOREIGN KEY (`recipientId`)
    REFERENCES `Users`(`id`)
    ON DELETE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `PostVotes` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `postId` CHAR(36) NOT NULL,
  `userId` CHAR(36) NOT NULL,
  `voteType` ENUM('up', 'down') NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  UNIQUE KEY `unique_post_vote` (`postId`, `userId`),
  INDEX `idx_postvotes_postId` (`postId`),
  INDEX `idx_postvotes_userId` (`userId`),
  CONSTRAINT `PostVotes_post_fk`
    FOREIGN KEY (`postId`)
    REFERENCES `Posts`(`id`)
    ON DELETE CASCADE,
  CONSTRAINT `PostVotes_user_fk`
    FOREIGN KEY (`userId`)
    REFERENCES `Users`(`id`)
    ON DELETE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `CommentVotes` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `commentId` CHAR(36) NOT NULL,
  `userId` CHAR(36) NOT NULL,
  `voteType` ENUM('up', 'down') NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  UNIQUE KEY `unique_comment_vote` (`commentId`, `userId`),
  INDEX `idx_commentvotes_commentId` (`commentId`),
  INDEX `idx_commentvotes_userId` (`userId`),
  CONSTRAINT `CommentVotes_comment_fk`
    FOREIGN KEY (`commentId`)
    REFERENCES `Comments`(`id`)
    ON DELETE CASCADE,
  CONSTRAINT `CommentVotes_user_fk`
    FOREIGN KEY (`userId`)
    REFERENCES `Users`(`id`)
    ON DELETE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `SavedPosts` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `userId` CHAR(36) NOT NULL,
  `postId` CHAR(36) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  UNIQUE KEY `unique_saved_post` (`userId`, `postId`),
  INDEX `idx_savedposts_userId` (`userId`),
  INDEX `idx_savedposts_postId` (`postId`),
  CONSTRAINT `SavedPosts_user_fk`
    FOREIGN KEY (`userId`)
    REFERENCES `Users`(`id`)
    ON DELETE CASCADE,
  CONSTRAINT `SavedPosts_post_fk`
    FOREIGN KEY (`postId`)
    REFERENCES `Posts`(`id`)
    ON DELETE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;