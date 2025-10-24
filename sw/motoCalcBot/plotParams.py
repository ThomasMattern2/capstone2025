import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np
import ipywidgets as widgets
from IPython.display import display

# --- Sample Data ---
data = {
    "model": ["a", "a", "b", "b"],
    "drag": [10, 11, 15, 16],
    "speed": [45, 55, 36, 67],
    "thrust": [33, 37, 22, 55],
}
df = pd.DataFrame(data)

# --- Create Base FigureWidget ---
fig = go.FigureWidget()

# Add line traces for each model
for model, group in df.groupby("model"):
    fig.add_scatter(
        x=group["speed"],
        y=group["drag"],
        mode="lines+markers",
        name=f"{model} - Drag"
    )
    fig.add_scatter(
        x=group["speed"],
        y=group["thrust"],
        mode="lines+markers",
        name=f"{model} - Thrust"
    )

# --- Add exponential line ---
x_vals = np.linspace(df["speed"].min(), df["speed"].max(), 100)
a_init, b_init = 1, 0.05
y_vals = a_init * np.exp(b_init * (x_vals - x_vals.min()))

exp_trace = fig.add_scatter(
    x=x_vals,
    y=y_vals,
    mode="lines",
    name=f"Exp: {a_init:.2f} * e^({b_init:.3f}x)",
    line=dict(color="black", dash="dot")
)

# --- Sliders ---
a_slider = widgets.FloatSlider(value=a_init, min=0.1, max=10, step=0.1, description="a:")
b_slider = widgets.FloatSlider(value=b_init, min=0.001, max=0.2, step=0.001, description="b:")

# --- Update function ---
def update_plot(change=None):
    a = a_slider.value
    b = b_slider.value
    new_y = a * np.exp(b * (x_vals - x_vals.min()))
    with fig.batch_update():
        fig.data[-1].y = new_y
        fig.data[-1].name = f"Exp: {a:.2f} * e^({b:.3f}x)"

a_slider.observe(update_plot, names="value")
b_slider.observe(update_plot, names="value")

# --- Layout ---
fig.update_layout(
    title="Drag & Thrust vs Speed (Interactive Exponential Fit)",
    xaxis_title="Speed",
    yaxis_title="Force",
    template="plotly_white",
    hovermode="x unified",
    legend_title="Measurement"
)

# Display
display(widgets.VBox([a_slider, b_slider]), fig)
