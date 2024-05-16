---
title: "End Effector"
tags:
  - JS
header:
  teaser: /assets/images/end-effector.png
---

End Effector is a rudimentary inverse kinematics demo that was used to create the custom inverse kinematics solver used on one of the versions of the NURover's arm. This project doesn't have a repo, so it's just demo'd here. Use the WASD keys to move the end effector or click with the mouse. It also has gamepad support but I haven't tested that in the portfolio page. Try it out!

<div>
    Speed <input id="speed" type="range" min="0" max="10" step="0.01" value="3">
    Length <input id="length" type="range" min="5" max="200" step="1" value="50">
    Number of Joints <input id="num-joints" type="range" min="2" max="30" step="1" value="3">
</div>

<canvas></canvas>

<script src="{{ '/assets/end_effector/Joint.js' | prepend: site.url }}"></script>
<script src="{{ '/assets/end_effector/gamepad.js' | prepend: site.url }}"></script>
<script src="{{ '/assets/end_effector/events.js' | prepend: site.url }}"></script>
<script src="{{ '/assets/end_effector/utils.js' | prepend: site.url }}"></script>
<script src="{{ '/assets/end_effector/graphics.js' | prepend: site.url }}"></script>
<script src="{{ '/assets/end_effector/index.js' | prepend: site.url }}"></script>