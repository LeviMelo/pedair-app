# PedAir Development Roadmap

This document outlines the key phases and tasks for the development of the PedAir platform, aligning with the updated project vision.

## Phase 1: Foundational Backend and Core Modules

1.  **Review and Refine Privacy Policies per Project:**
    *   Adjust the `privacy_profile` for each anticipated study type.
    *   Ensure compliance with LGPD, clearly defining the basis for data processing (e.g., "legitimate interest" vs. "consent").
    *   Define rules for re-contact, data retention, and data exclusion.

2.  **Implement Pseudonymization Module:**
    *   Develop HMAC functions with salt and pepper for `patient_id` generation.
    *   Establish procedures for key rotation and secure management of secrets in the production environment.

3.  **Build Backend Authentication and Role-Based Access Control (RBAC):**
    *   Configure Google OAuth 2.0 for user authentication.
    *   Create database tables for `roles` and `user_roles`.
    *   Implement decorators or middleware for verifying permissions on API endpoints.

## Phase 2: Dynamic Forms and Frontend Development

4.  **Develop Dynamic Form Builder:**
    *   Create a React-based UI for creating and editing JSON Schema definitions for forms.
    *   Allow users to define input types, labels, validation rules, and conditional logic for form fields.

5.  **Implement Encrypted Email System and Scheduling:**
    *   Configure `cryptography.fernet` (or a similar library) for encrypting and decrypting email addresses.
    *   Develop a service for scheduling and sending reminders and notifications (either via internal cron jobs or a PaaS scheduling service).

## Phase 3: Auditing, Testing, and Refinement

6.  **Implement Comprehensive Auditing and Logging:**
    *   Ensure that all critical actions (e.g., `patient_id` searches, form edits, notification dispatches) are logged.
    *   Logs should include `user_id`, `timestamp`, `project_id`, `action`, and `target_patient_id_hash` (if applicable).
    *   Guarantee a minimum log retention period of 180 days.

7.  **Thorough Testing and Validation:**
    *   Create detailed test scenarios for all major user flows:
        *   Project and form creation/configuration.
        *   Initial and subsequent data submissions.
        *   Pseudonymized patient search functionality.
        *   Notification sending and log analysis.
        *   Consent management (including granting, revoking, and data exclusion).
    *   Conduct integration testing between frontend and backend components.
    *   Perform security testing, particularly around data privacy and access control.

## Phase 4: UI/UX Refactor and Integration of Form Approaches

*   **Major UI Refactor:**
    *   Modernize the overall user interface and user experience.
    *   Ensure intuitive navigation and a clean, accessible design.
*   **Integrate Fixed and Customizable Forms:**
    *   Brainstorm and implement a strategy to allow projects to use pre-defined (fixed) forms for common scenarios while also supporting fully customizable forms created with the dynamic form builder.
    *   Ensure UI features from the old fixed-form approach are preserved or enhanced in the new system.

---

This roadmap will be updated as the project progresses and new priorities emerge. 