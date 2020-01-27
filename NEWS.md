# Release notes for kf-portal-ui

<!--
## 2020-01-?? kf-portal-ui 2.??.??

### Features

### Technical / Other changes

-->
## 2020-01-27 kf-portal-ui 2.13.6

This feature is a hotfix for this issue :
- [#2275](https://github.com/kids-first/kf-portal-ui/issues/2275) Can't scroll in dashboard


## 2020-01-22 kf-portal-ui 2.13.5

This feature includes :

### Features

- [#2187](https://github.com/kids-first/kf-portal-ui/issues/2187) Add Histological Diagnoses filters in the file repository

### Technical / Other changes

- [#2261](https://github.com/kids-first/kf-portal-ui/issues/2261) Fix broken link in the resource menu
- [#2262](https://github.com/kids-first/kf-portal-ui/issues/2262) Change order of some fields in the contact information form
- [#2265](https://github.com/kids-first/kf-portal-ui/issues/2265) Set recommended colour for the disconnect button in the profile settings
- [#2270](https://github.com/kids-first/kf-portal-ui/issues/2270) Use more concise wording for public/private tooltip in the profile page
- [#2271](https://github.com/kids-first/kf-portal-ui/issues/2271) Make sure correct access is shown when viewing file details


## 2020-01-13 kf-portal-ui 2.13.4

This feature includes : 

### Features
- [#2245](https://github.com/kids-first/kf-portal-ui/issues/2249) improve interests suggestion in member page
- [#2252](https://github.com/kids-first/kf-portal-ui/issues/2252) Change maxlength of bio and story 
- [#2253](https://github.com/kids-first/kf-portal-ui/issues/2253) Edit Profile : Display max number characters in error message
 
## 2020-01-13 kf-portal-ui 2.13.3

This feature includes : 

### Features
- [#2245](https://github.com/kids-first/kf-portal-ui/issues/2245) Add validation to member information
- [#2192](https://github.com/kids-first/kf-portal-ui/issues/2192) Change fence integration due to an upgrade in Gen3


## 2020-01-14 kf-portal-ui 2.13.2

### Features

This feature includes : 

#### kf-portal-ui
- [#2233](https://github.com/kids-first/kf-portal-ui/issues/2233) Change label when disconnecting
- [#2236](https://github.com/kids-first/kf-portal-ui/issues/2236) Enable feature toggles with url parameters

#### kf-api-portal-reports
- [#14](https://github.com/kids-first/kf-api-portal-reports/issues/14) Add `Method of Sample Procurement` to biospecimen report download

## 2020-01-13 kf-portal-ui 2.13.1

### Features

This release is a hot fix. We were not able to push files to Cavatica anymore, due to react-emotion removal. 

We also fixed this issue:
- [#2232](https://github.com/kids-first/kf-portal-ui/issues/2232) Cavatica modal : Link to cavatica token page is broken



## 2020-01-09 kf-portal-ui 2.13.0

This release includes a new _Members_ page and alterations to the profile page, allowing to search for other members that made their user profile public.

It also fix the data release number in the footer and the bump on the login.

### Features

- [#727](https://github.com/kids-first/kf-portal-ui/issues/727) Incorrect cursor on disabled button hover
- [#839](https://github.com/kids-first/kf-portal-ui/issues/839) Release # in footer not working  
- [#1042](https://github.com/kids-first/kf-portal-ui/issues/1042) Fix bump on login when user already has a token
- [#1734](https://github.com/kids-first/kf-portal-ui/issues/1734) Can't search by biospecimen ID
- [#1881](https://github.com/kids-first/kf-portal-ui/issues/1881) Member page: List member pages
- [#1887](https://github.com/kids-first/kf-portal-ui/issues/1887) Member page: Search members
- [#1954](https://github.com/kids-first/kf-portal-ui/issues/1954) Member page: Invite members to make their profile public
- [#2037](https://github.com/kids-first/kf-portal-ui/issues/2037) Cohort Builder: Participant table empty where filter "Available Data Type" = "No data" is applied 
- [#2124](https://github.com/kids-first/kf-portal-ui/pull/2124) Make sure other members profile can be viewed but not edited
- [#2130](https://github.com/kids-first/kf-portal-ui/issues/2130) Redesign User Profile using Ant Design
- [#2158](https://github.com/kids-first/kf-portal-ui/issues/2158) Member page: Filter member search by interests or role
- [#2185](https://github.com/kids-first/kf-portal-ui/issues/2185) Cohort Builder : Need to click twice on a menu element to open it 
- [#2167](https://github.com/kids-first/kf-portal-ui/issues/2167) Add a loader while downloading a clinical data report 
- [#9](https://github.com/kids-first/kf-api-portal-reports/issues/9) Add and reorder columns to Diagnoses / Histological Diagnoses tabs 


### Technical / Other changes
- [#2017](https://github.com/kids-first/kf-portal-ui/issues/2017) Security : upgrade axios 
- [#2018](https://github.com/kids-first/kf-portal-ui/issues/2018) Security : upgrade eslint 
- [#2063](https://github.com/kids-first/kf-portal-ui/issues/2063) Reduce kf front-end bundle size 
- [#2126](https://github.com/kids-first/kf-portal-ui/issues/2126) Add custom theme for the antd library 
- [#2133](https://github.com/kids-first/kf-portal-ui/issues/2133) Update babel to modernize the build system

## 2019-11-27 kf-portal-ui 2.12.1
Hot fix on user creation issue due to regression when working on:
 - [#1042](https://github.com/kids-first/kf-portal-ui/issues/1042) Fix bump on login when user already has a token
 The code had been reverted, therefore issue #1042 is unresolved.

## 2019-11-27 kf-portal-ui 2.12.0

This release includes revamped clinical data reports, available under the _Download Data_ button of the Cohort Builder table.

It also include improvements and bug fixes including Cavatica error management.

### Features

- [#2031](https://github.com/kids-first/kf-portal-ui/issues/2031) Download Clinical Data/Biospecimen Data

### Bug fixes

- [#2044](https://github.com/kids-first/kf-portal-ui/issues/2044) Manage errors during calls to Cavatica API
- [#1822](https://github.com/kids-first/kf-portal-ui/issues/1822) An error should show an Internal error, not a "we are down for maintenance" page
- [#1042](https://github.com/kids-first/kf-portal-ui/issues/1042) Fix bump on login when user already has a token
- [#2143](https://github.com/kids-first/kf-portal-ui/issues/2143) Page routing is broken once a user is logged out

### Technical / Other changes

- [#2021](https://github.com/kids-first/kf-portal-ui/issues/2021) Netlify OSS licence for kf-qa : display Netlify logo on the login page
- [#2063](https://github.com/kids-first/kf-portal-ui/issues/2063) Reduce front-end JavaScript bundle size in production

## 2019-10-14 kf-portal-ui 2.11.3

This release fixes major issues :

- [#2113](https://github.com/kids-first/kf-portal-ui/issues/2113) Widget Authorized studies show open access files on study that not contain open access files
- [#2105](https://github.com/kids-first/kf-portal-ui/issues/2111) Duplicate studies in widget Authorized Studies

## 2019-10-10 kf-portal-ui 2.11.2

This release fixes minor issues :

- [#2102](https://github.com/kids-first/kf-portal-ui/issues/2102) Participant page : Rename family table in the clinical tab
- [#2105](https://github.com/kids-first/kf-portal-ui/issues/2105) Dashboard : Widgets Authorized studies broken

## 2019-10-10 kf-portal-ui 2.11.1

This release fixes major issues, most of these concern the public access files :

### Bug fixes

- [#2088](https://github.com/kids-first/kf-portal-ui/issues/2088) File Repository : Analyze in Cavatica after opening entity page directly does not work
- [#2090](https://github.com/kids-first/kf-portal-ui/issues/2090) Cavatica: can't push open access files
- [#2093](https://github.com/kids-first/kf-portal-ui/issues/2093) Filter on value \* for ACL is not working
- [#2091](https://github.com/kids-first/kf-portal-ui/issues/2091) Participant page: Do not repeat diagnoses and phenotypes that are not shared with other family members in the family table

## 2019-09-25 kf-portal-ui 2.11.0

This release fixes performance issues in the File Repository along with some bug fixes.

### Includes

#### kids-first/kf-portal-ui

- [#2027](https://github.com/kids-first/kf-portal-ui/issues/2027) File Repository: Remove some fields from "Browse all" to fix performance issues
- [#1564](https://github.com/kids-first/kf-portal-ui/issues/1564) File Repository: Browse all filters: Return only the values that match the query
- [#2080](https://github.com/kids-first/kf-portal-ui/issues/2080) Cohort Builder: Remove the "Beta" banner 🎉

### Bug fixes

#### kids-first/kf-portal-ui

- [#2060](https://github.com/kids-first/kf-portal-ui/issues/2060) Cohort Builder: Participants are displayed as "Kf Id" instead of "Participants Ids" in the Cohort Builder
- [#2004](https://github.com/kids-first/kf-portal-ui/issues/2004) File Repository: Remove weird column names in columns selection dropdown
- [#2072](https://github.com/kids-first/kf-portal-ui/issues/2072) Download Clinical Data: HPOs related columns are always empty

## 2019-09-11 kf-portal-ui 2.10.0

This release introduces Histological Diagnoses, a revamping of the member page, some backend features for members search (front end coming later), along with some bug fixes.

### Includes

#### kids-first/kf-portal-ui

- [#2028](https://github.com/kids-first/kf-portal-ui/issues/2028) Histological Diagnoses: Add filters to Cohort Builder
- [#2019](https://github.com/kids-first/kf-portal-ui/issues/2019) Histological Diagnoses: Modify Diagnoses Table in Participant Entity Page to include Specimen ID and an icon
- [#2068](https://github.com/kids-first/kf-portal-ui/issues/2068) Histological Diagnoses: add diagnostic icon to biospecimen chip
- [#1247](https://github.com/kids-first/kf-portal-ui/issues/1247) Member page: Make my profile non-searchable (private profile)
- [#1287](https://github.com/kids-first/kf-portal-ui/issues/1287) Member page: View someone's member's page
- [#2023](https://github.com/kids-first/kf-portal-ui/issues/2023) Search by entity IDs: frontend

#### kids-first/kf-arranger

- [#109](https://github.com/kids-first/kf-arranger/issues/109) Search by entity IDs: added an endpoint to query for ids

#### kids-first/kf-portal-etl

- [#34](https://github.com/kids-first/kf-portal-etl/issues/34) ETL: Create field for Histological Diagnoses

#### kids-first/kf-es-model

- [#52](https://github.com/kids-first/kf-es-model/pull/52) Histological Diagnoses: Add diagnoses into biospecimens

#### kids-first/kf-persona

- [#25](https://github.com/kids-first/kf-persona/issues/25) Member page: Store user preference for private profile
- [#46](https://github.com/kids-first/kf-persona/issues/46) Member Page: Index members in Elastic Search so we can search for them

### Bug fixes

- [#2041](https://github.com/kids-first/kf-portal-ui/issues/2041) File Repo: File without participants returns an error
- [#2048](https://github.com/kids-first/kf-portal-ui/issues/2048) User setting page: Replace the Gen3 Logo
- [#2072](https://github.com/kids-first/kf-portal-ui/issues/2072) Download Clinical Data : HPOs related columns are always empty
- [#2004](https://github.com/kids-first/kf-portal-ui/issues/2004) Weird column names in File Repository
- [#2041](https://github.com/kids-first/kf-portal-ui/issues/2041) File Repo: File without participants returns an error

## 2019-08-29 kf-portal-ui 2.9.0

This release makes ORCID feature available for everybody, and improves error messages in case of errors during login with ORCID.

### Includes

- [#2016](https://github.com/kids-first/kf-portal-ui/issues/2016) OrcId Login : Make available to greater public

## 2019-08-28 kf-portal-ui 2.8.0

This release introduces bug fixes.

### Bug fixes

- [#2020](https://github.com/kids-first/kf-portal-ui/issues/2020) Cohort Builder: MONDO link doesn't appear in the table view on the cohort builder
- [#1961](https://github.com/kids-first/kf-portal-ui/issues/1961) Open access files should be accessible for everyone
- [#2005](https://github.com/kids-first/kf-portal-ui/issues/2025) Participant entity page: Don't display the sequencing data table if empty

## 2019-08-13 kf-portal-ui 2.7.2

This release includes a way to deploy the OrcId login button in production, but hidden. This is only done for testing purposes.

### Includes

- [#2014](https://github.com/kids-first/kf-portal-ui/issues/2014) Orcid Login : hidden deploy to test in production

## 2019-08-09 kf-portal-ui 2.7.1

This release concentrates on bug fixes following the release 2.7.0 and contains no new features.

### Bug fixes

- [#2001](https://github.com/kids-first/kf-portal-ui/issues/2001) Broken link in the maintenance page
- [#2007](https://github.com/kids-first/kf-portal-ui/issues/2007) Participant clinical tab returns a Maintenance page !!
- [#2008](https://github.com/kids-first/kf-portal-ui/issues/2008) Participant Entity page: Empty lines in the Family members table

### Also included

Data fix, introduced 2019-08-08

- [#2003](https://github.com/kids-first/kf-portal-ui/issues/2003) Rename study "Consortium: Pediatric Brain Tumors - CBTTC" to "Pediatric Brain Tumor Atlas: CBTTC"

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
