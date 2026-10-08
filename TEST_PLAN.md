# QA Test Plan: FlavorCraft Labs (Agency 2)

## 1. Project Information & Objective
* **Project:** Smart Recipe Discovery Web Application
* **Client:** FlavorCraft Labs
* **Prepared By:** Milagros Vasshus/Team Beta 
* **Date:** 05.10.2026

The purpose of this test plan is to ensure the Smart Recipe Discovery Web Application functions correctly and provides a smooth user experience across desktop and mobile devices.

**This test plan focuses on these requirements:**

-	Search functionality
-	Recipe filtering
-	Loading states
-	Error handling
-	Mobile responsiveness
-	Desktop responsiveness
-	Developer collaboration in testing


## 2. Test Scope

### In Scope:

-	Recipe feed display
-	Search functionality
-	Category filtering
-	Loading states
-	API error handling
-	Mobile responsiveness
-	Desktop responsiveness

### Out of Scope

-	Favourites functionality (Sprint 2)
-	SEO testing (Sprint 2)
-	Analytics testing (Sprint 2)
-	Performance audits (Sprint 3)

## 3. Testing Approach

Testing will primarily be conducted through manual testing during Sprint 1. Test cases will be executed on available desktop and mobile devices to verify functional and responsive requirements. Any defects identified during testing will be documented and tracked through the project board for resolution.

**Testing activities will  focus on validating:**
- Functional requirements
- Responsive design requirements
- Error handling
- User experience across supported devices

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

This test plan establishes the manual testing activities required for Sprint 1. The plan focuses on validating search functionality, filtering, loading states, error handling, and responsive design. The document will be reviewed and updated throughout the project as additional functionality is implemented in future sprints.