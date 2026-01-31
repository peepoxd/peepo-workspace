-- Demo Granting System - Initial Schema
-- Layer 5b: Database Server (PostgreSQL)

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('partner', 'academic', 'approver', 'contract_center', 'legal')),
    organization VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proposals table
CREATE TABLE IF NOT EXISTS proposals (
    id SERIAL PRIMARY KEY,
    project_name VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(15,2) NOT NULL,
    duration_months INTEGER NOT NULL,
    objectives JSONB DEFAULT '[]',
    target_group TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'screening', 'approved', 'rejected', 'contracted')),
    created_by INTEGER REFERENCES users(id),
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Screenings table
CREATE TABLE IF NOT EXISTS screenings (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER REFERENCES proposals(id) NOT NULL,
    eligibility_check BOOLEAN DEFAULT FALSE,
    document_complete BOOLEAN DEFAULT FALSE,
    budget_reasonable BOOLEAN DEFAULT FALSE,
    comments TEXT,
    recommendation VARCHAR(20) CHECK (recommendation IN ('pass', 'revise', 'reject')),
    screened_by INTEGER REFERENCES users(id),
    screened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Approvals table
CREATE TABLE IF NOT EXISTS approvals (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER REFERENCES proposals(id) NOT NULL,
    decision VARCHAR(30) CHECK (decision IN ('approved', 'conditionally_approved', 'rejected')),
    conditions JSONB DEFAULT '[]',
    budget_approved DECIMAL(15,2),
    comments TEXT,
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER REFERENCES proposals(id) NOT NULL,
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_budget DECIMAL(15,2) NOT NULL,
    installments JSONB DEFAULT '[]',
    status VARCHAR(30) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_signature', 'signed', 'active', 'completed', 'terminated')),
    signatures JSONB DEFAULT '[]',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER REFERENCES contracts(id) NOT NULL,
    installment_number INTEGER NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'paid', 'rejected')),
    attachments JSONB DEFAULT '[]',
    requested_by INTEGER REFERENCES users(id),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    paid_at TIMESTAMP
);

-- Files table (metadata, actual files in MinIO)
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(500) NOT NULL,
    original_name VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    size_bytes BIGINT,
    bucket VARCHAR(100) NOT NULL,
    object_key VARCHAR(500) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'proposal', 'contract', 'payment'
    entity_id INTEGER NOT NULL,
    uploaded_by INTEGER REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_created_by ON proposals(created_by);
CREATE INDEX idx_screenings_proposal ON screenings(proposal_id);
CREATE INDEX idx_approvals_proposal ON approvals(proposal_id);
CREATE INDEX idx_contracts_proposal ON contracts(proposal_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_payments_contract ON payments(contract_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_files_entity ON files(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
