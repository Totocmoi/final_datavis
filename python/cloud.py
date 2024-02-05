import os
import pandas as pd


def new_df(a):
    df = pd.read_csv(a)
    moves_usage = {}
    for index, row in df.iterrows():
        moves = eval(row['moves'])
        usage = row['usage']
        for move, value in moves.items():
            if move in moves_usage:
                moves_usage[move] += value
            else:
                moves_usage[move] = value
    return pd.DataFrame(list(moves_usage.items()), columns=['move', a[:-4]])


if __name__ == "__main__":
    os.chdir("../datasets/raw_data")
    files = os.listdir(os.getcwd())
    df = new_df(files[0])
    for file in files[1:]:
        df2 = new_df(file)
        df = pd.merge(df, df2, on='move', how='outer')
    df.to_csv("../cloud.csv",index=False)

    print(df)

