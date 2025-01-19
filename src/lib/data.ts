import { encodeBase32LowerCase } from '@oslojs/encoding';
import { faker } from '@faker-js/faker';

export function generateId() {
    // ID with 120 bits of entropy, or about the same as UUID v4.
    const length = 15; // 8 * 15 = 120 bits

    const bytes = crypto.getRandomValues(new Uint8Array(length));
    const id = encodeBase32LowerCase(bytes);
    // id.length is 15 / 3 * 4 = 20 bytes
    return id;
}

export function abbrevId(id: string): string {
    return id.slice(0, 6);
}

export interface User {
    id: string;
    username: string;
    name: string;
    bio: string;
};

export type UsernameLike = string|{username: string};

export function userUrl(usernameLike: UsernameLike): string
{
    const username = typeof usernameLike === 'string' ? usernameLike : usernameLike.username;
    return `/@${username}`;
}

function createUser(username: string = '', name: string = '', bio: string = ''): User {
    if (!username) {
        username = faker.internet.username();
    }

    if (!name) {
        name = faker.internet.displayName();
    }

    if (!bio) {
        bio = faker.person.bio();
    }

    return {
        id: generateId(),
        username,
        name,
        bio,
    };
}

export interface Item {
    id: string;
    userId: string;
    title: string;
    body: string;

    user?: User;
};

function fakeTitle() {
    const r = Math.random();
    if (r < 0.2) {
        return faker.music.artist();
    }
    if (r < 0.3) {
        return faker.music.album();
    }
    if (r < 0.4) {
        return faker.food.ethnicCategory();
    }
    if (r < 0.6) {
        return faker.book.author();
    }
    if (r < 0.7) {
        return faker.company.name();
    }
    return faker.book.title();
}

function createItem(userId: string, title: string = '', body: string = ''): Item {
    if (!title) {
        title = fakeTitle();
    }

    if (!body) {
        body = faker.lorem.sentences();
    }

    return {
        id: generateId(),
        userId,
        title,
        body,
    }
}

const users: User[] = [];
const items: Item[] = [];

function generateFakeData() {
    const userCount = 17;
    const itemCount = 100 + Math.floor(50 * Math.random());

    for (let i = 0; i < userCount; i++) {
        const user = createUser();
        users.push(user);
    }

    for (let i = 0; i < itemCount; i++) {
        let userIndex = Math.floor(users.length * Math.random()) % users.length;

        // intentionally make the user 3 with no item.
        if (userIndex === 3) {
            userIndex = 0;
        }

        const user = users[userIndex];
        const item = createItem(user.id);
        items.push(item);
    }
}

generateFakeData();

export async function pause(ms: number = 1.0 / 60): Promise<void> {
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export async function getUsers(): Promise<User[]> {
    await pause();
    return users.map(user => ({...user}));
}

export async function getUserById(userId: string): Promise<User> {
    await pause();
    const user = users.find(user => user.id === userId);
    if (!user) {
        throw new Error('User not found');
    }
    return {...user};
}

export async function getUserByUsername(username: string): Promise<User> {
    await pause();
    const user = users.find(user => user.username === username);
    if (!user) {
        throw new Error('User not found');
    }
    return {...user};
}

export async function getItems(): Promise<Item[]> {
    await pause();
    return items.map(item => ({...item}));
}

export async function getItemsOfUser(userId: string): Promise<Item[]> {
    await pause();
    const itemsOfUser = items.filter(item => item.userId === userId);
    return itemsOfUser.map(item => ({...item}));
}

export async function getItem(itemId: string): Promise<Item> {
    await pause();
    const item = items.find(item => item.id.startsWith(itemId));
    if (!item) {
        throw new Error('Item not found');
    }
    return {...item};
}

export function itemUrl(item: Item): string
{
    return '/@/' + abbrevId(item.id);
}
