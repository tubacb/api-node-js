// tests/api.spec.ts
import { test, expect } from '@playwright/test';
import {StatusCodes} from "http-status-codes";
import {createRandomId} from "../src/controller-helper";
let baseURL: string = 'http://localhost:3000/users';
let numberOfObjects:number;
let userIDs:number[]=[];

test.describe('User management API', () => {

    test('find user: should return a user by ID', async ({ request }) => {
        const response = await request.post(`${baseURL}`);
        const responseBody = await response.json()
        const userId = responseBody.id;
        const getResponse = await request.get(`${baseURL}/${userId}`);
        expect(getResponse.status()).toBe(StatusCodes.OK);
    });

    test('find user: should return 404 if user not found', async ({ request }) => {
        const response = await request.get(`${baseURL}`);
        const responseBody = await response.json();
        const existingIds:number[] = [];
        for (let i = 0; i < responseBody.length; i++) {
            existingIds[i] =responseBody[i].id;
        }
        const userId = createRandomId(existingIds);
        const getResponse = await request.get(`${baseURL}/${userId}`);
        expect(getResponse.status()).toBe(StatusCodes.NOT_FOUND);
    });

    test('create user: should add a new user', async ({ request }) => {

        const response = await request.post(`${baseURL}`);
        expect(response.status()).toBe(201);
        const responseBody = await response.json()
        expect(responseBody.name).toBeDefined();
        console.log(responseBody);
    });

    test('delete user: should delete a user by ID', async ({ request }) => {
        const response = await request.post(`${baseURL}`);
        const responseBody = await response.json()
        const userId = responseBody.id;
        const getResponse = await request.delete(`${baseURL}/${userId}`);
        expect(getResponse.status()).toBe(StatusCodes.OK);
    });

    test('delete user: should return 404 if user not found', async ({ request }) => {
        const response = await request.get(`${baseURL}`);
        const responseBody = await response.json();
        const existingIds:number[] = [];
        for (let i = 0; i < responseBody.length; i++) {
            existingIds[i] =responseBody[i].id;
        }
        const userId = createRandomId(existingIds);
        const getResponse = await request.delete(`${baseURL}/${userId}`);
        expect(getResponse.status()).toBe(StatusCodes.NOT_FOUND);
    });


    test('GET user id information', async ({ request }) => {
        await request.post(`${baseURL}`);
        await request.post(`${baseURL}`);
        //request to get all users
        const responseAllUsers = await request.get(`${baseURL}`);
        const responseUsers = await responseAllUsers.json();
        numberOfObjects = responseUsers.length;
        console.log('numberOfObjects',numberOfObjects);
        //userID array
        for (let i = 0; i < numberOfObjects; i++) {
            let userId=responseUsers[i].id;
            userIDs.push(userId)
        }
        console.log('userIDs',userIDs);
    });

    test('DELETE all user id information', async ({ request }) => {
        for (let i = 0; i < numberOfObjects; i++) {
            await request.delete(`${baseURL}/${userIDs[i]}`);
        }
    });
});
