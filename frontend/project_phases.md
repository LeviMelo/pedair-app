# PedAir Development Roadmap (Revised)

This document outlines the key development phases for the PedAir platform, aligned with the detailed project vision and updated requirements.

## Phase 1: Core Backend Foundations & Security (Conceptual - Backend Team Focus)

*   **1.1. Privacy Policies & Compliance Framework:**
    *   Define project-level privacy profiles (LGPD: legitimate interest vs. consent, retention policies, data exclusion rules).
    *   Establish protocols for cryptographic key management and rotation.
*   **1.2. Pseudonymization Module:**
    *   Implement HMAC-SHA256 for `patient_id` generation (salt, pepper).
    *   Implement a secondary transient hash (`export_patient_id`) for data exports.
    *   Securely manage all cryptographic secrets (environment variables).
*   **1.3. Authentication & Authorization (RBAC Core):**
    *   Integrate Google OAuth 2.0 for user authentication.
    *   Design and implement database schema for `users`, `projects`, `roles`, and `user_roles` to support project-specific, customizable roles and permissions.
    *   Develop core JWT-based authentication for API endpoints.
    *   Implement backend logic for permission checking based on JWT claims and database roles.
*   **1.4. Database Schema & Core APIs:**
    *   Finalize and implement the database schema (PostgreSQL) for all core entities: `projects`, `forms` (including versioning), `form_submissions`, `patients`, `contact_log`, `access_logs`.
    *   Develop initial CRUD APIs for managing `projects`, `forms` (schemas and versions), and basic `user` profile information.

## Phase 1.5: Frontend Architectural Refactor - Project Context, RBAC Foundation & State Management

*   **1.5.1. Global State Management with Zustand (Mocked Auth/Roles & Submission State):**
    *   Install Zustand.
    *   Implement Zustand stores to manage global application state:
        *   `projectStore`: Manages the currently active/selected project ID, project details (mocked initially), and list of available projects.
        *   `authStore`: Manages (mocked) authenticated user information, including their roles specific to the active project (e.g., `ProjectLead`, `Researcher`).
        *   `submissionStore`: Manages the state of active/in-progress multi-form data submissions. This will include:
            *   Current patient identification data (`patientInputData`).
            *   The sequence of forms to be filled (`formsInSequence: FormDefinition[]`).
            *   The data for each form in the sequence (`allFormsData: { [formKey: string]: any }`).
            *   The index of the current form being filled in the sequence (`currentFormIndexInSequence`).
            *   This store will be crucial for the "quit and resume" functionality.
    *   Replace any existing React Context-based global state with Zustand.
*   **1.5.2. Dashboard as Project Launchpad:**
    *   Refactor `DashboardPage.tsx` to display a list of (mocked) projects.
    *   Allow users to select a project, which updates the `ProjectContext`.
*   **1.5.3. Conditional Navigation & UI Access (RBAC Foundations):**
    *   Modify `Layout.tsx` (sidebar) so that navigation links to project-specific tools (Form Builder, Role Editor, Data Submission, Patient Search) are dynamically rendered or enabled/disabled based on:
        *   An active project being selected via `ProjectContext`.
        *   The (mocked) user's role within that project, as provided by `AuthContext`.
    *   Implement basic route protection or conditional rendering within pages to restrict access if a project isn't selected or if the user lacks the necessary (mocked) role.
*   **1.5.4. Project-Aware Page Adaptation (Initial):**
    *   Begin adapting existing pages (`FormBuilderPage`, `RoleEditorPage`, etc.) to consume the `ProjectContext`. Their internal logic will start to depend on the selected project ID for fetching/displaying relevant data (though data will still be mocked or frontend-only for now).

## Phase 2: Frontend - Dynamic Forms & Clinical UX Refinement (Post-Architectural Refactor)

*   **2.1. Sequential Multi-Form Submission UX with State Persistence:**
    *   Refactor `DataSubmissionPage.tsx` to implement a sequential, multi-form workflow for patient data collection:
        *   **Initial Step**: Capture patient identification data and (simulated) consent information.
        *   **Form Sequence Management**: 
            *   Define or fetch a sequence of forms (e.g., Pre-Op, Intra-Op, Post-Op) for the patient encounter (initially mocked).
            *   Maintain the index of the currently active form in this sequence.
        *   **Form Rendering**: Dynamically load and render the *entirety* of the current form in the sequence using `DynamicFormRenderer.tsx`.
        *   **Navigation**: Implement "Next Form" and "Previous Form" (or similar) controls to navigate through the sequence.
        *   **Data Persistence within Encounter**: 
            *   As the user navigates between forms or completes a form, its data is saved into a central state object within `DataSubmissionPage.tsx` (e.g., `allFormsData`). 
            *   This state (patient ID, all collected form data, current form index) will then be managed by the `submissionStore` (Zustand) to enable pausing and resuming the entire submission process for a patient.
        *   **Submission Action**: Define how data for individual forms or the entire sequence is finalized/submitted (e.g., a "Complete Form & Proceed" button, and a final "Submit All Encounter Data" action after the last form).
    *   Ensure `DynamicFormRenderer.tsx` continues to render individual forms completely, without internal stepping.
*   **2.2. Form Versioning Awareness (Frontend):**
    *   Enable `DataSubmissionPage.tsx` to display the version of the selected form (loaded based on `ProjectContext`).
    *   Future: Allow selection from available form versions if multiple active versions exist for a form definition within the project.
*   **2.3. Basic Consent UI Placeholders & Integration Points:**
    *   Integrate placeholder UI elements (e.g., checkbox areas, informational text) on `DataSubmissionPage.tsx` (for form-specific and recontact consent) and relevant project settings/creation pages (for project-level consent), ensuring these are sensitive to `ProjectContext`.
*   **2.4. Initial Page Enhancements & Alignment (Project-Contextual):**
    *   `DashboardPage.tsx`: After project selection, this page might display project-specific summaries or quick links relevant to the active project and user role. The "Create New Project" button functionality needs consideration for where it lives if the dashboard now lists existing projects.
    *   `PatientSearchPage.tsx`: Ensure search operations are scoped to the selected `ProjectContext`.
    *   `Layout.tsx`: Confirm sidebar navigation, page titles, and overall structure are coherent with the project-contextual workflow.

## Phase 3: Frontend - Form & Role Management (MVP - Project Contextual)

*   **3.1. Form Builder (MVP 1 - Project-Scoped Schemas):**
    *   Develop the initial UI in `FormBuilderPage.tsx` for creating and editing form JSON Schemas and UI Schemas *for the selected project*.
    *   Allow configuration of UI widgets through the UI Schema editor.
    *   Implement UI to manage basic form metadata (title, description) and versioning *within the active project context*.
*   **3.2. Role Editor (MVP 1 - Project-Scoped Roles & Permissions):**
    *   Develop the initial UI in `RoleEditorPage.tsx` for managing roles and permissions *specific to the selected project*.
        *   Creating, viewing, and listing project-specific roles.
        *   Assigning a predefined set of high-level permissions to these roles.
        *   Basic user invitation (placeholder) and assignment to roles *within the active project*.
*   **3.3. Data Submission Flow Refinement (API-Driven Form List):**
    *   Enhance `DataSubmissionPage.tsx` to allow users to select from a list of available forms (and their versions) for the *active project*, fetched from an API endpoint (initially mocked, then real).

## Phase 4: Backend - API Expansion & Core Logic Implementation (Supporting Project Context)

*   **4.1. Form & Role Management APIs (Project-Scoped):**
    *   Develop comprehensive backend APIs to fully support the Form Builder MVP (CRUD for schemas, uiSchemas, form versions, metadata, all scoped by `project_id`).
    *   Implement APIs for the Role Editor MVP (CRUD for project-specific roles, permissions, user-role assignments, all scoped by `project_id`).
*   **4.2. Data Submission & Pseudonymization APIs (Project-Scoped):**
    *   Implement the backend endpoint for form submissions, including `project_id` in requests, `patient_id` generation (HMAC logic using `project_id`), validation against schema version, and storage of `form_data` linked to `project_id`, form version, and `patient_id`.
    *   Develop the API for pseudonymized patient search, requiring `project_id` as a parameter.
*   **4.3. Consent Management Backend Logic (Project-Scoped):**
    *   Implement backend logic and API endpoints for recording, retrieving, and verifying multi-layer consent status, ensuring all consent data is linked to a `project_id`.
*   **4.4. Encrypted Contact Storage & Notification Service Stubs (Project-Scoped):**
    *   Ensure `contact_log` table and encryption logic handle contacts in a project-specific manner if required by privacy policies.
    *   Develop API stubs for managing notification rules (potentially project-specific) and triggering placeholder notifications.
*   **4.5. Core Auditing Implementation (Project-Scoped):**
    *   Ensure critical backend actions logged to `access_logs` include `project_id`.

## Phase 5: Frontend - Advanced Features & Full Clinical UX Integration (Project Contextual)

*   **5.1. Form Builder (MVP 2 - Enhanced UI, Project-Scoped):**
    *   Implement a visual drag-and-drop interface in `FormBuilderPage.tsx` for forms within the selected `ProjectContext`.
    *   Develop UI for defining conditional logic within forms.
*   **5.2. Role Editor (Advanced Permissions & Project Member Management):**
    *   Enhance the UI to support assignment of fine-grained permissions within the selected `ProjectContext`.
    *   Implement full user invitation and member management workflows for the active project.
*   **5.3. Full Page Implementations & API Integration (Project-Scoped):**
    *   `DashboardPage.tsx`: Fully implement project creation flow. Dynamic project listing (from API) based on user's access. Display of project-specific metrics for the selected project.
    *   `PatientSearchPage.tsx`: Integrate with backend API for project-scoped pseudonymized search.
    *   `NotificationSchedulerPage.tsx`: Develop UI for defining, viewing, and managing notification rules, ensuring they are project-contextual if necessary.
    *   `DataSubmissionPage.tsx`: Full integration with backend for dynamic form loading (based on selected project), submission with consent data, and handling of form versions.
*   **5.4. Comprehensive Consent Management UI (Project-Contextual):**
    *   Implement user-facing UIs for viewing and managing consent preferences, respecting the active `ProjectContext`.
*   **5.5. UI/UX Refinement & Iteration:**
    *   Iterate on the step-by-step form filling UX.
    *   Refine overall application aesthetics, responsiveness, and accessibility.

## Phase 6: Backend - Full Service Integration, Scalability & Reporting (Project Contextual)

*   **6.1. Full Notification Service Integration (Project-Scoped Logic):**
    *   Integrate with chosen email/messaging services, ensuring notification logic respects project-specific configurations if any.
*   **6.2. Advanced Auditing & Basic Reporting (Project-Scoped Access):**
    *   Develop a secure UI for authorized users to view `access_logs` relevant to projects they have permission to audit.
    *   Implement backend capabilities for generating project-scoped data export reports.
*   **6.3. Performance Optimization & Scalability Preparations:**
    *   Optimize database queries and API response times, considering multi-project data segmentation.

## Phase 7: Comprehensive Testing, Deployment & Long-Term Evolution

*   **7.1. End-to-End Testing & Quality Assurance:**
    *   Conduct thorough testing of all user flows, including project selection, role-based access scenarios within projects, and project-scoped data operations.
*   **7.2. Security Audits & Penetration Testing:**
    *   Perform security reviews.
*   **7.3. Production Deployment & Monitoring:**
    *   Prepare and execute deployment.
    *   Set up monitoring, logging, and alerting.
*   **7.4. User Feedback, Iterative Refinement & Long-Term Vision:**
    *   Gather feedback.
    *   Plan for subsequent iterations.
    *   Begin exploration for long-term vision features.

This roadmap provides a more granular approach to developing PedAir, prioritizing foundational backend work, the critical clinical UX refactor for forms, and then iteratively building out the more complex management UIs and backend services. 