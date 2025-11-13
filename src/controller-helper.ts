import {APIRequestContext} from 'playwright';
import { expect } from '@playwright/test';
import {StatusCodes} from "http-status-codes";
let baseURL: string = 'http://localhost:3000/users';

//to create an id which is not existing in array
export function createRandomId(existingIds: number[]):number {
    let randomId: number;
    do {
        randomId = Math.floor(Math.random()*1000);
    } while (existingIds.includes(randomId));
    return randomId;
}

//to create an ids array from json
export function createUserIdList(responseBody:any ) :number[]{
    const ids:number[]=[];
    for (let i = 0; i < responseBody.length; i++) {
        ids.push(responseBody[i].id);
    }
    return ids;
}

export async function cleanUpUsers(request: APIRequestContext) {
    const getAllUsers = await request.get(`${baseURL}`);
    const responseAllUsers = await getAllUsers.json();
    const ids=createUserIdList(responseAllUsers);
    for (let i = 0; i < ids.length; i++) {
        let response = await request.delete(`${baseURL}/${ids[i]}`);
        expect.soft(response.status()).toEqual(StatusCodes.OK);
    }
}
