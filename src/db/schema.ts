import { int, sqliteTable as table, text } from 'drizzle-orm/sqlite-core';

export const Users = table('users', {
    id: int().primaryKey({autoIncrement: true}),
    name: text().notNull(),
    profile: text().notNull(),
    website: text(),
    image: text(),
    created: text().notNull(),
    updated: text().notNull(),
});

export const Categories = table('categories', {
    id: int().primaryKey({autoIncrement: true}),
    name: text().notNull(),
});

export const Keywords = table('keywords', {
    id: int().primaryKey({autoIncrement: true}),
    title: text().notNull(),
    userId: int('user_id').notNull(),
    categoryId: int('category_id').notNull(),
    body: text().notNull(),
    created: text().notNull(),
    updated: text().notNull(),
    viewed: int().notNull(),
    image: text(),
});

export const KeywordAttributes = table('keyword_attributes', {
    id: int().primaryKey({autoIncrement: true}),
    keywordId: int('keyword_id').notNull(),
    position: int().notNull(),
    name: text().notNull(),
    value: text().notNull(),
});

export const KeywordComments = table('keyword_comments', {
    id: int().primaryKey({autoIncrement: true}),
    keywordId: int('keyword_id').notNull(),
    userId: int('user_id').notNull(),
    position: int().notNull(),
    date: text().notNull(),
    comment: text().notNull(),
});

export const KeywordConnections = table('keyword_connections', {
    id: int().primaryKey({autoIncrement: true}),
    id1: int().notNull(),
    id2: int().notNull(),
    reason1: text(),
    reason2: text(),
});

export const Diaries = table('diaries', {
    id: int().primaryKey({autoIncrement: true}),
    title: text().notNull(),
    userId: int('user_id').notNull(),
    body: text().notNull(),
    date: text().notNull(),
});

export const DiaryImages = table('diary_images', {
    id: int().primaryKey({autoIncrement: true}),
    diaryId: int('diary_id').notNull(),
    position: int().notNull(),
    url: text().notNull(),
});

export const DiaryComments = table('diary_comments', {
    id: int().primaryKey({autoIncrement: true}),
    diaryId: int('diary_id').notNull(),
    userId: int('user_id').notNull(),
    position: int().notNull(),
    date: text().notNull(),
    comment: text().notNull(),
});
