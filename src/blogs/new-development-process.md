---
title: "Part 4 · What the New Development Process Looks Like"
date: "2026-07-02"
excerpt: "There is a diagram going around that shows the software lifecycle before and after AI. The coding block — once the biggest part of the process — collapses into a compressed, parallel step, while problem framing and validation grow to take its place. The shape of the work is changing."
coverImage: "/covers/new-development-process.svg"
---
***

*Part 4 of **Fast Code, Slow Engineering**, a short series on what AI agents are actually speeding up — and what they aren't.*

> There is a diagram from axify comparing the software development lifecycle before and after AI, by how time is *allocated* across it. It captures the shift this whole series has been circling better than a paragraph can, so I want to sit with it for a moment.

## The Old Shape

In the traditional lifecycle, the blocks are lopsided in a familiar way. Requirements and design are modest. Testing, validation, and deploy are modest. And sitting in the middle, dwarfing everything around it, is **coding**. Most of the time is spent writing code.

That shape is so ingrained that we built our entire sense of "productivity" around it. Faster typing, better autocomplete, more lines per day. If coding is the biggest block, shrinking it feels like the obvious win.

## The New Shape

Now look at the AI-augmented version. The coding block does not just get smaller — it gets absorbed. **Design, coding, and testing collapse into a single compressed step that happens in parallel**, largely driven by agents.

What grows instead are the two ends. **Problem framing** on the front. **Validation** on the back. The bookends of the process — the parts that were always about judgment rather than typing — become the largest blocks. Deploy stays small.

The center of gravity moves from the middle of the process to its edges.

## Design, Coding, Testing — In Parallel

The most interesting detail is that little "in parallel" label. In the old model those three were sequential phases you marched through. In the new one they compress into something an agent can do concurrently: sketch a design, generate the code, produce the tests, more or less at once.

This is genuinely faster. But notice what it does — it takes the part of the process we spent decades optimizing and turns it into the *cheap* part. When the middle becomes cheap and fast, the quality of the whole system is decided almost entirely at the two ends.

## Why the Bookends Grow

This is not an accident, and it is not overhead. It is where the engineering moved.

**Problem framing grows** because a fast agent pointed at a poorly-framed problem just produces the wrong thing faster. The value of getting the problem right goes up precisely when execution gets cheap.

**Validation grows** because you are now reviewing far more generated code than you used to write by hand. As I argued earlier in this series, the constraint moves to the human who has to confirm the work is correct. The diagram is just that argument drawn as boxes.

## What It Means for the Work

If this is the shape of things, then "getting faster at coding" is optimizing the block that is disappearing. The skills that compound are the ones at the edges: framing problems precisely, writing specifications an agent can execute against, and validating output you did not personally type.

None of this is a demotion of engineering. It is a relocation of it. The work did not shrink — it moved to the parts of the process that were always the hardest to automate, because they were never really about the code.

---

> 🚧 This post is still being written. Thoughts here are genuine but unfinished, much like the ecosystem it is describing.
