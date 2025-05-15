# Database Documentation

This document provides detailed information about the database schema and operations in the Groq Prompt Generator application.

## Database Provider

The application uses Supabase, which is built on PostgreSQL, as the database provider.

## Schema

### Tables

#### profiles

Stores user profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, matches auth.users.id |
| email | VARCHAR | User's email address |
| full_name | VARCHAR | User's full name (nullable) |
| avatar_url | VARCHAR | URL to user's avatar image (nullable) |
| created_at | TIMESTAMP | When the profile was created |
| updated_at | TIMESTAMP | When the profile was last updated |

**Indexes**:
- Primary Key: `id`
- Unique: `email`

**Foreign Keys**:
- `id` references `auth.users.id` (managed by Supabase Auth)

#### projects

Stores project information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Project name |
| description | VARCHAR | Project description (nullable) |
| user_id | UUID | ID of the project owner |
| created_at | TIMESTAMP | When the project was created |
| updated_at | TIMESTAMP | When the project was last updated |

**Indexes**:
- Primary Key: `id`
- Index: `user_id`

**Foreign Keys**:
- `user_id` references `profiles.id`

#### prompts

Stores generated prompts.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| topic | VARCHAR | Prompt topic |
| prompt_type | VARCHAR | Type of prompt (writing, coding, etc.) |
| tone | VARCHAR | Tone of the prompt (professional, casual, etc.) |
| length | INTEGER | Relative length of the prompt |
| additional_context | VARCHAR | Additional context for the prompt (nullable) |
| model | VARCHAR | AI model used for generation |
| generated_prompt | VARCHAR | The generated prompt text |
| user_id | UUID | ID of the user who generated the prompt |
| project_id | UUID | ID of the associated project (nullable) |
| created_at | TIMESTAMP | When the prompt was generated |

**Indexes**:
- Primary Key: `id`
- Index: `user_id`
- Index: `project_id`

**Foreign Keys**:
- `user_id` references `profiles.id`
- `project_id` references `projects.id`

#### code_generations

Stores generated code.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| description | VARCHAR | Description of what to generate |
| language | VARCHAR | Programming language |
| framework | VARCHAR | Framework or library |
| model | VARCHAR | AI model used for generation |
| additional_context | VARCHAR | Additional context (nullable) |
| generated_code | VARCHAR | The generated code |
| user_id | UUID | ID of the user who generated the code |
| project_id | UUID | ID of the associated project (nullable) |
| created_at | TIMESTAMP | When the code was generated |

**Indexes**:
- Primary Key: `id`
- Index: `user_id`
- Index: `project_id`

**Foreign Keys**:
- `user_id` references `profiles.id`
- `project_id` references `projects.id`

#### code_reviews

Stores code reviews.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| code | VARCHAR | The code that was reviewed |
| language | VARCHAR | Programming language |
| review_type | VARCHAR | Type of review (general, security, etc.) |
| model | VARCHAR | AI model used for the review |
| review_result | VARCHAR | The review feedback |
| user_id | UUID | ID of the user who requested the review |
| project_id | UUID | ID of the associated project (nullable) |
| created_at | TIMESTAMP | When the review was performed |

**Indexes**:
- Primary Key: `id`
- Index: `user_id`
- Index: `project_id`

**Foreign Keys**:
- `user_id` references `profiles.id`
- `project_id` references `projects.id`

#### tests

Stores generated tests.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| code | VARCHAR | The code for which tests were generated |
| language | VARCHAR | Programming language |
| framework | VARCHAR | Testing framework |
| test_types | VARCHAR[] | Types of tests generated |
| coverage | VARCHAR | Desired test coverage level |
| model | VARCHAR | AI model used for generation |
| additional_context | VARCHAR | Additional context (nullable) |
| generated_tests | VARCHAR | The generated test code |
| user_id | UUID | ID of the user who generated the tests |
| project_id | UUID | ID of the associated project (nullable) |
| created_at | TIMESTAMP | When the tests were generated |

**Indexes**:
- Primary Key: `id`
- Index: `user_id`
- Index: `project_id`

**Foreign Keys**:
- `user_id` references `profiles.id`
- `project_id` references `projects.id`

#### activity_logs

Stores user activity logs.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | ID of the user who performed the activity |
| project_id | UUID | ID of the associated project (nullable) |
| activity_type | VARCHAR | Type of activity |
| description | VARCHAR | Description of the activity |
| metadata | JSONB | Additional metadata about the activity |
| created_at | TIMESTAMP | When the activity occurred |

**Indexes**:
- Primary Key: `id`
- Index: `user_id`
- Index: `project_id`
- Index: `activity_type`
- Index: `created_at`

**Foreign Keys**:
- `user_id` references `profiles.id`
- `project_id` references `projects.id`

## Relationships

### One-to-Many Relationships

- One user can have many projects
- One user can have many prompts
- One user can have many code generations
- One user can have many code reviews
- One user can have many tests
- One user can have many activity logs
- One project can have many prompts
- One project can have many code generations
- One project can have many code reviews
- One project can have many tests
- One project can have many activity logs

## Database Operations

### Creating a New User Profile

When a user signs up, a new profile is automatically created in the `profiles` table:

\`\`\`sql
INSERT INTO profiles (id, email, full_name, created_at, updated_at)
VALUES (auth.uid(), :email, :full_name, now(), now());
\`\`\`

### Creating a New Project

\`\`\`sql
INSERT INTO projects (id, name, description, user_id, created_at, updated_at)
VALUES (uuid_generate_v4(), :name, :description, :user_id, now(), now());
\`\`\`

### Saving a Generated Prompt

\`\`\`sql
INSERT INTO prompts (
  id, topic, prompt_type, tone, length, additional_context, 
  model, generated_prompt, user_id, project_id, created_at
)
VALUES (
  uuid_generate_v4(), :topic, :prompt_type, :tone, :length, :additional_context,
  :model, :generated_prompt, :user_id, :project_id, now()
);
\`\`\`

### Logging User Activity

\`\`\`sql
INSERT INTO activity_logs (
  id, user_id, project_id, activity_type, description, metadata, created_at
)
VALUES (
  uuid_generate_v4(), :user_id, :project_id, :activity_type, :description, :metadata, now()
);
\`\`\`

### Getting User's Recent Activity

\`\`\`sql
SELECT * FROM activity_logs
WHERE user_id = :user_id
ORDER BY created_at DESC
LIMIT 10;
\`\`\`

### Getting Project Resources

\`\`\`sql
-- Get prompts for a project
SELECT * FROM prompts
WHERE project_id = :project_id
ORDER BY created_at DESC;

-- Get code generations for a project
SELECT * FROM code_generations
WHERE project_id = :project_id
ORDER BY created_at DESC;

-- Get code reviews for a project
SELECT * FROM code_reviews
WHERE project_id = :project_id
ORDER BY created_at DESC;

-- Get tests for a project
SELECT * FROM tests
WHERE project_id = :project_id
ORDER BY created_at DESC;
\`\`\`

### Getting Resource Counts for a Project

\`\`\`sql
SELECT
  (SELECT COUNT(*) FROM prompts WHERE project_id = :project_id) AS prompt_count,
  (SELECT COUNT(*) FROM code_generations WHERE project_id = :project_id) AS code_generation_count,
  (SELECT COUNT(*) FROM code_reviews WHERE project_id = :project_id) AS code_review_count,
  (SELECT COUNT(*) FROM tests WHERE project_id = :project_id) AS test_count;
\`\`\`

## Database Migrations

Database migrations are managed using Supabase migrations. The migrations are stored in the `supabase/migrations` directory.

### Initial Migration

The initial migration creates all the tables and relationships:

\`\`\`sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR NOT NULL UNIQUE,
  full_name VARCHAR,
  avatar_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description VARCHAR,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic VARCHAR NOT NULL,
  prompt_type VARCHAR NOT NULL,
  tone VARCHAR NOT NULL,
  length INTEGER NOT NULL,
  additional_context VARCHAR,
  model VARCHAR NOT NULL,
  generated_prompt VARCHAR NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE code_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description VARCHAR NOT NULL,
  language VARCHAR NOT NULL,
  framework VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  additional_context VARCHAR,
  generated_code VARCHAR NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE code_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR NOT NULL,
  language VARCHAR NOT NULL,
  review_type VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  review_result VARCHAR NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR NOT NULL,
  language VARCHAR NOT NULL,
  framework VARCHAR NOT NULL,
  test_types VARCHAR[] NOT NULL,
  coverage VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  additional_context VARCHAR,
  generated_tests VARCHAR NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  activity_type VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX projects_user_id_idx ON projects(user_id);
CREATE INDEX prompts_user_id_idx ON prompts(user_id);
CREATE INDEX prompts_project_id_idx ON prompts(project_id);
CREATE INDEX code_generations_user_id_idx ON code_generations(user_id);
CREATE INDEX code_generations_project_id_idx ON code_generations(project_id);
CREATE INDEX code_reviews_user_id_idx ON code_reviews(user_id);
CREATE INDEX code_reviews_project_id_idx ON code_reviews(project_id);
CREATE INDEX tests_user_id_idx ON tests(user_id);
CREATE INDEX tests_project_id_idx ON tests(project_id);
CREATE INDEX activity_logs_user_id_idx ON activity_logs(user_id);
CREATE INDEX activity_logs_project_id_idx ON activity_logs(project_id);
CREATE INDEX activity_logs_activity_type_idx ON activity_logs(activity_type);
CREATE INDEX activity_logs_created_at_idx ON activity_logs(created_at);
\`\`\`

## Security

### Row-Level Security (RLS)

Row-Level Security policies are implemented to ensure users can only access their own data:

\`\`\`sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Similar policies for other tables
\`\`\`

## Backup and Recovery

Supabase provides automatic backups of the database. The backup schedule is:

- Daily backups: Retained for 7 days
- Weekly backups: Retained for 4 weeks
- Monthly backups: Retained for 6 months

To restore from a backup, use the Supabase dashboard or API.

## Performance Considerations

1. **Indexes**: Indexes are created on frequently queried columns to improve performance.
2. **Query Optimization**: Complex queries are optimized to minimize execution time.
3. **Connection Pooling**: Connection pooling is used to efficiently manage database connections.
4. **Pagination**: Results are paginated to limit the amount of data returned in a single query.
5. **Caching**: Frequently accessed data is cached to reduce database load.

## Monitoring and Maintenance

1. **Performance Monitoring**: Database performance is monitored using Supabase's built-in tools.
2. **Query Analysis**: Slow queries are identified and optimized.
3. **Regular Maintenance**: Regular maintenance tasks are performed to ensure optimal performance.
4. **Scaling**: The database is scaled as needed to handle increased load.

## Conclusion

This database schema provides a solid foundation for the Groq Prompt Generator application. It supports all the required features while maintaining data integrity, security, and performance.
