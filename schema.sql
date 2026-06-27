CREATE DATABASE todo;

CREATE TABLE roles(
    role_id SERIAL, 
    name TEXT
);

CREATE TABLE users(
    user_id SERIAL, 
    username TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    archived_at TIMESTAMPTZ,
    role_id INT,

    CONSTRAINT pk_user PRIMARY KEY (user_id),
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(role_id),
    CONSTRAINT uq_username UNIQUE (username)
);

CREATE TYPE STATUS AS ENUM ('done', 'ongoing', 'not_done');
CREATE TYPE CATEGORY AS ENUM ('w-maxxing', 'sahur', 'brainrot');

CREATE TABLE tasks(
    task_id SERIAL,
    title TEXT NOT NULL,
    description TEXT, 
    status STATUS DEFAULT 'not_done', 
    category CATEGORY DEFAULT 'brainrot',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    archived_at TIMESTAMPTZ,
    user_id INT,

    CONSTRAINT pk_task PRIMARY KEY (task_id),
    CONSTRAINT fk_task_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);
