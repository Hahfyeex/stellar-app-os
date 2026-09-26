# Tree Analytics and Lifecycle Webhooks

This document describes the backend interfaces added for tree survival analytics and partner notifications.

## Tree survival analytics

The admin dashboard reads:

```text
GET /api/admin/analytics/tree-survival
```

The endpoint requires the normal `farmcredit_role=admin` session cookie and returns independent groupings by:

- `species`
- `region`
- `planter_team`

Optional query parameters:

| Parameter | Description |
| --- | --- |
| `from` | Inclusive ISO-8601 lower bound on tree creation time |
| `to` | Inclusive ISO-8601 upper bound on tree creation time |
| `species` | Filter by the species common name or slug |
| `region` | Filter by planting region |
| `planterTeam` | Filter by the resolved planter-team label |

Each result row contains lifecycle counts, `survivalRatePct`, `totalCostXlm`, `costPerTreeXlm`, `sponsorCount`, `retainedSponsorCount`, and `sponsorRetentionRatePct`.

The metrics are sourced from `trees`, `species_catalogue`, `planter_teams`, `planter_team_members`, and `sponsorship_events`. In the persisted tree status vocabulary, `completed` is reported as **grown** and `failed` is reported as **died**. A tree's survival rate is the percentage not in the failed state.

The planter-team dimension is populated by adding a team and membership through the `planter_teams` and `planter_team_members` tables introduced in migration `021_analytics_and_lifecycle_webhooks.sql`.

## Lifecycle webhooks

Partners register a signed callback through:

```text
POST /api/webhooks/subscriptions
Content-Type: application/json

{
  "planterId": 42,
  "url": "https://partner.example.com/tree-events",
  "eventTypes": ["tree.planted", "tree.verified", "tree.grown", "tree.died"]
}
```

The response includes a per-subscription signing secret. Store it securely; it is returned only when the subscription is created.

Supported lifecycle event types:

| Event | Source status | Meaning |
| --- | --- | --- |
| `tree.planted` | `planted` | Planting has been recorded |
| `tree.verified` | `verified` | Verification has been approved |
| `tree.grown` | `completed` | The tree reached the completed/grown state |
| `tree.died` | `failed` | The tree entered the failed/dead state |

Each delivery is a JSON envelope with a stable event ID:

```json
{
  "id": "event-uuid",
  "type": "tree.verified",
  "createdAt": "2026-09-26T13:00:00.000Z",
  "data": {
    "treeId": 42,
    "treeRef": "HRV-2026-0042",
    "previousStatus": "planted",
    "newStatus": "verified",
    "occurredAt": "2026-09-26T13:00:00.000Z"
  }
}
```

The dispatcher sends the signed payload with `X-Webhook-Id` and `X-Webhook-Signature` headers. Verify the signature against the exact raw request body before parsing JSON, and use `X-Webhook-Id` for idempotent processing.

Failed deliveries are persisted in `webhook_deliveries`, retried with exponential backoff, and can be processed by the protected webhook processor:

```text
POST /api/webhooks/process
Authorization: Bearer <WEBHOOK_CRON_SECRET>
```

A single delivery can also be retried through `/api/webhooks/retry` using its numeric `deliveryId`.
