import sys
import json
import tspAlgo
import numpy as np
# Read the input from stdin
input = sys.stdin.read()

# Deserialize the JSON string back into a Python list (2D matrix)
matrix = json.loads(input)

ans = tspAlgo.route(np.array(matrix))