# backend/test_resend.py

import resend
import os
from dotenv import load_dotenv

# Load variables from backend/.env
load_dotenv()

# Read the API key from the environment
resend.api_key = os.getenv("RESEND_API_KEY")

if not resend.api_key:
    raise ValueError("RESEND_API_KEY is not set. Check your .env file.")

params = {
    "from": "onboarding@resend.dev",   # this works with their testing domain
    "to": ["gmmm3890@gmail.com"],  # TODO: change this to your real email
    "subject": "Test Email",
    "html": "<strong>It works!</strong>"
}

email = resend.Emails.send(params)
print(email)
