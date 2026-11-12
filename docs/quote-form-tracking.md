# Quote form tracking

The shared `GetQuoteForm` starts with a required move-type choice. Selecting a card highlights it; the user then clicks **Continue to details** to see the existing address and contact fields. The Continue button is disabled until a move type is selected. Returning to the first step preserves the selected move type and entered details. Changing the choice updates `move_size` on the eventual submission.

All move types use the original GTM event name, `quote_form_submission`, with a top-level `move_size` variable:

| Choice | `move_size` value | Existing `moveType` value |
| --- | --- | --- |
| Single Item | `single_item` | `single_item` |
| House Move | `full_house` | `house` |
| Office Move | `office` | `office` |

An event is pushed to `window.dataLayer` only after both `/api/movermate` and `/api/sendmail` report success. Selecting an option, navigating between steps, validation errors, and failed requests do not emit submission events. Submission controls are locked while requests are pending and until the successful redirect.

The event retains the existing `formName: "Moving Quote"`, `moveType`, and `formData` tracking fields. The move-type label is also included in the email message and MoverMate note.

The separate contact and long-distance route forms also use `quote_form_submission`. They send `move_size: null` because they do not use this move-category selector; clearing it prevents GTM from reusing a previous quote's size during client-side navigation.

## Google Tag Manager setup

1. Use a Custom Event trigger with the event name `quote_form_submission`.
2. Create a Data Layer Variable with the Data Layer Variable Name `move_size` (version 2).
3. Use that variable as an event parameter or filter triggers by `single_item`, `full_house`, or `office` when different conversion tags are needed.

If move-specific event triggers were configured for the earlier implementation, replace them with `quote_form_submission` plus the appropriate `move_size` condition. The shared form emits only one submission event.

Use GTM Preview to confirm the latest selected `move_size` appears on each successful submission and the intended conversion tag fires once. Confirm selection, Continue, back navigation, and failed submissions do not fire those tags. Container configuration and publishing are separate from this website code change.
