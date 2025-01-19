import { getUsers } from '$lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const users = await getUsers();

    return {
        users,
    };
};
