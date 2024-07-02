import sys
import json
from numberpartitioning import karmarkar_karp

def partition(numbers, days):
  result = karmarkar_karp(numbers, num_parts=days)

  partitionResult = result.partition
  flag = [False]*len(numbers)

  for i in range(len(result.partition)):
    for j in range(len(result.partition[i])):
        for value in range(len(numbers)):
           if result.partition[i][j] == numbers[value] and not flag[value]:
              flag[value] = True
              partitionResult[i][j] = value

  output = f'{{"itinerary": {partitionResult}}}'
  print(output, end='')

input = sys.stdin.read()

data = json.loads(input)

# input: {"funScore": [], "days": number}
ans = partition(data["funScore"], data["days"])

