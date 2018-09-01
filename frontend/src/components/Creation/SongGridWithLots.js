import React, { Component } from 'react'

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

        let rows = {
            store: [],
            one: {
                lots: []
            },
            two: {
                lots: []
            }
        }

        Object.keys(rows).forEach(key => {
            if (key !== 'store') {
                for (let i = 0; i < 5; i++) {
                    rows[key].lots.push('')
                }
            }
        })

        this.state = {
            phrases: [
                { id: '45', name: '1', row: 'store', lot: 0 },
                { id: '70', name: '2', row: 'one', lot: 1 },
                { id: '12', name: '3', row: 'store', lot: 2 }
            ],
            rows: rows
        }

        this.lots = 5
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

        console.log(rows);

        this.setState({
            rows: rows
        })
    }

    findIndexByKey = (target, key, value) => {
        console.log({
            't': target,
            'v': value,
            'k': key
        })
        return target.findIndex(item => item[key] === value)
    }

    getElementCoords = (item_row, index) => {
        let elements = document.querySelectorAll(`.${item_row} .draggable`)
        return elements[index].getBoundingClientRect()
    }

    getProps = (item_row) => {
        return item_row !== 'store' ? { size: 'width', dir: 'x' } : { size: 'height', dir: 'y' }
    }

    closest = (dropped, item_row, id) => {
        let closest = null,
            prop = this.getProps(item_row)

        for (const [i, li] of this.state.rows[item_row].entries()) {
            if (li.key === id) continue;

            let coords = this.getElementCoords(item_row, i)
            
            if (dropped[prop.dir] > coords[prop.dir] && dropped[prop.dir] < (coords[prop.dir] + coords[prop.size])) {
                closest = i
                break;
            }
        }

        return closest
    }

    determineDropPosition = (item_row, dropped, closest) => {
        let coords = this.getElementCoords(item_row, closest),
            prop = this.getProps(item_row),
            zone = coords[prop.dir] + (coords[prop.size] / 2)

        return dropped[prop.dir] <= zone ? 'before' : 'after'
    }

    resetDraggableElems = () => {
        let allDraggable = document.querySelectorAll('.droppable .draggable')
        allDraggable.forEach(elem => {
            elem.classList.remove('hovered', 'insert-after', 'insert-before')
        })
    }

    getItemById = (id) => {
        return this.state.phrases.filter(p => p.id === id)
    }
    
    onDragEnter = (ev) => {}

    onDragLeave = (ev) => {
        this.resetDraggableElems()
    }

    onDragOver = (ev) => {
        ev.preventDefault()
        let target = ev.target
        if (target && !target.classList.contains('dragged')) {
            let draggedElem = document.querySelector('.droppable .draggable.dragged')
            target.classList.add('hovered')
            let dropped = { x: ev.clientX, y: ev.clientY },
                id = draggedElem.getAttribute('data-id'),
                item = this.getItemById(id),
                closest = this.closest(dropped, item[0].row, id)

            if (closest !== null) {
                let dropPos = this.determineDropPosition(item[0].row, dropped, closest)
                switch (dropPos) {
                    case 'before':
                        target.classList.add('insert-before')
                        target.classList.remove('insert-after')
                        break
                    case 'after':
                    default:
                        target.classList.add('insert-after')
                        target.classList.remove('insert-before')
                        break
                }
            }
        }
    }

    onDragStart = (ev, id) => {
        ev.dataTransfer.setData('id', id)
        ev.target.classList.add('dragged')
    }

    onDrop = (ev, row) => {
        this.resetDraggableElems()
        
        let dragged = document.querySelector('.draggable.dragged')
        dragged.classList.remove('dragged')

        let { rows, phrases } = this.state,
            id = ev.dataTransfer.getData('id'),
            item = this.getItemById(id),
            item_row_key = item[0].row,
            item_row = rows[item_row_key],
            dropped = { x: ev.clientX, y: ev.clientY }

        if (item_row_key === row && row === 'store') {
            let curIndex = this.findIndexByKey(item_row, 'key', id),
                closest = this.closest(dropped, item_row_key, id)

            if (closest !== null) {
                let dropPos = this.determineDropPosition(item_row_key, dropped, closest)

                switch (dropPos) {
                    case 'before':
                        item_row.splice(closest, 0, item_row[curIndex])
                        item_row.splice((curIndex + 1), 1)
                        break
                    case 'after':
                    default:
                        item_row.splice((closest + 1), 0, item_row[curIndex])
                        item_row.splice(curIndex, 1)
                        break
                }
            }
        }
        else {
            if (row === 'store') {
                let index = this.findIndexByKey(item_row.lots, 'key', item[0].id),
                    p_index = this.findIndexByKey(phrases, 'id', id),
                    removed = item_row.lots.splice(index, 1, [])

                console.log(removed)
    
                phrases[p_index].row = row
                rows[row].push(removed[0])
            }
            else {
                let row_elem = document.querySelector(`.row .droppable.${row}`)

                if (row_elem !== null) {
                    let lots = row_elem.querySelectorAll('.lot')
                    let prop = this.getProps(row)
                    let closest = null

                    for (const [i, lot] of lots.entries()) {
                        // if (lot.key === id) continue;
                        // let coords = this.getElementCoords(item_row, i)
                        let coords = lot.getBoundingClientRect()
                        
                        if (dropped[prop.dir] > coords[prop.dir] && dropped[prop.dir] < (coords[prop.dir] + coords[prop.size])) {
                            closest = i
                            break;
                        }
                    }

                    if (closest !== null) {
                        let lot = lots[closest]
                        if (lot.getAttribute('data-occupied') === 'true') {
                            console.log('Find next lot to fill')
                            return false;
                        }
                        else {
                            let index = this.findIndexByKey(item_row, 'key', item[0].id),
                                p_index = this.findIndexByKey(phrases, 'id', id),
                                removed = item_row.splice(index, 1, [])

                            phrases[p_index].row = row
                            phrases[p_index].lot = closest
                            rows[row].lots[closest] = removed[0]
                        }
                    }
                }
            }
        }

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