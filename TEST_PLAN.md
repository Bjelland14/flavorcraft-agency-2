# QA Test Plan: FlavorCraft Labs (Agency 2)

## 1. Project Information & Objective
* **Project:** Smart Recipe Discovery Web Application
* **Client:** FlavorCraft Labs
* **Prepared By:** Milagros Vasshus/Team Beta 
* **Date:** 10.10.2026

The objective of this test plan is to verify that the Smart Recipe Discovery web application functions according to the project requirements across Sprint 1 and Sprint 2. Testing focuses on search and filtering capabilites, loading states, error handling, recipe detail pages, favourites functionality, SEO implementation, responsive design, and the Surprise Me feature. Testing will be conducted on both desktop and mobile devices, with special attention given to ensuring that sensitive information such as **owner.email** is never exposed to users.

**This test plan focuses on these requirements:**

-	Search functionality
-	Recipe filtering
-	Loading states
-	Error handling
-   Recipe detail pages
-   Favourites functionality
-   SEO tags
-   Surprise Me button
-   Privacy validation (owner.email)
-	Mobile responsiveness
-	Desktop responsiveness
-	Developer collaboration in testing


## 2. Test Scope

### In Scope:
#### Sprint 1

-	Recipe feed display
-	Search functionality
-	Category filtering
-	Loading states
-	API error handling
-	Mobile responsiveness
-	Desktop responsiveness

#### Sprint 2

- Test Detail Page
- Favourites functionality
- SEO tags
- Surprise Me button
- Privacy validation (owner.email not exposed)
- Mobile responsiveness
- Desktop responsiveness

### Out of Scope

-	Performance audits (Sprint 3)

## 3. Testing Approach

Testing will primarily be conducted through manual testing during Sprint 1 and Sprint 2. Test cases will be executed on available desktop and mobile devices to verify functional and responsive requirements. Any defects identified during testing will be documented and tracked through the project board for resolution.

**Testing activities will  focus on validating:**
-   Functional requirements
-   Responsive design requirements
-   Error handling
-   User experience across supported devices
-   Favourites functionality
-   Recipe detail page functionality
-   SEO implementation
-   Privacy requirements

## 4. Test Environment

Testing will verify that the application maintains a responsive and accessible layout across supported devices and screen sizes, without introducing horizontal scrolling, overlapping content, clipped text, or inaccessible controls.

**📱Mobile:**

-	iPhone (Safari)
-	Android (Chrome) (If another team member has access)

**💻Desktop:**

-	Windows (Chrome, Edge, Firefox)
-	macOS (Chrome, Safari) (If another team member has access)

**Test Data Source:**

- [https://v2.api.noroff.dev/recipes](https://v2.api.noroff.dev/recipes)

## 5. Test Cases

### Search Functionality

| Test ID | Description | Expected Result |
| ------- | -------------------------------- | ----------------------------------------- |
| TC-01 | Search using a valid recipe name | Relevant recipes are displayed |
| TC-02 | Search using a partial keyword | Matching recipes are displayed |
| TC-03 | Search using invalid text | A "No Results Found" message is displayed |
| TC-04 | Clear search input | All recipes are displayed again |


### Filtering Functionality

| Test ID | Description | Expected Result |
| ------- | -------------------------------------- | ------------------------------------------------------- |
| TC-05 | Select a category filter | Only recipes within the selected category are displayed |
| TC-06 | Switch between categories | Results update correctly |
| TC-07 | Apply search and filter simultaneously | Results satisfy both criteria |


### Loading States

| Test ID | Description | Expected Result |
| ------- | ----------------------------------- | ----------------------------------------------- |
| TC-08 | Load application for the first time | Loading indicator is displayed while recipe data is being fetched and disappears when the data has loaded |
| TC-09 | Simulate slow network connection | Loading state remains visible while the delayed request is processing, and the application remains responsive  |


### Error Handling

| Test ID | Description | Expected Result |
| ------- | -------------------------- | ------------------------------------------------- |
| TC-10 | API request fails | User-friendly error message is displayed |
| TC-11 | Network connection is lost | Application informs the user of the issue |
| TC-12 | Invalid API response | Error is handled without crashing the application |

### Responsive Design Testing

| Test ID | Description | Expected Result |
| ------- | --------------------------------------- | ------------------------------------------- |
| TC-13 | View application on mobile screen size | Layout remains readable and functional with no horizontal scrolling, overlapping elements, clipped text, or inaccessible controls |  
| TC-14 | Use search and filtering on mobile | Features operate as expected |
| TC-15 | View application on desktop screen size | Content displays correctly and consistently |

#### Recipe Detail Page

| Test ID | Description | Expected Result |
| ------- | --------------------------------------- | ------------------------------------------- |
| TC-16 | Open a recipe detail page | Recipe information displays correctly |  
| TC-17 | Open recipe with valid ID | Correct recipe loads|
| TC-18 | Access invalid recipe URL | Appropriate error or fallback page displayed |

#### Favourite Functionality

| Test ID | Description | Expected Result |
| ------- | --------------------------------------- | ------------------------------------------- |
| TC-19 | Add recipe to favourites | Recipe appears in favourites |  
| TC-20 | Remove recipe from favourites | Recipe is removed |
| TC-21 | Refresh page after favouriting | Favourite status persists |

#### SEO Validation

| Test ID | Description | Expected Result |
| ------- | --------------------------------------- | ------------------------------------------- |
| TC-22 |Inspect page title | Title matches acceptance criteria |  
| TC-23 | Inspect meta description | Correct description present |
| TC-24 | Veirfy SEO tags on detail page | Required SEO tags exist |

#### Privacy Validation

| Test ID | Description | Expected Result |
| ------- | --------------------------------------- | ------------------------------------------- |
| TC-25 | View recipe detail page | owner.email is not displayed |  
| TC-26 | Inspect favourites page | owner.email is not displayed |
| TC-27 | Review page source | owner.email is not exposed to users |

#### Surprise Me Button

| Test ID | Description | Expected Result |
| ------- | --------------------------------------- | ------------------------------------------- |
| TC-28 | Click Suprise Me button | Random recipe is displayed |  
| TC-29 | Click button multiple times | Different valide recipes are loaded |
| TC-30 | Use Surprise Me on mobile | Feature functions correctly on mobile |

## 6. Team Contribution

| Role | Responsibility |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| QA Lead | Develop and maintain the manual test plan; execute testing activities |
| Developers | Contribute feature specific test scenarios and edge cases; perform preliminary testing before submitting pull requests |
| Scrum Master | Monitor testing progress and ensure testing tasks are completed |

Developers are expected to contribute feature specific test scenarios and potential edge cases for features they implement. This collaborative approach supports broader test coverage and assists in identifying defects earlier in the development process.

## 7. Defect Reporting

Any identified defects will be recorded in the project board using the following information:

| Field | Description |
| ------| -------------------------------------------- |
| Issue ID | Unique identifier for the issue |
| Test Case | Related test case |
| Description | Brief explanation about the issue |
| Steps to Reproduce | Steps needed to reproduce the issue|
| Expected Result | What should happen |
| Actual Result | What actually happened |
| Severity | Critical, High, Medium, Low |
| Environment | Browser, device, and operating system |
| Screenshot | Evidence of the issue, when applicable |
| Status | Open, In Progress, Fixed, or Retested |

### Severity Levels

| Severity | Description                                  |
| -------- | -------------------------------------------- |
| Critical | Application is unusable or crashes           |
| High     | Core functionality is significantly impaired |
| Medium   | Functionality works with minor issues        |
| Low      | Cosmetic or visual defects                   |

## 8. Pass/Fail Criteria

A test case will be considered **Pass** when the actual result matches the expected result and no significant usability or visual issues are identified. 

A test case will be considered **Fail** when the expected functionality does not work, an error occurs, or the application has a significant usability or responsive issue.

The application should not be considered ready for completion if there are unresolved **High** or **Critical** defects affecting core functionality such as recipe loading, searching, filtering, or application stability.

## 9. Conclusion

This test plan establishes the manual testing activities required for Sprint 1 and Sprint 2. The plan focuses on validating search functionality, filtering, loading states, error handling, recipe detail pages, favourites functionality, SEO implementation, privacy requirements, Suprise Me feature, and responsive design. The document will be reviewed and updated throughout the project as additional functionality is implemented in future sprints.