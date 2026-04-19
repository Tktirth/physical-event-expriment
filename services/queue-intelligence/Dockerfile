# Use Python Slim for lightweight image
FROM python:3.11-slim

WORKDIR /app

# Copy requirements followed by installation
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY main.py ./

# Port used by the service
EXPOSE 5000

CMD ["python", "main.py"]
