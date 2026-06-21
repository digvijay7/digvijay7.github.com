---
layout: clean-default
title: Digvijay Singh — Game
tagline: An interactive easter egg
permalink: /game/
---

{% include JB/setup %}

<div id="game-world">
  <canvas id="game-canvas"></canvas>
</div>

<link rel="stylesheet" href="{{ ASSET_PATH }}/css/game.css">
<script src="{{ ASSET_PATH }}/js/game.js" defer></script>

<style>
html, body { margin: 0; padding: 0; background: #0d0d1a; overflow: hidden; }
#wrap { padding: 0; margin: 0; }
.footer, .navbar { display: none !important; }
</style>
