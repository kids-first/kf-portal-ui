# Release notes for include-portal-ui

<!--
## 2020-01-?? include-portal-ui 1.??.??

### Features

### Technical / Other changes
-->
## 2022-07-11 include-portal-ui 1.4.0
### Features
- [SJIP-302](https://d3b.atlassian.net/browse/SJIP-302) Feature (Explore Data): Saved Filter Name Ellipsis in Query Management bar to be more dynamic
- [SJIP-282](https://d3b.atlassian.net/browse/SJIP-282) Feature (Explore Data): Integrate UploadIds Component (ferlab) for each Category
## Technical / Other changes
- [SJIP-296](https://d3b.atlassian.net/browse/SJIP-296) Fix (Saved Set, Filter): Remove Character Limit
- [SJIP-284](https://d3b.atlassian.net/browse/SJIP-284) Fix (HPO/MONDO Tree): Search results should still display the drill down options
- [SJIP-279](https://d3b.atlassian.net/browse/SJIP-279) Fix (Data Exploration): Download Participant & Family data - missing some data rows

## 2022-05-31 include-portal-ui 1.3.0
### Features
- [SJIP-257](https://d3b.atlassian.net/browse/SJIP-257) Feature (Dashboard): Added information icon and popover to Saved Filters and Saved Sets widget
## Technical / Other changes
- [SJIP-275](https://d3b.atlassian.net/browse/SJIP-275) Fix (Mobile, Login): Fixed the login button visibility on the mobile website
- [SJIP-283](https://d3b.atlassian.net/browse/SJIP-283)Refactor (Explore Data, Facet): Adjusted facet name to Age at Biospec. Collection (days)
- [SJIP-288](https://d3b.atlassian.net/browse/SJIP-288) Refactor (Explore Data, Facet): Refactored the number of participants associated to terms in the HPO and MONDO explorer to remain in place when a wrap occurred
- [SJIP-292](https://d3b.atlassian.net/browse/SJIP-292) Fix (Explore Data, QueryBuilder): Fixed an error that would appear when selecting a saved query in the QueryBuilder
- [SJIP-293](https://d3b.atlassian.net/browse/SJIP-293) Fix (Support): Corrected the contact support email to support@includedcc.org

## 2022-05-03 include-portal-ui 1.2.0
### Features
- [SJIP-220](https://d3b.atlassian.net/browse/SJIP-220) Feature (Dashboard): Implemented Saved Sets widget to dashboard
- [SJIP-226](https://d3b.atlassian.net/browse/SJIP-226) Feature (Explore Data, Table): Implemented Saved Set buttons for the tables of each entity tab
- [SJIP-227](https://d3b.atlassian.net/browse/SJIP-227) Feature (Explore Data, QueryBuilder): Added a Share button to the QueryBuilder to share the queries of a Saved Filter
- [SJIP-268](https://d3b.atlassian.net/browse/SJIP-268) Feature (Explore Data, QueryBuilder): Added an Undo button to return to the Saved Filters original state after adding or removing unsaved filters
## Technical / Other changes
- [SJIP-256](https://d3b.atlassian.net/browse/SJIP-256) Fix (Explore Data, Table): Fixed Export TSV loading indefinitely for Biospecimen and Data Files tables
- [SJIP-259](https://d3b.atlassian.net/browse/SJIP-259) Refactor (Explore Data, Summary View): Display the Observed Phenotype and the Diagnosis sunbursts based on the active participants in a query
- [SJIP-261](https://d3b.atlassian.net/browse/SJIP-261) Refactor (Explore Data, QueryBuilder): Refactored the query count of combined queries to dynamically update when the subquery is modified
- [SJIP-269](https://d3b.atlassian.net/browse/SJIP-269) Fix (Explore Data, Table):  Fixed the Download report error on larger requests

## 2022-04-04 include-portal-ui 1.1.0

### Features:
- [SJIP-178](https://d3b.atlassian.net/browse/SJIP-178) Feature: Added a Participant ID search box for the Participant Facets
- [SJIP-179](https://d3b.atlassian.net/browse/SJIP-179) Feature: Added a Biospecimen ID search box in the Biospecimen Facets
- [SJIP-180](https://d3b.atlassian.net/browse/SJIP-180) Feature: Added a File ID search box in the Data File Facets
- [SJIP-217](https://d3b.atlassian.net/browse/SJIP-217) Feature: Added Operators (Any of, All of, None of) to facets and query pills in the query builder
- [SJIP-218](https://d3b.atlassian.net/browse/SJIP-218) Feature: Implemented the Diagnosis (MONDO) tree as a facet and added the sunburst in the Summary page
- [SJIP-236](https://d3b.atlassian.net/browse/SJIP-236) Feature: Added Operators to both Observed phenotype (HPO) and Diagnosis (MONDO) tree

### Technical/ Other changes:

- [SJIP-185](https://d3b.atlassian.net/browse/SJIP-185) Refactor (Data Exploration, Facets): Adjusted the facet name from "DS Status" to "Down Syndrome Status"
- [SJIP-209](https://d3b.atlassian.net/browse/SJIP-209) Refactor (Data Exploration, Query Builder): Selecting the number of participants, biospecimens, or data files in the table of results will now create a new query instead of replacing the current active query
- [SJIP-219](https://d3b.atlassian.net/browse/SJIP-219) Refactor (Data Exploration, Data Files): Added "URL" as a non-default column in the Data Files table
- [SJIP-225](https://d3b.atlassian.net/browse/SJIP-225) Refactor (Study page): Adjusted the list of study rows to be static
- [SJIP-240](https://d3b.atlassian.net/browse/SJIP-240) Fix (Dashboard, Saved Filters widget): Fixed the incorrect elapsed time from the moment a filter being saved