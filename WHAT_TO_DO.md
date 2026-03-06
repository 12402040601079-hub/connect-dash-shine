# MicroLink Hackathon What-To-Do Plan

This file is the execution plan to finish the platform workflow fast.
It includes:
- exact Firestore schema
- exact files to create/update
- strict coding order (to avoid rework)

## 1) Target Outcome (Judge-Friendly)

Complete this end-to-end lifecycle:
`Post Task -> Smart Match -> Helper Accept -> Chat -> Complete -> Rate -> Reputation`

Support 3 roles:
- Requester
- Helper
- Both

Enable Super Admin controls:
- user moderation
- task moderation
- dispute/report handling
- analytics snapshots

## 2) Firestore Schema (Exact)

## 2.1 Collections

### `profiles/{uid}`
Use existing profile doc and extend fields.

```ts
{
  name: string,
  email: string,
  phone: string,
  age: string,
  gender: string,
  address: string,
  bio: string,
  interests: string[],
  role: "requester" | "helper" | "both",
  joinedDate: string,
  joinedFull: string,

  // New
  location: {
    city: string,
    lat: number,
    lng: number,
    geohash?: string
  },
  helperMeta?: {
    skills: string[],
    availability: {
      weekdays: string[],
      startHour: number,
      endHour: number,
      timezone: string
    },
    experienceYears: number,
    verified: boolean,
    isSuspended: boolean
  },
  stats: {
    completedCount: number,
    ratingAvg: number,
    ratingCount: number
  },
  updatedAt: Timestamp
}
```

### `tasks/{taskId}`

```ts
{
  title: string,
  description: string,
  category: "Tutoring" | "Cleaning" | "Repair" | "Grocery Help" | "Digital Help" | string,
  location: {
    address: string,
    city: string,
    lat: number,
    lng: number,
    geohash?: string
  },
  schedule: {
    date: string,    // ISO date
    time: string     // HH:mm
  },
  paymentOptional: number | null,

  posterId: string,
  posterName: string,
  acceptedBy: string | null,
  acceptedBidId: string | null,

  status: "open" | "accepted" | "in_progress" | "completion_requested" | "completed" | "closed" | "cancelled",
  recommendedHelpers: string[],

  createdAt: Timestamp,
  updatedAt: Timestamp,
  completedAt?: Timestamp
}
```

### `bids/{bidId}`
Use deterministic id format: `${taskId}_${helperId}`

```ts
{
  taskId: string,
  helperId: string,
  helperName: string,
  posterId: string,
  amount: number,
  note: string,
  status: "pending" | "accepted" | "rejected" | "withdrawn",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `conversations/{conversationId}` and `conversations/{conversationId}/messages/{messageId}`
Keep current shape.

### `ratings/{ratingId}`
`ratingId` format: `${taskId}_${fromUserId}_${toUserId}`

```ts
{
  taskId: string,
  fromUserId: string,
  toUserId: string,
  stars: number, // 1..5
  review: string,
  createdAt: Timestamp
}
```

### `notifications/{notificationId}`

```ts
{
  userId: string,
  type: "bid_received" | "bid_accepted" | "task_accepted" | "completion_requested" | "task_completed" | "rating_received" | "admin_alert",
  title: string,
  body: string,
  ref: {
    taskId?: string,
    bidId?: string,
    conversationId?: string
  },
  read: boolean,
  createdAt: Timestamp
}
```

### `reports/{reportId}`

```ts
{
  reporterId: string,
  againstUserId?: string,
  taskId?: string,
  reason: string,
  details: string,
  status: "open" | "investigating" | "resolved" | "dismissed",
  actionTaken?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `admin_actions/{actionId}`

```ts
{
  adminId: string,
  type: "suspend_user" | "unsuspend_user" | "remove_task" | "verify_helper" | "resolve_report",
  target: {
    userId?: string,
    taskId?: string,
    reportId?: string
  },
  note: string,
  createdAt: Timestamp
}
```

## 2.2 Required Indexes (`firestore.indexes.json`)

Add indexes for:
- `tasks`: `status ASC, createdAt DESC`
- `tasks`: `posterId ASC, createdAt DESC`
- `tasks`: `acceptedBy ASC, updatedAt DESC`
- `bids`: `taskId ASC, createdAt DESC`
- `bids`: `helperId ASC, createdAt DESC`
- `notifications`: `userId ASC, read ASC, createdAt DESC`
- `ratings`: `toUserId ASC, createdAt DESC`
- `reports`: `status ASC, createdAt DESC`

## 2.3 Rules Update (`firestore.rules`)

Implement these constraints:
- only task poster can accept/reject bids on their task
- helper can create/update only own bid
- task status transitions allowed only by valid actor:
  - `open -> accepted` by poster
  - `accepted/in_progress -> completion_requested` by accepted helper
  - `completion_requested -> completed` by poster
- only participants can read conversation/messages
- only requester can rate helper for completed task
- users can read/write only their notifications
- admin-only writes for moderation collections

## 3) File-by-File Implementation Plan

## 3.1 New Files

1. `src/lib/firestoreSchema.ts`
- central types for `TaskDoc`, `BidDoc`, `ProfileDoc`, `RatingDoc`, `NotificationDoc`, `ReportDoc`

2. `src/lib/taskStatus.ts`
- enum/constants + transition guards
- helper methods: `canAccept`, `canRequestCompletion`, `canConfirmCompletion`

3. `src/lib/matching.ts`
- smart scoring function:
  - skills match weight
  - distance weight
  - rating weight
  - availability weight
- `rankHelpersForTask(task, helpers)`

4. `src/services/tasks.ts`
- CRUD/query wrappers:
  - `createTask`
  - `getOpenTasks`
  - `getMyPostedTasks`
  - `acceptBid`
  - `requestCompletion`
  - `confirmCompletion`

5. `src/services/bids.ts`
- `placeBid`, `getTaskBids`, `acceptBid`, `rejectOtherBids`

6. `src/services/ratings.ts`
- `submitRating`
- `getRatingsForHelper`
- transaction to update helper aggregate `stats.ratingAvg/ratingCount`

7. `src/services/notifications.ts`
- `notify(userId, payload)`
- `getMyNotifications`
- `markNotificationRead`

8. `src/services/admin.ts`
- `suspendUser`, `verifyHelper`, `removeTask`, `resolveReport`

9. `src/components/workflow/TaskCard.tsx`
- reusable task card with role-aware actions

10. `src/components/workflow/BidList.tsx`
- requester view: accept/reject buttons

11. `src/components/workflow/CompletionPanel.tsx`
- helper request completion + requester confirm completion

12. `src/components/workflow/RatingDialog.tsx`
- 1-5 stars + review submit

13. `src/components/workflow/NotificationsPanel.tsx`
- list unread/read and quick nav actions

14. `src/components/workflow/RecommendedHelpers.tsx`
- helper suggestions for requester task

15. `src/components/workflow/RecommendedTasks.tsx`
- tasks ranked for helper dashboard

16. `src/pages/super-admin/Moderation.tsx`
- unified moderation table (users/tasks/reports)

17. `src/pages/super-admin/TrustSafety.tsx`
- verification, abuse flags, quick actions

18. `src/test/workflow/task-status.test.ts`
- unit tests for state transitions

19. `src/test/workflow/matching.test.ts`
- tests for ranking logic

## 3.2 Existing Files To Update

1. `src/components/MicroLink.tsx`
- split giant component logic progressively into service calls + workflow components
- add role `both`
- add requester accept/reject bid actions
- add completion request/confirmation actions
- wire rating dialog after completion
- wire notifications badge + panel
- fix posted task list to use Firestore query instead of orphan local state

2. `src/contexts/AuthContext.tsx`
- allow role values: `requester|helper|both`
- include helper profile metadata updates

3. `src/data/types.ts`
- align with Firestore schema types

4. `src/pages/super-admin/index.tsx`
- add routes/views for `Moderation`, `TrustSafety`
- remove dead sidebar entries that have no screens

5. `src/pages/super-admin/Users.tsx`
- replace mock rows with Firestore data
- wire suspend/verify actions

6. `src/pages/super-admin/Jobs.tsx`
- replace placeholder with real tasks table + remove/freeze actions

7. `src/pages/super-admin/Reports.tsx`
- replace placeholder with real reports list + resolve actions

8. `src/pages/super-admin/Analytics.tsx`
- derive metrics from Firestore snapshots or aggregate docs

9. `firestore.rules`
- enforce actor-based transitions and admin controls

10. `README.md`
- add architecture + runbook + judge demo flow

11. `tailwind.config.ts`
- fix lint error (`require()` import issue)

12. `src/components/ui/command.tsx`
- fix empty interface lint error

13. `src/components/ui/textarea.tsx`
- fix empty interface lint error

## 4) Strict Order of Coding (Fastest Path)

## Phase A - Foundation (must do first)
1. Add schema/types:
- `src/lib/firestoreSchema.ts`
- update `src/data/types.ts`

2. Add status guards + tests:
- `src/lib/taskStatus.ts`
- `src/test/workflow/task-status.test.ts`

3. Add service layer:
- `src/services/tasks.ts`
- `src/services/bids.ts`
- `src/services/notifications.ts`
- `src/services/ratings.ts`

## Phase B - Core Workflow (MVP demo path)
4. Update requester flow in `src/components/MicroLink.tsx`:
- post task with date/time
- view bids on own tasks
- accept one bid

5. Update helper flow in `src/components/MicroLink.tsx`:
- recommended tasks
- place bid
- accepted task panel
- request completion

6. Completion + rating:
- `CompletionPanel.tsx`
- `RatingDialog.tsx`
- helper reputation aggregate update

7. Notifications:
- `NotificationsPanel.tsx`
- create events on bid placed, bid accepted, completion requested/completed, rating received

## Phase C - Smart Match + Admin
8. Implement ranking logic:
- `src/lib/matching.ts`
- `RecommendedHelpers.tsx`
- `RecommendedTasks.tsx`

9. Wire super admin real data:
- `Users.tsx`, `Jobs.tsx`, `Reports.tsx`, `Analytics.tsx`
- create `Moderation.tsx`, `TrustSafety.tsx`

10. Finalize rules + indexes:
- `firestore.rules`
- `firestore.indexes.json`

## Phase D - Quality + Demo Readiness
11. Resolve lint blockers:
- `tailwind.config.ts`
- `src/components/ui/command.tsx`
- `src/components/ui/textarea.tsx`
- reduce major `any` usage in `MicroLink.tsx`

12. Demo script and README polish.

## 5) Done Criteria Checklist

Requester flow done when:
- can post with title/desc/category/location/date/time/payment
- can view incoming bids
- can accept one helper
- can chat with accepted helper
- can confirm completion
- can submit 1-5 rating + review

Helper flow done when:
- has profile with skills/availability/experience/location
- sees recommended tasks
- can place bids
- can see accepted tasks
- can request completion
- receives rating and updated reputation

Admin flow done when:
- real user list from Firestore
- suspend/verify helper actions work
- real task moderation works
- reports list and resolve action works
- analytics reflects live/aggregate data

## 6) Hackathon Demo Script (2-3 min)

1. Sign up as requester and post a task.
2. Sign in as helper and place bid from recommended list.
3. Switch requester and accept bid.
4. Open chat and exchange one message.
5. Helper requests completion.
6. Requester confirms completion and rates helper.
7. Show helper rating changed.
8. Show admin panel moderating users/tasks/reports.

## 7) Time Split Suggestion (if ~12-16 hours left)

- 3h: schema + services + rules draft
- 4h: requester/helper acceptance + completion flow
- 2h: rating + notification
- 3h: admin wiring
- 2h: lint fixes + demo polish

---
Owner note: prioritize lifecycle correctness over UI polish. Judges reward complete flow + trust controls more than visual complexity.
