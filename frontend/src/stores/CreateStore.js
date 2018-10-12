import { action, observable, configure, runInAction, computed } from 'mobx'
import { keygen } from '../helpers/keygen'

configure({ enforceActions: 'always' })

class CreateStore {
    @observable selectedArtist = ''
    @observable selectedSong = ''
    @observable selectedWords = []
    @observable scale = null
    @observable key_pairs = null
    @observable lyrics = ''

    @computed get key() {
        return this.key_pairs ? this.key_pairs.key : null
    }

    @computed get words() {
        return this.selectedWords || null
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
}

export default new CreateStore()