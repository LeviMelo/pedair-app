# CREST Development Roadmap - Complete Strategic Plan

This document outlines the comprehensive development roadmap for CREST (Clinical REsearch Study Tool), a multi-project clinical research platform for pediatric thoracic surgery ERAS protocols. The roadmap prioritizes clinical UX requirements, data privacy compliance (LGPD), and the sophisticated multi-project architecture described in the project vision.

## Current Status & Foundation

**✅ Completed (Frontend Foundations):**
- React 19 + TypeScript + Vite + Tailwind CSS setup
- Dynamic form rendering engine with JSON Schema support
- Sophisticated widget system (InputField, SelectField, AutocompleteTagSelector, DrugSection, etc.)
- Schema-driven form architecture (*.schema.json + *.uiSchema.json)
- Layout with project-contextual sidebar navigation
- Basic project selection and role-based UI visibility
- Three legacy forms successfully converted to schema-driven system

**🔧 In Progress:**
- Global state management architecture (Zustand stores)
- Project-contextual navigation and permissions
- Clinical UX refinements for touch interfaces

---

## Phase 1: Backend Foundation & Security Infrastructure (8-10 weeks)

### 1.1 Database Architecture & Core Models (2 weeks)
**Priority: Critical - Foundation for all subsequent development**

- **Database Setup (PostgreSQL on Supabase/Render)**
  - Set up production-ready PostgreSQL instance
  - Configure connection pooling and basic security
  
- **Core Schema Implementation**
  ```sql
  -- Critical tables with proper indexing and constraints
  users (id, google_sub, email_encrypted, name, created_at, approved)
  projects (id, name, description, privacy_profile_jsonb, created_by, created_at)
  forms (id, project_id, name, schema_jsonb, ui_schema_jsonb, version, status)
  form_submissions (id, project_id, form_id, patient_id_hash, form_data_jsonb, version, submitted_by, submitted_at)
  patients (patient_id_hash, project_id, consent_data_jsonb, created_at)
  roles (id, project_id, name, permissions_jsonb, created_by)
  user_roles (user_id, role_id, project_id, assigned_at, assigned_by)
  contact_log (id, patient_id_hash, contact_data_encrypted, consent_type, created_at)
  access_logs (id, user_id, project_id, action, target_id, timestamp, ip_addr, old_data, new_data)
  ```

- **Flask Application Structure**
  - Organize into Blueprints: auth, projects, forms, submissions, users, audit
  - Configure Flask-SQLAlchemy with Alembic migrations
  - Set up environment-based configuration management

### 1.2 Pseudonymization & Privacy Core (2 weeks)  
**Priority: Critical - Core to LGPD compliance**

- **Cryptographic Module Implementation**
  ```python
  # Core pseudonymization functions
  def generate_patient_id(dob, gender, initials, project_id, salt, pepper) -> str
  def generate_export_id(patient_id, export_salt) -> str
  def encrypt_contact_info(contact_data, encryption_key) -> bytes
  def decrypt_contact_info(encrypted_data, encryption_key) -> str
  ```

- **Key Management System**
  - Secure storage of salt, pepper, encryption keys in environment variables
  - Key rotation mechanism design (for future implementation)
  - Backup and recovery procedures for cryptographic materials

- **Privacy Profile System**
  - JSONB-based privacy configurations per project
  - Data retention policies and automatic cleanup jobs
  - Consent management framework (project, form, recontact levels)

### 1.3 Authentication & Authorization (RBAC) (2 weeks)
**Priority: Critical - Required for multi-project security**

- **Google OAuth 2.0 Integration**
  - Configure Authlib for Google OAuth
  - Implement token validation and user creation/retrieval
  - Handle edge cases (account linking, email changes)

- **JWT-Based Session Management**
  - Issue project-contextual JWTs with role claims
  - Implement token refresh mechanism
  - Configure secure token storage and transmission

- **RBAC Permission System**
  ```python
  # Granular permissions system
  PERMISSIONS = [
      'can_view_submissions', 'can_edit_submissions', 'can_delete_submissions',
      'can_create_forms', 'can_edit_forms', 'can_publish_forms',
      'can_manage_users', 'can_assign_roles', 'can_view_audit_logs',
      'can_export_data', 'can_search_patients', 'can_send_notifications',
      'can_manage_project_settings', 'can_delete_project'
  ]
  ```

- **Authorization Middleware**
  - Decorator-based permission checking
  - Project-contextual authorization (user must have role in specific project)
  - Audit logging for all permission checks

### 1.4 Core API Endpoints (2 weeks)
**Priority: High - Enables frontend integration**

- **Project Management APIs**
  ```
  POST /api/projects - Create new project
  GET /api/projects - List user's projects
  GET /api/projects/{id} - Get project details
  PUT /api/projects/{id} - Update project settings
  DELETE /api/projects/{id} - Delete project (with safeguards)
  ```

- **User & Role Management APIs**
  ```
  GET /api/projects/{id}/members - List project members
  POST /api/projects/{id}/members/invite - Invite new member
  PUT /api/projects/{id}/members/{user_id}/roles - Update member roles
  GET /api/projects/{id}/roles - List project roles
  POST /api/projects/{id}/roles - Create new role
  PUT /api/projects/{id}/roles/{role_id} - Update role permissions
  ```

- **Form Management APIs**
  ```
  GET /api/projects/{id}/forms - List project forms
  POST /api/projects/{id}/forms - Create new form
  GET /api/projects/{id}/forms/{form_id} - Get form schema
  PUT /api/projects/{id}/forms/{form_id} - Update form
  POST /api/projects/{id}/forms/{form_id}/versions - Create new version
  ```

---

## Phase 2: Frontend State Management & Clinical UX Foundation (4-6 weeks)

### 2.1 Zustand State Architecture (1 week)
**Priority: Critical - Enables complex state management**

- **Core Store Implementation**
  ```typescript
  // authStore.ts - Authentication and user context
  interface AuthState {
    isAuthenticated: boolean
    user: User | null
    activeProjectRoles: string[]
    login: (token: string) => void
    logout: () => void
    setProjectRoles: (roles: string[]) => void
  }

  // projectStore.ts - Project context and selection
  interface ProjectState {
    availableProjects: Project[]
    activeProjectId: string | null
    activeProjectDetails: Project | null
    setActiveProject: (projectId: string) => void
    fetchAvailableProjects: () => Promise<void>
  }

  // submissionStore.ts - Multi-form data collection
  interface SubmissionState {
    patientData: PatientInputData | null
    formsInSequence: FormDefinition[]
    allFormsData: Record<string, any>
    currentFormIndex: number
    encounterStatus: 'idle' | 'active' | 'paused' | 'completed'
    startNewEncounter: (patient: PatientInputData, forms: FormDefinition[]) => void
    updateFormData: (formKey: string, data: any) => void
    navigateToForm: (index: number) => void
    pauseEncounter: () => void
    resumeEncounter: () => void
    submitEncounter: () => Promise<void>
  }
  ```

- **Persistence & Hydration**
  - LocalStorage integration for draft submissions
  - Automatic state restoration on page reload
  - Conflict resolution for concurrent sessions

### 2.2 Sequential Multi-Form Clinical UX (2 weeks)
**Priority: Critical - Core clinical workflow**

- **Enhanced DataSubmissionPage.tsx**
  - Patient identification workflow with pseudonymization preview
  - Multi-layered consent collection (project, form, recontact)
  - Form sequence navigation with progress indicators
  - Touch-optimized interface for tablets/smartphones

- **Clinical UX Principles Implementation**
  ```typescript
  // Large touch targets (minimum 44px)
  // Immediate validation feedback
  // Swipe gestures for form navigation
  // Offline-capable data entry with sync
  // Voice input preparation (future)
  ```

- **Form State Persistence**
  - Auto-save every 30 seconds during data entry
  - Recovery from unexpected disconnections
  - "Resume where you left off" functionality
  - Data integrity checks before submission

### 2.3 Project-Contextual Navigation Enhancement (1 week)
**Priority: High - Improves user experience**

- **Enhanced Layout.tsx**
  - Project-specific breadcrumb navigation
  - Context-sensitive header actions
  - Role-based feature visibility
  - Mobile-responsive sidebar with touch gestures

- **Page-Level Project Integration**
  - All pages consume project context
  - Permission-based component rendering
  - Project-scoped data loading
  - Error handling for insufficient permissions

### 2.4 Form Builder Foundation (1-2 weeks)
**Priority: Medium - Enables form customization**

- **Basic Form Builder UI**
  - JSON Schema editor with visual preview
  - Widget mapping interface (schema field → UI component)
  - Form metadata management (title, description, version)
  - Schema validation with real-time error display

- **Advanced Widget Configuration**
  - AutocompleteTagSelector data source configuration
  - DrugSection customization options
  - Conditional field logic setup
  - Custom validation rules editor

---

## Phase 3: Data Submission & Patient Management (4-5 weeks)

### 3.1 Backend Form Submission System (2 weeks)
**Priority: Critical - Core data collection functionality**

- **Form Submission APIs**
  ```python
  POST /api/projects/{id}/submissions
  GET /api/projects/{id}/submissions
  GET /api/projects/{id}/submissions/{submission_id}
  PUT /api/projects/{id}/submissions/{submission_id}
  DELETE /api/projects/{id}/submissions/{submission_id}
  ```

- **Patient Pseudonymization Implementation**
  - Real-time patient_id generation from input data
  - Duplicate patient detection and linking
  - Patient consent status tracking
  - Contact information encryption and storage

- **Form Version Management**
  - Schema compatibility checking
  - Migration scripts for version updates
  - Legacy submission support
  - Version-specific validation

### 3.2 Patient Search & Data Retrieval (1 week)
**Priority: High - Essential for clinical workflow**

- **Pseudonymized Search API**
  ```python
  GET /api/projects/{id}/patients/search?initials=JS&gender=M&dob=2017-02-04
  # Returns: List of submissions for calculated patient_id
  ```

- **Patient Search UI**
  - Intuitive search interface with autocomplete
  - Search result display with submission timeline
  - Permission-based data access controls
  - Export functionality for authorized users

### 3.3 Enhanced Data Submission Frontend (1-2 weeks)
**Priority: High - Clinical user experience**

- **Complete Multi-Form Workflow**
  - Seamless form-to-form transitions
  - Progress tracking and completion status
  - Error handling and validation feedback
  - Bulk submission capabilities

- **Mobile-Optimized Interface**
  - Touch-friendly form controls
  - Gesture-based navigation
  - Offline data entry with sync
  - Adaptive layouts for various screen sizes

---

## Phase 4: Advanced Project Management & Collaboration (3-4 weeks)

### 4.1 Role Editor & Member Management (2 weeks)
**Priority: High - Essential for multi-user projects**

- **Advanced Role Editor UI**
  - Granular permission assignment interface
  - Role templates for common use cases
  - Permission inheritance and conflicts resolution
  - Bulk role assignments

- **Member Management System**
  - User invitation workflow with email integration
  - Member onboarding and role assignment
  - Access level modifications and audit trail
  - Member removal and data access revocation

### 4.2 Project Settings & Privacy Configuration (1 week)
**Priority: High - LGPD compliance interface**

- **Privacy Policy Configuration UI**
  - Data retention period settings
  - Consent requirement customization
  - Export policies and restrictions
  - Contact data handling preferences

- **Project Lifecycle Management**
  - Project archiving and data retention
  - Bulk data export for project closure
  - Legal compliance reporting
  - Data anonymization workflows

### 4.3 Audit & Compliance Features (1 week)
**Priority: Medium - Governance and transparency**

- **Audit Log Interface**
  - Searchable and filterable access logs
  - User activity timelines
  - Data modification history
  - Export compliance reports

- **Compliance Dashboard**
  - LGPD compliance status indicators
  - Data retention policy enforcement
  - Consent status monitoring
  - Security incident tracking

---

## Phase 5: Notifications & Communication (3-4 weeks)

### 5.1 Notification System Backend (2 weeks)
**Priority: Medium - Patient engagement and follow-up**

- **Email Service Integration**
  - Configure SendGrid/Mailgun integration
  - Template-based email composition
  - Encrypted contact data handling
  - Delivery status tracking and retry logic

- **Notification Scheduling System**
  ```python
  # Flexible scheduling rules
  POST /api/projects/{id}/notification-rules
  {
    "trigger": "days_after_submission",
    "form_id": "intra_operative",
    "delay_days": 30,
    "template": "followup_30_days",
    "consent_required": "recontact"
  }
  ```

### 5.2 Notification Management UI (1 week)
**Priority: Medium - User control over communications**

- **Notification Rule Configuration**
  - Visual rule builder interface
  - Template editor with variable substitution
  - Schedule preview and testing
  - Bulk notification management

### 5.3 Patient Communication Portal (1 week)
**Priority: Low - Future patient engagement**

- **Token-Based Access System**
  - Secure tokenized links for patients
  - No-login form completion
  - Progress tracking for multi-part surveys
  - Consent management for patients/guardians

---

## Phase 6: Advanced Features & Optimization (4-5 weeks)

### 6.1 Advanced Form Builder (2 weeks)
**Priority: Medium - Enhanced form creation capabilities**

- **Drag-and-Drop Interface**
  - Visual form designer with widget palette
  - Real-time preview with actual data
  - Advanced conditional logic builder
  - Form template library and sharing

### 6.2 Data Export & Analytics Preparation (1 week)
**Priority: Medium - Research data utilization**

- **Secure Data Export System**
  - Multiple export formats (CSV, JSON, SPSS)
  - Export-specific pseudonymization
  - Audit trail for all exports
  - Scheduled automated exports

### 6.3 Performance Optimization & Scalability (1-2 weeks)
**Priority: Medium - Production readiness**

- **Backend Optimization**
  - Database query optimization and indexing
  - API response caching strategies
  - Connection pooling and resource management
  - Load testing and performance monitoring

- **Frontend Optimization**
  - Code splitting and lazy loading
  - Form caching and offline capabilities
  - Progressive Web App features
  - Mobile performance optimization

---

## Phase 7: Production Deployment & Quality Assurance (3-4 weeks)

### 7.1 Security Audit & Penetration Testing (2 weeks)
**Priority: Critical - Production security**

- **Comprehensive Security Review**
  - Authentication and authorization testing
  - Data encryption validation
  - API security assessment
  - Frontend security hardening

### 7.2 End-to-End Testing & User Acceptance (1 week)
**Priority: Critical - Quality assurance**

- **Complete User Journey Testing**
  - Project creation to data export workflows
  - Multi-user collaboration scenarios
  - Mobile device compatibility testing
  - Performance under load testing

### 7.3 Production Deployment & Monitoring (1 week)
**Priority: Critical - Go-live preparation**

- **Production Infrastructure**
  - Render.com deployment configuration
  - Database backup and recovery procedures
  - SSL/TLS certificate management
  - Environment variable security

- **Monitoring & Alerting**
  - Application performance monitoring
  - Error tracking and alerting
  - User analytics and usage patterns
  - Security incident detection

---

## Future Vision & Long-Term Roadmap (Post-MVP)

### Advanced Clinical Integration
- **Voice Input Integration**: Speech-to-text for hands-free data entry
- **Barcode/QR Code Scanning**: Equipment and medication tracking
- **Integration with Hospital Systems**: HL7 FHIR compatibility
- **Real-time Collaboration**: Multi-user simultaneous data entry

### Enhanced Analytics & Research Tools
- **Statistical Analysis Integration**: R/Python notebook integration
- **Machine Learning Pipelines**: Automated pattern recognition
- **Predictive Modeling**: Risk stratification tools
- **Research Collaboration**: Multi-site study coordination

### Regulatory & Compliance Evolution
- **FDA 21 CFR Part 11 Compliance**: Electronic records and signatures
- **International Standards**: ISO 27001, HIPAA compliance options
- **Regulatory Reporting**: Automated adverse event reporting
- **Data Governance**: Advanced data lineage and provenance

---

## Success Metrics & Key Performance Indicators

### Technical KPIs
- **Page Load Time**: < 2 seconds for form loading
- **Mobile Responsiveness**: 100% touch interface compatibility
- **Uptime**: 99.9% availability target
- **Data Security**: Zero data breaches or unauthorized access

### User Experience KPIs
- **Form Completion Rate**: > 95% for started forms
- **User Adoption**: Time to productivity < 30 minutes for new users
- **Mobile Usage**: > 60% of data entry via mobile devices
- **Error Rate**: < 1% data validation errors

### Research Impact KPIs
- **Data Quality**: > 98% complete data fields
- **Multi-site Adoption**: Support for > 10 concurrent projects
- **Compliance**: 100% LGPD compliance audit success
- **Research Output**: Enable > 5 peer-reviewed publications per year

This comprehensive roadmap balances immediate clinical needs with long-term research platform goals, ensuring PedAir becomes a robust, secure, and user-friendly platform for pediatric surgical research while maintaining strict compliance with Brazilian data protection regulations. 