export const getImageName = (url: string) => {
    return  new URL(url).pathname.split('/').pop();
};