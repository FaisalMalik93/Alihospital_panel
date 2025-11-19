# Ali Hospital Management System

A comprehensive Hospital Management System built for Ali Hospital (Pakistan) to streamline patient record management, report generation, and billing processes.

## Features

### Core Functionality
- **Quick Report Generation**: Generate patient reports from predefined templates without recreating them every time
- **Template Management**: Create and manage reusable report templates
- **Instant Printing/PDF Export**: Print or download reports as PDF with one click

### Modules

#### 1. Doctors Management
- Add, edit, and view doctor information
- Track doctor specializations and qualifications
- Assign doctors to specific report templates

#### 2. Patients Management
- Complete patient record management
- Store patient demographics, contact info, and medical history
- Link patients to their reports and bills

#### 3. Report Templates
- Create reusable templates for common medical reports
- Dynamic placeholders for patient data ([PATIENT_NAME], [PATIENT_AGE], [PATIENT_GENDER], [DATE])
- Edit and update templates as needed

#### 4. Reports Generation
- Select a patient and template
- Auto-populate report with patient details
- Edit content before saving if needed
- Print or download as professional PDF
- View report history

#### 5. Billing
- Generate bills for patient services
- Track payment status (Paid/Unpaid/Partial)
- View billing statistics and totals
- Update payment status easily

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **PDF Generation**: jsPDF
- **Date Handling**: date-fns

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Navigate to project directory**
   ```bash
   cd ali-hospital-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Getting Started

1. **Add Doctors**
   - Navigate to "Doctors" from the menu
   - Click "Add Doctor"
   - Fill in doctor details (name, specialization, qualifications, contact)
   - Save the doctor

2. **Create Report Templates**
   - Go to "Templates"
   - Click "Create Template"
   - Give it a name (e.g., "Blood Test Report", "X-Ray Report")
   - Write the template content using placeholders:
     - `[PATIENT_NAME]` - Will be replaced with patient name
     - `[PATIENT_AGE]` - Will be replaced with patient age
     - `[PATIENT_GENDER]` - Will be replaced with patient gender
     - `[DATE]` - Will be replaced with current date
   - Optionally assign to a specific doctor
   - Save the template

3. **Register Patients**
   - Navigate to "Patients"
   - Click "Add Patient"
   - Enter patient details (name, age, gender, contact, address, medical history)
   - Save the patient

4. **Generate Reports**
   - Go to "Reports"
   - Click "Generate New Report"
   - Select the patient from dropdown
   - Select a report template
   - The report will auto-populate with patient details
   - Edit the content as needed
   - Click "Save Report"

5. **Print/Download Reports**
   - In the Reports page, you'll see all generated reports
   - Click "Print" to open print dialog
   - Click "Download PDF" to save as PDF file

6. **Manage Billing**
   - Navigate to "Billing"
   - Click "Create New Bill"
   - Select patient
   - Enter services/items provided
   - Enter total amount
   - Set payment status
   - Save the bill

## Database Schema

### Tables
- **doctors**: Doctor information and credentials
- **patients**: Patient demographics and medical history
- **report_templates**: Reusable report templates
- **reports**: Generated patient reports
- **bills**: Patient billing records

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
```

For production with PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ali_hospital"
```

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run:

```bash
npx prisma db push
```

## Features Walkthrough

### Quick Report Generation
The main goal of this system is to allow staff to quickly generate patient reports:

1. Select a pre-made template (e.g., "Lab Test Report")
2. Choose the patient
3. Template auto-fills with patient information
4. Make any necessary edits
5. Click save and immediately print or download as PDF

This eliminates the need to manually type patient details and create reports from scratch every time.

### Template Placeholders

When creating templates, use these placeholders:

```
MEDICAL REPORT

Patient Name: [PATIENT_NAME]
Age: [PATIENT_AGE] years
Gender: [PATIENT_GENDER]
Date: [DATE]

Findings:
[Enter findings here]

Diagnosis:
[Enter diagnosis here]

Treatment Plan:
[Enter treatment plan here]

Doctor Signature: __________________
```

When generating a report, all placeholders are automatically replaced with actual patient data.

## Support

For issues or questions, please contact the hospital IT department.

## License

Proprietary - Ali Hospital, Pakistan

---

**Built with care for Ali Hospital staff and patients**
