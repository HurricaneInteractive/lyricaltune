import { action, observable, configure, runInAction } from 'mobx'
import { keygen } from '../helpers/keygen'

configure({ enforceActions: 'always' })

class CreateStore {
    @observable selectedArtist = 'eminem'
    @observable selectedSong = 'rap_god'
    @observable selectedWords = ['rap', 'god', 'was', 'happen', 'slapbox']
    @observable key = null
    @observable scale = null
    @observable key_pairs = null
    @observable lyrics = ''

    @action
    async getLyrics(song = this.selectedSong) {
        if (typeof song === 'undefined' || typeof song !== 'string') {
            throw new Error('`song` is a required value and should be of type `string`')
        }

        return import('../helpers/data/lyrics.json')
            .then(res => {
                if (!res.hasOwnProperty(song)) {
                    throw new Error('Song could not be found')
                }
                else {
                    runInAction(() => {
                        // this.lyrics = this.wrapLyrics(res[song])
                        this.lyrics = res[song]
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
        this.scale = data.scale;
        this.key_pairs = data.key_pairs
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
}

export default new CreateStore()