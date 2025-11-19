import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with dummy data...\n')

  // Create Doctors
  console.log('👨‍⚕️ Creating doctors...')
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        name: 'Dr. Ahmed Khan',
        specialization: 'General Physician',
        phone: '0300-1234567',
        email: 'ahmed.khan@alihospital.com',
        qualifications: 'MBBS, FCPS (Medicine)',
      },
    }),
    prisma.doctor.create({
      data: {
        name: 'Dr. Fatima Malik',
        specialization: 'Cardiologist',
        phone: '0321-9876543',
        email: 'fatima.malik@alihospital.com',
        qualifications: 'MBBS, FCPS (Cardiology), MD',
      },
    }),
    prisma.doctor.create({
      data: {
        name: 'Dr. Hassan Ali',
        specialization: 'Pediatrician',
        phone: '0333-5551234',
        email: 'hassan.ali@alihospital.com',
        qualifications: 'MBBS, FCPS (Pediatrics)',
      },
    }),
  ])
  console.log(`✓ Created ${doctors.length} doctors\n`)

  // Create Report Templates
  console.log('📄 Creating report templates...')
  const templates = await Promise.all([
    prisma.reportTemplate.create({
      data: {
        name: 'General Consultation Report',
        doctorId: doctors[0].id,
        contentTemplate: `ALI HOSPITAL - GENERAL CONSULTATION REPORT

Patient Name: [PATIENT_NAME]
Age: [PATIENT_AGE] years
Gender: [PATIENT_GENDER]
Date: [DATE]

VITAL SIGNS:
Blood Pressure: _________
Temperature: _________
Pulse Rate: _________
Respiratory Rate: _________

CHIEF COMPLAINT:


HISTORY OF PRESENT ILLNESS:


EXAMINATION FINDINGS:
General Appearance:
Cardiovascular System:
Respiratory System:
Abdomen:
CNS:

DIAGNOSIS:


TREATMENT PRESCRIBED:


FOLLOW-UP INSTRUCTIONS:


Doctor's Notes:`,
      },
    }),
    prisma.reportTemplate.create({
      data: {
        name: 'Lab Test Report - Complete Blood Count (CBC)',
        doctorId: doctors[0].id,
        contentTemplate: `ALI HOSPITAL - LABORATORY REPORT
COMPLETE BLOOD COUNT (CBC)

Patient: [PATIENT_NAME]
Age: [PATIENT_AGE] | Gender: [PATIENT_GENDER]
Date: [DATE]

TEST RESULTS:

Hemoglobin: _________ g/dL (Normal: 13-17 for men, 12-15 for women)
Total WBC Count: _________ /cumm (Normal: 4000-11000)
RBC Count: _________ million/cumm
Platelet Count: _________ /cumm (Normal: 150000-450000)
Hematocrit: _________ %
MCV: _________ fL
MCH: _________ pg
MCHC: _________ g/dL

DIFFERENTIAL COUNT:
Neutrophils: _________ %
Lymphocytes: _________ %
Monocytes: _________ %
Eosinophils: _________ %
Basophils: _________ %

REMARKS:


Tested By: _________________
Verified By: Dr. [PATIENT_NAME]
Lab Technician Signature: _________________`,
      },
    }),
    prisma.reportTemplate.create({
      data: {
        name: 'X-Ray Report',
        contentTemplate: `ALI HOSPITAL - RADIOLOGY DEPARTMENT
X-RAY EXAMINATION REPORT

Patient Name: [PATIENT_NAME]
Age/Gender: [PATIENT_AGE] / [PATIENT_GENDER]
Date: [DATE]

EXAMINATION: Chest X-Ray (PA View)

CLINICAL INDICATION:


TECHNIQUE:
Standard PA chest radiograph

FINDINGS:

Heart: Size and shape normal
Lungs:
Pleura:
Mediastinum:
Bones:
Soft Tissues:

IMPRESSION:


RECOMMENDATIONS:


Radiologist: _________________
Signature: _________________`,
      },
    }),
    prisma.reportTemplate.create({
      data: {
        name: 'Blood Sugar Test Report',
        contentTemplate: `ALI HOSPITAL - LABORATORY REPORT
BLOOD GLUCOSE TEST

Patient: [PATIENT_NAME]
Age: [PATIENT_AGE] | Gender: [PATIENT_GENDER]
Date: [DATE]

TEST RESULTS:

Fasting Blood Sugar: _________ mg/dL (Normal: 70-100)
Random Blood Sugar: _________ mg/dL (Normal: <140)
HbA1c: _________ % (Normal: <5.7%)

INTERPRETATION:
[ ] Normal
[ ] Pre-diabetic
[ ] Diabetic

REMARKS:


RECOMMENDATIONS:


Tested By: _________________
Pathologist: _________________`,
      },
    }),
    prisma.reportTemplate.create({
      data: {
        name: 'ECG Report',
        doctorId: doctors[1].id,
        contentTemplate: `ALI HOSPITAL - CARDIOLOGY DEPARTMENT
ELECTROCARDIOGRAM (ECG) REPORT

Patient: [PATIENT_NAME]
Age/Gender: [PATIENT_AGE] / [PATIENT_GENDER]
Date: [DATE]

INDICATION:


ECG FINDINGS:

Rate: _________ bpm
Rhythm: [ ] Regular [ ] Irregular
P Wave:
PR Interval: _________ ms
QRS Complex: _________ ms
QT Interval: _________ ms
ST Segment:
T Wave:

INTERPRETATION:


CONCLUSION:
[ ] Normal ECG
[ ] Abnormal ECG

RECOMMENDATIONS:


Cardiologist: Dr. Fatima Malik
Signature: _________________`,
      },
    }),
    prisma.reportTemplate.create({
      data: {
        name: 'Pediatric Checkup Report',
        doctorId: doctors[2].id,
        contentTemplate: `ALI HOSPITAL - PEDIATRICS DEPARTMENT
CHILD HEALTH CHECKUP REPORT

Child Name: [PATIENT_NAME]
Age: [PATIENT_AGE]
Gender: [PATIENT_GENDER]
Date: [DATE]

GROWTH PARAMETERS:
Weight: _________ kg
Height: _________ cm
Head Circumference: _________ cm
BMI: _________

VITAL SIGNS:
Temperature: _________ °F
Heart Rate: _________ bpm
Respiratory Rate: _________ /min

DEVELOPMENTAL MILESTONES:
[ ] Age-appropriate
[ ] Delayed

EXAMINATION:
General Appearance:
Eyes, Ears, Nose, Throat:
Cardiovascular:
Respiratory:
Abdomen:
Neurological:

IMMUNIZATION STATUS:


NUTRITIONAL ASSESSMENT:


RECOMMENDATIONS:


Next Visit: _________

Pediatrician: Dr. Hassan Ali
Signature: _________________`,
      },
    }),
  ])
  console.log(`✓ Created ${templates.length} report templates\n`)

  // Create Patients
  console.log('👥 Creating patients...')
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        patientId: 'PAT-00001',
        mrId: 'MR-2024-001',
        name: 'Muhammad Ali',
        age: 35,
        gender: 'Male',
        contact: '0321-9876543',
        address: 'House 123, Street 5, Gulberg III, Lahore',
        medicalHistory: 'Hypertension, Diabetes Type 2 (controlled)',
      },
    }),
    prisma.patient.create({
      data: {
        patientId: 'PAT-00002',
        mrId: 'MR-2024-002',
        name: 'Ayesha Khan',
        age: 28,
        gender: 'Female',
        contact: '0300-1112233',
        address: 'Flat 45, Block C, DHA Phase 5, Lahore',
        medicalHistory: 'Asthma (mild)',
      },
    }),
    prisma.patient.create({
      data: {
        patientId: 'PAT-00003',
        name: 'Ahmed Hassan',
        age: 7,
        gender: 'Male',
        contact: '0333-4445566',
        address: 'House 67, Johar Town, Lahore',
        medicalHistory: 'No significant history',
      },
    }),
    prisma.patient.create({
      data: {
        patientId: 'PAT-00004',
        name: 'Zainab Malik',
        age: 45,
        gender: 'Female',
        contact: '0345-7778899',
        address: 'Apartment 12, Model Town, Lahore',
        medicalHistory: 'Thyroid disorder, Arthritis',
      },
    }),
  ])
  console.log(`✓ Created ${patients.length} patients\n`)

  // Create Bills
  console.log('💰 Creating bills...')
  const bills = await Promise.all([
    prisma.bill.create({
      data: {
        patientId: patients[0].id,
        services: `- Consultation Fee (General Physician): Rs. 1,500
- Complete Blood Count (CBC): Rs. 800
- Blood Sugar Test (Fasting): Rs. 500
- Medicines: Rs. 2,200`,
        amount: 5000,
        status: 'paid',
      },
    }),
    prisma.bill.create({
      data: {
        patientId: patients[1].id,
        services: `- Consultation Fee (General Physician): Rs. 1,500
- Chest X-Ray: Rs. 1,200
- Prescription Medicines: Rs. 1,800`,
        amount: 4500,
        status: 'unpaid',
      },
    }),
    prisma.bill.create({
      data: {
        patientId: patients[2].id,
        services: `- Pediatric Consultation: Rs. 2,000
- Vaccination (MMR): Rs. 800
- Growth Chart Monitoring: Rs. 500`,
        amount: 3300,
        status: 'paid',
      },
    }),
  ])
  console.log(`✓ Created ${bills.length} bills\n`)

  // Create Reports
  console.log('📋 Creating sample reports...')
  const reports = await Promise.all([
    prisma.report.create({
      data: {
        patientId: patients[0].id,
        templateId: templates[0].id,
        content: `ALI HOSPITAL - GENERAL CONSULTATION REPORT

Patient Name: Muhammad Ali
Age: 35 years
Gender: Male
Date: ${new Date().toLocaleDateString('en-PK')}

VITAL SIGNS:
Blood Pressure: 140/90 mmHg
Temperature: 98.6°F
Pulse Rate: 78 bpm
Respiratory Rate: 16 /min

CHIEF COMPLAINT:
Patient complains of persistent headache and dizziness for the past 3 days.

HISTORY OF PRESENT ILLNESS:
Patient reports headache started 3 days ago, worse in morning. Associated with dizziness. No nausea or vomiting. Patient has history of hypertension and diabetes, both on medications.

EXAMINATION FINDINGS:
General Appearance: Well-nourished, no acute distress
Cardiovascular System: Normal heart sounds, BP elevated
Respiratory System: Clear chest, normal breath sounds
Abdomen: Soft, non-tender
CNS: Alert and oriented, no focal neurological deficits

DIAGNOSIS:
1. Hypertension (uncontrolled)
2. Tension headache

TREATMENT PRESCRIBED:
1. Tab. Amlodipine 10mg - Once daily (Morning)
2. Tab. Paracetamol 500mg - SOS for headache
3. Advised low-salt diet and regular exercise

FOLLOW-UP INSTRUCTIONS:
- Review after 1 week with BP monitoring record
- Maintain blood pressure diary
- Continue diabetic medications as prescribed

Doctor's Notes:
Advised patient on lifestyle modifications and importance of medication compliance.`,
      },
    }),
    prisma.report.create({
      data: {
        patientId: patients[1].id,
        templateId: templates[1].id,
        content: `ALI HOSPITAL - LABORATORY REPORT
COMPLETE BLOOD COUNT (CBC)

Patient: Ayesha Khan
Age: 28 | Gender: Female
Date: ${new Date().toLocaleDateString('en-PK')}

TEST RESULTS:

Hemoglobin: 13.2 g/dL (Normal: 13-17 for men, 12-15 for women)
Total WBC Count: 8,500 /cumm (Normal: 4000-11000)
RBC Count: 4.5 million/cumm
Platelet Count: 250,000 /cumm (Normal: 150000-450000)
Hematocrit: 39.5 %
MCV: 88 fL
MCH: 29 pg
MCHC: 33 g/dL

DIFFERENTIAL COUNT:
Neutrophils: 62 %
Lymphocytes: 30 %
Monocytes: 5 %
Eosinophils: 2 %
Basophils: 1 %

REMARKS:
All values within normal limits.

Tested By: Lab Tech - Ali Raza
Verified By: Dr. Ahmed Khan
Lab Technician Signature: [Signed]`,
      },
    }),
  ])
  console.log(`✓ Created ${reports.length} sample reports\n`)

  console.log('✅ Database seeded successfully!')
  console.log(`\n📊 Summary:`)
  console.log(`   - ${doctors.length} Doctors`)
  console.log(`   - ${templates.length} Report Templates`)
  console.log(`   - ${patients.length} Patients`)
  console.log(`   - ${bills.length} Bills`)
  console.log(`   - ${reports.length} Reports`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
