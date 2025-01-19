import { getItemsOfUser, getUserByUsername } from "$lib/data";
import { get } from "svelte/store";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const username = params.username;
    const user = await getUserByUsername(username);
    const items = await getItemsOfUser(user.id);
    return {
        user,
        items,
    };
};
