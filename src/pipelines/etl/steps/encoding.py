import pandas as pd


def apply_encoding(df: pd.DataFrame, steps: dict):
    if not steps.get("encode_categorical"):
        return df

    cat_cols = df.select_dtypes(include=["object", "category"]).columns

    if len(cat_cols) == 0:
        return df

    df = pd.get_dummies(df, columns=cat_cols, drop_first=False)

    bool_cols = df.select_dtypes(include=["bool"]).columns
    if len(bool_cols) > 0:
        df[bool_cols] = df[bool_cols].astype(int)

    return df