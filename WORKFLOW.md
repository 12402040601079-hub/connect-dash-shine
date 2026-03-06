# MicroLink Workflow

## Product Intent
Location is not decoration in MicroLink.

Location powers three strategic outcomes:
1. Matching
2. Notifications
3. Decision making

Current direction: optimize the system for helper-side decision speed.

## Core Lifecycle
All jobs still follow:
`open -> accepted -> in_progress -> completion_requested -> completed`

## User Workflow
1. Sign up/sign in as `User`.
2. Open `Post Task`.
3. Enter task details:
   - Title
   - Category (`General`, `Repair`, `Tutoring`, `Delivery`, `Tech`, `Pet Care`, `Cleaning`, `Cooking`, `Other`)
   - If `Other`, enter `Please specify`
   - Location
   - Date/Time
   - Description
4. Optional: use `Use my location` for better distance accuracy.
5. Publish task.
6. Review bids in `Dashboard -> Bids`.
7. Accept/reject/counter.
8. Track in `Orders`, complete payment, confirm completion, and rate helper.

## Helper Workflow (Distance-First)
1. Sign up/sign in as `Helper`.
2. Set helper skill set during onboarding.
3. Open `Requests`.
4. See only open tasks relevant to helper skills.
5. Prioritize tasks by distance cues:
   - within `2 km`
   - within `5 km`
   - within `10 km`
6. Open task card and bid/counter/reject.
7. Complete task lifecycle in `Orders`.

## Map Strategy
### Where maps should be strong
- Helper task discovery (map pins for nearby open tasks)
- Radius-driven job awareness and dispatch

### Where maps are lower value
- Generic chat location display
- Browsing own posted tasks without a distance decision

## Smart Radius Notification Strategy
When a task is posted:

```txt
task_location = coordinates

if distance(helper, task) < 5km
  notify(helper)
```

Notification example:
`New tutoring task 1.8 km away.`

This should make the system feel real-time and alive.

## Distance as a Decision Variable
Even without a full map screen, every helper card should expose distance clearly.

Task card pattern:

```txt
Math Tutoring
📍 1.4 km away
⭐ INR 300
```

Why this matters: helpers can mentally filter in seconds.

## Matching Model
Helper ranking continues to combine:
- Skill relevance
- Distance
- Rating
- Availability

Recommended helpers are stored on task creation for downstream discovery/notification use.

## Bidding and Negotiation
1. Helper places bid.
2. User accepts/rejects/counters.
3. Helper counters if needed.
4. Counter offers remain anchored to the same task/bid context.
5. Accepting one bid rejects remaining bids on that task.

## Signup and Role Rules
- `User` onboarding:
  - Personal details only.
  - No skill/interest picking.
- `Helper` onboarding:
  - Personal details.
  - Skills/services are mandatory.

## Implementation Notes for Next Iteration
1. Add helper `Requests` map view with task pins grouped by proximity bands (2/5/10 km).
2. Add server-side or Cloud Function radius notification trigger.
3. Keep distance badges on all helper-facing task cards.
4. Avoid map-heavy UI in screens where distance does not change action.
