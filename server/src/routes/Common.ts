import {RouteException, UserInfo} from "../types";

export async function throwIfNotExists<T>(func: () => Promise<T>, entity: string): Promise<T> {
    try {
        return await func();
    } catch (err: any) {
        throw new RouteException(`${entity} not found`, 404);
    }
}

export async function throwIfExists<T>(func: () => Promise<T>, entityName: string): Promise<void> {
    let entity: T | undefined = undefined;
    try {
        entity = await func();
    } catch (err) {
    }
    if (entity) {
        throw new RouteException(`${entityName} already exists`, 429);
    }
}

