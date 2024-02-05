import numpy as np
import pandas as pd
import os

def clean_types(type_str):
    return [t.strip(" '[]") for t in type_str.split(';')]


if __name__ == "__main__":
    os.chdir("../datasets")
    df_uses = pd.read_csv('main-chart.csv')
    df_pokemon = pd.read_csv('pokemon.csv')
    df_pokemon = df_pokemon[["name", "type"]]
    df = pd.merge(df_uses, df_pokemon, on='name', how='outer')
    df['type'] = df['type'].apply(clean_types)
    # print(df)
    type_usage = {month: {} for month in df.columns[1:-1]}
    for index, row in df.iterrows():
        pokemon_name = row['name']
        usage_per_month = row.drop(['name', 'type'])
        pokemon_types = row['type']
        for month, value in usage_per_month.items():
            if not np.isnan(value):
                for poke_type in pokemon_types:
                    if poke_type in type_usage[month]:
                        type_usage[month][poke_type] += value
                    else:
                        type_usage[month][poke_type] = value
    new_df = pd.DataFrame(type_usage)
    new_df.to_csv("waffle.csv", index=False)
