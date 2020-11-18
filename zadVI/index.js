function makeSpace(x, y, arr) {
    const mySpaces = [];
    arr = arr.map((row, rowId) => row.map((field, fieldId) => {
        const dist = (x - rowId)**2 + (y - fieldId)**2;
        mySpaces.push({ x, y });
        return dist <= 2 && field == 0 ? field + 2 : field;
    }));

    return arr;
}

function freeSpace(x, y, arr) {
    arr = arr.map((row, rowId) => row.map((field, fieldId) => {
        const dist = (x - rowId)**2 + (y - fieldId)**2;
        return dist <= 2 && field == 2 ? 0 : field;
    }));

    return arr;
}

function placeComputerShip(shipSize, map) {
    let mapCopy = JSON.parse(JSON.stringify(map));
    const x = Math.floor(Math.random() * mapCopy.length);
    const y = Math.floor(Math.random() * mapCopy.length);
    const isRotated = Math.round(Math.random()) > 0;

    // Where ships are
    const fields = [];

    // If ships cannot be placed use recursion
    if (isRotated) {
        if (shipSize + x > mapCopy.length) {
            return placeComputerShip(shipSize, map);
        }

        for (let i = x; i < shipSize + x; i++) {
            if (mapCopy[i][y] != 0) {
                return placeComputerShip(shipSize, map);
            }

            mapCopy[i][y] = 1;
            fields.push([i, y]);
        }
    } else {
        if (shipSize + y > mapCopy[x].length) {
            return placeComputerShip(shipSize, map);
        }

        for (let i = y; i < shipSize + y; i++) {
            if (mapCopy[x][i] != 0) {
                return placeComputerShip(shipSize, map);
            }

            mapCopy[x][i] = 1;
            fields.push([x, i]);
        }
    }

    fields.forEach(([x, y])=> {
        mapCopy = makeSpace(x, y, mapCopy);
    });

    return { mapCopy, fields, isRotated };
}

function removeHover(map) {
    map.forEach(r => {
        r.childNodes.forEach(f => {
            f.classList.remove('td--active');
            f.classList.remove('td--wrong');
        });
    });
}

function renderMap(map) {
    const table = document.createElement('table');
    map.forEach((row, x) => {
        const tr = document.createElement('tr');
        row.forEach((field, y) => {
            const td = document.createElement('td');
            td.dataset.x = x;
            td.dataset.y = y;
            if (field == 1) {
                td.classList.add('ship');
            }
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    document.querySelector('.wrapper').appendChild(table);
    return table;
}

function prepareComputer(size, map, ships) {
    for (let i = 0; i < size; i++) {
        map.push(new Array(size).fill(0));
    }
    
    renderMap(map);

    ships.forEach(ship => {
        ({ mapCopy } = placeComputerShip(ship, map));
        map = mapCopy;
    });

    return map;
}

function canBePlaced(activeFields, map) {
    if (activeFields.length <= 0) return false;

    return activeFields.every(field => {
        const { x, y } = field.dataset;
        if (map[x][y] === 0) return true;
        return false;
    });
}

function removePlayerShip(field, playerMap, map, panel) {
    const { x, y, ship } = field.dataset;
    const [ isRotated, shipSize, fieldId ] = ship.split(':');
    const shipFields = [];
    if (isRotated == "true") {
        const beginning = parseInt(x) - parseInt(fieldId);
        playerMap.forEach(row => {
            row.childNodes.forEach(f => {
                const isInline = f.dataset.x < beginning+parseInt(shipSize) && f.dataset.x >= beginning;
                if (f.dataset.y == y && isInline) {
                    shipFields.push(f);
                }
            });
        });
    } else {
        const beginning = parseInt(y) - parseInt(fieldId);
        playerMap.forEach(row => {
            row.childNodes.forEach(f => {
                const isInline = f.dataset.y < beginning+parseInt(shipSize) && f.dataset.y >= beginning;
                if (f.dataset.x == x && isInline) {
                    shipFields.push(f);
                }
            });
        });
    }

    shipFields.forEach(shipField => {
        const { x, y } = shipField.dataset;
        shipField.classList.remove('ship');
        map[x][y] = 0;
    });
    shipFields.forEach(shipField => {
        const { x, y } = shipField.dataset;
        map = freeSpace(x, y, map);
    });

    // Fix space
    map.forEach((r, rid) => {
        r.forEach((f, fid) => {
            if (f == 1) map = makeSpace(rid, fid, map);
        });
    });

    const trash = [...document.querySelector('.trash').childNodes];
    const panelShip = trash.find(ship => ship.children.length == shipSize);
    panelShip.classList.remove('ship--active');
    panel.appendChild(panelShip);

    return map;
}

function preparePlayer(size, map, ships) {
    // Handle auto button
    const autoButton = document.querySelector('.auto');
    autoButton.addEventListener('click', () => {
        const panelShips = panel.querySelectorAll('.ship--player');
        if (panelShips.length <= 0) return;

        const placedShips = [];
        panelShips.forEach(ship => {
            const { mapCopy, fields, isRotated } = placeComputerShip(ship.children.length, map);
            placedShips.push({ fields, isRotated, size: ship.children.length });
            
            map = mapCopy;
            document.querySelector('.trash').appendChild(ship);
        });
        activeShip = null;

        placedShips.forEach(placedShip => {
            const { fields, isRotated, size } = placedShip;
            fields.forEach(([x, y], index) => {
                const f = table.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                f.classList.add('ship');
                f.dataset.ship = `${isRotated}:${size}:${index}`;
            });
        });

        document.querySelector('.start').classList.remove('inactive');
        document.body.dispatchEvent(new CustomEvent('shipsPlaced', { detail: map }));
    });
    
    // Filling player map with 0
    for (let i = 0; i < size; i++) {
        map.push(new Array(size).fill(0));
    }

    // Rendering panel with ships
    const panel = document.querySelector('.controlPanel');
    let activeShip;
    ships.forEach(ship => {
        const shipEl = document.createElement('div');
        shipEl.classList.add('ship--player')

        shipEl.addEventListener('click', () => {
            if (activeShip) activeShip.classList.remove('ship--active');
            shipEl.classList.add('ship--active');
            activeShip = shipEl;
            isRotated = false;
        });

        for (let i=0; i<ship; i++) {
            const square = document.createElement('div');
            square.classList.add('ship--square')
            shipEl.appendChild(square);
        }
        panel.appendChild(shipEl);
    });
    
    activeShip = document.querySelector('.ship--player');
    activeShip.classList.add('ship--active');

    // handling placing ships on map
    renderMap(map);
    const table = document.querySelector('table');
    const playerMap = table.childNodes;
    let isRotated = false;

    table.addEventListener('mouseleave', () => {
        removeHover(playerMap);
    });

    table.addEventListener('contextmenu', e => {
        e.preventDefault();
        isRotated = !isRotated;
        e.target.dispatchEvent(new Event('mouseover'));
    });

    table.addEventListener('dblclick', e => {
        if (e.target.classList.contains('ship')) {
            map = removePlayerShip(e.target, playerMap, map, panel);
            document.querySelector('.start').classList.add('inactive');
        }
    });

    table.addEventListener('click', () => {
        const activeFields = [];
        playerMap.forEach(row => {
            const af = [...row.childNodes].filter(f => f.classList.contains('td--active'));
            af.length <= 0 ? null : activeFields.push(...af);
        });

        // If not free quit
        if (!canBePlaced(activeFields, map)) {
            return;
        }

        // place ship
        activeFields.forEach((field, index) => {
            const { x, y } = field.dataset;
            map[x][y] = 1;
        
            field.classList.remove('td--active');
            field.dataset.ship = `${isRotated}:${activeShip.children.length}:${index}`;
            field.classList.add('ship');
        });

        // generate space
        activeFields.forEach(field => {
            const {x, y} = field.dataset;
            map = makeSpace(x, y, map);
        });

        // Remove ship from panel
        const trash = document.querySelector('.trash');
        trash.appendChild(activeShip);

        if (panel.querySelectorAll('.ship--player').length <= 0) {
            activeShip = null;
            document.querySelector('.start').classList.remove('inactive');
            document.body.dispatchEvent(new CustomEvent('shipsPlaced', { detail: map }));
            return;
        }

        activeShip = null;
        const quickPlacing = document.querySelector('.checkbox').checked;
        if (quickPlacing) {
            activeShip = panel.querySelector('.ship--player');
            activeShip.classList.add('ship--active');
        }
    });

    playerMap.forEach((row, rowId) => {
        row.childNodes.forEach((field, fieldId) => {
            field.addEventListener('mouseover', () => {
                if (!activeShip) return;

                const shipSize = activeShip.children.length;
                removeHover(playerMap);

                let line;
                let id;
                if (isRotated) {
                    id = rowId
                    line = [...playerMap].map(r => r.childNodes[fieldId]);
                } else {
                    id = fieldId
                    line = [...row.childNodes];
                }
                let bias = line.length - id - shipSize;
                bias = bias > 0 ? 0 : bias;
                const activeFields = line.slice(id + bias, id + shipSize);

                activeFields.forEach(activeField => {
                    activeField.classList.add('td--active');
                });

                if (!canBePlaced(activeFields, map)) {
                    activeFields.forEach(field => {
                        field.classList.remove('td--active');
                        field.classList.add('td--wrong');
                    });
                }
            });
        });
    });
}

function isHit(field) {
    if (field.classList.contains('hit')) return true;
    if (field.classList.contains('miss')) return true;
    return false;
}

function scanLine(line, index) {
    index = parseInt(index);
    let i=index+1, j=index-1;
    const indexes = [index];
    for (let _ in line) {
        if (line[i] == 1) {
            indexes.push(i);
            i++;
        }
        if (line[j] == 1) {
            indexes.push(j);
            j--;
        }
    }
    return indexes;
}

function destroyShip(x, y, map, table) {
    const cords = findShip(x, y, map);
    const fields = [];
    cords.x.forEach((r) => {
        cords.y.forEach(f => {
            fields.push(table.querySelector(`td[data-x="${r}"][data-y="${f}"]`));
        });
    });
    if (fields.every(field => field.classList.contains('hit'))) {
        fields.forEach(field => field.classList.add('destroyed'));
    }
}

function findShip(x, y, map) {
    const row = map[x];
    const column = map.map(r => r[y]);
    const shipRow = scanLine(row, y);
    const shipCol = scanLine(column, x);
    const result = {};
    if (shipCol.length > shipRow.length) {
        result.x = shipCol;
        result.y = [y];
    } else {
        result.x = [x];
        result.y = shipRow;
    }
    return result;
}

function checkIfFree(table, r, f) {
    const fields = [];
    table.querySelectorAll('td').forEach(td => {
        const { x, y } = td.dataset;
        const dist = (r-x)**2 + (f-y)**2;
        if (dist <= 2) {
            fields.push(td);
        }
    });

    return fields.every(field => !field.classList.contains('destroyed'));
}

function calculateBestMove(table) {
    // Get possible fields
    computerTargets.forEach(({ x, y }) => {
        for (let i=-1; i<=1; i++) {
            for (let j=-1; j<=1; j++) {
                if (Math.abs(i) == Math.abs(j)) continue;
                const move = {
                    x: x+i,
                    y: y+j
                }
                if (computerNextMoves.findIndex(m => m.x == move.x && m.y == move.y) == -1) {
                    computerNextMoves.push(move);
                }
            }
        }
    });

    // Filter next moves

    // Must be inside map
    computerNextMoves = computerNextMoves.filter(move => {
        const xCondition = move.x >= 0 && move.x < size;
        const yCondition = move.y >= 0 && move.y < size;
        return xCondition && yCondition;
    });

    // Find axis
    if (computerTargets.length > 1) {
        let key = computerTargets[0].x;
        if (computerTargets.every(target => key == target.x)) {
            computerNextMoves = computerNextMoves.filter(move => move.x == key);
        } else {
            key = computerTargets[0].y;
            computerNextMoves = computerNextMoves.filter(move => move.y == key);
        }
    }

    // Field must be free (no ships nearby, and not shot)
    computerNextMoves = computerNextMoves.filter(move => {
        const field = table.querySelector(`td[data-x="${move.x}"][data-y="${move.y}"]`);
        if (checkIfFree(table, move.x, move.y) && !isHit(field)) {
            return true;
        }
        return false;
    });


    // Pop next move
    if (computerNextMoves.length > 0) {
        const randIndex = Math.floor(Math.random() * computerNextMoves.length);
        return computerNextMoves.splice(randIndex, 1)[0];
    }

    const r = Math.floor(Math.random() * size);
    const f = Math.floor(Math.random() * size);

    const field = table.querySelector(`td[data-x="${r}"][data-y="${f}"]`);
    if (!checkIfFree(table, r, f) || isHit(field)) {
        return calculateBestMove(table);
    }
    
    return { x: r, y: f };
}

function makeComputerMove(playerTable, playerMap, computerMap, computerTable) {
    if (checkWin(playerTable, 'Computer WON!', computerMap, computerTable)) {
        return;
    }

    const { x, y } = calculateBestMove(playerTable);
    const field = playerTable.querySelector(`td[data-x="${x}"][data-y="${y}"]`);
    setTimeout(() => {
        if (field.classList.contains('ship')) {
            computerTargets.push({ x, y });
            field.classList.add('hit');
            destroyShip(x, y, playerMap, playerTable);
            if (field.classList.contains('destroyed')) {
                computerNextMoves.splice(0);
                computerTargets.splice(0);
            }
            return makeComputerMove(playerTable, playerMap, computerMap, computerTable);
        } else {
            field.classList.add('miss');
        }
        
        label.innerHTML = "Player";
        playerMove = true;
    }, computerMoveTime);
}

function makePlayerMove(e, map, table) {
    const { x, y } = e.target.dataset;

    const field = table.querySelector(`td[data-x="${x}"][data-y="${y}"]`);
    if (isHit(field)) return;
    scanLine(map[x], y);

    if (map[x][y] == 1) {
        field.classList.add('hit');
        destroyShip(x, y, map, table);
        return;
    } else {
        field.classList.add('miss');
    }

    playerMove = false;
    label.innerHTML = "Computer";
}

function checkWin(table, message, map, computerTable) {
    const fields = table.querySelectorAll('td.destroyed');
    if (fields.length >= 20) {
        if (map) {
            computerTable.querySelectorAll('td').forEach(td => {
                const { x, y } = td.dataset;
                if (map[x][y] == 1 ) {
                    const clone = td.cloneNode(true);
                    td.parentNode.replaceChild(clone, td);
                    clone.classList.add('ship');
                }
            });
        }
        
        label.innerHTML = message;
        const restartBtn = document.querySelector('.restart');
        restartBtn.classList.remove('inactive');
        restartBtn.onclick = restartGame;
        return true;
    }
    return false;
}

function makeMoves(e, computerMap, computerTable, playerTable, playerMap) {
    if (!playerMove) {
        if (label.innerHTML != 'Computer WON!' && label.innerHTML != 'Player WON!') {
            label.innerHTML = "THE COMPUTER IS SHOOTING NOW!!! STOP CLICKING!!!";
        }
        return;
    }

    makePlayerMove(e, computerMap, computerTable);
    if (checkWin(computerTable, 'Player WON!')) {
        playerMove = false;
        return; 
    }
    if (!playerMove) {
        makeComputerMove(playerTable, playerMap, computerMap, computerTable);
    }
}

let label = document.querySelector('.label');
let playerMove = true;

function startGame(computerMap, playerMap) {
    document.querySelector('.controlPanel').remove();
    document.querySelector('.start').classList.add('inactive');
    document.querySelector('table').remove();
    label.classList.remove('inactive');

    renderMap(playerMap);

    const [computerTable, playerTable] = document.querySelectorAll('table');
    document.querySelector('.wrapper').prepend(playerTable);

    label.innerHTML = "Player";

    computerTable.childNodes.forEach(r => 
        r.childNodes.forEach(field => {
            field.addEventListener('click', e => {
                makeMoves(e, computerMap, computerTable, playerTable, playerMap);
            });
        }));
}

function restartGame() {
    document.body.innerHTML = bodyBackup;

    label = document.querySelector('.label');
    playerMove = true;
    main();
}

const size = 10;
const computerTargets = [];
let computerNextMoves = [];
const computerMoveTime = 1000;
const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
const points = ships.reduce((acc, curr) => acc+curr);

const headBackup = document.head.innerHTML;
const bodyBackup = document.body.innerHTML;

function main() {
    // Initial
    let computerMap = [];
    let playerMap = [];
    
    // Placing ships
    preparePlayer(size, playerMap, ships);
    document.body.addEventListener('shipsPlaced', e => {
        playerMap = e.detail;
    });

    computerMap = prepareComputer(size, computerMap, ships);

    // Handle start game
    document.querySelector('.start').addEventListener('click', () => startGame(computerMap, playerMap));
}

main();
