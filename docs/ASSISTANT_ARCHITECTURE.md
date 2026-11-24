# Assistant Architecture — PoC-25
- **Integration**: Collapsible `AssistantPanel` inside `/data-intelligence` (`app/data-intelligence/page.tsx`) + `POST /api/assistant/query` (`app/api/assistant/query/route.ts`) + `/assistant/` deterministic Python config/core/queries.
- **Pipeline**: `Question -> Length & Safety Check -> Scope Guard -> Intent Classifier -> Parameter Validator -> Contract Version Gate (1.0.1 / 1.0.0) -> Deterministic Retrieval -> Evidence Builder -> Response Composer -> Output Validator`.
