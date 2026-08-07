---
title: "Part 4 · What the New Development Process Looks Like"
date: "2026-07-03"
excerpt: "The diagram compares how time gets spent across the software lifecycle, before and after AI. In the old way, coding is the giant block in the middle. In the AI version, coding shrinks into a small parallel step and the big blocks become problem framing and validation. Here is what I make of it."
coverImage: "/covers/new-development-process.svg"
---
***

*Part 4 of **AI, As I See It**, a personal series on what AI agents are really changing about how we build software — and what they aren't.*

> This diagram compares the software development lifecycle before and after AI — not by the steps themselves, but by how much *time* each one takes up. It says what I have been trying to say across this whole series better than my paragraphs have, so I want to slow down and walk through it.

## The Old Shape

Start with the traditional version. Requirements and design are small blocks. Testing and validation are a bit bigger, but still modest. Deploy is tiny. And then there is **coding**, sitting in the middle as this huge block that dwarfs everything else. The line under it says it plainly: most of the time is spent writing code.

We got so used to that shape that we quietly built our whole idea of "being productive" around it. Type faster. Get better autocomplete. Ship more lines in a day. If coding is the biggest block, then of course making it smaller feels like the win.

## The New Shape

Now the AI-augmented version. Coding does not just get smaller — it stops being its own big block at all. Design, coding, and testing get squeezed into a single step marked **in parallel**, mostly handled by agents.

What grows instead are the two ends. **Problem framing** becomes a big block on one side. **Validation** becomes an equally big block on the other. Deploy stays tiny. The caption sums it up: the focus shifts to problem framing and validation.

So the weight of the work slides from the middle out to the edges.

## Design, Coding, Testing — All At Once

The detail I keep coming back to is that little "in parallel" tag on the middle block. In the traditional version, design, coding, and testing were three separate stages you moved through one after another. In the AI version they are bundled into one thing an agent can do more or less at once — rough out a design, write the code, generate the tests, together.

And yes, this is genuinely faster. But look at what happened: the part we spent decades trying to perfect just became the small, cheap block. Once the middle is cheap and quick, the quality of the whole thing gets decided almost entirely at the two ends.

## Why the Ends Get Bigger

This is not wasted time and it is not red tape. It took me a while to really get this, but this is where the engineering quietly went.

**Getting the problem right matters more** because a fast agent aimed at a fuzzy problem just builds the wrong thing, faster. The clearer you are up front, the more you get back — and that only becomes more true as the building gets cheaper.

**Checking the work matters more** because now you are reading way more generated code than you would ever have written by hand. Like I said earlier in this series, the bottleneck moves to the person who has to say "yes, this is actually right." The diagram is just that same idea, drawn as boxes.

## What This Means for the Job

If this is really the shape of things, then "getting faster at coding" is polishing the block that is on its way out. The skills that actually add up are the ones at the edges: framing a problem clearly, writing it down well enough that an agent can run with it, and being able to check work you did not type yourself.

None of this means engineering matters less. It just moved. The work did not shrink — it slid over to the parts that were always the hardest to hand off, because they were never really about the code.

---