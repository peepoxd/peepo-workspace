-- Demo Users for Testing
-- Password: bcrypt hash of 'demo123' for all users

INSERT INTO users (email, password_hash, name, role, organization) VALUES
-- Partners (ภาคีเครือข่าย)
('partner@demo.com', '$2a$10$demo.hash.partner123', 'คุณสมชาย ภาคีดี', 'partner', 'มูลนิธิสุขภาพชุมชน'),
('partner2@demo.com', '$2a$10$demo.hash.partner123', 'คุณสมหญิง รักสุขภาพ', 'partner', 'สมาคมส่งเสริมสุขภาวะ'),

-- Academics (นักวิชาการ)
('academic@demo.com', '$2a$10$demo.hash.academic123', 'ดร.วิชาการ เก่งกาจ', 'academic', 'สำนักวิชาการ สสส.'),
('academic2@demo.com', '$2a$10$demo.hash.academic123', 'ดร.ศึกษา วิจัย', 'academic', 'สำนักวิชาการ สสส.'),

-- Approvers (ผู้อนุมัติ)
('approver@demo.com', '$2a$10$demo.hash.approver123', 'คุณอนุมัติ ตัดสินใจ', 'approver', 'คณะกรรมการ สสส.'),
('director@demo.com', '$2a$10$demo.hash.approver123', 'ดร.ผู้อำนวยการ ใหญ่มาก', 'approver', 'สำนักงาน สสส.'),

-- Contract Center (ศูนย์สัญญา)
('contract@demo.com', '$2a$10$demo.hash.contract123', 'คุณสัญญา มั่นคง', 'contract_center', 'ศูนย์บริหารสัญญา สสส.'),

-- Legal (กฎหมาย)
('legal@demo.com', '$2a$10$demo.hash.legal123', 'คุณกฎหมาย เที่ยงธรรม', 'legal', 'ฝ่ายกฎหมาย สสส.')

ON CONFLICT (email) DO NOTHING;
