import secrets

# Generate a URL-safe secret key
secret_key = secrets.token_urlsafe(64)
print(secret_key)
