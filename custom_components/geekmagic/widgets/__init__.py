"""Widget components for GeekMagic displays."""

from .base import Widget, WidgetConfig
from .chart import ChartWidget
from .clock import ClockWidget
from .entity import EntityWidget
from .media import MediaWidget
from .text import TextWidget

__all__ = [
    "ChartWidget",
    "ClockWidget",
    "EntityWidget",
    "MediaWidget",
    "TextWidget",
    "Widget",
    "WidgetConfig",
]
