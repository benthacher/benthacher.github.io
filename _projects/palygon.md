---
title: "Palygon"
tags:
  - C
header:
  teaser: /assets/images/palygon/breakout.png
---

Palygon is a tamagotchi style virtual pet device in the shape of a hexagon. Currently, development is currently in very early stages, with most hardware designed (schematic captured but not laid out) but not manufactured, and the engine in its early stages ([PAL Engine](https://github.com/benthacher/pal-engine)).

The current design of Palygon will be a hexagonal housing, square 128x128 touch screen, two side buttons, and two bumper/trigger style buttons. It'll also have a 6DoF IMU just in case I want to add anything like step tracking or extra interactive aspects. Internally, all ICs have been specced out already and will be detailed later in the PCB repo.

The PAL Engine, the game engine running on Palygon, currently has the following features:

- Physics engine
  - Impulse-based collision resolution
  - Separating Axis Theorem collision detection
- Input handling
  - Platform agnostic input event system based on PAL (Palygon Abstraction Layer)
    - Support for button press/release events, touch events, IMU events
- Entity system
  - Event system for emitting events on entities
    - | Event name                     | When event is emitted                                                            |
      |--------------------------------|----------------------------------------------------------------------------------|
      | `ENTITY_EVENT_UPDATE`          | every frame                                                                      |
      | `ENTITY_EVENT_CLICK`           | when entity is clicked (touch event collides with entity bounds)                 |
      | `ENTITY_EVENT_RELEASE`         | on entity if pointer is released after being clicked                             |
      | `ENTITY_EVENT_DRAG_START`      | when draggable entity is being dragged                                           |
      | `ENTITY_EVENT_DRAG_STOP`       | on current dragged entity after drag ends                                        |
      | `ENTITY_EVENT_SPRITE_LOOP_END` | when sprite loop completes or on the last frame of sprite if sprite doesn't loop |
      | `ENTITY_EVENT_BUTTON_UP`       | when button is released                                                          |
      | `ENTITY_EVENT_BUTTON_DOWN`     | when button is pressed                                                           |
- Audio system
  - Simple oscillator system
    - Playing tones of different frequencies on separate voice channels
    - ADSR envelope
    - Filter and effect chain
  - MIDI file reading and parsing for playback
  - Wave sample player
- Graphics system
  - Primatives
    - Lines
    - Circles (filled and stroked)
    - Convex polygons
    - Pixels
  - Images
    - Implemented Nearest Neighbor algorithm for image scaling/rotation (mostly because it's easier than alpha blending but also because of the unique aesthetic)
  - Sprites
    - Animated images with the ability to loop or play once, providing entity events in either case
    - Script to convert .gif or .png files to sprites