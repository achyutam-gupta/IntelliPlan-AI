# IntelliPlan AI: Database Schema (PostgreSQL)

## 1. Core Entities

### Users
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique identifier |
| `email` | String (Unique) | User email |
| `password_hash` | String | Hashed password |
| `full_name` | String | User's name |
| `created_at` | Timestamp | Creation date |

### Projects
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique identifier |
| `user_id` | UUID (FK) | Owner |
| `name` | String | Project name |
| `description` | Text | Project context |
| `created_at` | Timestamp | Creation date |

### Connections
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique identifier |
| `project_id` | UUID (FK) | Associated project |
| `type` | Enum | 'Jira', 'ADO', 'LLM' |
| `config` | JSONB | Credentials and endpoints (encrypted) |
| `status` | String | 'Connected', 'Failed' |

### Requirements
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique identifier |
| `project_id` | UUID (FK) | Associated project |
| `external_id` | String | Jira Issue Key, etc. |
| `title` | String | Title |
| `description` | Text | Raw requirement text |
| `risk_level` | Enum | 'Low', 'Medium', 'High' |
| `ai_scenarios` | JSONB | AI-generated scenarios |

### TestPlans
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique identifier |
| `project_id` | UUID (FK) | Associated project |
| `title` | String | Plan title |
| `content` | JSONB | Scoped objectives, strategy, etc. |
| `status` | Enum | 'Draft', 'Approved' |

### TestCases
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique identifier |
| `requirement_id`| UUID (FK) | Linked requirement |
| `title` | String | Case title |
| `steps` | JSONB | List of steps |
| `automation_code`| Text | Playwright/Selenium script |
| `is_automated` | Boolean | |

### ExecutionRuns
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique identifier |
| `project_id` | UUID (FK) | |
| `status` | Enum | 'Pending', 'Running', 'Passed', 'Failed' |
| `results` | JSONB | Detailed step results |
| `logs` | Text | Console stderr/stdout |
| `started_at` | Timestamp | |
| `completed_at` | Timestamp | |
