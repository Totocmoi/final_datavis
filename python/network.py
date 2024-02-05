import numpy as np
import pandas as pd
import os


def new_csv(a):
    df = pd.read_csv(a)
    df = df[['name','teammates']]
    pokemon_scores = {}
    for index, row in df.iterrows():
        pokemon_name = row['name']
        teammates_scores = eval(row['teammates'])
        pokemon_scores[pokemon_name] = {}

        for teammate, score in teammates_scores.items():
            pokemon_scores[pokemon_name][teammate] = score
    pokemon_df = pd.DataFrame(pokemon_scores)
    pokemon_df.fillna(0, inplace=True)
    pokemon_df.to_csv("../network/"+a)



if __name__ == "__main__":
    os.chdir("../datasets/raw_data")
    files = os.listdir(os.getcwd())
    for file in files:
        new_csv(file)