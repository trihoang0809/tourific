from python_tsp.exact import solve_tsp_dynamic_programming
from python_tsp.heuristics import solve_tsp_lin_kernighan

def route(distance_matrix):
  if len(distance_matrix) <= 12:
    route, cost = solve_tsp_dynamic_programming(distance_matrix)
  else:
    route, cost = solve_tsp_lin_kernighan(distance_matrix)

  result = f'{{"route": {route}, "cost": {cost}}}'

  print(result, end='')

