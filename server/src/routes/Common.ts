import {RouteException} from "../types";

export async function assertExistsOrThrow<T>(func: () => Promise<T>, entity: string): Promise<T>  {
    try {
        return await func();
    } catch (err: any) {
        throw new RouteException(`${entity} not found`, 404);
    }
}
