# Release notes for kf-portal-ui

# 2019-06-18 kf-portal-ui 2.4.0
This release introduces new features and bug fixes.

## New features
- #1387 Virtual Study: Add a description
- #1467 Survival chart: reset zoom
- #1685 Change the link of studies and participants clickable diagrams in the dashboard to point to the cohort buider
- #1688 Query area: show number of participants for a query
- #1724 Persistence of which tab is active in the cohort builder
- #1795 Save dialog: pressing enter should close this dialog
- #1810 File page: Put "--" for missing values for "Sequencing read properties"

## Bug fixes
- #1820 Corrupted Virtual Studies in saved Riff or in the local storage cause the application to break on load
- #1836 Virtual studies: The vertical space for the comment section is too big


# 2019-06-04 kf-portal-ui 2.3.0
This release introduces a few features and bug fixes after a larger release.

## New features
- #1741 Clickable charts: Most Frequent Diagnoses
- #1802 Change title of "Most Frequent Diagnoses" chart in the cohort builder
- #1803 Update field names in exported Participant data TSV file

## Bug fixes
- #1695 Remove field phenotype.ancestral\_hpo\_ids 
- #1801 Clicking on a chart crashes the application when the virtual study contains a reference


## 2019-05-30 kf-portal-ui 2.2.0
As part of this release, we have forked the Overture projects to the Fids First team: Ego, Persona, Rollcall and Riff.
We also improved significantly the documentation for the deployment of all services. We standardized the deployment
process for Riff. We also did the investigation and implementation of the backend for login in with ORCID with Ego.
Notably, many charts in the cohort builder are now clickable, and we've implemented the save/save as buttons.
We've also updated the UI for the new ontological field format.
See the list below for the issue numbers on GitHub.

### New features
- #1636 Update UI for the new ontological field format
- #1776 Use Diagnosis (Mondo) in the participants table
- #1533 Save a virtual study: both save and save as
- #1782 Virtual studies: Add an "Edit" button
- #1699 Limit the length of virtual study names in the dialog
- #1644 Save a virtual study: Check the permissions in Riff and Persona
- #1465 Cohort Builder: Make pie charts clickable in order to add a query term to the active query
- #1739 Clickable chart: Available Data

### Bug fixes
- #1639 "Search all filters": cannot find the "Age" filter
- #1705 Queries are lost when you navigate back to Explore Data
- #1707 Number of families is counted when it's none
- #1714 "is not" filter shows "is not" only when more than one item is checked
- #1779 When we disconnect and reconnect, no virtual study should be opened
- #1633 "Is Not" queries are badly displayed in the query section of the cohort builder
- #1753 ETL: Tissue type : anatomical site has their ID but no text value

### Refactoring
- #1536 Improve error handling: add error boundaries for widgets
- #1537 Improve performances: implement a central state manager and its debugging tools

