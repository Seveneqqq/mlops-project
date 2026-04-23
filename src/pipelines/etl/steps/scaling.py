import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler


def apply_scaling(df: pd.DataFrame, steps: dict):
    scale_type = steps.get("scale_numeric")

    if not scale_type:
        return df

    target_cols = [col for col in df.columns if col.startswith("Target_")]

    numeric_cols = df.select_dtypes(include=["int64", "float64"]).columns.tolist()

    numeric_cols = [col for col in numeric_cols if col not in target_cols]

    if len(numeric_cols) == 0:
        return df

    if scale_type == "standard":
        scaler = StandardScaler()
        df[numeric_cols] = scaler.fit_transform(df[numeric_cols])

    elif scale_type == "minmax":
        scaler = MinMaxScaler()
        df[numeric_cols] = scaler.fit_transform(df[numeric_cols])

    else:
        raise Exception("Invalid scaling type")

    return df