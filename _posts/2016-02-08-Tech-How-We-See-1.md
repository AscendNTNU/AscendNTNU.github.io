---
layout: post
title:  "Tech: How we see the world (Part 1)"
date:   2016-02-08 10:00:00
categories: tech computer vision
author: Simen Haugo
---

How we see the world (Part 1)
=============================

As many of our readers are surely aware, here at Ascend we are building a robot that can not only observe and reason about the world, but also take actions to modify it on its own volition. Clearly, this does not come free in terms of the moral and ethical questions that arise. For this reason, we will dedicate the next ten blog posts solely to discussing our responsibility towards mankind and its surrounding nature --- digging deep into the questions that really matter around here, such as *"What does really it mean to be rational"* and *"What about global warming?"*

...

No, wait! I'm just kidding, don't close the tab!

Despite how *exciting* it would be for you, dear reader, to read through such a discussion without falling asleep, we feel like questions about morals and ethics and stuff like that can be *temporarily pushed onto the stack*, while we focus on cranking out the technical details first.

(The above sentence will hopefully *not* appear in future history books with the caption *" --- last words from the organization that built the AI that took over the world"*)

Instead, we thought we should take a break from all this AI stuff, and tell you all a thing or two about our drone's perception algorithms --- how we
distinguish order from chaos in the flood of bits and bytes streaming into
our sockets.

Where are we?
-------------
As is often the case in life, you need to know where you are at the moment in order to make good decisions about where to go next. Our drone shares some of our life issues, and our team is currently working hard to solve the --- surprisingly difficult --- problem of figuring out where the drone is on the arena.

To aid us in answering this tough question, we have equipped our drone with so much expensive equipment that it makes us kinda nervous. That includes

* a downward-pointing laser, telling us how high up we are,
* an inertial measurement unit, telling us how fast we are moving,
* and multiple color cameras.

We actually maxed out the USB capacity on our device after two cameras, so we were all kinda bummed out about that. We haven't nailed down the list of equipment or their connections yet, so I'll save that for a future post.

There's also the problem of recognizing the roomba robots. But we haven't really begun on that yet, so let's take the position estimation first.

...

