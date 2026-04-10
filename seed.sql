PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY,
	username TEXT NOT NULL,
	email TEXT NOT NULL,
	role TEXT NOT NULL,
	password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
	id TEXT PRIMARY KEY,
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	title TEXT NOT NULL,
	content TEXT NOT NULL,
	status TEXT NOT NULL,
	authorId TEXT NOT NULL,
	slug TEXT UNIQUE,
	FOREIGN KEY (authorId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tags (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL UNIQUE,
	createdAt DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS post_tags (
	postId TEXT NOT NULL,
	tagId TEXT NOT NULL,
	PRIMARY KEY (postId, tagId),
	FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
	FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
	id TEXT PRIMARY KEY,
	content TEXT NOT NULL,
	authorId TEXT NOT NULL,
	postId TEXT NOT NULL,
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME,
	FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
);

DELETE FROM comments;
DELETE FROM post_tags;
DELETE FROM posts;
DELETE FROM tags;
DELETE FROM users;

-- 1. INSERTION DES UTILISATEURS 


INSERT INTO users (id, username, email, role, password) VALUES
-- Lecteur
('uuid-reader', 'reader_user', 'reader@example.com', 'user', 'password123'),

-- Rédacteur 
('writer_user', 'writer_user', 'writer@example.com', 'writer', 'password123'),

-- Modérateur 
('uuid-mod', 'moderator_user', 'moderator@example.com', 'moderator', 'password123'),

-- Administrateur 
('uuid-admin', 'admin_user', 'admin@example.com', 'admin', 'password123');



-- 2. INSERTION DES POSTS


INSERT INTO posts (id, title, content, status, authorId, slug) VALUES
-- Brouillon,cite
('post-1', 'My Draft Article', 'This is a draft...', 'draft', 'writer_user','my-draft-article'),

-- En attente de relecture 
('post-2', 'Article Pending Review', 'Waiting for approval...', 'waiting', 'writer_user','article-pending-review'),

-- Article publié/accepté, cite
('post-3', 'Published Article', 'This is published...', 'accepted', 'writer_user','published-article'),

-- Article refusé, cite
('post-4', 'Rejected Article', 'This was rejected...', 'rejected', 'writer_user', 'rejected-article');


-- 3. DONNÉES ADDITIONNELLES RECOMMANDÉES 

-- Tags 
INSERT INTO tags (id, name, createdAt) VALUES
('tag-1', 'typescript', CURRENT_TIMESTAMP),
('tag-2', 'nodejs', CURRENT_TIMESTAMP),
('tag-3', 'javascript', CURRENT_TIMESTAMP);

INSERT INTO post_tags (postId, tagId) VALUES
('post-3', 'tag-1'),
('post-3', 'tag-2');

-- 4. INSERTION DES COMMENTAIRES
INSERT INTO comments (id, content, authorId, postId, createdAt) VALUES
('comment-1', 'Super article ! Merci pour le partage.', 'uuid-reader', 'post-3', CURRENT_TIMESTAMP),
('comment-2', 'Je ne suis pas tout à fait d''accord avec cette partie...', 'uuid-mod', 'post-3', CURRENT_TIMESTAMP),
('comment-3', 'Hâte de lire la suite !', 'uuid-admin', 'post-3', CURRENT_TIMESTAMP);