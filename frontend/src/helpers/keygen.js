const major_scales = require('./data/major_scales')
const minor_scales = require('./data/minor_scales')

export const keygen = () => {
    let key_pairs = {
        "major": major_scales.major,
        "minor": minor_scales.minor
    }
}