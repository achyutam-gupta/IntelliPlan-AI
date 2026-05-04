# Vercel Environment Variables Setup Guide

This guide explains how to configure the securely hosted environment variables for the IntelliNexus AI platform on Vercel. 

By adding these environment variables directly to Vercel, the application will automatically fall back to them if a user has not configured their own API keys in the application's Settings UI. This ensures your API keys are kept entirely secure on the server and are never exposed to the browser.

## Required Environment Variables

Add the following keys to your Vercel project:

### Jira Integration
- `JIRA_URL`: The base URL of your Jira instance (e.g., `https://your-domain.atlassian.net`)
- `JIRA_EMAIL`: The email address associated with your Jira account
- `JIRA_API_TOKEN`: Your Atlassian API token

### LLM Providers
- `GROQ_API_KEY`: Your Groq API key for fast inference (e.g., `gsk_...`)
- `NVIDIA_API_KEY`: *(Optional)* Your NVIDIA API key if using the NVIDIA NIM Cloud
- `OPENAI_API_KEY`: *(Optional)* Your OpenAI API key if using OpenAI models

---

## How to Add Variables to Vercel

1. **Open Vercel Dashboard**
   Navigate to your [Vercel Dashboard](https://vercel.com/dashboard) and select the `intellinexusai` project.

2. **Go to Settings**
   Click on the **Settings** tab located near the top of the project page.

3. **Open Environment Variables**
   From the left-hand sidebar menu, select **Environment Variables**.

4. **Add the Keys**
   For each required variable listed above:
   - Paste the exact name (e.g., `JIRA_URL`) into the **Key** field.
   - Paste the corresponding value into the **Value** field.
   - Ensure the environments (Production, Preview, Development) are checked as needed.
   - Click the **Save** button.

5. **Redeploy the Application**
   Vercel requires a fresh deployment to inject new environment variables into the backend.
   - Go to the **Deployments** tab.
   - Click the three dots (`...`) next to your most recent deployment.
   - Select **Redeploy**.
   - *(Optional)* Ensure the "Use existing Build Cache" option is unchecked so it pulls the fresh environment variables.

Once the deployment is complete, your backend proxy will automatically utilize these Vercel-hosted keys for any external API requests!
