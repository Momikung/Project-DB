# PS09 E-commerce Admin Dashboard 🚀

โปรเจคระบบจัดการหลังบ้าน (Admin Dashboard) สำหรับร้านค้าออนไลน์ พัฒนาด้วย Next.js, Flask และ MySQL โดยเน้นโครงสร้างที่ชัดเจนและเป็นระเบียบเพื่อให้ทีมงานพัฒนาต่อได้ง่าย

---

## 📂 โครงสร้างโปรเจค (Project Structure)

### 🐍 Backend (Flask)
ตั้งอยู่ในโฟลเดอร์ `backend/src/` โดยแบ่งหน้าที่ตามไฟล์ดังนี้:
- **`init/`**: ศูนย์รวมไฟล์ตั้งค่าและลงทะเบียนต่างๆ (รวมถึงการจัดการ Blueprints) เพื่อให้โฟลเดอร์อื่นสะอาด
- **`queries/`**: ใช้สำหรับเขียนคำสั่ง SQL Query เพื่อจัดการข้อมูล (เปลี่ยนจาก models)
- **`utils/`**: เก็บเครื่องมือช่วยเหลือต่างๆ (Helper functions)

### ⚛️ Frontend (Next.js)
ตั้งอยู่ในโฟลเดอร์ `frontend/` โดยใช้ TypeScript และ Tailwind CSS:
- **`app/`**: หน้าหลักของเว็บไซต์ (Next.js App Router)
- **`components/`**: ส่วนประกอบของ UI ที่นำมาใช้ซ้ำได้
- **`hooks/`**: ใช้สำหรับดึงข้อมูลและจัดการ State (เช่น `useDashboard.ts`)
- **`api/`**: เก็บคำสั่ง Fetch ข้อมูลจาก Backend (ย้ายมาอยู่ใน `init/api.ts`)
- **`types/`**: นิยาม Type และ Interface ของ TypeScript เพื่อให้โค้ดไม่อ่านยาก

### 🗄️ Database (MySQL)
- **`mysql/init.sql`**: ไฟล์หลักสำหรับเก็บ Schema และข้อมูล Seed Data ทั้งหมด

---

## 🛠️ ขั้นตอนการเพิ่ม Feature ใหม่ (Workflow)

เพื่อให้ทีมงานทำงานไปในทิศทางเดียวกัน โปรดทำตามลำดับนี้:

1.  **Database**: หากต้องเพิ่มตารางหรือคอลัมน์ ให้แก้ไขที่ `mysql/init.sql`
2.  **Backend Query**: เขียนฟังก์ชัน Query ข้อมูลใน `backend/src/queries/`
3.  **Backend Controller**: นำข้อมูลมาประมวลผลที่ `backend/src/controllers/`
4.  **Backend Route**: จดทะเบียน Route ใน `backend/src/routes/` และ Register ใน `app.py`
5.  **Frontend Type**: เพิ่ม Interface ใหม่ใน `frontend/types/index.ts`
6.  **Frontend API**: เพิ่มฟังก์ชัน Fetch ใน `frontend/init/api.ts`
7.  **Frontend Hook**: สร้าง Hook ใหม่ใน `frontend/hooks/` เพื่อเรียกใช้ API
8.  **Frontend Page**: นำ Hook ไปใช้แสดงผลในหน้า `app/`

---

## 🚀 วิธีการรันโปรเจค (Getting Started)

### แบบใช้ Docker (แนะนำ)
```bash
docker-compose up --build
```

### แบบรันแยก (Manual Setup)
**1. Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```
**2. Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📥 การ Clone โปรเจค (Cloning)

สำหรับการทำงานร่วมกัน โปรดใช้คำสั่งดังนี้เพื่อดึงโปรเจคไปยังเครื่องของคุณ:

**1. Clone โปรเจค:**
```bash
git clone https://github.com/Momikung/Project-DB.git
cd Project-DB
```

**2. การสร้าง Branch สำหรับงานใหม่:**
ห้ามแก้โค้ดบน branch `main` โดยตรง ให้สร้าง branch ใหม่เสมอ:
```bash
git checkout -b feature/your-feature-name
```

---

## 🔄 กฎการจัดการ Branch และการ Merge (Merge Rules)

เพื่อให้โค้ดหลัก (`main`) ไม่พังและทำงานได้ตลอดเวลา โปรดทำตามกฎดังนี้:

1.  **ห้าม Push ตรงเข้า Main**: ทุกการเปลี่ยนแปลงต้องทำผ่าน Branch ของตัวเองเท่านั้น
2.  **เปิด Pull Request (PR)**: เมื่อทำ Feature เสร็จแล้ว ให้เปิด PR บน GitHub เพื่อให้คนในทีมช่วยตรวจ (Code Review)
3.  **Merge Rules**: 
    - ต้องไม่มีข้อขัดแย้งของโค้ด (Conflict) ก่อนทำการ Merge
    - หากมีการตั้งค่า **Status Checks** ต้องรอให้ผลการตรวจสอบผ่านทั้งหมด (เขียว) ถึงจะ Merge ได้
    - หลังทำการ Merge แล้ว ให้ลบ Branch ของตัวเองทิ้งเพื่อความสะอาดของโปรเจค
4.  **Update สม่ำเสมอ**: ก่อนเริ่มงานทุกครั้ง ให้ทำการดึงโค้ดล่าสุดจาก main มาที่เครื่องเสมอ:
    ```bash
    git checkout main
    git pull origin main
    ```

---

## ⚠️ กฎการทำงานร่วมกัน (Team Rules)
- **อย่าเขียน Logic ไว้ใน Route**: ให้ย้ายไปไว้ใน Controller เสมอ
- **ใช้ TypeScript เสมอ**: ห้ามใช้ `any` หากไม่จำเป็นจริงๆ
- **จัด Format โค้ด**: โปรดใช้ Prettier/ESLint ตามที่โปรเจคตั้งค่าไว้
- **Commit Message**: เขียนคำอธิบายสั้นๆ ว่าแก้/เพิ่มอะไร (เช่น `feat: add login page`, `fix: database connection`)
