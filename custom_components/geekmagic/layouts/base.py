"""Base layout class."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import TYPE_CHECKING

from PIL import Image
from PIL import ImageDraw as PILImageDraw

from ..const import COLOR_BLACK, DISPLAY_HEIGHT, DISPLAY_WIDTH
from ..render_context import RenderContext

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant
    from PIL import ImageDraw

    from ..renderer import Renderer
    from ..widgets.base import Widget


@dataclass
class Slot:
    """Represents a widget slot in a layout."""

    index: int
    rect: tuple[int, int, int, int]  # x1, y1, x2, y2
    widget: Widget | None = None


class Layout(ABC):
    """Base class for display layouts."""

    def __init__(self, padding: int = 8, gap: int = 8) -> None:
        """Initialize the layout.

        Args:
            padding: Padding around the edges
            gap: Gap between widgets
        """
        self.padding = padding
        self.gap = gap
        self.width = DISPLAY_WIDTH
        self.height = DISPLAY_HEIGHT
        self.slots: list[Slot] = []
        self._calculate_slots()

    @abstractmethod
    def _calculate_slots(self) -> None:
        """Calculate the slot rectangles. Override in subclasses."""

    def _available_space(self) -> tuple[int, int]:
        """Calculate available width and height after padding.

        Returns:
            Tuple of (available_width, available_height)
        """
        return (
            self.width - 2 * self.padding,
            self.height - 2 * self.padding,
        )

    def _grid_cell_size(self, rows: int, cols: int) -> tuple[int, int]:
        """Calculate cell size for a grid layout.

        Args:
            rows: Number of rows
            cols: Number of columns

        Returns:
            Tuple of (cell_width, cell_height)
        """
        aw, ah = self._available_space()
        return (
            (aw - (cols - 1) * self.gap) // cols,
            (ah - (rows - 1) * self.gap) // rows,
        )

    def _split_dimension(self, total: int, ratio: float) -> tuple[int, int]:
        """Split a dimension by ratio, accounting for gap.

        Args:
            total: Total available dimension (excluding gap)
            ratio: Ratio for first section (0.0-1.0)

        Returns:
            Tuple of (first_size, second_size)
        """
        content = total - self.gap
        first = int(content * ratio)
        second = content - first
        return first, second

    def get_slot_count(self) -> int:
        """Return the number of widget slots."""
        return len(self.slots)

    def get_slot(self, index: int) -> Slot | None:
        """Get a slot by index."""
        if 0 <= index < len(self.slots):
            return self.slots[index]
        return None

    def set_widget(self, index: int, widget: Widget) -> None:
        """Set a widget in a slot.

        Args:
            index: Slot index
            widget: Widget to place
        """
        if 0 <= index < len(self.slots):
            self.slots[index].widget = widget

    def render(
        self,
        renderer: Renderer,
        draw: ImageDraw.ImageDraw,
        hass: HomeAssistant | None = None,
    ) -> None:
        """Render all widgets in the layout with clipping.

        Each widget is rendered to a temporary image first, then pasted
        onto the main canvas. This ensures widgets cannot overflow their
        slot boundaries.

        Args:
            renderer: Renderer instance
            draw: ImageDraw instance
            hass: Home Assistant instance
        """
        # Get the main canvas from the draw object
        canvas = draw._image  # noqa: SLF001
        scale = renderer.scale

        for slot in self.slots:
            widget = slot.widget
            if widget is None:
                continue

            # Calculate slot dimensions in scaled coordinates
            x1, y1, x2, y2 = slot.rect
            slot_width = (x2 - x1) * scale
            slot_height = (y2 - y1) * scale

            # Create temporary image for this widget
            temp_img = Image.new("RGB", (slot_width, slot_height), COLOR_BLACK)
            temp_draw = PILImageDraw.Draw(temp_img)

            # Create render context with local coordinates (0, 0 to width, height)
            # The rect is relative to the temp image, not the main canvas
            local_rect = (0, 0, x2 - x1, y2 - y1)
            ctx = RenderContext(temp_draw, local_rect, renderer)
            widget.render(ctx, hass)

            # Paste the widget image onto the main canvas at the slot position
            paste_x = x1 * scale
            paste_y = y1 * scale
            canvas.paste(temp_img, (paste_x, paste_y))

    def get_all_entities(self) -> list[str]:
        """Get all entity IDs from all widgets."""
        entities = []
        for slot in self.slots:
            if slot.widget is not None:
                entities.extend(slot.widget.get_entities())
        return entities
