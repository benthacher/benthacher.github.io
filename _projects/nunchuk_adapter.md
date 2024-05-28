---
title: "Nunchuk Adapter"
tags:
  - C
  - KiCAD
  - Embedded
header:
  teaser: /assets/images/nunchuk_adapter/pcb.jpg
---

After playing Clone Hero with a friend a few times, I really wanted to get a USB compatible guitar. After looking into for exactly zero seconds, I decided I'd just make an adapter with an Adafruit ItsyBitsy (ATmega32U4), as it had I2C to communicate with nunchuk peripherals as well as a USB phy.

For the nunchuk connector, I took a piece of double-sided copper clad board and a dremel tool and got to work. I connected the cut board to some proto-board with 0.1" headers and connected that to another proto-board with the ItsyBitsy.

![](/assets/images/nunchuk_adapter/IMG_20200226_165410.jpg)
![](/assets/images/nunchuk_adapter/IMG_20200226_180008.jpg)
![](/assets/images/nunchuk_adapter/IMG_20200229_192651_01.jpg)

About a year after I'd made the prototype, I got to work on a PCB and baremetal firmware for the device, and bought the components and hand soldered everything together.

![](/assets/images/nunchuk_adapter/layout.png)
