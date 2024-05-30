export const extractDateString = (ms) => {
    const createdDate = new Date(ms);
    return createdDate.toLocaleDateString() + ',' + createdDate.toLocaleTimeString();
}
