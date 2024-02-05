import numpy as np
import pandas as pd
import os


if __name__ == "__main__":
    os.chdir("../datasets")
    df_uses = pd.read_csv('main-chart.csv')
    df_pokemon = pd.read_csv('pokemon.csv')
    df_pokemon = df_pokemon[["name", "hp", "attack", "defense", "special-attack", "special-defense", "speed"]]
    df = pd.merge(df_uses, df_pokemon, on='name', how='outer')
    #print(df)
    hp_usage = {month: {} for month in df.columns[1:-6]}
    atk_usage = {month: {} for month in df.columns[1:-6]}
    def_usage = {month: {} for month in df.columns[1:-6]}
    satk_usage = {month: {} for month in df.columns[1:-6]}
    sdef_usage = {month: {} for month in df.columns[1:-6]}
    spe_usage = {month: {} for month in df.columns[1:-6]}
    for index, row in df.iterrows():
        pokemon_name = row['name']
        usage_per_month = row.drop(['name', "hp", "attack", "defense", "special-attack", "special-defense", "speed"])
        pokemon_hp = row['hp']
        pokemon_atk = row['attack']
        pokemon_def = row['defense']
        pokemon_satk = row['special-attack']
        pokemon_sdef = row['special-defense']
        pokemon_spe = row['speed']
        for month, value in usage_per_month.items():
            if not np.isnan(value):
                if pokemon_hp in hp_usage[month]:
                    hp_usage[month][pokemon_hp] += value
                else:
                    hp_usage[month][pokemon_hp] = value
                if pokemon_atk in atk_usage[month]:
                    atk_usage[month][pokemon_atk] += value
                else:
                    atk_usage[month][pokemon_atk] = value
                if pokemon_def in def_usage[month]:
                    def_usage[month][pokemon_def] += value
                else:
                    def_usage[month][pokemon_def] = value
                if pokemon_satk in satk_usage[month]:
                    satk_usage[month][pokemon_satk] += value
                else:
                    satk_usage[month][pokemon_satk] = value
                if pokemon_sdef in sdef_usage[month]:
                    sdef_usage[month][pokemon_sdef] += value
                else:
                    sdef_usage[month][pokemon_sdef] = value
                if pokemon_spe in spe_usage[month]:
                    spe_usage[month][pokemon_spe] += value
                else:
                    spe_usage[month][pokemon_spe] = value
    hp_df = pd.DataFrame(hp_usage)
    hp_df.to_csv("violin/hp.csv")
    atk_df = pd.DataFrame(atk_usage)
    atk_df.to_csv("violin/atk.csv")
    def_df = pd.DataFrame(def_usage)
    def_df.to_csv("violin/def.csv")
    satk_df = pd.DataFrame(satk_usage)
    satk_df.to_csv("violin/satk.csv")
    sdef_df = pd.DataFrame(sdef_usage)
    sdef_df.to_csv("violin/sdef.csv")
    spe_df = pd.DataFrame(spe_usage)
    spe_df.to_csv("violin/spe.csv")
