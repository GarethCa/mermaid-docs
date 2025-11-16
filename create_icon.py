#!/usr/bin/env python3
"""
Simple script to create a basic icon for the Mermaid VSCode extension.
This creates a 128x128 PNG with a simple diagram representation.
"""

from PIL import Image, ImageDraw, ImageFont
import os


def create_icon():
    # Create a 128x128 image with a gradient background
    size = 128
    img = Image.new("RGB", (size, size), color="#1e1e1e")
    draw = ImageDraw.Draw(img)

    # Draw a simple flowchart-like diagram
    # Box 1
    box1_x, box1_y = 20, 20
    box1_w, box1_h = 35, 20
    draw.rectangle(
        [box1_x, box1_y, box1_x + box1_w, box1_y + box1_h],
        fill="#4CAF50",
        outline="#2E7D32",
        width=2,
    )

    # Box 2
    box2_x, box2_y = 75, 20
    box2_w, box2_h = 35, 20
    draw.rectangle(
        [box2_x, box2_y, box2_x + box2_w, box2_y + box2_h],
        fill="#2196F3",
        outline="#1976D2",
        width=2,
    )

    # Diamond (decision)
    diamond_x, diamond_y = 47, 60
    diamond_size = 15
    diamond_points = [
        (diamond_x, diamond_y - diamond_size),  # top
        (diamond_x + diamond_size, diamond_y),  # right
        (diamond_x, diamond_y + diamond_size),  # bottom
        (diamond_x - diamond_size, diamond_y),  # left
    ]
    draw.polygon(diamond_points, fill="#FF9800", outline="#F57C00", width=2)

    # Box 3
    box3_x, box3_y = 20, 90
    box3_w, box3_h = 35, 20
    draw.rectangle(
        [box3_x, box3_y, box3_x + box3_w, box3_y + box3_h],
        fill="#9C27B0",
        outline="#7B1FA2",
        width=2,
    )

    # Box 4
    box4_x, box4_y = 75, 90
    box4_w, box4_h = 35, 20
    draw.rectangle(
        [box4_x, box4_y, box4_x + box4_w, box4_y + box4_h],
        fill="#FF5722",
        outline="#D84315",
        width=2,
    )

    # Draw arrows
    arrow_color = "#FFFFFF"
    arrow_width = 2

    # Arrow from box1 to box2
    draw.line(
        [box1_x + box1_w, box1_y + box1_h // 2, box2_x, box2_y + box2_h // 2],
        fill=arrow_color,
        width=arrow_width,
    )

    # Arrow from box1 to diamond
    draw.line(
        [box1_x + box1_w // 2, box1_y + box1_h, diamond_x, diamond_y - diamond_size],
        fill=arrow_color,
        width=arrow_width,
    )

    # Arrow from box2 to diamond
    draw.line(
        [box2_x + box2_w // 2, box2_y + box2_h, diamond_x, diamond_y - diamond_size],
        fill=arrow_color,
        width=arrow_width,
    )

    # Arrows from diamond to bottom boxes
    draw.line(
        [
            diamond_x - diamond_size // 2,
            diamond_y + diamond_size,
            box3_x + box3_w // 2,
            box3_y,
        ],
        fill=arrow_color,
        width=arrow_width,
    )
    draw.line(
        [
            diamond_x + diamond_size // 2,
            diamond_y + diamond_size,
            box4_x + box4_w // 2,
            box4_y,
        ],
        fill=arrow_color,
        width=arrow_width,
    )

    # Save the icon
    img.save("icon.png", "PNG", optimize=True)
    print("Icon created: icon.png")


if __name__ == "__main__":
    create_icon()
