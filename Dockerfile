# Specify Python version
FROM python:3.9

# Update and clean up
RUN apt-get update && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory to /app
WORKDIR /app

# Copy application files (exclude .env)
COPY . . 

# Install any needed packages specified in requirements.txt 
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 5000
EXPOSE 5000

# Run projectcode.py when the container launches
CMD ["python", "server.py"]
