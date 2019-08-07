# Release notes for kf-portal-ui

## 2019-08-05 kf-portal-ui 2.7.0

This release concentrates on renaming the studies and adding the participant entity page, including family and phenotype data. The format of family and phenotype data has been corrected in the ETL as part of that effort.

It also introduces improvements and bug fixes.

### New features and improvements

- [#1851](https://github.com/kids-first/kf-portal-ui/issues/1851) Database script to rename studies
- [#1953](https://github.com/kids-first/kf-portal-ui/issues/1953) Participant pages: Add Phenotypes table
- [#1956](https://github.com/kids-first/kf-portal-ui/issues/1956) ETL: Change the `participant.phenotype` field to a nested type
- [#1240](https://github.com/kids-first/kf-portal-ui/issues/1240) Filters: Show selected items first

### Bug fixes

- [#1962](https://github.com/kids-first/kf-portal-ui/issues/1962) Dashboard: Saved queries widget: Template file query "Female probands with cleft palate..." is invalid
  - Note: fixes the query for new users only
- [kf-portal-etl#90](https://github.com/kids-first/kf-portal-etl/issues/90) The phenotypes for each participant are missing

## 2019-07-26 kf-portal-ui 2.6.0

This release introduces new features and bug fixes.

### New features and improvements

- #1123 Participant Page
- #1829 Participant Page: Links to these pages from elsewhere in the portal
- #1880 Participant Page: Add family ID
- #1950 Participant Page: add PedcBioPortal link

### Bug fixes

- Null dates are rendered as an invalid date #1960

## 2019-07-11 kf-portal-ui 2.5.1

This release introduces a bug fix.

### Bug fix

- #1943 Put back "Beta release" banner

## 2019-07-11 kf-portal-ui 2.5.0

This release introduces new features and bug fixes.

### New features and improvements

- #1115 Cohort Builder: Saved queries widget with Virtual Studies
- #1685 Change the link of studies and participants clickable diagrams in the dashboard to point to the cohort buider
- #1721 Saved queries: list virtual studies
- #1722 Saved queries: show the description of each virtual study
- #1723 Saved queries card: delete virtual studies
- #1728 Remove "Beta release" banner
- #1807 Change the link of Frequent diagnoses clickable diagrams in the dashboard to point to the cohort buider
- #1833 Remove "Virtual Study" in the title
- #1849 Cohort builder: Add the "Consent Type" field in the filters
- #1853 Saved queries: list virtual studies
- #1866 Cohort builder: Show "You have unsaved changes" when relevant
- #1867 Cohort builder: Make the description of the virtual study bigger
- #1883 The title of the page should always be the same
- #1895 Styling simplification for the reset zoom button
- #1903 Age at diagnosis chart: use a comma for ranges
- #1906 Rename edit name dialog and tooltip

### Bug fixes

- #1417 The Virtual Study dropdown is not populated when you navigate back to Explore Data
- #1471 Firefox is reverse sorting the Cohort Builder diagnosis card
- #1506 Open #files link in new tab redirects to dashboard
- #1520 Resources Menu is underneath columns selector on File Repository
- #1597 External links need an non-breaking space
- #1674 Cannot see the title of someone else's virtual study
- #1675 A line at the top of the participant table is not at the right location
- #1681 Bar charts: Number of participant should not be a fraction (have decimals)
- #1697 Available Data bar chart: minimum column height
- #1737 Dynamically update the data version
- #1830 Cohort builder: The "New" button should be enabled, when a virtual study is open
- #1835 "Age at diagnosis" chart: range should not overlap
- #1865 Some widgets overlap on top of the menu
- #1869 Active tab in Cohort Builder is lost
- #1872 Long query parameters overlaps the count of participants
- #1875 Available Data card: the titles at the bottom are cropped on Firefox
- #1876 Available Data card: the title on the left of the chart overlaps on Firefox
- #1877 Save dialog: pressing enter should not close the dialog anymore
- #1885 Saved queries widget: persistence of which tab is selected
- #1886 Available Data chart: sort the columns from most to least
- #1891 Issues with "Save" and "Load"
- #1897 Dashboard clickable charts: create a new query in a new virtual study
- #1921 Cohort builder: The line height of the description of the virtual study is too high
- #1930 Update data version API in prod

## 2019-06-18 kf-portal-ui 2.4.0

This release introduces new features and bug fixes.

### New features and improvements

- #1387 Virtual Study: Add a description
- #1467 Survival chart: reset zoom
- #1685 Change the link of studies and participants clickable diagrams in the dashboard to point to the cohort buider
- #1688 Query area: show number of participants for a query
- #1724 Persistence of which tab is active in the cohort builder
- #1795 Save dialog: pressing enter should close this dialog
- #1810 File page: Put "--" for missing values for "Sequencing read properties"

### Bug fixes

- #1820 Corrupted Virtual Studies in saved Riff or in the local storage cause the application to break on load
- #1836 Virtual studies: The vertical space for the comment section is too big
- #1832 Shared virtual study: the edit button should not be visible

## 2019-06-04 kf-portal-ui 2.3.0

This release introduces a few features and bug fixes after a larger release.

### New features and improvements

- #1741 Clickable charts: Most Frequent Diagnoses
- #1802 Change title of "Most Frequent Diagnoses" chart in the cohort builder
- #1803 Update field names in exported Participant data TSV file

### Bug fixes

- #1695 Remove field phenotype.ancestral_hpo_ids
- #1801 Clicking on a chart crashes the application when the virtual study contains a reference

## 2019-05-30 kf-portal-ui 2.2.0

As part of this release, we have forked the Overture projects to the Fids First team: Ego, Persona, Rollcall and Riff.
We also improved significantly the documentation for the deployment of all services. We standardized the deployment
process for Riff. We also did the investigation and implementation of the backend for login in with ORCID with Ego.
Notably, many charts in the cohort builder are now clickable, and we've implemented the save/save as buttons.
We've also updated the UI for the new ontological field format.
See the list below for the issue numbers on GitHub.

### New features and improvements

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
