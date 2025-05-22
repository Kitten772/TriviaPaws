# Deploying Purrfect Trivia to Render

This guide will help you deploy the Purrfect Trivia game to Render.com, a cloud platform that makes it easy to host web applications.

## Prerequisites

1. A [Render account](https://render.com)
2. Your OpenAI API key
3. Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Set Up Your Render Account

If you haven't already, sign up for a [Render account](https://dashboard.render.com/register).

### 2. Create a New Web Service

1. From your Render dashboard, click "New" and select "Web Service"
2. Connect your Git repository
3. Configure your web service:
   - **Name**: purrfect-trivia (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `NODE_ENV=production node dist/server/prod.js`

### 3. Add Environment Variables

Add the following environment variables in the Render dashboard:
- `NODE_ENV`: `production`
- `OPENAI_API_KEY`: Your OpenAI API key
- `DATABASE_URL`: Will be automatically set when you create a database

### 4. Create a PostgreSQL Database

1. From your Render dashboard, click "New" and select "PostgreSQL"
2. Configure your database:
   - **Name**: purrfect-trivia-db (or your preferred name)
   - **Database**: `purrfect_trivia`
   - **User**: `purrfect_trivia`
   - Choose an appropriate plan

3. After creation, Render will provide a connection string. This will be automatically linked to your web service if you used the `render.yaml` file.

### 5. Deploy Your Application

1. Click "Create Web Service" and wait for the deployment to complete
2. Once deployed, you can access your application at the URL provided by Render

## Backup and Restore

Since Render databases are ephemeral on some plans, make sure to regularly backup your trivia questions:

1. Connect to your application's shell in the Render dashboard
2. Run `npm run backup` to create a backup file
3. Download the backup file from the Render dashboard
4. If needed, upload a backup file and run `npm run restore [filename]` to restore your questions

## Troubleshooting

If you encounter issues during deployment:

1. Check the logs in the Render dashboard
2. Ensure your environment variables are set correctly
3. Verify your database connection is working
4. Make sure your OpenAI API key is valid

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [PostgreSQL on Render](https://render.com/docs/databases)