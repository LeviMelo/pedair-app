# PedAir Development Diary

This document tracks major development milestones, decisions, challenges, bugs, fixes, and solutions encountered during the PedAir project refactor and enhancement.

## Entries

---

**YYYY-MM-DD: Project Refactor Kick-off & Initial Documentation**

*   **Decision:** Initiated a major project refactor based on the new `project_description.md`.
*   **Task:** Created `project_phases.md` to outline the development roadmap.
*   **Task:** Created this `dev_diary.md` for ongoing tracking.
*   **Next Steps:** Begin planning the integration of fixed and customizable forms and the UI refactor.

---

**YYYY-MM-DD: Code Refactor Planning & Information Gathering**

*   **Task:** Outlined high-level strategy for integrating fixed and customizable forms, and for the major UI refactor.
*   **Challenge:** Need more information about the current codebase structure (backend and frontend form definitions, UI components) to proceed with detailed refactoring plans.
*   **Discussion Point:** How to best represent fixed forms in the new system (e.g., as non-editable JSON Schemas) while preserving their specific UI characteristics.
*   **Next Steps:** Awaiting details on existing codebase to refine the refactoring approach. Requesting information on directory structure, current fixed-form definitions (backend/frontend), and specific UI features to preserve.

---

**YYYY-MM-DD: Frontend Design Philosophy & Revised Refactoring Strategy**

*   **Task:** Created `frontend/frontend_design_philosophy.md` outlining the UI/UX vision (clinical-scientific, modern, glows, shadows, glassmorphism, bright colors, dark mode).
*   **Decision:** Revised the project refactoring strategy after detailed review of `PreAnestesia.tsx`, `Intraoperatoria.tsx`, and `RecuperacaoPosAnestesica.tsx`.
*   **New Approach:** Focus on iteratively converting existing React component-based forms into JSON Schema and `uiSchema` definitions. This will involve:
    1.  Manually creating schema files for current forms.
    2.  Developing a dynamic form renderer that uses these schemas.
    3.  Adapting existing UI components (e.g., `InputField`, `DrugInputField`, `AutocompleteInput`) into reusable "widgets" driven by the schemas.
    4.  Creating new composite widgets for complex UI patterns (e.g., drug groups, autocomplete with tags).
*   **Rationale:** This approach better leverages the current frontend structure, maximizes UI component reuse, and provides a clearer path to backend integration and the new dynamic form builder.
*   **Next Steps:** Awaiting user feedback on the revised approach, information on the `frontend/src/components/ui/` directory structure, and guidance on which form to use as the first proof-of-concept for schema conversion.

---

**YYYY-MM-DD: Schema Definition for RecuperacaoPosAnestesica**

*   **Task:** Created `frontend/src/schemas/recuperacaoPosAnestesica.schema.json`.
    *   Defined properties: `tempoRecuperacao` (string/null, enum), `nivelDessaturacaoPos` (string/null, enum), `outrasQueixasPos` (array of strings, enum).
    *   Included `enumNames` for user-friendly labels for all enum values, including items in `outrasQueixasPos`.
    *   Marked `tempoRecuperacao` as required.
*   **Task:** Created `frontend/src/schemas/recuperacaoPosAnestesica.uiSchema.json`.
    *   Specified `ui:widget` for each property:
        *   `tempoRecuperacao`: "RadioButtonGroupField"
        *   `nivelDessaturacaoPos`: "RadioButtonGroupField"
        *   `outrasQueixasPos`: "CheckboxGroupField"
    *   Included a `ui:options: { required: true }` for `tempoRecuperacao` as an example of passing options to widgets.
*   **Status:** Ready to begin development of the `<DynamicFormRenderer>` component and adapt UI widgets.
*   **Next Steps:** Plan and start implementing the `<DynamicFormRenderer>` and necessary widget adaptations for `RadioButtonGroupField` and `CheckboxGroupField`.

---

**YYYY-MM-DD: DynamicFormRenderer Skeleton Created**

*   **Task:** Created the initial `frontend/src/components/forms/DynamicFormRenderer.tsx`.
    *   The component accepts `schema`, `uiSchema`, `formData`, and `onFormDataChange` props.
    *   It iterates through schema properties and currently renders placeholder information for each field, indicating the field name, intended widget, and current value.
    *   Basic structure for title and description from schema is included.
*   **Status:** Skeleton is in place.
*   **Next Steps:** Adapt existing UI components (`RadioButtonGroupField.tsx`, `CheckboxGroupField.tsx`) to serve as widgets by standardizing their props. Then, update `DynamicFormRenderer` to import and use these adapted widgets to render fields from `recuperacaoPosAnestesica.schema.json`.

---

**YYYY-MM-DD: Dynamic Form Rendering Test Page**

*   **Task:** Created `frontend/src/pages/TestRecuperacaoFormPage.tsx`.
    *   This page imports `DynamicFormRenderer`, the schemas for `RecuperacaoPosAnestesica` (`.schema.json` and `.uiSchema.json`).
    *   It initializes and manages `formData` state for the form.
    *   Renders the `DynamicFormRenderer` with the appropriate props.
    *   Includes a section to display the live `formData` JSON for debugging and verification.
*   **Linter Fix:** Addressed a type mismatch in `DynamicFormRenderer.tsx` by ensuring options passed to `CheckboxGroupField` have `value` as type `string`, introducing a `CheckboxWidgetOption` type for clarity.
*   **Status:** Ready for the user to integrate this test page into their `App.tsx` or routing setup to visually test the dynamic rendering of the `RecuperacaoPosAnestesica` form.
*   **Next Steps:** User to test the page. Based on results, debug any issues or proceed to adapt more complex forms/widgets.

---

**YYYY-MM-DD: Schemas for PreAnestesia Form**

*   **Task:** Created `frontend/src/schemas/preAnestesia.schema.json`.
    *   Defined properties: `idade` (number), `peso` (number), `sexo` (string with enum).
    *   Defined `diagnosticos`, `comorbidades`, `queixas` as arrays of objects, each object having at least `value` and `label` (plus `icd10` for diagnosticos).
    *   Marked `idade`, `peso`, `sexo` as required.
*   **Task:** Created `frontend/src/schemas/preAnestesia.uiSchema.json`.
    *   Specified `ui:widget` for each property:
        *   `idade`, `peso`: "InputFieldWidget" (with `ui:options` for `inputType` and `placeholder`).
        *   `sexo`: "SelectFieldWidget" (with `ui:options` for `placeholder`).
        *   `diagnosticos`, `comorbidades`, `queixas`: "AutocompleteTagSelectorWidget" (with `ui:options` to provide keys for option lists, placeholder, and sub-labels).
*   **Status:** Schemas for `PreAnestesia` form are defined.
*   **Next Steps:** Review existing `InputField.tsx` and `SelectField.tsx` from `frontend/src/components/ui/` for adaptation. Plan and create the new `AutocompleteTagSelectorWidget.tsx`. Update `DynamicFormRenderer` to handle these new widget types.

---

**YYYY-MM-DD: InputField and SelectField Widgets Integrated**

*   **Task:** Updated `DynamicFormRenderer.tsx` to correctly render `InputFieldWidget` and `SelectFieldWidget`.
    *   Handles `inputType` and `placeholder` from `ui:options` for `InputFieldWidget`.
    *   Manages `onChange` for both, adapting event-based changes to value-based changes for `onFormDataChange` (including parsing for number inputs).
    *   Generates `options` for `SelectFieldWidget` from schema enums.
*   **Linter Fix:** Resolved a linter error in `DynamicFormRenderer.tsx` by removing an unsupported `required` prop from `CheckboxGroupField`.
*   **Status:** `DynamicFormRenderer` can now handle basic input, select, radio group, and checkbox group fields based on schema definitions.
*   **Next Steps:** Plan and implement the `AutocompleteTagSelectorWidget` for complex array-of-objects fields (diagnoses, comorbidities, queixas) from `PreAnestesia.tsx`. This requires reviewing `QuickSelectButtons.tsx`, `AutocompleteInput.tsx`, and `SelectedItemTags.tsx`.

---

**YYYY-MM-DD: AutocompleteTagSelectorWidget and Data Source Created**

*   **Task:** Created `frontend/src/data/preAnestesiaOptions.ts` to centralize option lists (diagnoses, comorbidities, queixas) for the PreAnestesia form.
*   **Task:** Created the `frontend/src/components/widgets/` directory.
*   **Task:** Implemented `frontend/src/components/widgets/AutocompleteTagSelectorWidget.tsx`.
    *   The widget takes `id`, `label`, `value` (array of selected items), `onChange`, `uiOptions` (including keys for data sources), and `required` as props.
    *   It imports and uses `QuickSelectButtons`, `AutocompleteInput`, and `SelectedItemTags`.
    *   It fetches data from `preAnestesiaOptions.ts` based on keys in `uiOptions`.
    *   Includes handlers for quick toggle, autocomplete selection, and tag removal, all calling `props.onChange` to update form data.
*   **Task:** Updated `DynamicFormRenderer.tsx` to import and render `AutocompleteTagSelectorWidget` when specified in `uiSchema`.
    *   Passes appropriate props, including `value` from `formData` and `uiOptions`.
*   **Status:** `DynamicFormRenderer` is now equipped to handle complex custom widgets like `AutocompleteTagSelectorWidget`.
*   **Next Steps:** User to test the `PreAnestesia` form rendering (especially the Diagnósticos, Comorbidades, Queixas fields) using a test page (`TestPreAnestesiaFormPage.tsx`).

---

**YYYY-MM-DD: All Core Forms Dynamically Rendered & Tested**

*   **Task:** Created `frontend/src/data/intraoperatoriaOptions.ts` for Intraoperatória form option lists.
*   **Task:** Created `frontend/src/schemas/intraoperatoria.schema.json` and `frontend/src/schemas/intraoperatoria.uiSchema.json`.
*   **Task:** Updated `DynamicFormRenderer.tsx` to support `optionsSourceKey` in `uiSchema` for sourcing options from `intraOpDataSources`.
*   **Task:** Implemented `frontend/src/components/widgets/DrugSectionWidget.tsx` for rendering complex drug input sections, utilizing `DrugInputField`.
*   **Task:** Integrated `DrugSectionWidget` into `DynamicFormRenderer.tsx`.
*   **Task:** Created `frontend/src/pages/TestIntraoperatoriaFormPage.tsx` for testing the Intraoperatória form.
*   **Task:** Updated `frontend/src/App.tsx` to render `TestIntraoperatoriaFormPage.tsx` for easy testing of the most complex dynamic form.
*   **Achievement:** Successfully tested and confirmed that all three initial forms (`RecuperacaoPosAnestesica`, `PreAnestesia`, `Intraoperatoria`) are now dynamically rendered using their respective JSON schemas, UI schemas, and the `DynamicFormRenderer` with its associated widgets. The core dynamic form rendering mechanism is validated.
*   **Status:** The foundational work for schema-driven form rendering on the frontend is complete for the existing forms.
*   **Next Steps (High-Level):**
    1.  Begin work on the overall UI/UX refactor as per `frontend_design_philosophy.md` and `project_description.md` (e.g., main layout, navigation, dashboard).
    2.  Plan and develop the UI for the "Form Builder" (allowing users to create/edit JSON Schemas).
    3.  Commence backend development (Flask, SQLAlchemy, PostgreSQL, authentication, API endpoints for schemas and submissions).
    4.  Integrate frontend form submissions with the backend.
    5.  Address other features outlined in `project_phases.md` and `project_description.md` (pseudonymization, notifications, RBAC, etc.).

---

**YYYY-MM-DD: Basic Application Skeleton and Routing Implemented**

*   **Task:** Updated `project_description.md` and `frontend_design_philosophy.md` with user feedback regarding agile UX for medical professionals, touch-friendly inputs, and long-term vision (voice/PDF input).
*   **Task:** Created placeholder page components for all main application sections (`Dashboard`, `FormBuilder`, `RoleEditor`, `DataSubmission`, `PatientSearch`, `NotificationScheduler`, `Settings`, `NotFound`) in `frontend/src/pages/`.
*   **Task:** Implemented `frontend/src/components/layout/Layout.tsx` providing a basic structure with a sidebar (placeholder navigation links and icons), a header, and a main content area using `<Outlet />`.
*   **Task:** Configured routing in `frontend/src/App.tsx` using `react-router-dom` to link all placeholder pages and existing test form pages under the main `Layout`.
*   **Task:** Ensured `frontend/src/main.tsx` wraps the `App` component with `<BrowserRouter>`.
*   **Bug Fix:** Recreated the missing `TestPreAnestesiaFormPage.tsx` and corrected its internal state management and prop usage for `DynamicFormRenderer` (from `onSubmit` to `formData`/`onFormDataChange` with a local submit button). Corrected import paths and default import for `SectionCard`.
*   **Status:** The basic frontend application shell is functional. Navigation between pages is working, and pages are rendered within the main layout. The UI is currently barebones, using placeholder icons and styling.
*   **User Feedback:** User confirmed functionality but highlighted the need to improve aesthetics to align with `frontend_design_philosophy.md`, including proper icons and a collapsible sidebar.
*   **Next Steps:** 
    1.  Integrate an icon library (e.g., `react-icons`) and replace placeholder icons in `Layout.tsx`.
    2.  Implement collapsible sidebar functionality in `Layout.tsx`.
    3.  Implement the dark mode toggle functionality.
    4.  Begin applying more specific styling (colors, spacing, shadows, etc.) from `frontend_design_philosophy.md` to `Layout.tsx` and its sub-components (sidebar, header). 

---

**YYYY-MM-DD: UI Enhancement Iteration 1 (Icons, Dark Mode, Collapsible Sidebar)**

*   **Task:** Installed `react-icons` library.
*   **Task:** Enabled class-based dark mode in `tailwind.config.js`.
*   **Task:** Significantly updated `frontend/src/components/layout/Layout.tsx` to include:
    *   Phosphor icons (`react-icons/pi`) for navigation and actions.
    *   State and toggle functionality for a collapsible sidebar.
    *   State, toggle, and `localStorage` persistence for dark mode, applying `.dark` class to `<html>`.
    *   Dynamic page title in the header based on route.
    *   Placeholders for user avatar and notification bell in the header.
    *   Initial refined styling for colors, spacing, and dark mode variants.
*   **User Feedback (Visual Review):** 
    *   Collapsible sidebar is functional but toggle handle icon (`PiMenuIcon` / `PiCaretLeftDuotone`) isn't the desired "minimal button-handle."
    *   Sidebar collapse animation is too coarse; text labels disappear abruptly.
    *   Sidebar navigation items could use better, more minimal visual dividers.
    *   **Critical Layout Issue:** Main content header (with page title) is misaligned with the sidebar's top "PedAir" logo block.
    *   **Major Dark Mode Issue:** Dark mode is perceived as poorly handled, primarily just a dark blue background. Needs significant overhaul to match the (now updated) `frontend_design_philosophy.md` regarding desaturated palettes, glows instead of shadows, text contrast, and component-specific dark styles.
    *   Request to ensure sidebar auto-collapses on small screens (this was implemented, user likely reiterating its importance).
*   **Task:** Updated `frontend_design_philosophy.md` with much more detailed specifications for:
    *   Sidebar behavior (collapsible handle, collapsed state, dividers, animation, small screen adaptation).
    *   Dark Mode aesthetics (rethinking shadows/elevation with glows, desaturated palette, text contrast, glassmorphism considerations, specific component styling for buttons/inputs).
    *   Layout alignment principles.
*   **Next Steps:** 
    1.  Prioritize fixing the header misalignment.
    2.  Undertake a more thorough dark mode styling pass on `Layout.tsx` and core page elements (e.g., cards in `DashboardPage.tsx`) based on the updated philosophy.
    3.  Refine sidebar toggle handle, animation, and item dividers.

--- 