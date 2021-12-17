import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function getWords() {
    const response = await fetch('https://www.thefreedictionary.com/words-that-end-in-us');
    const body = await response.text();

    const $ = cheerio.load(body);

    const wordList = [];
    for (let index = 1; index <= 15; index++) {
        $(`li[data-f=${index}]`).each((i, title) => {
            const titleText = $(title).text();
            const obj = {
                word: titleText
            };
            if (!titleText.includes("Words that end in") && !titleText.includes("Words that start with")) {
                wordList.push(obj);
            }
        });
    }
    return wordList;
}