# Car Management
- Backend: NestJs + TypeOrm + PostgreSQL
- Frontend: React + Vite + TypeScript + Tailwind CSS + React Router + TanStacn Query
- Infra: Docker Compose (db + be + fe)

# Quick Start 
- docker compose up -d --build

# Service
FE: http://localhost:5173
BE: http://localhost:8005/api
API Docs (Swagger): http://localhost:8005/api/docs
PostgreSQL: localhost: 5434 (user/pass/db ตาม .env หรือค่า default ที่ใช้)

ระบบ Schema ถูก migration ด้วย BE เอง ซึ่งตั้งค่าระบบไว้เป็น 

- autoLoadEntities: true,
- synchronize: true,

เพื่อให้ง่ายต่อการ Dev และขึ้นระบบได้รวดเร็ว

สามารถใช้วิธีรันแยกกันได้โดย

For db
docker compose up -d db

For be
cd be
กำหนดค่าใน .env เช่น

- PORT=8005
- DB_HOST=localhost
- DB_PORT=5434
- DB_USER=postgres
- DB_PASS=postgres
- DB_NAME=example_db

npm install
npm start

For be
cd fe
กำหนดค่าใน .env เช่น

API_TARGET=http://localhost:8005

ืnpm install
npm run dev

## API endpoint /api

| Method | Endpoint | คำอธิบาย |
| :--- | :--- | :--- |
| `POST` | `/api/cars` | เพิ่มข้อมูลรถใหม่ |
| `GET` | `/api/cars/:id` | ค้นหาข้อมูลรถด้วย `id` |
| `PATCH` | `/api/cars/:id` | แก้ไขข้อมูลรถ (รองรับ partial update ที่ backend แต่ฝั่ง FE บังคับส่งครบทุก field) |
| `DELETE` | `/api/cars/:id` | ลบข้อมูลรถแบบ Soft Delete (อัปเดต field `deletedAt`) |
| `POST` | `/api/cars/search` | ค้นหาและดึงรายการข้อมูลรถทั้งหมด (รองรับ filter / pagination ตามเงื่อนไข) |

## รูปแบบ Response จะเป็น 

{
    "status": http.Status,
    "message: ""
    "data": {}
}

รูปแบบของการใช้ /api/search
POST /api/cars/search
HEADER: Content-Type: applicationjson

JSON BODY : {
    "keyword": "", // รับการค้นหา licensePlate / brand / model / province / color / year
    "where": {}, // ฝั่งของ FE ไม่ได้ทำให้ส่ง where ไว้ จะใช้เป็นการ พิมพ์แล้ว search ข้อมูล หรือ Auto comp
    "order_by": "desc",
    "limit": 20,
    "offset": 0​
}

## Database schema cars

id uuid PK
license_plate varchar unique
province varchar unique
brand varchar
model varchar
year smallint
color varchar(50)
remark text nullable: true
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz, nullable

# Project Structure

- docker-compose.yml
- be
    - src/
        - cars/
            - dto/
            - entities/
            - cars.controller.ts
            - cars.service.ts
            - cars.module.ts
        - helpers/
            - queryfilter/
                - keywordqueryfilter.dto.ts
                - queryfilter.dto.ts
            - response/
                - response.dto.ts
                - response.util.ts
            - middleware/
                - logger.middleware.ts
        - app.controller.ts
        - app.module.ts
        - app.service.ts
        - data-source.ts
        - main.ts

- fe
    - src/
        - api/
            - cars.ts
            - client.ts
        - components/
            - CarForm.tsx
            - DataTable.tsx
            - Modal.tsx
        - hook/
            - useDebounce.ts
        - layouts/
            - AppLayout.tsx
        - pages/
            - CarsPage.tsx
        - types/
            - car.ts
            - common.ts
        - app.tsx
        - index.css
        - main.tsx
        - router.tsx
        