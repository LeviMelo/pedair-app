# Frontend Design Philosophy - PedAir

## 1. Core Aesthetic: Clinical Precision, Modern Clarity

The PedAir interface aims for a **clinical-scientific aesthetic** that instills confidence and trust, combined with **modern UI sensibilities** for a positive and efficient user experience. The design should feel professional, reliable, and cutting-edge.

## 2. Key Visual Elements & Principles

*   **Color Palette:**
    *   **Primary:** Clean neutrals (whites, light grays, dark grays for text/elements) for the base UI to maintain a professional and uncluttered look.
    *   **Accents:** Judicious use of **bright, clear colors** (e.g., a specific blue for primary actions, greens for success, reds for alerts/errors). These should be used consistently for calls to action, highlighting important information, and data visualization (e.g., status indicators, drug categories if applicable, charts). Accent colors should also be thoughtfully integrated to bring more "soul" and visual interest to the application, potentially in section backgrounds, iconography, and subtle UI flourishes, without becoming distracting.
    *   **Dark Mode:** A fully supported, thoughtfully designed dark theme is crucial. It should use a desaturated dark background (not pure black) with appropriate contrast for text and interactive elements to reduce eye strain and offer user choice.

*   **Typography:**
    *   **Font Family:** Modern, highly legible sans-serif fonts (e.g., Inter, Roboto, Open Sans). Ensure excellent readability at various sizes.
    *   **Hierarchy:** Clear and consistent typographic hierarchy (headings, subheadings, body text, captions) to guide the user and structure information effectively.

*   **Layout & Spacing:**
    *   **Grid-Based:** Utilize a consistent grid system for alignment and structure.
    *   **Spaciousness:** Ample whitespace to prevent clutter and improve focus on content areas. Avoid overly dense interfaces.
    *   **Consistency:** Uniform padding, margins, and spacing rules across all components and views.
    *   **Alignment:** Pay meticulous attention to alignment across different sections of the layout, for instance, ensuring the sidebar's top edge or logo block aligns harmoniously with the main content header.

*   **Visual Depth & Modernism:**
    *   **Shadows:** Subtle, well-diffused shadows to create depth and elevate interactive elements (cards, buttons, modals) from the background. Avoid harsh or overly prominent shadows.
    *   **Glows:** Minimal and purposeful use of soft glows, perhaps for indicating focus on an active element or as part of a notification system. Should be subtle and not distracting.
    *   **Glassmorphism (Optional & Subtle):** Can be considered for specific, non-critical UI areas like sidebars, modal backgrounds, or decorative card layers. If used, it should be subtle with appropriate blur and transparency to maintain readability and not overwhelm the primary content. The effect should enhance the modern feel without compromising usability.

*   **Iconography:**
    *   Clean, modern, and universally understandable icons. Consistency in style and weight is key.
    *   Use SVGs for scalability and clarity.
    *   **Sidebar Icons:** Generally displayed with their inherent or theme-defined colors.
    *   **Header Icons:** Typically rendered monochromatically (e.g., using `currentColor` or a specific neutral shade) to maintain a cleaner header aesthetic, unless a specific icon requires color for status indication (e.g., a notification badge).

## 3. Interaction & User Experience

*   **Responsiveness:** Fully responsive design that adapts seamlessly to various screen sizes, from mobile to desktop.
*   **Touch-Friendly Interactions & Diverse Input Modalities:** Prioritize designing for touch interfaces, especially for tablets and phones. Explore and implement varied input controls (e.g., sliders, steppers, interactive time pickers) to minimize reliance on keyboard entry and enhance usability in clinical settings.
*   **Centralized CSS and Reusable Components:** Adhere to the principle of centralizing common styles in global CSS (e.g., `index.css` using Tailwind's `@apply`) and building a robust library of reusable UI components. This ensures consistency, maintainability, and a coherent visual language across the application.

*   **Application Flow & Navigation:**
    *   **Dashboard as Central Hub:** The `DashboardPage` serves as the primary landing area after login. It should provide users with an overview of their projects, relevant news or updates (placeholder), quick access to their user profile, and a clear path to create new projects (if permitted). It's envisioned as a more comprehensive space, potentially distinct in its feel from the in-project operational pages.
    *   **Project-Centric Workflow:** Once a project is selected (typically from the Dashboard), the application context switches to that specific project.
    *   **Project Details Page:** A dedicated page (e.g., `/project/:projectId`) will display detailed information about the active project, including its description, goals, and a visual representation of team members (e.g., cards showing names, roles, photos, contact info), with potential emphasis on the project lead.
    *   **Sidebar Navigation (Project Context):** The main sidebar provides navigation to different functional areas *within the context of the active project*. Links to features like "Data Submission," "Form Builder," "Role Editor," "Patient Search," etc., are only enabled and visible if:
        1.  An active project is selected.
        2.  The authenticated user possesses the necessary roles/permissions *for that specific project* to access the feature. Tooltips should clarify why a link is disabled.
    *   **Header as Contextual Action Bar:** The main application header, besides displaying the current page title and global actions (like notifications or user profile access), will dynamically adapt to the active sidebar navigation item. It can provide context-specific actions or sub-navigation related to the selected page. For example:
        *   If "Data Submission" is active, the header might offer "View Existing Patient Entries" and "Start New Patient Data Collection."
        *   If "Form Builder" is active, it might show "Create New Form" or "Load Existing Form."

*   **Sidebar Behavior:**
    *   **Collapsible Handle:** The sidebar should feature a minimal, discrete button/handle for collapsing and expanding, integrated subtly into its border or header.
    *   **Collapsed State:** In its collapsed state, the sidebar should only display icons, with tooltips appearing on hover to reveal item labels.
    *   **Dividers:** Navigation items within the sidebar should have subtle, minimal visual dividers (e.g., a very light, thin border or a slight change in background shade for separation) to enhance readability without adding clutter.
    *   **Animation:** Sidebar collapse/expand animation should be smooth and refined, not abrupt. Text labels should gracefully fade or slide out, and icon sizes might subtly transition.
    *   **Small Screen Adaptation:** On smaller screens (e.g., mobile, tablets in portrait), the sidebar should default to a collapsed state or transform into an off-canvas menu to maximize content visibility.
*   **Feedback:** Clear visual feedback for user actions (e.g., hover states, active states, loading indicators, success/error messages).
*   **Intuitive Navigation:** Simple, predictable, and efficient navigation patterns.
*   **Accessibility (WCAG AA Compliance):**
    *   Sufficient color contrast for text and UI elements.
    *   Keyboard navigability for all interactive elements.
    *   Proper use of ARIA attributes where necessary.
    *   Focus indicators should be clear.
*   **Clinical Form Presentation (Step-by-Step):**
    *   **Prioritize Campo Único Visível (Single Visible Field/Section Focus):** To reduce cognitive load and enhance usability in dynamic clinical environments, especially on touch/mobile devices, long or complex forms should be broken down into smaller, manageable chunks or steps.
    *   Each step should ideally focus on a single section or a very small group of related fields.
    *   Clear and intuitive navigation (e.g., "Next" and "Previous" buttons) must be provided to move between these steps.
    *   Provide a sense of progress (e.g., step indicators).
*   **Performance:** Optimize for fast load times and smooth interactions.

## 4. Component Design

*   **Modularity:** Design reusable components that can be consistently applied across the application (buttons, input fields, cards, modals, etc.).
*   **States:** Components should have clearly defined states (default, hover, focused, active, disabled).

## 5. Dark Mode Specifics

*   **Rethink Shadows/Elevation:** In Dark Mode, traditional shadows for elevation should be largely replaced or complemented by **soft glows** around elevated elements (cards, modals, active buttons). These glows should use desaturated accent colors or a subtle, lighter shade of the background to create depth.
*   **Desaturated Palette:** The Dark Mode color palette should lean towards desaturated tones. Pure black for backgrounds should be avoided; instead, use very dark grays or blues (e.g., `slate-800` to `slate-900` as a base, potentially `slate-850` for slightly off-base elements like sidebars or headers if needed for subtle separation). Primary accent colors (like the action blue, e.g., `blue-500` or `blue-400` in dark mode) should be slightly desaturated or their lightness adjusted to maintain pleasing contrast without being overly vibrant against dark backgrounds.
*   **Text Contrast:** Ensure high text contrast in dark mode. Off-whites or very light grays (e.g., `slate-200`, `slate-300`) for text are preferable to pure white for better readability and reduced eye strain.
*   **Glassmorphism in Dark Mode:** If glassmorphism is used, its appearance in dark mode should be carefully considered. Blur intensity and transparency may need adjustment. It could subtly pick up desaturated background colors or use a faint inner glow effect. Care must be taken to ensure it doesn't make text or interactive elements hard to read.
*   **Specific Component Styling:** For key components like buttons and input fields in dark mode:
    *   **Buttons:** Primary action buttons might use a desaturated version of their light mode color or a brighter shade (e.g., `blue-500`) with a subtle glow on hover/focus. Secondary/ghost buttons should have clear, light borders (e.g., `slate-600` or `slate-700`) or subtle background changes on hover (e.g., to `slate-750`).
    *   **Input Fields:** Should have clearly defined borders (e.g., `slate-600` or `slate-700`), possibly a slightly lighter background than the main dark background (e.g. `slate-800` if main is `slate-850` or `slate-900`), and clear focus states (e.g., a glowing border using an accent color like `blue-500`).
*   **Color Adaptation:** (This can be merged or refined with the above) Accent colors might need slight desaturation or brightness adjustments to work well on a dark background.
*   **Elevation:** (This can be merged or refined with the above) Shadows might need to be less reliant on darkness and more on spread or even subtle lighter glows to indicate elevation on dark surfaces.
*   **Image/Illustration Handling:** Ensure any images or illustrations have a dark mode-friendly version or are designed to work on both light and dark backgrounds.

## Tools & Implementation

*   **Tailwind CSS:** Leverage Tailwind CSS for utility-first styling. Define the core color palette, font families, and spacing scales in `tailwind.config.js` to ensure consistency and enable the dark mode variant (`darkMode: 'class'`).
*   **Centralized Styles & Reusable Components:** Common styling patterns (buttons, inputs, cards, etc.) should be defined as global classes in `index.css` using `@apply` or as base styles for reusable React components. This approach promotes consistency and reduces code duplication, aligning with the goal of a maintainable and aesthetically cohesive UI.

This philosophy will guide the UI/UX development, ensuring PedAir is not only functional and scientifically robust but also a pleasure to use. 