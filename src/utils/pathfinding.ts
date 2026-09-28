// Grid-based A* Pathfinding for 2.5D Museum

export interface Point2D {
  x: number
  z: number
}

interface Obstacle {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

// Map boundaries and player buffer
const MAP_MIN_X = -12.0
const MAP_MAX_X = 12.0
const MAP_MIN_Z = -14.0
const MAP_MAX_Z = 14.0
const CELL_SIZE = 0.4
const PLAYER_RADIUS = 0.45

// Obstacles definition (Walls and Display cases)
const OBSTACLES: Obstacle[] = [
  // Outer walls (with thickness buffer)
  { minX: -13.0, maxX: -11.9, minZ: -15.0, maxZ: 15.0 }, // Left outer wall
  { minX: 11.9, maxX: 13.0, minZ: -15.0, maxZ: 15.0 },  // Right outer wall
  { minX: -13.0, maxX: 13.0, minZ: -15.0, maxZ: -14.1 }, // Back outer wall
  { minX: -13.0, maxX: -2.3, minZ: 14.1, maxZ: 15.0 },  // Front left entrance wall
  { minX: 2.3, maxX: 13.0, minZ: 14.1, maxZ: 15.0 },   // Front right entrance wall

  // Interior room divider walls (Leaving central hallway ~[-4.2, 4.2] open)
  // Wall at z = 6.9 (left & right)
  { minX: -12.4, maxX: -4.3, minZ: 6.6, maxZ: 7.2 },
  { minX: 4.3, maxX: 12.4, minZ: 6.6, maxZ: 7.2 },

  // Wall at z = -2.0 (left & right)
  { minX: -12.4, maxX: -4.3, minZ: -2.3, maxZ: -1.7 },
  { minX: 4.3, maxX: 12.4, minZ: -2.3, maxZ: -1.7 },

  // Wall at z = -8.8 (left & right)
  { minX: -12.4, maxX: -4.3, minZ: -9.1, maxZ: -8.5 },
  { minX: 4.3, maxX: 12.4, minZ: -9.1, maxZ: -8.5 },

  // Display Cases (Pedestals + Glass)
  { minX: -1.4, maxX: 1.4, minZ: 6.3, maxZ: 8.7 },      // Statue (0, 7.5)
  { minX: -1.4, maxX: 1.4, minZ: 0.6, maxZ: 3.0 },      // Bust (0, 1.8)
  { minX: -8.4, maxX: -5.6, minZ: 2.8, maxZ: 5.2 },     // French branch (-7.0, 4.0)
  { minX: 5.6, maxX: 8.4, minZ: 2.8, maxZ: 5.2 },      // Letter to workers (7.0, 4.0)
  { minX: -8.4, maxX: -5.6, minZ: -6.0, maxZ: -3.6 },   // Declaration (-7.0, -4.8)
  { minX: 5.6, maxX: 8.4, minZ: -6.0, maxZ: -3.6 },    // Silk shirt (7.0, -4.8)
  { minX: -8.4, maxX: -5.6, minZ: -12.7, maxZ: -10.3 }, // Khaki outfit (-7.0, -11.5)
  { minX: -1.4, maxX: 1.4, minZ: -12.7, maxZ: -10.3 },  // National emblem (0, -11.5)
]

export function isWalkable(x: number, z: number): boolean {
  if (x < MAP_MIN_X || x > MAP_MAX_X || z < MAP_MIN_Z || z > MAP_MAX_Z) {
    return false
  }

  for (const obs of OBSTACLES) {
    if (
      x >= obs.minX - PLAYER_RADIUS &&
      x <= obs.maxX + PLAYER_RADIUS &&
      z >= obs.minZ - PLAYER_RADIUS &&
      z <= obs.maxZ + PLAYER_RADIUS
    ) {
      return false
    }
  }

  return true
}

export function clampToWalkable(x: number, z: number): Point2D {
  let cx = Math.max(MAP_MIN_X + 0.5, Math.min(MAP_MAX_X - 0.5, x))
  let cz = Math.max(MAP_MIN_Z + 0.5, Math.min(MAP_MAX_Z - 0.5, z))

  if (isWalkable(cx, cz)) return { x: cx, z: cz }

  // Search spiral outward for closest walkable point
  for (let r = 0.3; r <= 3.5; r += 0.3) {
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
      const sx = cx + Math.cos(angle) * r
      const sz = cz + Math.sin(angle) * r
      if (isWalkable(sx, sz)) {
        return { x: sx, z: sz }
      }
    }
  }

  return { x: 0, z: 12.0 } // Safe fallback (entrance)
}

function lineOfSight(p1: Point2D, p2: Point2D): boolean {
  const dx = p2.x - p1.x
  const dz = p2.z - p1.z
  const dist = Math.hypot(dx, dz)
  const steps = Math.ceil(dist / (CELL_SIZE * 0.5))

  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const px = p1.x + dx * t
    const pz = p1.z + dz * t
    if (!isWalkable(px, pz)) return false
  }
  return true
}

// A* Node
interface Node {
  gx: number
  gz: number
  x: number
  z: number
  g: number
  h: number
  f: number
  parent?: Node
}

const GRID_OFFSET_X = -MAP_MIN_X
const GRID_OFFSET_Z = -MAP_MIN_Z
const GRID_COLS = Math.ceil((MAP_MAX_X - MAP_MIN_X) / CELL_SIZE)
const GRID_ROWS = Math.ceil((MAP_MAX_Z - MAP_MIN_Z) / CELL_SIZE)

function toGrid(x: number, z: number): [number, number] {
  return [
    Math.floor((x + GRID_OFFSET_X) / CELL_SIZE),
    Math.floor((z + GRID_OFFSET_Z) / CELL_SIZE),
  ]
}

function fromGrid(gx: number, gz: number): Point2D {
  return {
    x: (gx + 0.5) * CELL_SIZE - GRID_OFFSET_X,
    z: (gz + 0.5) * CELL_SIZE - GRID_OFFSET_Z,
  }
}

export function findPath(start: Point2D, end: Point2D): Point2D[] {
  const safeStart = clampToWalkable(start.x, start.z)
  const safeEnd = clampToWalkable(end.x, end.z)

  // Fast shortcut if direct line of sight exists
  if (lineOfSight(safeStart, safeEnd)) {
    return [safeEnd]
  }

  const [startGx, startGz] = toGrid(safeStart.x, safeStart.z)
  const [endGx, endGz] = toGrid(safeEnd.x, safeEnd.z)

  const openSet: Node[] = []
  const closedSet = new Uint8Array(GRID_COLS * GRID_ROWS)

  const startNode: Node = {
    gx: startGx,
    gz: startGz,
    x: safeStart.x,
    z: safeStart.z,
    g: 0,
    h: Math.hypot(safeStart.x - safeEnd.x, safeStart.z - safeEnd.z),
    f: 0,
  }
  startNode.f = startNode.h
  openSet.push(startNode)

  const neighbors = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1],
  ]

  let closestNode: Node = startNode
  let iterations = 0
  const maxIterations = 1200

  while (openSet.length > 0 && iterations++ < maxIterations) {
    // Find node with lowest f
    let lowestIdx = 0
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIdx].f) {
        lowestIdx = i
      }
    }

    const current = openSet.splice(lowestIdx, 1)[0]
    const closedIdx = current.gz * GRID_COLS + current.gx
    closedSet[closedIdx] = 1

    if (current.h < closestNode.h) {
      closestNode = current
    }

    // Reached destination grid
    if (Math.hypot(current.x - safeEnd.x, current.z - safeEnd.z) <= CELL_SIZE * 1.2) {
      closestNode = current
      break
    }

    for (const [dx, dz] of neighbors) {
      const ngx = current.gx + dx
      const ngz = current.gz + dz

      if (ngx < 0 || ngx >= GRID_COLS || ngz < 0 || ngz >= GRID_ROWS) continue
      const nIdx = ngz * GRID_COLS + ngx
      if (closedSet[nIdx]) continue

      const pos = fromGrid(ngx, ngz)
      if (!isWalkable(pos.x, pos.z)) continue

      const moveCost = (dx !== 0 && dz !== 0) ? 1.414 : 1.0
      const g = current.g + moveCost * CELL_SIZE
      const h = Math.hypot(pos.x - safeEnd.x, pos.z - safeEnd.z)
      const f = g + h

      const existing = openSet.find((n) => n.gx === ngx && n.gz === ngz)
      if (existing) {
        if (g < existing.g) {
          existing.g = g
          existing.f = f
          existing.parent = current
        }
      } else {
        openSet.push({
          gx: ngx,
          gz: ngz,
          x: pos.x,
          z: pos.z,
          g,
          h,
          f,
          parent: current,
        })
      }
    }
  }

  // Reconstruct path
  const rawPath: Point2D[] = []
  let curr: Node | undefined = closestNode
  while (curr) {
    rawPath.push({ x: curr.x, z: curr.z })
    curr = curr.parent
  }
  rawPath.reverse()

  if (rawPath.length === 0) return [safeEnd]

  // Replace final node with actual target
  rawPath[rawPath.length - 1] = safeEnd

  // Path smoothing (string pulling)
  const smoothedPath: Point2D[] = [rawPath[0]]
  let currentIdx = 0

  while (currentIdx < rawPath.length - 1) {
    let furthest = currentIdx + 1
    for (let j = rawPath.length - 1; j > currentIdx; j--) {
      if (lineOfSight(rawPath[currentIdx], rawPath[j])) {
        furthest = j
        break
      }
    }
    smoothedPath.push(rawPath[furthest])
    currentIdx = furthest
  }

  // Remove first point if it's too close to starting location
  if (smoothedPath.length > 1 && Math.hypot(smoothedPath[0].x - safeStart.x, smoothedPath[0].z - safeStart.z) < 0.2) {
    smoothedPath.shift()
  }

  return smoothedPath
}
