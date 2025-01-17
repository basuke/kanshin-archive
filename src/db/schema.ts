import { int, sqliteTable as table, text, index } from 'drizzle-orm/sqlite-core';

export const Users = table('users', {
    id: int().primaryKey({autoIncrement: true}),
    name: text().notNull(),
    profile: text().notNull(),
    website: text(),
    image: text(),
    created: text().notNull(),
    updated: text().notNull(),
}, (Users) => ({
    nameIdx: index('users_name_idx').on(Users.name),
    createdIdx: index('users_created_idx').on(Users.created),
    updatedIdx: index('users_updated_idx').on(Users.updated),
}));

export const Categories = table('categories', {
    id: int().primaryKey({autoIncrement: true}),
    name: text().notNull(),
}, (Categories) => ({
    nameIdx: index('categories_name_idx').on(Categories.name),
}));

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
}, (Keywords) => ({
    titleIdx: index('keywords_title_idx').on(Keywords.title),
    userIdIdx: index('keywords_user_id_idx').on(Keywords.userId),
    categoryIdIdx: index('keywords_category_id_idx').on(Keywords.categoryId),
    createdIdx: index('keywords_created_idx').on(Keywords.created),
    updatedIdx: index('keywords_updated_idx').on(Keywords.updated),
    viewedIdx: index('keywords_viewed_idx').on(Keywords.viewed),
}));

export const KeywordAttributes = table('keyword_attributes', {
    id: int().primaryKey({autoIncrement: true}),
    keywordId: int('keyword_id').notNull(),
    position: int().notNull(),
    name: text().notNull(),
    value: text().notNull(),
}, (KeywordAttributes) => ({
    keywordIdIdx: index('keyword_attributes_keyword_id_idx').on(KeywordAttributes.keywordId),
}));

export const KeywordComments = table('keyword_comments', {
    id: int().primaryKey({autoIncrement: true}),
    keywordId: int('keyword_id').notNull(),
    userId: int('user_id').notNull(),
    position: int().notNull(),
    date: text().notNull(),
    comment: text().notNull(),
}, (KeywordComments) => ({
    keywordIdIdx: index('keyword_comments_keyword_id_idx').on(KeywordComments.keywordId),
    userIdIdx: index('keyword_comments_user_id_idx').on(KeywordComments.userId),
    dateIdx: index('keyword_comments_date_idx').on(KeywordComments.date),
}));

export const KeywordConnections = table('keyword_connections', {
    id: int().primaryKey({autoIncrement: true}),
    id1: int().notNull(),
    id2: int().notNull(),
    reason1: text(),
    reason2: text(),
}, (KeywordConnections) => ({
    id1Idx: index('keyword_connections_id1_idx').on(KeywordConnections.id1),
    id2Idx: index('keyword_connections_id2_idx').on(KeywordConnections.id2),
}));

export const Diaries = table('diaries', {
    id: int().primaryKey({autoIncrement: true}),
    title: text().notNull(),
    userId: int('user_id').notNull(),
    body: text().notNull(),
    date: text().notNull(),
}, (Diaries) => ({
    userIdIdx: index('diaries_user_id_idx').on(Diaries.userId),
    dateIdx: index('diaries_date_idx').on(Diaries.date),
}));

export const DiaryImages = table('diary_images', {
    id: int().primaryKey({autoIncrement: true}),
    diaryId: int('diary_id').notNull(),
    position: int().notNull(),
    url: text().notNull(),
}, (DiaryImages) => ({
    diaryIdIdx: index('diary_images_diary_id_idx').on(DiaryImages.diaryId),
}));

export const DiaryComments = table('diary_comments', {
    id: int().primaryKey({autoIncrement: true}),
    diaryId: int('diary_id').notNull(),
    userId: int('user_id').notNull(),
    position: int().notNull(),
    date: text().notNull(),
    comment: text().notNull(),
}, (DiaryComments) => ({
    diaryIdIdx: index('diary_comments_diary_id_idx').on(DiaryComments.diaryId),
    userIdIdx: index('diary_comments_user_id_idx').on(DiaryComments.userId),
    dateIdx: index('diary_comments_date_idx').on(DiaryComments.date),
}));
