const major_scales = require('./data/major_scales')
const minor_scales = require('./data/minor_scales')

/**
 * Removes all unwanted symbols, characters and spaces from the provided lyrics
 * 
 * @param {string} song 
 * @returns {string}
 */
const cleanLyrics = (song) => {
    const regex = [
        { match: /(\\n|\n)/g, replace: ' ' },
        { match: /\s\s/g, replace: ' ' },
        { match: /(\\"|[^a-zA-z0-9 \0])/g, replace: '' },
        { match: /N W A/, replace: 'nwa' },
        { match: /(\*\*\*\*\*\*\* This Lyrics is NOT for Commercial use \*\*\*\*\*\*\*)/, replace: '' }
    ]
    let cleaned = song

    regex.forEach(item => {
        cleaned = cleaned.replace(item.match, item.replace)
    })

    return cleaned.trim().toLowerCase();
}

/**
 * Finds the number of times a word occurs in the lyrics
 * 
 * @param {string} song Song Lyrics
 * @param {string} word Selected word
 */
const findCount = (song, word) => {
    if (word.split(' ').length > 1) {
        throw new Error('Please supply only one word')
    }

    const clean_word = word.replace(/[^a-zA-Z]/gm, '').toLowerCase().trim()
    if (clean_word.length === 0) {
        throw new Error("Requested word must contain at least one character")
    }

    const re = new RegExp(` ${clean_word} `, 'gm')
    let word_count = song.match(re) === null ? 0 : song.match(re).length

    return word_count
}

/**
 * Finds the 5 most occuring words
 * 
 * @param {string} song_lyrics Song Lyrics
 */
const getHighestOccuringWords = (song_lyrics) => {
    let count = -1,
        words = [],
        numbers = []

    song_lyrics.split(' ').forEach(word => {
        if (words.indexOf(word) < 0) {
            words.push(word)
            let re = new RegExp(` ${word} `, 'gm'),
                matches = song_lyrics.match(re) !== null ? song_lyrics.match(re).length : 0
            
            count = matches > count ? matches : count;
            
            if (numbers.indexOf(matches) < 0) {
                numbers.push(matches)
            }
        }
    })

    return numbers.sort((a, b) => b - a).slice(0, 5);
}

/**
 * Returns an array without duplicates
 * 
 * @param {*} array[] Array to filter
 */
const uniqueArrayEntries = (array) => {
    return Array.from(new Set(array))
}

/**
 * Returns the scale and key/notes pair based on the lyrics and provided words
 * 
 * @param {string} lyrics Song Lyrics
 * @param {string} words[] Selected words
 */
export const keygen = (lyrics, words) => {
    // Throws an error if an empty array is provided
    if (words.length < 1) {
        throw new Error('You require at least one item in the words array')
    }

    // Throws an error is the words var isn't an array
    if (typeof words !== 'object') {
        throw new Error('You must pass an array of words')
    }

    // Ensures only 5 words are passed & removes all duplicates
    words = uniqueArrayEntries(words)
    words = words.slice(0, 5)

    let key_pairs = {
        "major": major_scales.major,
        "minor": minor_scales.minor
    }
    
    // Calculates the variables needed for the scale and index equation
    let num_of_words = words.length,
        clean_lyrics = cleanLyrics(lyrics) + ' ',
        most = getHighestOccuringWords(clean_lyrics),
        half = Math.floor((most.reduce((accumulator, currentValue, index) => {
            return index < num_of_words ? accumulator + currentValue : accumulator
        })) / 2),
        count = 0,
        ratio = 100 / 12

    words.forEach(word => {
        count += findCount(clean_lyrics, word)
    })

    // Gets the scale and index
    let scale = count >= half ? 'major' : 'minor',
        index = ( ( ((count / 2) / half) * 100 ) / ratio ) - 1
        index = index < 0 ? 0 : Math.round(index)

    if (index < 0) index = 0
    if (index >= key_pairs[scale].length) index = key_pairs[scale].length - 1
 
    // Returns the scale and key/notes values
    return {
        "scale": scale,
        "key_pairs": key_pairs[scale][index]
    }
}
