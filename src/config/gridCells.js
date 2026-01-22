export const brabrandCenter = { lat: 56.1680, lng: 10.1250 };

/*export const gridCells = [
  {
    id: 'grid-0',
    bounds: [[56.1720, 10.1100], [56.1693, 10.1145]],
    center: { lat: 56.17065, lng: 10.11225 }
  },
  {
    id: 'grid-1',
    bounds: [[56.1705, 10.1180], [56.1678, 10.1225]],
    center: { lat: 56.16915, lng: 10.12025 }
  },
  {
    id: 'grid-2',
    bounds: [[56.1690, 10.1260], [56.1663, 10.1305]],
    center: { lat: 56.16765, lng: 10.12825 }
  },
  {
    id: 'grid-3',
    bounds: [[56.1730, 10.1320], [56.1703, 10.1365]],
    center: { lat: 56.17165, lng: 10.13425 }
  },
  {
    id: 'grid-4',
    bounds: [[56.1650, 10.1150], [56.1623, 10.1195]],
    center: { lat: 56.16365, lng: 10.11725 }
  },
  {
    id: 'grid-5',
    bounds: [[56.1640, 10.1240], [56.1613, 10.1285]],
    center: { lat: 56.16265, lng: 10.12625 }
  },
  {
    id: 'grid-6',
    bounds: [[56.1675, 10.1340], [56.1648, 10.1385]],
    center: { lat: 56.16615, lng: 10.13625 }
  },
  {
    id: 'grid-7',
    bounds: [[56.1620, 10.1320], [56.1593, 10.1365]],
    center: { lat: 56.16065, lng: 10.13425 }
  },
  {
    id: 'grid-8',
    bounds: [[56.1750, 10.1200], [56.1723, 10.1245]],
    center: { lat: 56.17365, lng: 10.12225 }
  },
  {
    id: 'grid-9',
    bounds: [[56.1710, 10.1380], [56.1683, 10.1425]],
    center: { lat: 56.16965, lng: 10.14025 }
  }
];*/


const BRABRAND_BOUNDS = {
  north: 56.1750,
  south: 56.1450,
  west:  10.0850,
  east:  10.1500
};
const CELL_LAT = 0.0018;   // ~200 m
const CELL_LNG = 0.0033;  // ~200 m

export function generateBrabrandGrid() {
  const cells = [];
  let id = 0;

  for (let lat = BRABRAND_BOUNDS.south; lat < BRABRAND_BOUNDS.north; lat += CELL_LAT) {
    for (let lng = BRABRAND_BOUNDS.west; lng < BRABRAND_BOUNDS.east; lng += CELL_LNG) {

      const north = lat + CELL_LAT;
      const east  = lng + CELL_LNG;

      cells.push({
        id: `grid-${id++}`,
        bounds: [
          [north, lng],   // NW
          [lat, east]     // SE
        ],
        center: {
          lat: lat + CELL_LAT / 2,
          lng: lng + CELL_LNG / 2
        }
      });
    }
  }

  return cells;
}
export const gridCells = generateBrabrandGrid();

export const availableTags = ['hverdag', 'fællesskab', 'nabolag'];
