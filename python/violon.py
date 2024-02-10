import numpy as np
import pandas as pd
import os

if __name__ == "__main__":
    os.chdir("../datasets")
    df_uses = pd.read_csv('main-chart.csv')
    df_pokemon = pd.read_csv('pokemon.csv')
    df_pokemon = df_pokemon[["name", "hp", "attack", "defense", "special-attack", "special-defense", "speed"]]
    df = pd.merge(df_uses, df_pokemon, on='name', how='outer')
    df.drop(columns=['name'], inplace=True)
    df.dropna(how="all", subset=df.keys()[:-6], inplace=True)
    for date in df.keys()[:-6]:
        tpdf = df[[date, *df.keys()[-6:].tolist()]].dropna()
        df_hp = tpdf[[date, 'hp']].groupby("hp").sum()
        df_atk = tpdf[[date, 'attack']].groupby("attack").sum()
        df_def = tpdf[[date, 'defense']].groupby("defense").sum()
        df_satk = tpdf[[date, 'special-attack']].groupby("special-attack").sum()
        df_sdef = tpdf[[date, 'special-defense']].groupby("special-defense").sum()
        df_spe = tpdf[[date, 'speed']].groupby("speed").sum()
        pd.concat([df_hp, df_atk, df_def, df_satk, df_sdef, df_spe], axis=1).fillna(0).to_csv("../datasets/violin/"+date+".csv")


