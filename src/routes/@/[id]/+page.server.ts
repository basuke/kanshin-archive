import { getItem, getUserById } from "$lib/data";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    const item = await getItem(id);
    const user = await getUserById(item.userId);
    return {
        item,
        user,
    };
};
