
## 📦 Backend Setup Guide

### **Dependencies**
- **Prisma**
- **PostgreSQL** (server or Docker instance)
- **Node.js** v24.5.0
- **npm** v11.5.1

---

## 🚀 Steps to Start Backend

### **1. Run PostgreSQL instance on Docker**
```bash
docker run --name pg_server -p 5432:5432 -e POSTGRES_PASSWORD=pass -d postgres
```


### **1.2. create database storedb**
```bash
    docker exec -it pg_server psql -U postgres
    create database storedb
```
### **3. install dependencies**
```bash
 npm i
 ```

### **4. Setup Prisma**
```bash
 npx prisma migrate reset
 npx prisma migrate dev --name testing
 npx prisma generate
```
### ** 5. start backend**
```bash
  npm run dev
```

## Future Improvements

- **Security Enhancement with JWT or OAuth**  
  Implement secure authentication and authorization using JSON Web Tokens (JWT) or OAuth 2.0 to protect APIs and user sessions.

- **Password Hashing**  
  Store user passwords securely by encoding them using **bcrypt** or **Argon2**, ensuring sensitive data is never stored in plain text.

- **Helmet Integration**  
  Use the `helmet` middleware to set secure HTTP headers, helping reduce common vulnerabilities.

- **Robust Logging**  
  Implement a detailed logging mechanism using libraries like **morgan**, integrated with file-based or cloud logging solutions for better monitoring and debugging.



## 📦 Frontend Setup Guide Setup Guide
## 🚀 Steps to Start Backend
```bash
   npm i
   npm run dev
``` 