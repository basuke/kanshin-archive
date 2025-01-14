import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { getTableName } from 'drizzle-orm';
import {
    Users,
    Categories,
    Keywords,
    KeywordAttributes,
    KeywordComments,
    KeywordConnections,
    Diaries,
    DiaryImages,
    DiaryComments,
} from './db/schema';
import { readFileSync } from 'fs';

const db = drizzle(process.env.DB_FILE_NAME!);

const sources= {
    users: './data/users.json',
    keywords: './data/keywords.json',
    diaries: './data/diaries.json',
    connections: './data/connections.json',
};

function loadSource(kind: string) {
    const items = JSON.parse(readFileSync(sources[kind], 'utf-8'));
    console.log(`${kind}: ${items.length}`);
    return items;
}

const chunkSize = 3000;

async function chunkedInsert(table: any, items: any[]) {
    console.log(`Chnked Insert into ${getTableName(table)} : chunkSize=${chunkSize}`);

    while (items.length > 0) {
        const chunk = items.splice(0, chunkSize);
        await db.insert(table).values(chunk);
        console.log(`  ...inserted ${chunk.length}, remainings ${items.length}`);
    }
}

interface User {
    id: number;
    name?: string;
    profile?: string;
    website?: string;
    image?: string;
    created?: string;
    updated?: string;
};

interface Category {
    id: number;
    name: string;
}

interface Keyword {
    id: number;
    title: string;
    user_id: number;
    category: Category;
    body: string;
    created: string;
    updated: string;
    viewed: number;
    images: string[];
    attributes: {name: string, value: string}[];
    comments: {user_id: number, date: string, text: string}[];
};

interface Connection {
    id: number;
    other_id: number;
    in_reason?: string;
    out_reason?: string;
}
interface Diary {
    id: number;
    user_id: number;
    title: string;
    text: string;
    date: string;
    images: string[];
    comments: {user_id: number, date: string, text: string}[];
};

async function main() {
    const comUsers: User[] = loadSource('users');
    const comKeywords: Keyword[] = loadSource('keywords');
    const comDiaries: Diary[] = loadSource('diaries');
    const comConnections: Connection[] = loadSource('connections');

    db.delete(DiaryComments).run();
    db.delete(DiaryImages).run();
    db.delete(Diaries).run();
    db.delete(KeywordConnections).run();
    db.delete(KeywordAttributes).run();
    db.delete(KeywordComments).run();
    db.delete(Keywords).run();
    db.delete(Categories).run();
    db.delete(Users).run();

    // users ============

    await chunkedInsert(Users, comUsers
        .map(user => {
            user = {...user};
            if (!('name' in user)) {
                user.name = '';
            }
            if (!('profile' in user)) {
                user.profile = '';
            }
            return user;
        })
    );

    // keywords and categories ============

    const categories = new Map<number, string>();

    const keywords = comKeywords.map(source => {
        const category = source.category;
        if (!categories.has(category.id)) {
            categories.set(category.id, category.name);
        }

        return {
            id: source.id,
            title: source.title ?? '',
            userId: source.user_id,
            categoryId: category.id,
            body: source.body ?? '',
            created: source.created ?? '',
            updated: source.updated ?? '',
            viewed: source.viewed ?? 0,
            image: source.images.length > 0 ? source.images[0] : null,
        };
    });

    const categoryValues = [];
    categories.forEach(async (name, id) => categoryValues.push({id, name}));
    await chunkedInsert(Categories, categoryValues);

    await chunkedInsert(Keywords, keywords);

    // keyword connections ============

    const keywordConnections = comConnections.filter(source => {
        return source.id < source.other_id;
    }).map(source => {
        return {
            id1: source.id,
            id2: source.other_id,
            reason1: source.in_reason ?? null,
            reason2: source.out_reason ?? null,
        };
    });

    await chunkedInsert(KeywordConnections, keywordConnections);

    // keyword attributes ============

    const attributes = comKeywords.reduce((result, source) => {
        return result.concat(source.attributes.map((attribute, index) => ({
            keywordId: source.id,
            position: index,
            name: attribute.name,
            value: attribute.value,
        })));
    }, []);
    await chunkedInsert(KeywordAttributes, attributes);

    // keyword comments ============

    const keywordComments = comKeywords.reduce((result, source) => {
        return result.concat(source.comments.map((comment, index) => ({
            keywordId: source.id,
            userId: comment.user_id,
            position: index,
            date: comment.date,
            comment: comment.text,
        })));
    }, []);
    await chunkedInsert(KeywordComments, keywordComments);

    // diaries ============

    const diaries = comDiaries.map(source => {
        return {
            id: source.id,
            title: source.title ?? '',
            userId: source.user_id,
            body: source.text ?? '',
            date: source.date ?? '',
        };
    });

    await chunkedInsert(Diaries, diaries);

    // diary images ============

    const diaryImages = comDiaries.reduce((result, source) => {
        return result.concat(source.images.map((url, index) => ({
            diaryId: source.id,
            position: index,
            url,
        })));
    }, []);

    await chunkedInsert(DiaryImages, diaryImages);

    // diary comments ============

    const diaryComments = comDiaries.reduce((result, source) => {
        return result.concat(source.comments.map((comment, index) => ({
            diaryId: source.id,
            userId: comment.user_id,
            position: index,
            date: comment.date,
            comment: comment.text,
        })));
    }, []);

    await chunkedInsert(DiaryComments, diaryComments);
}

main();
