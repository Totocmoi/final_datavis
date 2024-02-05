import os
import pandas as pd


def new_df(a):
    df = pd.read_csv(a)
    df = df[['name', 'usage']]
    sum_us = df['usage'].sum()
    df['usage'] = df['usage'] / sum_us * 600
    df.rename(columns={'usage': a[:-4]}, inplace=True)
    return df


if __name__ == "__main__":
    os.chdir("../datasets/raw_data")
    files =  os.listdir(os.getcwd())
    df = new_df(files[0])
    for file in files[1:]:
        df2 = new_df(file)
        df = pd.merge(df, df2, on='name', how='outer')
    df.to_csv("../main-chart.csv",index=False)
