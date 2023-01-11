import {DijkstraCalculator} from "dijkstra-calculator";

export const getPath = async (token0Symbol, token1Symbol, pathList = [], nodeList = []) => {

  const graph = new DijkstraCalculator();
  //We add every contract hash that we have
  nodeList.forEach(v => {
    graph.addVertex(v.id)
  })

  //We have all pairs symbol and contracthash matched
  let token0ContractHash = null
  let token1ContractHash = null
  pathList.forEach(v => {
    if (v.token0.symbol == token0Symbol) {
      token0ContractHash = v.token0.id
    }
    if (v.token1.symbol == token0Symbol) {
      token0ContractHash = v.token1.id
    }
    if (v.token0.symbol == token1Symbol) {
      token1ContractHash = v.token0.id
    }
    if (v.token1.symbol == token1Symbol) {
      token1ContractHash = v.token1.id
    }

    graph.addEdge(v.token0.id, v.token1.id)
  })

  if (token0ContractHash == null || token1ContractHash == null) return []

  return graph.calculateShortestPath(token0ContractHash, token1ContractHash);
}