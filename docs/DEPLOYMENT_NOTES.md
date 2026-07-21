# Deployment Notes

## Render and SMTP

The project spec noted a known limitation: some hosting providers, including Render, can have restrictions or delays around outbound SMTP connections on free-tier services. In practice, for this project, Gmail SMTP via Nodemailer worked successfully from the deployed Render backend using a Gmail App Password (not the account's regular password), with no additional configuration needed beyond setting the `EMAIL_USER` and `EMAIL_APP_PASSWORD` environment variables directly in the Render dashboard.

**Solution selected:** Direct Gmail SMTP via Nodemailer, using a Gmail App Password generated specifically for this application. This required:
1. Enabling 2-Step Verification on the Gmail account
2. Generating an App Password (not the account's real password)
3. Adding `EMAIL_USER` and `EMAIL_APP_PASSWORD` as environment variables in Render's dashboard (never committed to source control)

**Reliability consideration:** to avoid appointment booking feeling slow or unresponsive while waiting on an email to send, email sending was implemented as non-blocking — the API responds to the user immediately once the appointment is saved to the database, and the email is sent afterward in the background. A failed email send is logged but does not affect the booking itself or crash the server.

## Render free-tier cold starts

Render's free tier spins down web services after a period of inactivity. The first request after idle time can take 30-60 seconds to respond while the service restarts. This is expected behavior on the free tier and was accounted for during testing and demonstration, rather than treated as a bug.

## Environment variables

Both the backend (`MONGODB_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_APP_PASSWORD`) and frontend (`VITE_API_URL`) environment variables were configured directly through the Render dashboard for each service, since `.env` files are excluded from version control via `.gitignore`.

## MongoDB Atlas network access

Since Render's servers do not have a single fixed IP address, MongoDB Atlas's Network Access list was configured to allow all IPs (`0.0.0.0/0`) rather than a specific address, which is the standard approach for platform-as-a-service deployments like this one.
