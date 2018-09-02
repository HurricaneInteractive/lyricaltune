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

export default class SongGridWithLots extends Component {
    constructor() {
        super()

        this.creationSettings = {
            octaves: 1,
            bars: 4,
            rows_per_octave: 8
        }

        let available_rows = this.generateRows();

        let rows = {
            store: [],
            ...available_rows
        }

        Object.keys(rows).forEach(key => {
            if (key !== 'store') {
                for (let i = 0; i < (this.creationSettings.bars * 8); i++) {
                    rows[key].lots.push('')
                }
            }
        })

        this.state = {
            phrases: [
                { id: '45', name: '1', row: 'store', lot: -1 },
                { id: '46', name: '4', row: 'store', lot: -1 },
                { id: '70', name: '2', row: 'store', lot: -1 },
                { id: '12', name: '3', row: 'store', lot: -1 },
                { id: '15', name: '5', row: 'store', lot: -1 },
                { id: '16', name: '6', row: 'store', lot: -1 }
            ],
            rows: rows
        }

        this.lots = 5
    }

    generateRows = () => {
        let rows = {}
        for (let i = 0; i < this.creationSettings.octaves; i++) {
            for (let x = 0; x < this.creationSettings.rows_per_octave; x++) {
                let key = converter.toWords(x + 1)
                rows[key] = { lots: [] }
            }
        }

        return rows
    }

    componentDidMount() {
        let rows = this.state.rows

        this.state.phrases.forEach((p) => {
            if (p.row === 'store') {
                rows[p.row].push(
                    <Draggable
                        key={p.id}
                        id={p.id}
                        name={p.name}
                        onDragStart={(e, id) => this.onDragStart(e, id)}
                        onDragEnter={(e) => this.onDragEnter(e)}
                        onDragLeave={(e) => this.onDragLeave(e)}
                        onDragOver={(e) => this.onDragOver(e)}
                    />
                )
            }
            else {
                rows[p.row].lots[p.lot] = (
                    <Draggable
                        key={p.id}
                        id={p.id}
                        name={p.name}
                        onDragStart={(e, id) => this.onDragStart(e, id)}
                        onDragEnter={(e) => this.onDragEnter(e)}
                        onDragLeave={(e) => this.onDragLeave(e)}
                        onDragOver={(e) => this.onDragOver(e)}
                    />
                )
            }
        })

        this.setState({
            rows: rows
        })
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
     */
    getProps = (item_row) => {
        return item_row !== 'store' ? { size: 'width', dir: 'x' } : { size: 'height', dir: 'y' }
    }

    /**
     * Returns the array that contains all the row data based on row key
     *
     * @memberof SongGridWithLots
     * @param {string} item_row_key - Row key
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
            row_items = this.getRowTarget(item_row)

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
     * Gets a phrase element based on its id
     *
     * @memberof SongGridWithLots
     * @param {string} id - id of the phrase
     */
    getItemById = (id) => {
        return this.state.phrases.filter(p => p.id === id)
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
        // let target = ev.target
        // if (target && !target.classList.contains('dragged')) {
        //     let draggedElem = document.querySelector('.droppable .draggable.dragged')
        //     target.classList.add('hovered')
        //     let dropped = { x: ev.clientX, y: ev.clientY },
        //         id = draggedElem.getAttribute('data-id'),
        //         item = this.getItemById(id),
        //         closest = this.closest(dropped, item[0].row, id)

        //     if (closest !== null) {
        //         let dropPos = this.determineDropPosition(item[0].row, dropped, closest)
        //         switch (dropPos) {
        //             case 'before':
        //                 target.classList.add('insert-before')
        //                 target.classList.remove('insert-after')
        //                 break
        //             case 'after':
        //             default:
        //                 target.classList.add('insert-after')
        //                 target.classList.remove('insert-before')
        //                 break
        //         }
        //     }
        // }
    }

    /**
     * Sets the id to the element id when the drag is initiated
     *
     * @memberof SongGridWithLots
     * @param {object} ev - Drag event
     * @param {string|number} id - Draggable id
     */
    onDragStart = (ev, id) => {
        ev.dataTransfer.setData('id', id)
        ev.target.classList.add('dragged')
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
        this.resetDraggableElems()
        let dragged = document.querySelector('.draggable.dragged')
        dragged.classList.remove('dragged')

        let { rows, phrases } = this.state,
            id = ev.dataTransfer.getData('id'),
            item = phrases.filter(p => p.id === id),
            item_row = item[0].row,
            dropped = { x: ev.clientX, y: ev.clientY }

        // If dropping the element in the same row
        if (item_row === row) {
            let row_target = this.getRowTarget(item_row),
                curIndex = this.findIndexByKey(row_target, 'key', id),
                closest = this.closest(dropped, item_row, id)

            
            // If the current items row is the store
            // reorder the elements based on how it is dropped
            if (item_row === 'store') {
                if (closest !== null) {
                    let dropPos = this.determineDropPosition(item_row, dropped, closest)
    
                    switch (dropPos) {
                        case 'before':
                            rows[item_row].splice(closest, 0, rows[item_row][curIndex])
                            rows[item_row].splice((curIndex + 1), 1)
                            break
                        case 'after':
                        default:
                            rows[item_row].splice((closest + 1), 0, rows[item_row][curIndex])
                            rows[item_row].splice(curIndex, 1)
                            break
                    }
                }
            }
            // If it isn't the store
            else {
                // if there is a closest element
                if (closest !== null) {
                    // Update the row order
                    let updated_rows = this.swapRowItems(item_row, curIndex, closest, id, row)
                    if (updated_rows === false) return false
                    rows = updated_rows.rows
                    phrases = updated_rows.phrases
                }
            }
        }
        // If it is being dropped in a different row
        else {
            // determine index and closest
            let row_target = this.getRowTarget(item_row),
                index = this.findIndexByKey(row_target, 'key', id),
                closest = this.closest(dropped, row, id)

            // if the target row is the store, set closest to 0 (it will be ignored)
            if (row === 'store') closest = 0;

            // if there is a closest element
            if (closest !== null) {
                // Update the rows to reflect the new elements
                let updated_rows = this.swapRowItems(item_row, index, closest, id, row)
                if (updated_rows === false) return false
                rows = updated_rows.rows
                phrases = updated_rows.phrases
            }
        }

        // Set the component state to trigger a re-render
        this.setState({
            rows: rows,
            phrases: phrases
        })
    }

    render() {
        let { rows } = this.state

        return (
            <div className="song-grid">
                <div 
                    className="droppable store"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { this.onDrop(e, "store") }}
                >
                    {this.state.rows.store}
                </div>

                <div className="grid">
                    {
                        Object.keys(rows).map((key, i) => {
                            if (key === 'store') return ''

                            return (
                                <div className="row" key={key}>
                                    <span className="row-label">{i}</span>
                                    <div
                                        className={`droppable ${key}`}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => this.onDrop(e, key)}
                                    >
                                        {
                                            rows[key].lots.map((lot, i) => (
                                                <div 
                                                    className="lot"
                                                    key={`${key}-${i}`}
                                                    data-occupied={ typeof lot.key !== 'undefined' ? 'true' : 'false' }
                                                >{lot}</div>
                                            ))
                                        }
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