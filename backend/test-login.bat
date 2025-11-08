@echo off
echo Testing login API...
curl -X POST http://localhost:3000/api/auth/login ^
-H "Content-Type: application/json" ^
-d "{\"email\":\"admin@example.com\",\"password\":\"123456\"}"
pause