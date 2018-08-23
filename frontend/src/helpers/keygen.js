const major_scales = require('./data/major_scales')
const minor_scales = require('./data/minor_scales')
const lyrics = require('./data/lyrics')

const cleanLyrics = (song) => {
    const regex = [
        { match: /\\n/g, replace: ' '},
        { match: /\n/g, replace: ' ' },
        { match: /\\"/g, replace: '' },
        { match: /[^a-zA-z0-9 \0]/g, replace: '' },
        { match: /\s\s/g, replace: ' ' },
        { match: /N W A/, replace: 'nwa' }
    ]
    let cleaned = song

    regex.forEach(item => {
        cleaned = cleaned.replace(item.match, item.replace)
    })

    return cleaned.trim().toLowerCase();
}

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

const getHighestOccuringWord = (song_lyrics) => {
    let count = -1,
        words = [];

    song_lyrics.split(' ').forEach(word => {
        if (words.indexOf(word) < 0) {
            words.push(word)
            let re = new RegExp(` ${word} `, 'gm')
            let matches = song_lyrics.match(re) !== null ? song_lyrics.match(re).length : 0
            count = matches > count ? matches : count;
        }
    })

    return count;
}

export const keygen = () => {
    let key_pairs = {
        "major": major_scales.major,
        "minor": minor_scales.minor
    }
        
    let clean_lyrics = cleanLyrics(lyrics.rap_god) + ' ',
        most = getHighestOccuringWord(clean_lyrics),
        half = Math.floor((most / 2)),
        count = findCount(clean_lyrics, 'a'),
        scale = count >= half ? 'major' : 'minor',
        ratio = 100 / 12,
        index = ( ( ((count / 2) / half) * 100 ) / ratio ) - 1
        index = index < 0 ? 0 : Math.round(index)
    
    console.log('Scale', scale)
    console.log('Index', index)
    console.log('Key & notes', key_pairs[scale][index])

    return key_pairs[scale][index]
}

// f = +(Math.round( ((word_count / song_length) * 100) + "e+4" ) + "e-4")
// special 120
// f = (occurs / total_words) x 100
// p = 120 / f of highest occuring word
// < 60 = Minor Scale
// > 60 = Major Scale
// scale = (f x p)
// key = (scale / 2) - 1
// 0 - 4 = index 0, 5 - 9 = index 1 etc etc

// half = hightest occuring / 2
// count < half = minor
// count > half = major
// p = ((count / 2) / half) x 100
// ratio = 100 / 12
// index = ((p / ration) x 100) - 1