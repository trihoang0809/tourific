import numpy as np
from python_tsp.exact import solve_tsp_dynamic_programming
from python_tsp.heuristics import solve_tsp_lin_kernighan


distance_matrix = np.array([
    [0,  5, 4, 10],
    [5,  0, 8,  5],
    [4,  8, 0,  3],
    [10, 5, 3,  0]
])

if len(distance_matrix) <= 12:
  route, cost = solve_tsp_dynamic_programming(distance_matrix)
else:
  route, cost = solve_tsp_lin_kernighan(distance_matrix)

print(route)
print(cost)