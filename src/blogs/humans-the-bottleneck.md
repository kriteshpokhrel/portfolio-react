---
title: "Part 2 · Are Humans the Bottleneck Now?"
date: "2026-06-15"
excerpt: "Once AI can generate code faster than we can review it, the constraint moves. Humans, the rate-limiters of this code overload, might soon become the bottleneck — and that changes what we need to adapt."
coverImage: "/covers/humans-the-bottleneck.svg"
---
***

*Part 2 of **AI, As I See It**, a personal series on what AI agents are really changing about how we build software — and what they aren't.*

> If writing code was never the real constraint, then making it faster just moves the pressure somewhere else. This post is about where it lands.

## The Bottleneck Doesn't Disappear

There is a principle from the Theory of Constraints that has stuck with me: in any system, there is always a constraint. You never remove a bottleneck, you only relocate it. Speed up one stage and the pressure simply reappears at the next slowest one.

That is exactly what I see happening with AI. Because it collapses the marginal cost of writing code, the constraint shifts away from generation and onto review, integration and validation.

So if writing code was the constraint (and I do not think it ever really was) and AI removes it, the pressure lands on the humans around the code. The rate-limiters of this overload become the reviewers, the architects, the people holding the shared mental model of the system.

Reviews get rushed, patterns that would have been caught get missed. Architectural drift accumulates across dozens of pull requests, and the collective mental model the team builds over time, the shared sense of why things are the way they are, never fully forms.

There is early evidence this is already happening. Teams that lean heavily on these tools report far more pull requests merged, but review times climbing just as sharply. In one controlled study, experienced developers were actually slower with AI tools, even as they reported feeling faster. The work did not disappear when generation got cheap. It moved downstream, onto the people who have to understand it.

So the real question, honestly, is whether we can solve for the human part at all. Can we 10X code review, the building of requirements, the work of testing how one change ripples through a whole system, the way we managed to 10X the writing? Some of it, maybe. But judgment, taste, and the slow accumulation of context were never things you could simply run faster.

And if we cannot, what happens? Either humans stay the constraint and all that generated speed piles up behind them, going nowhere, or we stop insisting a person sits in the loop at all, and we find out what that review was really protecting.

Or maybe the premise is wrong, and it took me a while to sit with this one. Maybe we were never the bottleneck, only the last one that was easy to see. Solve for us, and the pressure moves again, to something we have not thought of yet.

---
