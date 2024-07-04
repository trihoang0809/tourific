import sys
import json
import numpy as np
from python_tsp.exact import solve_tsp_dynamic_programming
from python_tsp.heuristics import solve_tsp_lin_kernighan

def getRoute(distance_matrix):
  if len(distance_matrix) <= 12:
    route, cost = solve_tsp_dynamic_programming(distance_matrix)
  else:
    route, cost = solve_tsp_lin_kernighan(distance_matrix)

  result = f'{{"route": {route}, "cost": {cost}}}'

  print(result, end='')

# Read the input from stdin
input = sys.stdin.read()

# Deserialize the JSON string back into a Python list (2D matrix)
matrix = json.loads(input)

# input: 2D matrix
ans = getRoute(np.array(matrix))

sys.stdout.flush()