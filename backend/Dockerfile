FROM python:3.11-slim

# Working directory set kar rahe hain
WORKDIR /app

# Dependencies copy aur install kar rahe hain
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Bcrypt version fix for passlib
RUN pip install bcrypt==4.0.1

# Bacha hua code copy kar rahe hain
COPY . .

# Port expose kar rahe hain
EXPOSE 8000

# Server start karne ka command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
