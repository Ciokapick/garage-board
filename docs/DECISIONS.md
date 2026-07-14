# GarageBoard — implementation decisions

## Why a workflow dashboard

The project is meant to demonstrate more than static Vue components. A workshop gives the UI a small but credible domain: work has stages, dates matter, staff assignment changes, and the overview can derive meaningful numbers from the same source of truth.

## State boundaries

`useWorkshopStore` owns the order collection and the operations that change it. Components do not assign status strings directly; they ask the store to move a job through the known pipeline. This keeps stage ordering and progress mapping in one place.

Customer and report records remain realistic seed data because this front-end demonstration has no database. The reports screen labels that limitation in the interface and README.

## Persistence

Work-order changes use a versioned local-storage key. Parsing is guarded and falls back to fresh seed data when stored data is unavailable or invalid. A visible reset action makes the demonstration repeatable.

## Accessibility

- Native buttons, links, labels, form fields and fieldsets preserve keyboard behaviour.
- Dialogs expose names and modal semantics; scrims can close them without removing explicit close buttons.
- Status is communicated through text and colour, never colour alone.
- Focus-visible styles remain clear on light and dark surfaces.
- Reduced-motion preferences shorten transitions.
- Responsive table layouts preserve the most decision-relevant fields on small screens.

## Honest demo boundaries

The application does not simulate a login, server sync or fake API latency. If a control is visible, it performs an action: global search routes to filtered work orders, stage controls update state, the intake persists a new job, and report export downloads a CSV.
