import { GenerationResponse } from '../lib/types';

export const DEMO_PRD = `Users should be able to manage their notification preferences — choose which notifications they receive (email, push, in-app), set quiet hours, and opt out of marketing communications.`;

export const DEMO_OUTPUT: GenerationResponse = {
  stories: [
    {
      id: "US-001",
      title: "Set notification channel preferences",
      description: "As a user, I want to choose which channels I receive notifications on (email, push, in-app) so that I only get notified where I want.",
      acceptanceCriteria: {
        functional: [
          "User can toggle email, push, and in-app notifications independently",
          "Preferences persist across sessions and devices",
          "Changes take effect within 30 seconds — no app restart needed"
        ],
        accessibility: [
          "All toggles have ARIA labels and are keyboard accessible",
          "State changes announced to screen readers"
        ],
        performance: [
          "Preferences page loads within 1 second"
        ],
        errorHandling: [
          "Network failure shows retry option — unsaved changes are not lost",
          "Conflicting updates from multiple devices resolved with last-write-wins"
        ]
      },
      storyPoints: 3,
      epic: "Notification Preferences",
      flags: [],
      techNotes: "Store preferences server-side with user profile. Optimistic UI update with rollback on failure."
    },
    {
      id: "US-002",
      title: "Configure quiet hours",
      description: "As a user, I want to set quiet hours so that I'm not disturbed by notifications during specific times.",
      acceptanceCriteria: {
        functional: [
          "User sets start and end time for quiet hours",
          "Notifications are queued during quiet hours and delivered after",
          "Supports user's local timezone — handles DST transitions"
        ],
        accessibility: [
          "Time picker is keyboard navigable and screen-reader compatible"
        ],
        performance: [
          "Quiet hours check adds < 50ms latency to notification delivery"
        ],
        errorHandling: [
          "Invalid time range (start after end) shows clear inline error",
          "If timezone detection fails, prompt user to select manually"
        ]
      },
      storyPoints: 5,
      epic: "Notification Preferences",
      flags: ["Timezone handling adds complexity"],
      techNotes: "Evaluate server-side vs client-side timezone resolution. Store as UTC offsets."
    }
  ],
  summary: {
    totalStories: 2,
    totalPoints: 8,
    epics: ["Notification Preferences"]
  }
};
