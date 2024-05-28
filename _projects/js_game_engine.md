---
title: "JS Game Engine"
tags:
  - JS
header:
  teaser: /assets/images/engine.png
---

<link rel="stylesheet" href="{{ site.baseurl }}/assets/game_engine/css/styles.css"/>

The JS Game Engine was a project I started in high school as I started making simple games. This engine implements impulse-based collision resolution and is primarily a physics engine, but also has support for things like particles, various input device methods, and simple graphics rendering. It's very unfinished but collisions work which can be fun to play around with. Try moving the box around with the arrow keys!

<canvas tabindex="1"></canvas>

Collision handling was used later as a starting point for [Palygon's](/palygon) collision resolution.

<!-- start game loop -->
<script type="module" src="{{ site.baseurl }}/assets/game_engine/js/index.js"></script>