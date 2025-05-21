# Trivia Database Backup System

This directory contains backups of the animal trivia questions database. These backups help ensure your data isn't lost when Replit pauses (after 6 days) or deletes (after 36 days) databases.

## Backup Commands

To create a backup of all your trivia questions:
```
npx tsx scripts/backupTriviaQuestions.ts
```

This will create a timestamped JSON file in this directory with all your questions.

## Restore Commands

To restore from the most recent backup:
```
npx tsx scripts/restoreTriviaQuestions.ts
```

To restore and replace all existing questions:
```
npx tsx scripts/restoreTriviaQuestions.ts --clear
```

To restore from a specific backup file:
```
npx tsx scripts/restoreTriviaQuestions.ts backups/trivia-backup-2025-05-21.json
```

## Backup Schedule

It's recommended to run backups:
- Before making major changes to the database
- Once per week
- Before your Replit goes inactive (before 6 days of inactivity)

## Automatic Backup

The system also automatically populates the database with over 1,000 animal trivia questions whenever it starts, ensuring you always have content even if the database is reset.