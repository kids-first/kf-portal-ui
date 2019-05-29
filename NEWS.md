# Release notes for kf-portal-ui

## 2019-05-29 kf-portal-ui 2.2.0

As part of this release, we have forked the Overture projects to the Fids First team: Ego, Persona, Rollcall and Riff.
We also improved significantly the documentation for the deployment of all services. We standardized the deployment
process for Riff. We also did the investigation and implementation of the backend for login in with ORCID with Ego.
Notably, many charts in the cohort builder are now clickable, and we've implemented the save/save as buttons.
We've also updated the UI for the new ontological field format.
See the list below for the issue numbers on GitHub.

### New features
- #1465 Cohort Builder: Make pie charts clickable in order to add a query term to the active query
- #1533 Save a virtual study: both save and save as
- #1636 Update UI for the new ontological field format
- #1699 Limit the length of virtual study names in the dialog
- #1644 Save a virtual study: Check the permissions in Riff and Persona
- #1739 Clickable chart: Available Data
- #1776 Use Diagnosis (Mondo) in the participants table
- #1782 Virtual studies: Add an "Edit" button

### Bug fixes
- #1639 "Search all filters": cannot find the "Age" filter
- #1705 Queries are lost when you navigate back to Explore Data
- #1707 Number of families is counted when it's none
- #1714 "is not" filter shows "is not" only when more than one item is checked
- #1779 When we disconnect and reconnect, no virtual study should be opened
- #1781 "Save" should not open a dialog - but simply save the study under the same name
- #1753 ETL: Tissue type : anatomical site has their ID but no text value
- #1778 Clean the store after fixed the logout issue
- #1633 "Is Not" queries are badly displayed in the query section of the cohort builder

### Refactoring
- #1536 Improve error handling: add error boundaries for widgets
- #1537 Improve performances: implement a central state manager and its debugging tools

