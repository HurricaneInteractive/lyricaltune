import { action, observable, configure, runInAction, computed } from 'mobx'
import { keygen } from '../helpers/keygen'

configure({ enforceActions: 'always' })

class CreateStore {
    @observable selectedArtist = 'eminem'
    @observable selectedSong = 'rap_god'
    @observable selectedWords = ['rap', 'god']
    @observable scale = null
    @observable key_pairs = null
    @observable lyrics = ''
    @observable mixlab_data = {}
    @observable project_name = ''

    @computed get mixlab_settings() {
        return {
            octaves: [6, 7],
            bars: 2,
            beats: 8
        }
    }

    @computed get key() {
        return this.key_pairs ? this.key_pairs.key : null
    }

    @computed get words() {
        return this.selectedWords || null
    }

    @computed get data() {
        let settings = this.mixlab_settings
        let data = {}

        if (!this.key_pairs) {
            return false
        }

        settings.octaves.forEach((oct) => {
            if (typeof data[oct] === 'undefined') {
                data[oct] = []
            }

            this.key_pairs.notes.forEach((note) => {
                let length = settings.bars * (settings.beats * 2),
                    pattern = Array(length).fill(0)

                data[oct].push({
                    note: note,
                    octave: oct,
                    pattern: pattern
                })
            })
        })

        return data
    }

    @computed get projectName() {
        return this.project_name
    }

    @action
    async getLyrics(song = this.selectedSong) {
        if (typeof song === 'undefined' || typeof song !== 'string') {
            throw new Error('`song` is a required value and should be of type `string`')
        }

        if (song === '') {
            return false
        }

        return import(`../data/songs/${song}.json`)
            .then(res => {
                if (!res.hasOwnProperty(song)) {
                    throw new Error('Song could not be found')
                }
                else {
                    runInAction(() => {
                        this.selectedWords = []
                        this.key_pairs = null
                        this.scale = null
                        this.lyrics = res[song]
                        if (song !== this.selectedSong) {
                            this.selectedSong = song
                        }
                    })
                    
                    return this.lyrics
                }
            })
            .catch(e => console.error(e))
    }

    @action
    generateKey() {
        if (this.selectedWords.length === 0) {
            return false
        }

        let data = keygen(this.lyrics, this.selectedWords)
        runInAction(() => {
            this.scale = data.scale;
            this.key_pairs = data.key_pairs
        })
    }

    @action
    wrapLyrics(lyrics) {
        if (typeof lyrics !== 'string' || lyrics.trim() === '') {
            throw new Error('`lyrics` is a required parameter and should be of type `string`')
        }

        lyrics = JSON.stringify(lyrics)

        let word_pattern = /(^|<\/?[^>]+>|\s+)([^\s^,<]+)/g
        let wrapped = lyrics.replace(/\\n/g, '<br/>');
        wrapped = wrapped.replace(/['?"()\\]/g, '');
        wrapped = wrapped.replace(word_pattern, "$1<span>$2</span>")
        
        return wrapped
    }

    @action
    addWord(word) {
        if (word.trim() === '' || typeof word !== 'string') {
            throw new Error('Please provide a word')
        }

        if (this.selectedWords.length === 5) {
            return false
        }

        runInAction(() => {
            this.selectedWords.push(word.trim().toLowerCase())
        })
    }

    @action
    removeWord(key) {
        if (!this.selectedWords.indexOf(key)) {
            return false
        }

        runInAction(() => {
            this.selectedWords.splice(key, 1);
        })
    }

    @action
    setArtistName(name) {
        if (name.trim() === '' || typeof name !== 'string') {
            throw new Error('Please provide a valid value for the `name` arguement')
        }

        runInAction(() => {
            this.selectedArtist = name
        })
    }

    @action
    setProjectName(name) {
        runInAction(() => {
            this.project_name = name
        })
    }
}

export default new CreateStore()