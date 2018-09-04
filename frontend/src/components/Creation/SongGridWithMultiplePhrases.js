import React, { Component } from 'react'
const converter = require('number-to-words');

const Draggable = (props) => (
    <div
        className="draggable"
        draggable
        onDragStart={(e) => props.onDragStart(e, props.id)}
        onDragEnter={(e) => props.onDragEnter(e)}
        onDragLeave={(e) => props.onDragLeave(e)}
        data-id={props.id}
    >
        { props.name }
    </div>
)

export default class SongGridWithMultiplePhrases extends Component {
    constructor() {
        super()

        this.creationSettings = {
            octaves: 1,
            bars: 4,
            rows_per_octave: 8
        }

        this.rows = this.generateRows()
        this.lots = this.creationSettings.bars * 8

        this.state = {
            phrases: [
                { id: '45', name: '1', rows: this.generateRows() },
                { id: '46', name: '4', rows: this.generateRows() },
                { id: '70', name: '2', rows: this.generateRows() },
                { id: '12', name: '3', rows: this.generateRows() },
                { id: '15', name: '5', rows: this.generateRows() },
                { id: '16', name: '6', rows: this.generateRows() }
            ]
        }
    }

    componentDidMount() {
        let { phrases } = this.state

        this.setState({
            phrases: phrases
        })
    }

    /**
     * Generates a row object which contains an empty array of all the rows needed
     *
     * @memberof SongGridWithMultiplePhrases
     * @return {object} - row object
     */
    generateRows = () => {
        let rows = {}
        for (let i = 0; i < this.creationSettings.octaves; i++) {
            for (let x = 0; x < this.creationSettings.rows_per_octave; x++) {
                let key = converter.toWords(x + 1)
                rows[key] = []
            }
        }

        return rows
    }

    /**
     * Gets the index of a object based on a key
     *
     * @memberof SongGridWithLots
     * @param {object} target - Object to search through
     * @param {string} key - key to search for
     * @param {string|number} value - value of the object key
     */
    findIndexByKey = (target, key, value) => {
        return target.findIndex(item => item[key] === value)
    }

    /**
     * Gets the bounding client rect of either a draggable element or lot based on the target row
     *
     * @memberof SongGridWithLots
     * @param {string} item_row - Row key
     * @param {number} index - Index position of element
     */
    getElementCoords = (item_row, index) => {
        let elements = item_row === 'store' ? document.querySelectorAll(`.${item_row} .draggable`) : this.getRowLots(item_row)
        return elements[index].getBoundingClientRect()
    }

    /**
     * Determines the orientation of the row
     *
     * @memberof SongGridWithLots
     * @param {string} item_row - Row key
     *
     * @deprecated
     */
    getProps = (item_row) => {
        return item_row !== 'store' ? { size: 'width', dir: 'x' } : { size: 'height', dir: 'y' }
    }

    /**
     * Returns the array that contains all the row data based on row key
     *
     * @memberof SongGridWithLots
     * @param {string} item_row_key - Row key
     * 
     * @deprecated
     */
    getRowTarget = (item_row_key) => {
        let { rows } = this.state;
        return rows[item_row_key].hasOwnProperty('lots') ? rows[item_row_key].lots : rows[item_row_key]
    }

    /**
     * Gets all the lot elements based on the row key
     *
     * @memberof SongGridWithLots
     * @param {string} item_row_key - Row key
     */
    getRowLots = (item_row_key) => {
        return document.querySelectorAll(`.${item_row_key} .lot`)
    }

    /**
     * Finds the closest lot or item based on where the item is dropped
     *
     * @memberof SongGridWithLots
     * @param {object} dropped - coordinates of where the item is dropped in the row
     * @param {string} item_row - Row key
     * @param {string} id - id of the phrase
     */
    closest = (dropped, item_row, id) => {
        let closest = null,
            prop = this.getProps(item_row),
            row_items = this.getRowLots(item_row)

        for (const [i, li] of row_items.entries()) {
            if (li.key === id) continue;

            let coords = this.getElementCoords(item_row, i)
            
            if (dropped[prop.dir] > coords[prop.dir] && dropped[prop.dir] < (coords[prop.dir] + coords[prop.size])) {
                closest = i
                break;
            }
        }

        return closest
    }

    /**
     * Determine if the element is being dropped before or after a item
     *
     * @memberof SongGridWithLots
     * @param {string} item_row - Row key
     * @param {object} dropped - coordinates of where the item is dropped in the row
     * @param {number} closest - closest element to dropped item
     * 
     * @deprecated
     */
    determineDropPosition = (item_row, dropped, closest) => {
        let coords = this.getElementCoords(item_row, closest),
            prop = this.getProps(item_row),
            zone = coords[prop.dir] + (coords[prop.size] / 2)

        return dropped[prop.dir] <= zone ? 'before' : 'after'
    }

    /**
     * Removes all hover related classes from draggable items
     *
     * @memberof SongGridWithLots
     */
    resetDraggableElems = () => {
        let allDraggable = document.querySelectorAll('.droppable .draggable')
        allDraggable.forEach(elem => {
            elem.classList.remove('hovered', 'insert-after', 'insert-before')
        })
    }

    /**
     * Swaps the row content with a destination
     *
     * @memberof SongGridWithLots
     * @param {string} item_row - Row key
     * @param {string|number} cur_index - Index of the dragged element in its current row
     * @param {number} closest - closest element to dropped item
     * @param {string} id - id of the phrase
     * @param {string} row - row key of the destination row
     * 
     * @deprecated
     */
    swapRowItems = (item_row_key, cur_index, closest, id, row) => {
        let { rows, phrases } = this.state,
            phrase_index = this.findIndexByKey(phrases, 'id', id)

        if (rows[row].hasOwnProperty('lots')) {
            let lots = this.getRowLots(row),
                old_closest = closest
            
            if (lots[closest].getAttribute('data-occupied') === 'true') {
                for (let x = closest; x < lots.length; x++) {
                    if (lots[x].getAttribute('data-occupied') === 'false') {
                        closest = x
                        break
                    }
                }
                if (closest === old_closest) {
                    alert('No available positions')
                    return false;
                }
            }

            let removed = item_row_key !== 'store' ? rows[item_row_key].lots.splice(cur_index, 1, []) : rows[item_row_key].splice(cur_index, 1)

            rows[row].lots[closest] = removed[0]
        }
        else {
            let removed = item_row_key !== 'store' ? rows[item_row_key].lots.splice(cur_index, 1, []) : rows[item_row_key].splice(cur_index, 1)
            rows[row].push(removed[0])
        }
        
        phrases[phrase_index].lot = closest
        phrases[phrase_index].row = row

        return {
            rows: rows,
            phrases: phrases
        }
    }

    /**
     * Checks the avaiablity of the destination lot and attempts to
     * adjust to be placed before or after the target destination if needed
     *
     * @memberof SongGridWithMultiplePhrases
     * @param {string} target_row - Row that the phrase is being dropped in
     * @param {number} closest - Closest lot of dropped element
     * @return {number|null} - closest avaiable spot
     */
    checkLotAvailability = (target_row, closest) => {
        let lot_elems = this.getRowLots(target_row)
        if (lot_elems[closest].getAttribute('data-occupied') === 'true') {
            let leftSide = closest === 0 ? null : lot_elems[closest - 1],
                rightSide = closest === this.lots - 1 ? null : lot_elems[closest + 1]
            
            if (rightSide && rightSide.getAttribute('data-occupied') !== 'true') {
                closest = closest + 1
            }
            else if (leftSide && leftSide.getAttribute('data-occupied') !== 'true') {
                closest = closest - 1
            }
            else {
                closest = null
            }
        }

        return closest
    }

    /**
     * Gets a phrase element based on its id
     *
     * @memberof SongGridWithLots
     * @param {string} id - id of the phrase
     * 
     * @deprecated
     */
    getItemById = (id) => {
        return this.state.phrases.filter(p => p.id === id)
    }

    /**
     * Get the current index of the lot in the rows array
     *
     * @memberof SongGridWithMultiplePhrases
     * @param {string} id - id of phrase
     * @param {string} row - Row that the phrase is being dropped in
     * @param {number} index - Index of lot element
     * @return {number} - index of lot number in rows array
     */
    getCurrentLotIndex = (id, row, index) => {
        let { phrases } = this.state,
            phrase_index = this.findIndexByKey(phrases, 'id', id)

        return phrases[phrase_index].rows[row].indexOf(index)
    }

    /**
     * Message to 
     *
     * @memberof SongGridWithMultiplePhrases
     */
    noClosestLots = () => {
        alert('No lots available to fill')
    }
    
    /**
     * Event triggered when entering a droppable element
     *
     * @memberof SongGridWithLots
     * @param {object} ev - Drag event
     */
    onDragEnter = (ev) => {}

    /**
     * Event triggered when leaving a droppable element
     *
     * @memberof SongGridWithLots
     * @param {object} ev - Drag event
     */
    onDragLeave = (ev) => {
        this.resetDraggableElems()
    }

    /**
     * Event triggered when hovering over a droppable element
     *
     * @memberof SongGridWithLots
     * @param {object} ev - Drag event
     */
    onDragOver = (ev) => {
        ev.preventDefault()
    }

    /**
     * Sets the id to the element id when the drag is initiated
     *
     * @memberof SongGridWithLots
     * @param {object} ev - Drag event
     * @param {string|number} id - Draggable id
     */
    onDragStart = (ev, id, row, index) => {
        ev.dataTransfer.setData('data', JSON.stringify({
            'id': id,
            'item_row': row,
            'lot_index': index
        }))
    }

    /**
     * Event triggered when dropped a droppable element
     * Changes the order or moves elements to a destination row
     *
     * @memberof SongGridWithLots
     * @param {object} ev - Drag event
     * @param {string} row - row key of the destination row
     */
    onDrop = (ev, row) => {
        let { phrases } = this.state,
            { id, item_row, lot_index } = JSON.parse(ev.dataTransfer.getData('data')),
            dropped = { x: ev.clientX, y: ev.clientY },
            closest = this.closest(dropped, row, id),
            phrase_index = this.findIndexByKey(phrases, 'id', id)

        if (item_row === 'store') {
            closest = this.checkLotAvailability(row, closest)
            if (closest !== null) {
                phrases[phrase_index].rows[row].push(closest)
            }
            else {
                this.noClosestLots()
                return false
            }
        }
        else if (row !== 'store') {
            closest = item_row === row ? this.checkLotAvailability(item_row, closest) : this.checkLotAvailability(row, closest)
            let target_row = item_row === row ? row : item_row,
                cur_lot_index = this.getCurrentLotIndex(id, target_row, lot_index)

            if (closest !== null) {
                if (item_row === row) {
                    phrases[phrase_index].rows[row].splice(cur_lot_index, 1)
                    phrases[phrase_index].rows[row].push(closest)
                }
                else {
                    phrases[phrase_index].rows[item_row].splice(cur_lot_index, 1)
                    phrases[phrase_index].rows[row].push(closest)
                }
            }
            else {
                this.noClosestLots()
                return false
            }
        }
        else if (item_row !== 'store' && row === 'store') {
            let cur_lot_index = this.getCurrentLotIndex(id, item_row, lot_index)
            phrases[phrase_index].rows[item_row].splice(cur_lot_index, 1)
        }

        this.setState({
            phrases: phrases
        })
    }

    /**
     * Renders the phrase item in its row
     *
     * @memberof SongGridWithMultiplePhrases
     * @param {string} row - current row
     * @return {array} - Array of dom elements to render
     */
    renderLots = (row) => {
        let lots = [],
            { phrases } = this.state

        for (let i = 0; i < this.lots; i++) {
            let lot_phrase = false

            for (const phrase of phrases) {
                if (phrase.rows[row].length === 0) continue;

                if (phrase.rows[row].includes(i)) {
                    lot_phrase = phrase
                    break
                }
            }

            lots.push(
                <div className="lot" key={i} data-occupied={ lot_phrase === false ? 'false' : true }>
                    {
                        lot_phrase !== false ? (
                            <Draggable
                                id={lot_phrase.id}
                                name={lot_phrase.name}
                                onDragStart={(e, id) => this.onDragStart(e, id, row, i)}
                                onDragEnter={(e) => this.onDragEnter(e)}
                                onDragLeave={(e) => this.onDragLeave(e)}
                                onDragOver={(e) => this.onDragOver(e)}
                            />
                        ) : ('')
                    }
                </div>
            )
        }

        return lots
    }

    render() {
        let { phrases } = this.state

        return (
            <div className="song-grid">
                <div 
                    className="droppable store"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { this.onDrop(e, "store") }}
                >
                    {
                        phrases.map(phrase => {
                            return (
                                <Draggable
                                    key={phrase.id}
                                    id={phrase.id}
                                    name={phrase.name}
                                    onDragStart={(e) => this.onDragStart(e, phrase.id, 'store', -1)}
                                    onDragEnter={(e) => this.onDragEnter(e)}
                                    onDragLeave={(e) => this.onDragLeave(e)}
                                    onDragOver={(e) => this.onDragOver(e)}
                                />
                            )
                        })
                    }
                </div>

                <div className="grid">
                    {
                        Object.keys(this.rows).map((key, i) => {
                            return (
                                <div className="row" key={key}>
                                    <span className="row-label">{i + 1}</span>
                                    <div
                                        className={`droppable ${key}`}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => this.onDrop(e, key)}
                                    >
                                        { this.renderLots(key) }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}