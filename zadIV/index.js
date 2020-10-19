function makeSpace(x, y, arr) {
    arr = arr.map((row, rowId) => row.map((field, fieldId) => {
        const dist = (x - rowId)**2 + (y - fieldId)**2;
        return dist <= 2 && field == 0 ? 2 : field;
    }));

    return arr;
}

function placeShip(shipSize, map) {
    let mapCopy = JSON.parse(JSON.stringify(map));
    const x = Math.floor(Math.random() * mapCopy.length);
    const y = Math.floor(Math.random() * mapCopy.length);
    const isRotated = Math.round(Math.random()) > 0;

    const fields = [];

    if (isRotated) {
        if (shipSize + x > mapCopy.length) {
            return placeShip(shipSize, map);
        }

        for (let i = x; i < shipSize + x; i++) {
            if (mapCopy[i][y] != 0) {
                return placeShip(shipSize, map);
            }

            mapCopy[i][y] = 1;
            fields.push([i, y]);
        }
    } else {
        if (shipSize + y > mapCopy[x].length) {
            return placeShip(shipSize, map);
        }

        for (let i = y; i < shipSize + y; i++) {
            if (mapCopy[x][i] != 0) {
                return placeShip(shipSize, map);
            }

            mapCopy[x][i] = 1;
            fields.push([x, i]);
        }
    }

    fields.forEach(([x, y])=> {
        mapCopy = makeSpace(x, y, mapCopy);
    });

    return mapCopy;
}

function renderMap(map) {
    const table = document.createElement('table');
    map.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(field => {
            const td = document.createElement('td');
            if (field == 1) {
                td.classList.add('ship');
            }
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    document.body.appendChild(table);
}

function main() {
    // Initial
    const size = 10;
    let map = [];
    for (let i = 0; i < size; i++) {
        map.push(new Array(size).fill(0));
    }
    const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    
    // Generate ships
    ships.forEach(ship => {
        map = placeShip(ship, map);
    });

    // Render
    renderMap(map);
}

main();
