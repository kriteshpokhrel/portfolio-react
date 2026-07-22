---
title: "Part 6 · Why Collaborating Got Harder"
date: "2026-07-22"
excerpt: "We used to split a feature into small pieces and integrate as we went. With agents, each piece arrives bigger, faster, and with less shared context — and the work quietly shifts from writing code to reconciling large changes that were built in isolation."
coverImage: "/covers/putting-it-back-together.svg"
---
***

*Part 6 of **AI, As I See It**, a personal series on what AI agents are really changing about how we build software — and what they aren't.*

> The surprising thing, for me, was not that agents made coding faster. It was that they made *working together* harder. This post is about the part of the job that got quietly more difficult while everyone was celebrating the speed.

## We Used to Divide the Work

When I first learned to build software with a team, the trick was to cut a feature into small, ownable pieces. One person took the API, another the data model, another the interface. Each piece was small enough to hold in your head and small enough to review in one sitting, and it reached the main branch before it had time to drift far from everyone else's work. Integration was not some big event we braced for at the end. It happened continuously, in small steps, almost as a side effect of how we worked together.

Looking back, that rhythm was doing something quiet but important. Every small merge was a checkpoint where the whole team's picture of the system lined up again. You saw what other people were building as it arrived, piece by piece, instead of meeting all of it at once at the end.

## Now the Pieces Arrive Bigger, and Faster

Agents broke that rhythm for me, and honestly it took me a while to see it. When one developer with an agent can produce in an afternoon what used to take the team a week, the unit of work stops being small. The requirement that once spread across five people, each making a modest change, now goes to a single agent that hands all of it back at once.

So the volume you have to bring together is suddenly huge. It is not five small pull requests trickling into the main branch over a week — it is one large changeset, touching many files across several layers, landing in a single go. And large changes fight you when you try to integrate them.

The speed did not disappear. It moved downstream and turned into a pile.

## Context Doesn't Travel Well

There is a second, subtler force pushing changes to be big. Sharing context is hard — between people, and even more so between agents.

When I split a task across teammates, I still have to sit with each of them and explain the shape of the whole thing, then trust that the pieces will meet in the middle. When I split it across separate agent sessions, it is worse — each one starts cold, remembering nothing the others decided. So there is a strong pull in the other direction: just hand the *entire* feature to one agent, start to finish, because that is the only way to keep the context in one place and the pieces agreeing with each other.

It keeps the change coherent, yes, but it also makes it enormous. One agent, one session, one giant pull request that does everything. And a change built entirely on its own is exactly the kind that is hardest to follow and hardest to review. There is no story to walk through, only a large diff you have to reverse-engineer the intent from later.

## What Actually Helps

I do not think the answer is to slow the agents down. It is to rebuild, on purpose, the checkpoints we quietly lost — instead of hoping they will happen on their own.

**Keep changes small on purpose.** Cheap generation is not a reason to ship big. Ask the agent for the change in reviewable slices, merge them behind feature flags, and keep the main branch moving in small increments. The old discipline of small batches matters *more* now, not less, precisely because nothing enforces it automatically anymore.

**Make context a shared artifact, not a private session.** The reason a single agent gets handed everything is that context lives in its head and nowhere else. Write the context down — a spec, an interface definition, an ADR, the kind of `AGENTS.md` routing I described in Part 5 — so any person or any agent can pick up a piece without re-deriving the whole. Shared context is what lets you split work again.

**Define the contract before the code.** For anything crossing a module or repository boundary, agree on the interface first — the API shape, the schema, the types — and let each side be built against that fixed contract. This is what lets three separate changes meet in the middle instead of being reconciled at the end.

**Review the plan, not just the diff.** A thousand-line change is unreviewable as a diff but very reviewable as a plan. Have the agent produce its intended approach first, review *that*, and the final diff becomes a confirmation rather than an investigation.

## The Point

The bottleneck this series keeps chasing has moved again. First it went from writing code to reviewing it. Now, for a team, it goes from reviewing one change to integrating many large ones that were built without ever seeing each other.

Collaboration used to be mostly about dividing the work. With agents, dividing the work is the easy part — anyone can generate a large, coherent chunk on their own. The hard part, the human part, is putting it all back together.

---