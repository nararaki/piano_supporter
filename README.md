# Piano Supporter

A web application designed to bridge the gap between piano teachers and students, enabling effective remote lesson feedback and practice management.

## The Problem

Traditional piano education faces several challenges:

1. **Limited Lesson Time**: Teachers can only provide feedback during scheduled lessons, leaving students without guidance during practice sessions.

2. **Feedback Without Context**: When students practice at home, teachers cannot see exactly where mistakes occur or how students interpret the music.

3. **Inefficient Communication**: Students often forget teacher feedback, and there's no structured way to track progress on specific sections of a piece.

4. **Disconnected Practice**: Students practice in isolation without clear goals or the ability to share their progress easily.

## The Solution

Piano Supporter creates a collaborative environment where:

### For Students
- **Post Performance Videos**: Record and upload practice sessions with the associated sheet music
- **Receive Targeted Feedback**: View teacher comments linked to specific measures and timestamps
- **Track Practice Tasks**: Follow structured practice assignments with clear objectives
- **Join Schools**: Connect with teachers and peers through school communities

### For Teachers
- **Review Performances Anytime**: Watch student videos and provide feedback on your schedule
- **Annotate with Precision**: Add comments tied to specific measure numbers and video timestamps
- **Create Practice Tasks**: Assign focused practice goals for specific sections
- **Manage Multiple Students**: Organize and track all students within your school

## Key Features

| Feature | Description |
|---------|-------------|
| Performance Posts | Students upload videos paired with sheet music (MusicXML) |
| Measure-Linked Annotations | Teachers comment on exact locations in the score |
| Time-Synced Feedback | Comments linked to specific moments in performance videos |
| Practice Tasks | Structured assignments targeting specific musical sections |
| School Management | Teachers create schools, students join via share codes |
| Sheet Music Display | Interactive score viewing with OpenSheetMusicDisplay |

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Radix UI
- **Backend**: Hono, Node.js, Drizzle ORM
- **Database**: MySQL
- **Storage**: Cloudinary (video), AWS S3 (files)
- **Authentication**: Clerk

## Project Structure

```
piano_support/
├── apps/
│   ├── client/     # Next.js frontend
│   └── server/     # Hono API server
├── packages/
│   └── common/     # Shared types and utilities
└── docker-compose.yaml
```

## Getting Started

### Prerequisites
- Node.js
- Docker & Docker Compose
- Cloudinary account
- AWS S3 bucket
- Clerk account

### Development

```bash
# Start database
docker-compose up -d

# Install dependencies
npm install

# Run development servers
npm run dev
```

## License

This project is private and proprietary.
