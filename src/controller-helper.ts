
export function createRandomId(existingIds: number[]):number {
    let randomId: number;
    do {
        randomId = Math.floor(Math.random()*1000);
    } while (existingIds.includes(randomId));
    return randomId;
}