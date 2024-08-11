  // Select all the grid items
  const gridItems = document.querySelectorAll('.grid-item');
  const gridSize = 9;
  const source = {row: 0, col: 0};
  const destination = {row: 8, col: 8};

  // Mark nodes as blockage on click
  gridItems.forEach(item => {
      item.addEventListener('click', () => {
          if (!(item.dataset.row == source.row && item.dataset.col == source.col) &&
              !(item.dataset.row == destination.row && item.dataset.col == destination.col)) {
              item.classList.toggle('blockage');
          }
      });
  });

  // Helper function to get the index in the grid array
  function getIndex(row, col) {
      return row * gridSize + col;
  }

  // Dijkstra's algorithm to find the shortest path
  function findPath() {
      let distances = Array(gridSize * gridSize).fill(Infinity);
      let previous = Array(gridSize * gridSize).fill(null);
      let visited = new Set();

      distances[getIndex(source.row, source.col)] = 0;
      let pq = [[0, source.row, source.col]]; // [distance, row, col]

      while (pq.length > 0) {
          pq.sort((a, b) => a[0] - b[0]); // Sort by distance
          let [dist, row, col] = pq.shift();

          if (visited.has(getIndex(row, col))) continue;
          visited.add(getIndex(row, col));

          if (row === destination.row && col === destination.col) {
              break;
          }

          // Explore neighbors (up, down, left, right)
          let neighbors = [
              [row - 1, col],
              [row + 1, col],
              [row, col - 1],
              [row, col + 1]
          ];

          for (let [nRow, nCol] of neighbors) {
              if (nRow >= 0 && nRow < gridSize && nCol >= 0 && nCol < gridSize) {
                  let index = getIndex(nRow, nCol);
                  if (!visited.has(index) && !gridItems[index].classList.contains('blockage')) {
                      let alt = dist + 1;
                      if (alt < distances[index]) {
                          distances[index] = alt;
                          previous[index] = [row, col];
                          pq.push([alt, nRow, nCol]);
                      }
                  }
              }
          }
      }

      // Reconstruct path
      let path = [];
      let current = destination;

      while (previous[getIndex(current.row, current.col)] !== null) {
          path.push(current);
          let [prevRow, prevCol] = previous[getIndex(current.row, current.col)];
          current = {row: prevRow, col: prevCol};
      }

      // Color the path
      if (distances[getIndex(destination.row, destination.col)] !== Infinity) {
          path.reverse().forEach(pos => {
              gridItems[getIndex(pos.row, pos.col)].classList.add('path');
          });
      } else {
          alert('No path found!');
      }
  }
  function resetGrid() {
    gridItems.forEach(item => {
        item.classList.remove('blockage', 'path');
    });
}