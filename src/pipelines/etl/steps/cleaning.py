import pandas as pd


def apply_cleaning(df: pd.DataFrame, steps: dict):
    if steps.get("drop_na"):
        df = df.dropna()

    fill_na = steps.get("fill_na")

    if fill_na == "mean":
        df = df.fillna(df.mean(numeric_only=True))
    elif fill_na == "median":
        df = df.fillna(df.median(numeric_only=True))
    elif fill_na == "mode":
        df = df.fillna(df.mode().iloc[0])

    return df