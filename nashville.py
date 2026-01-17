import reprlib
import warnings
from dataclasses import dataclass, field
from typing import TypeAlias

import itables
import numpy as np
import pandas as pd
from plotly import graph_objects as go

Df: TypeAlias = pd.DataFrame
warnings.filterwarnings("ignore")


def load_data(path) -> Df:
    return pd.read_csv(path, encoding="utf-8")


@dataclass(frozen=False, slots=True)
class ColumnView:
    name: str
    dtype: str
    count: int
    unique_values: int
    missing_values: int
    sample_values: list
    is_categorical: bool
    is_numerical: bool

    _series: pd.Series = field(repr=False)
    min: float | None = field(init=False, default=None)
    max: float | None = field(init=False, default=None)
    mean: float | None = field(init=False, default=None)
    median: float | None = field(init=False, default=None)
    std: float | None = field(init=False, default=None)
    quartiles: dict = field(init=False, default_factory=dict)
    kurt: float | None = field(init=False, default=None)
    skew: float | None = field(init=False, default=None)

    def __post_init__(self):
        if self.is_numerical:
            self.min = self._series.min()
            self.max = self._series.max()
            self.mean = self._series.mean()
            self.median = self._series.median()
            self.std = self._series.std()
            self.quartiles = {
                "25%": self._series.quantile(0.25),
                "50%": self._series.quantile(0.50),
                "75%": self._series.quantile(0.75),
            }
            self.kurt = self._series.kurtosis()
            self.skew = self._series.skew()
        else:
            self.min = None
            self.max = None
            self.mean = None
            self.median = None
            self.std = None

    def info(self):
        return self.as_df().T

    def as_df(self) -> Df:
        def shorten(val):
            return reprlib.repr(str(val))

        dtype_tag = (
            "categorical"
            if self.is_categorical
            else "numerical"
            if self.is_numerical
            else "other"
        )
        single_unique = "unique_eq_1" if self.unique_values == 1 else ""
        null_gt_50 = "null_gt_50" if self.null_ratio() > 0.5 else ""
        complete = "no_missing" if self.missing_values == 0 else ""
        low_unique = "unique_lt_10" if self.unique_values < 10 else ""
        normal = (
            "skew_normal" if abs(self.skew or 0) < 0.5 and self.is_numerical else ""
        )
        left_tail = (
            "skew_left_tail" if (self.skew or 0) < -0.5 and self.is_numerical else ""
        )
        right_tail = (
            "skew_right_tail" if (self.skew or 0) > 0.5 and self.is_numerical else ""
        )
        tags = " ".join(
            [
                item.upper()
                for item in [
                    dtype_tag,
                    single_unique,
                    null_gt_50,
                    low_unique,
                    complete,
                    normal,
                    left_tail,
                    right_tail,
                ]
            ]
        )

        return pd.DataFrame(
            {
                "Column Name": [self.name],
                "Data Type": [self.dtype],
                "Total Count": [self.count],
                "Unique Values": [self.unique_values],
                "Missing Values": [self.missing_values],
                "Sample Values": [", ".join(map(shorten, self.sample_values))],
                "Most Common": [
                    ", ".join(f"{k}: {v}" for k, v in self.most_common(n=2).items())
                ],
                "Is Categorical": [self.is_categorical],
                "Is Numerical": [self.is_numerical],
                "Null Ratio": [f"{self.null_ratio():.2%}"],
                "Min": [self.min if self.is_numerical else None],
                "Max": [self.max if self.is_numerical else None],
                "Mean": [self.mean if self.is_numerical else None],
                "Median": [self.median if self.is_numerical else None],
                "Std Dev": [self.std if self.is_numerical else None],
                "Kurtosis": [self.kurt if self.is_numerical else None],
                "Skewness": [self.skew if self.is_numerical else None],
                "Quartiles": [
                    ", ".join(f"{k}: {v:.2f}" for k, v in self.quartiles.items())
                    if self.is_numerical
                    else None
                ],
                "Tags": [tags],
            }
        )

    def null_ratio(self):
        total = len(self._series)
        nulls = self.missing_values
        ratio = nulls / total if total > 0 else 0
        return ratio

    def most_common(self, n: int = 5):
        return self._series.value_counts().head(n)

    @classmethod
    def from_series(cls, name, series: pd.Series):
        dtype = str(series.dtype)
        count = len(series)
        unique_values = series.nunique()
        missing_values = series.isnull().sum()
        sample_values = series.dropna().unique()[:5].tolist()
        is_categorical = pd.api.types.is_categorical_dtype(
            series
        ) or pd.api.types.is_object_dtype(series)
        is_numerical = pd.api.types.is_numeric_dtype(series)

        return cls(
            name=name,
            dtype=dtype,
            count=count,
            unique_values=unique_values,
            missing_values=missing_values,
            sample_values=sample_values,
            is_categorical=is_categorical,
            is_numerical=is_numerical,
            _series=series,
        )

    def _show_fig(self, trace, height: int, width: int, title: str):
        fig = go.Figure()
        fig.add_trace(trace)
        fig.update_layout(
            title=title,
            height=height,
            width=width,
            template="plotly_white",
        )
        fig.show()

    def bar(self, show: bool = True, height: int = 400, width: int = 600):
        if not self.is_categorical:
            raise ValueError("Bar chart can only be generated for categorical columns.")
        counts = self._series.value_counts().head(20)
        trace = go.Bar(
            x=counts.index.astype(str),
            y=counts.values,
            name=self.name,
            marker=dict(color="lightcoral", line=dict(color="darkred", width=1)),
        )
        if show:
            self._show_fig(trace, height, width, f"Bar Chart of {self.name}")
            return
        return trace

    def box(self, show: bool = True, height: int = 400, width: int = 400):
        if not self.is_numerical:
            raise ValueError("Boxplot can only be generated for numerical columns.")
        trace = go.Box(
            y=self._series,
            name=self.name,
            boxmean=True,
            pointpos=0,
            marker=dict(color="lightblue"),
            line=dict(color="darkblue"),
        )
        if show:
            self._show_fig(trace, height, width, f"Boxplot of {self.name}")
            return
        return trace

    def hist(
        self, bins: int = 30, show: bool = True, height: int = 400, width: int = 600
    ):
        if not self.is_numerical:
            raise ValueError("Histogram can only be generated for numerical columns.")
        trace = go.Histogram(
            x=self._series,
            nbinsx=bins,
            name=self.name,
            marker=dict(color="lightgreen", line=dict(color="darkgreen", width=1)),
        )
        if show:
            self._show_fig(trace, height, width, f"Histogram of {self.name}")
            return
        return trace


class DataView:
    def __init__(self, data: Df):
        self.data = data.copy()
        self.fields: list[ColumnView] = []
        self.analyze()

    def __getattr__(self, name):
        if name in self.data.columns:
            return self.analyze_col(name)
        return getattr(self.data, name)

    def df(self):
        return self.data

    def list_null_rows(self, threshold: float = 0.5):
        null_rows = self.data.isnull().mean(axis=1)
        return self.data[null_rows > threshold]

    def list_null_columns(self):
        null_cols = self.data.isnull().mean()
        return self.data.columns[null_cols > 0].tolist()

    def analyze(self, clear: bool = False):
        if clear:
            self.fields = []
        else:
            if self.fields:
                return self.fields

        for col in self.data.columns:
            colview = self.analyze_col(col)
            self.fields.append(colview)

        return self.fields

    def itable(self, **kwargs):
        data = self.summary_table(**kwargs)
        itables.show(data)

    def summary_table(
        self,
        categorical_only: bool = False,
        numerical_only: bool = False,
        exclude_cols: list[str] | None = None,
        pivot: bool = False,
    ):
        if categorical_only and numerical_only:
            raise ValueError(
                "Specify either categorical_only or numerical_only as True."
            )

        self.analyze()
        concat = pd.concat([col.as_df() for col in self.fields], ignore_index=True)
        if categorical_only:
            concat = concat[concat["Is Categorical"] == True]
        if numerical_only:
            concat = concat[concat["Is Numerical"] == True]

        if pivot:
            concat = concat.set_index("Column Name").T

        if exclude_cols:
            concat = concat.drop(columns=exclude_cols, errors="ignore")
        return concat

    def list_numerical(self):
        return self.data.select_dtypes(include=["number"]).columns.tolist()

    def analyze_col(self, column_name: str) -> ColumnView:
        if column_name in [col.name for col in self.fields]:
            for col in self.fields:
                if col.name == column_name:
                    return col
        series = self.data[column_name]
        return ColumnView.from_series(column_name, series)

    def list_by_null_ratio(self, descending: bool = True):
        if not self.fields:
            self.analyze
        return sorted(
            self.fields,
            key=lambda x: x.null_ratio(),
            reverse=descending,
        )

    def list_categorical(self):
        return self.data.select_dtypes(include=["object", "category"]).columns.tolist()

    def list_other(self):
        num_cols = self.list_numerical()
        cat_cols = self.list_categorical()
        other_cols = [
            col
            for col in self.data.columns
            if col not in num_cols and col not in cat_cols
        ]
        return other_cols

    def heatmap(self, exclude_cols: list[str] | None = None):
        import matplotlib.pyplot as plt
        import numpy as np
        import seaborn as sns

        corr = self.data.select_dtypes(include=["number", "float64", "int64"]).corr()
        if exclude_cols:
            corr = corr.drop(index=exclude_cols, columns=exclude_cols)
        mask = np.triu(np.ones_like(corr, dtype=bool))
        plt.figure(figsize=(12, 10))  # adjust size as needed
        sns.heatmap(
            corr,
            mask=mask,  # hide upper triangle
            annot=True,  # show numbers
            fmt=".2f",  # 2 decimal places
            cmap="coolwarm",  # red-blue is very intuitive
            vmin=-1,
            vmax=1,
            center=0,  # perfect for correlation
            square=True,
            linewidths=0.5,
            cbar_kws={"shrink": 0.8},
        )

        plt.title("Heatmap", fontsize=16, pad=20)
        plt.tight_layout()
        plt.show()

    def pair_plot(self, include_cols: list[str] | None = None):
        import matplotlib.pyplot as plt
        import seaborn as sns

        num_data = self.data.select_dtypes(include=["number", "float64", "int64"])
        if include_cols:
            num_data = num_data[include_cols]
        sns.pairplot(num_data)
        plt.suptitle("Pair Plot", y=1.02)
        plt.show()

    def scatter(
        self, x_col: str, y_col: str, height: int = 400, width: int = 600, show=True
    ):
        if x_col not in self.data.columns or y_col not in self.data.columns:
            raise ValueError("Both x_col and y_col must exist in the data.")
        trace = go.Scatter(
            x=self.data[x_col],
            y=self.data[y_col],
            mode="markers",
            marker=dict(color="rgba(152, 0, 0, .8)", size=5),
        )
        if show:
            fig = go.Figure(data=[trace])
            fig.update_layout(
                title=f"{y_col} vs {x_col}",
                xaxis_title=x_col,
                yaxis_title=y_col,
                height=height,
                width=width,
                template="plotly_white",
            )
            fig.show()
            return
        return trace

    def make_subplots(
        self, rows: int, cols: int, specs=None, subplot_titles=None, **kwargs
    ):
        from plotly.subplots import make_subplots

        fig = make_subplots(
            rows=rows,
            cols=cols,
            specs=specs,
            subplot_titles=subplot_titles,
            **kwargs,
        )
        return fig


class Transformer:
    def __init__(self, data: Df):
        self._data = data.copy()
        self._applied = set()

    @property
    def data(self):
        return DataView(self._data)

    def drop_rows(self, threshold: float = 0.5):
        cols_to_drop = [
            col
            for col in self._data.columns
            if self._data[col].isnull().mean() > threshold
        ]
        self._data.drop(columns=cols_to_drop, inplace=True)
        return self

    def drop_columns(self, *column_names):
        for column_name in column_names:
            if column_name in self._data.columns:
                self._data.drop(columns=[column_name], inplace=True)
        return self

    def apply(self, *funcs):
        for func in funcs:
            if not callable(func):
                raise ValueError("All arguments to apply must be callable functions.")
            if func.__name__ in self._applied:
                continue
            self._data = func(self._data)
            self._applied.add(func.__name__)
        return self

    def label_encode(self, col):
        if col not in self._data.columns:
            raise ValueError(f"Column '{col}' does not exist in the data.")

        if not pd.api.types.is_categorical_dtype(self._data[col]):
            self._data[col] = self._data[col].astype("category")
        self._data[col] = self._data[col].cat.codes
        # convert to integer type
        self._data[col] = self._data[col].astype(int)
        return self

    def fill_missing(self, col: str, strategy: str = "mean", value=None):
        if self._data[col].isnull().sum() == 0:
            return self
        if strategy == "mean" and pd.api.types.is_numeric_dtype(self._data[col]):
            fill_value = self._data[col].mean()
        elif strategy == "median" and pd.api.types.is_numeric_dtype(self._data[col]):
            fill_value = self._data[col].median()
        elif strategy == "mode":
            fill_value = self._data[col].mode()[0]
        elif strategy == "constant":
            fill_value = value
        elif strategy == "sample":
            fill_value = self._data[col].dropna().sample(n=1).values[0]
        else:
            raise ValueError(f"Unsupported strategy '{strategy}' for column '{col}'.")
        self._data[col].fillna(fill_value, inplace=True)
        return self

    def price_to_log(self):
        if "price" in self._data.columns:
            self._data["log_price"] = np.log1p(self._data["price"])
        return self


class Nashville:
    raw = DataView(load_data("nashville.csv"))
    transformer = Transformer(raw.data)
