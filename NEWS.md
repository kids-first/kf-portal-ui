# Release notes for kf-portal-ui

<!--
## 2020-01-?? kf-portal-ui 3.??.??

### Features

### Technical / Other changes
-->
## 2020-05-06 kf-portal-ui 3.0.2

### Features
- [3165](https://github.com/kids-first/kf-portal-ui/issues/3165) Variant page : Add tooltip to participants column in KF Studies table.
- [3111](https://github.com/kids-first/kf-portal-ui/issues/3111) Display impact long names.

### Technical / Other changes
- [3124](https://github.com/kids-first/kf-portal-ui/issues/3124) Tables : fix border color for table rows.
- [3177](https://github.com/kids-first/kf-portal-ui/issues/3177) Fix Table column dropdown in File Repo.
- [3070](https://github.com/kids-first/kf-portal-ui/issues/3070) Use operator AND when adding a term to an active query from the sunburst.
- [3005](https://github.com/kids-first/kf-portal-ui/issues/3005) Cohort builder - Summary View - Studies bar chart: Replace study names by study codes in Y axis.
- [3200](https://github.com/kids-first/kf-portal-ui/issues/3200) Fix(variant search page): remove the "showing" message if table is empty.
- [3113](https://github.com/kids-first/kf-portal-ui/issues/3113) Add -- when there's no data (variant search page + variant entity).
- [3128](https://github.com/kids-first/kf-portal-ui/issues/3128) Variant entity page : update display for empty tables (change request).

## 2021-04-30 kf-portal-ui  3.0.1

### Features

- [2905](https://github.com/kids-first/kf-portal-ui/issues/2905) Feature (Variant Page, Spark Cluster): Users will now see a more detailed error message if starting the cluster fails. The on/off button will now also be updated when the cluster is turned off.
- [2934](https://github.com/kids-first/kf-portal-ui/issues/2934) Feature (Portal, Studies Page): There is now a new Studies page on the portal. Users can now search and filter KF studies by domain, program name, available data and experimental strategy.
- [2935](https://github.com/kids-first/kf-portal-ui/issues/2935) Feature (Portal, Studies Page): The results table columns are not filterable and showable/hideable.
- [2974](https://github.com/kids-first/kf-portal-ui/issues/2974) Feature (Portal, Variant Search Page): There is now an updated Variant page on the portal allowing users to search for variants present in the KF variant database directly from the Portal.
- [3001](https://github.com/kids-first/kf-portal-ui/issues/3001) Feature (Portal, Facets): Added new facets to the Cohort Builder and File repository to allow users to search with the same fields than the ones present in the Studies Page
- [3020](https://github.com/kids-first/kf-portal-ui/issues/3020) Feature (Portal, Variant Entity Page): There is now a new Variant Entity page on the portal allowing users to see the details of all the variant annotations stored in the variant database.
- [3032](https://github.com/kids-first/kf-portal-ui/issues/3032) Feature (Portal, Studies Page): Clicking on a Studies from the Studies page now redirects the user to the Cohort Builder with the study pre-selected in a new query.
- [3140](https://github.com/kids-first/kf-portal-ui/issues/3140) Feature (Variant Entity Page, Frequencies): For all studies having 10 or more participants of a specific variant, clicking on the number of participants now redirects to the query builder with those Participants ID selected in a new query

### Technical / Other changes

- [2818](https://github.com/kids-first/kf-portal-ui/issues/2818) Refactor (Studies page, Table): Adjusted the scrolling mechanism of the results table.
- [2865](https://github.com/kids-first/kf-portal-ui/issues/2865) Fix (Portal, ETL): Added a fix to the ETL preventing mapping family members if a participant has no family ID.
- [2895](https://github.com/kids-first/kf-portal-ui/issues/2895) Refactor (Portal, Arranger): Development of a new microservice containing the latest version of arranger (2.2.0) to be used on the Studies and Variant pages and secured with Ego. 
- [2896](https://github.com/kids-first/kf-portal-ui/issues/2896) Refactor (Portal, ETL): Addition of the new Studies fields to the existing ETL (File Centric and participant Centric).
- [2897](https://github.com/kids-first/kf-portal-ui/issues/2897) Refactor (Portal, ETL): Addition of a new Studies index to the ETL.
- [2952](https://github.com/kids-first/kf-portal-ui/issues/2952) Refactor (Studies page, Librairies): Integration of the Apollo library.
- [3004](https://github.com/kids-first/kf-portal-ui/issues/3004) Refactor (Cohort Builder, Participant table): Replaced the “Study name” column by the “Study code” column.
- [3009](https://github.com/kids-first/kf-portal-ui/issues/3009) Refactor (Studies page, Filters): Modified the label used to identify the study domains by using the full word instead of only an acronym.
- [3023](https://github.com/kids-first/kf-portal-ui/issues/3023) Refactor (Studies page, Filters): Adjustments regarding the theme colors and the alignment of some tags.
- [3062](https://github.com/kids-first/kf-portal-ui/issues/3062) Fix (Cohort Builder, Saved Sets): Fixed an issue where the default naming when creating a new Saved Set was not working anymore.
- [3105](https://github.com/kids-first/kf-portal-ui/issues/3105) Refactor (Variant Entity page, Clinical Associations): Corrections were made in the data for the Gene - Phenotype table to remove unwanted brackets and also use the entire inheritance name instead of just the first letter
- [3108](https://github.com/kids-first/kf-portal-ui/issues/3108) Fix (Portal, ETL): Fixed different issues with the ETL regarding family data and also the display name for the Studies.
- [3123](https://github.com/kids-first/kf-portal-ui/issues/3123) Fix (Variant Page, Search results table): Fixed the colors and hover states for links.
- [3126](https://github.com/kids-first/kf-portal-ui/issues/3126) Fix (File Repository, Columns): Fixed an issue where the column title label wasn’t displayed correctly and also another issue that was displaying a column that was supposed to be hidden.
- [3137](https://github.com/kids-first/kf-portal-ui/issues/3137) Fix (File Repository, Columns): Fixed an issue with the Study Domain column in which values were never displayed.
- [3167](https://github.com/kids-first/kf-portal-ui/issues/3167) Fix (Variant Page, Search results table): Fixed an issue where the user was unable to select and copy the text from the Variant Column in the Variant Search page.

## 2021-03-22 kf-portal-ui  2.36.0

### Features
- [2929](https://github.com/kids-first/kf-portal-ui/issues/2929) Feature (Portal, Arranger): Integrated a new separate and up-to-date Arranger microservice for future development.
- [2952](https://github.com/kids-first/kf-portal-ui/issues/2952) Feature (Portal, Apollo): Integrated Apollo to the portal libraries for future development.
- [2965](https://github.com/kids-first/kf-portal-ui/issues/2965) Feature (Data Repository Integrations, RAS): The Data Repository Integration now uses RAS (Research Auth Service) instead of the Fences.

## 2020-02-16 kf-portal-ui 2.35.0

### Features
- [2926](https://github.com/kids-first/kf-portal-ui/issues/2926) Missing Biospecimen attributes from the Cohort Builder filtering

## 2021-02-09 kf-portal-ui 2.34.0
### Features
- [2437](https://github.com/kids-first/kf-portal-ui/issues/2437) Feature (Ontology browser): Add Any Of / All Of / Not in the modal
- [2913](https://github.com/kids-first/kf-portal-ui/issues/2913) Feature: Add banner to advertise KF Forum

## 2021-01-21 kf-portal-ui 2.33.0
### Technical / Other changes
- [2914](https://github.com/kids-first/kf-portal-ui/issues/2914) Fix (VariantDB):  Update numbers.

## 2021-01-14 kf-portal-ui 2.32.0
### Technical / Other changes
- [2586](https://github.com/kids-first/kf-portal-ui/issues/2586) Fix (Ontology Browser):  Better display when no phenotypes for returned participants.
- [2852](https://github.com/kids-first/kf-portal-ui/issues/2852) Refactor (Dashboard, Charts, Cohort Builder): Reduce size of pie and bar charts in the KF portal.

## 2020-12-18 kf-portal-ui

### Features
- [2860](https://github.com/kids-first/kf-portal-ui/issues/2860) Feature (File Repository, Search): Added a new Facet in the sidebar allowing users to search using the External Study ID.
- [2861](https://github.com/kids-first/kf-portal-ui/issues/2861) Feature (File Repository, Table columns): Added a new column called “dbGaP” that displays the dbGaP accession number when there is one.
- [2862](https://github.com/kids-first/kf-portal-ui/issues/2862) Feature (Participant Entity Page, dbGaP): Added a line in the table to display the dbGaP accession number when the study is a dbGaP study.
- [2863](https://github.com/kids-first/kf-portal-ui/issues/2863) Feature (File Entity Page, dbGaP): Added a line in the table to display the dbGaP accession number when the study is a dbGaP study.

### Technical / Other changes
- [2853](https://github.com/kids-first/kf-portal-ui/issues/2853) Fix (Cohort Builder, Survival Plot): Fixed an issue where refreshing the page would shrink the size of the plot in half until moving the mouse over it.
- [2857](https://github.com/kids-first/kf-portal-ui/issues/2857) Refactor (Dashboard, Charts): Adjusted the Studies Graph so that it also gets filtered when clicking on a study in the chart or when searching for a specific study.
- [2858](https://github.com/kids-first/kf-portal-ui/issues/2858) Refactor (Patient Entity Page, External ID): Renamed the “External ID” label to “Participant - External ID” so the field is easier to recognize for users coming from dbGaP.
- [2866](https://github.com/kids-first/kf-portal-ui/issues/2866) Fix (Portal, Logout): Fixed an issue where logging out of the portal was causing the Portal to crash for some users.
- [2883](https://github.com/kids-first/kf-portal-ui/issues/2883) Fix (Dashboard, Charts): Fixed an issue in the Most Frequent Diagnoses chart where the value “Missing” was considered the most frequent diagnoses.

## 2020-12-10 kf-portal-ui 2.29.0

### Features
- [2643](https://github.com/kids-first/kf-portal-ui/issues/2643) Feature (Cohort Builder, HPO Sunburst): The small HPO Tree beside the sunburst is now dynamic allowing the user to click on the terms to navigate in the Sunburst.
- [2829](https://github.com/kids-first/kf-portal-ui/issues/2829) Feature (Cohort Builder, Family ID): Made the Family ID in the Family ID column clickable to be able to add it to the active query to facilitate the process for a user to restrict his search to a specific family only.
- [2830](https://github.com/kids-first/kf-portal-ui/issues/2830) Feature (Cohort Builder, Age_at_diagnosis): Removed the age_at_diagnosis column and added the Pedcbio one that is now also a hyperlink.

### Technical / Other changes
- [2819](https://github.com/kids-first/kf-portal-ui/issues/2819) Refactor (Portal, Hotjar): Replaced the User Feedback add-on Hotjar for Usersnap.
- [2831](https://github.com/kids-first/kf-portal-ui/issues/2831) Fix (Cohort Builder, Table view): Fixed an issue where when a user visiting a Participants page would go back to the Cohort Builder using the browser back button, the view of the results would be reset to Summary view automatically.
- [2832](https://github.com/kids-first/kf-portal-ui/issues/2832) Refactor (Cohort Builder, HPO Sunburst): Adjusted the Sunburst to also be filtered when selecting a HPO term in the HPO Browser.
- [2838](https://github.com/kids-first/kf-portal-ui/issues/2838) Fix (Dashboard, Charts): Fixed an issue where the studies/participants figure on the dashboard was stripping colons from study names
- [2840](https://github.com/kids-first/kf-portal-ui/issues/2840) Refactor (Cohort Builder, HPO Sunburst): Adjusted indentation and vertical space of the information block beside the Sunburst.
- [2849](https://github.com/kids-first/kf-portal-ui/issues/2849) Fix (Cohort Builder, age_at_diagnosis): Fixed an issue where the Portal would cause an error and crash when selecting a large range for the age_at_diagnosis filter.
- [2850](https://github.com/kids-first/kf-portal-ui/issues/2850) Fix (File Repository, Filters): Fixed an issue where the results in the “All filters” modal were not filtered properly.
- [2851](https://github.com/kids-first/kf-portal-ui/issues/2851) Refactor (Cohort Builder, Saved Sets): Improved the default naming for the saved sets that are now based on the values included in the queries.

## 2020-11-13 kf-portal-ui 2.28.0

### Features
- [2639](https://github.com/kids-first/kf-portal-ui/issues/2639) Feature (Cohort Builder, HPO Sunburst): Update the presentation of the information present in the center of the Sunburst.
- [2640](https://github.com/kids-first/kf-portal-ui/issues/2640) Feature (Cohort Builder, HPO Sunburst): Added extra details regarding the selected HPO term beside the Sunburst.
- [2641](https://github.com/kids-first/kf-portal-ui/issues/2641) Feature (Cohort Builder, HPO Sunburst): Added a minimalistic version of the HPO tree beside the Sunburst showing the path of the selected term.
- [2642](https://github.com/kids-first/kf-portal-ui/issues/2642) Feature (Cohort Builder, HPO Sunburst): Added a link to the right of the Sunburst to add the selected HPO term to the active query.
- [2668](https://github.com/kids-first/kf-portal-ui/issues/2668) Feature (Cohort Builder, Participants Saved Sets): A new menu filter called “My sets” was added beside the “Search all filters” bar allowing users to use their Participants Saved Sets in their queries.
- [2726](https://github.com/kids-first/kf-portal-ui/issues/2726) Feature (Cohort Builder, Participants Saved sets): When using a Saved set in a query in the Cohort Builder, we now see a dropdown containing all saved sets when clicking on the Saved Set name.

### Technical / Other changes
- [2754](https://github.com/kids-first/kf-portal-ui/issues/2754) Refactor (Public-Stats-API): Removed duplicated code.
- [2767](https://github.com/kids-first/kf-portal-ui/issues/2767) Refactor (Dashboard, Grid system): Implemented updated grid system in dashboard allowing for 2 columns wide cards.
- [2768](https://github.com/kids-first/kf-portal-ui/issues/2768) Refactor (Dashboard, Grid system): Converted cards to new antd design.
- [2797](https://github.com/kids-first/kf-portal-ui/issues/2797) Refactor (File Repository, Freactal): Removed Freactal code from the Browse All facets modal.
- [2800](https://github.com/kids-first/kf-portal-ui/issues/2800) Refactor (Portal, Main navigation): Updated navigation buttons to better match new layout.
- [2803](https://github.com/kids-first/kf-portal-ui/issues/2803) Refactor (Cohort Builder, Query Operators): Fixed an issue where it was impossible to modify the query operator in Firefox only.
- [2804](https://github.com/kids-first/kf-portal-ui/issues/2804) Refactor (Cohort Builder, Query Operators): Fixed an issue where moving the cursor out of the box would disable the “Apply” button.
- [2805](https://github.com/kids-first/kf-portal-ui/issues/2805) Refactor (Portal, File Repository): Fixed an issue where checking the “show only fields with value" checkbox in the “Browse All” modal would redirect the user to an error page.
- [2816](https://github.com/kids-first/kf-portal-ui/issues/2816) Refactor (Cohort Builder, Participants Saved Sets): Fixed an issue where combining sets in a query using the “not” operator would give incorrect results.

## 2020-10-28 kf-portal-ui 2.27.0

### Features
- [2668](https://github.com/kids-first/kf-portal-ui/issues/2668) Feature (Cohort Builder, Participants Saved Sets): A new menu filter called “My sets” was added beside the “Search all filters” bar allowing users to use their Participants Saved Sets in their queries.
- [2726](https://github.com/kids-first/kf-portal-ui/issues/2726) Feature (Cohort Builder, Participants Saved sets): When using a Saved set in a query in the Cohort Builder, we now see a dropdown containing all saved sets when clicking on the Saved Set name.
- [2639](https://github.com/kids-first/kf-portal-ui/issues/2639) Feature (Summary View, Sunburst): Refactor information at middle of sunburst as per design mockup.
- [2640](https://github.com/kids-first/kf-portal-ui/issues/2640) Feature (Summary View, Sunburst): Add details regarding the selected HPO term on the right side of the Sunburst's card.

### Technical / Other changes
- [2767](https://github.com/kids-first/kf-portal-ui/issues/2767) Refactor (Dashboard, Grid system): Implement updated grid system in dashboard allowing for 2 columns wide cards.
- [2768](https://github.com/kids-first/kf-portal-ui/issues/2768) Refactor (Dashboard, Grid system): Convert cards to new antd design.
- [2797](https://github.com/kids-first/kf-portal-ui/issues/2797) Refactor (File Repository, Freactal): Removing Freactal code from the Browse All facets modal.
- [2800](https://github.com/kids-first/kf-portal-ui/issues/2800) Refactor (Portal, Main navigation): Update navigation buttons to better match new layout.

## 2020-10-15 kf-portal-ui 2.26.1

### Technical / Other changes
- [2784](https://github.com/kids-first/kf-portal-ui/issues/2784) Fix (FileRepo, File Manifest Modal): Fix participant counts when one navigates from the cohort builder to the file repository and opens up the file manifest modal. Refactor of the modal UI with Antd components.
- [2780](https://github.com/kids-first/kf-portal-ui/issues/2780) Refactor (Clear all queries modal): remove freactal dependency and migrate UI with Antd components.

## 2020-10-05 kf-portal-ui 2.26.0

### Features
- [2755](https://github.com/kids-first/kf-portal-ui/issues/2755) Feature (Cohort Builder, Participants Sets): The participants set feature is now visible to everyone. Adding a set to the Cohort Builder from the Dashboard page now replace any existing set instead of adding a new one.


### Technical / Other changes
- [2770](https://github.com/kids-first/kf-portal-ui/issues/2770) Fix (SqonBuilder): Make sure case range does not generate a type error (ex, age at diagnosis).
- [2693](https://github.com/kids-first/kf-portal-ui/issues/2693) Refactor (Portal, Login): Removal of duplicate code in LoginUtils.
- [2754](https://github.com/kids-first/kf-portal-ui/issues/2754) Refactor (Dashboard, Public-stats-api): Removal of duplicate code.
- [2775](https://github.com/kids-first/kf-portal-ui/issues/2775) Refactor (CohortBuilder, File repo): Share query modal.

## 2020-10-01 kf-portal-ui

### Features
- [2614](https://github.com/kids-first/kf-portal-ui/issues/2614) Feature (Cohort Builder, Participants Sets): From the card listing the saved sets on the dashboard, it is now possible to click on the number representing the number of participants in a set to be redirected to the cohort builder and view its content.
- [2715](https://github.com/kids-first/kf-portal-ui/issues/2715) Perf (Studies Chart): Make 1 call vs many ones in order to fetch the needed data for the Studies Chart.

### Technical / Other changes
- [2632](https://github.com/kids-first/kf-portal-ui/issues/2632) Refactor (Dashboard, Cards): Updated the title of the "My Saved Queries" card.
- [2719](https://github.com/kids-first/kf-portal-ui/issues/2719) Fix (Cohort Builder, Participants sets): Make sure sets card show correct data.
- [2722](https://github.com/kids-first/kf-portal-ui/issues/2722) Refactor (Variant Workbench, Fences): Return a 404 error instead of an error 500 when users try to launch a cluster with their fences disconnected.
- [2730](https://github.com/kids-first/kf-portal-ui/issues/2730) Fix (Cohort Builder, Summary/Table view toolbar): Fixed an issue where a loading spinner did not appear at the right place when trying to go from the Cohort Builder to the File Repository.
- [2735](https://github.com/kids-first/kf-portal-ui/issues/2735) Refactor (Portal, Styling): Modifications to unify the styling across the project.
- [2742](https://github.com/kids-first/kf-portal-ui/issues/2742) Fix (Dashboard, Cards): Fixed an issue where some cards in the Dashboard were not scrollable anymore.
- [2750](https://github.com/kids-first/kf-portal-ui/issues/2750) Fix: Avoid showing a vertical bar in the dashboard page.

## 2020-09-23 kf-portal-ui 2.24.0

### Features
- [2687](https://github.com/kids-first/kf-portal-ui/issues/2687) Fix (Variant page): Update text on the Variant DB home page

### Technical / Other changes
- [2706](https://github.com/kids-first/kf-portal-ui/issues/2706) Fix (Cohort Builder, Sets): Make sure userId is not visible on the network (sets)
- [2558](https://github.com/kids-first/kf-portal-ui/issues/2558) Fix (File Repo, Download Manifest): Make modal readable (layout was broken)
- [2719](https://github.com/kids-first/kf-portal-ui/issues/2719) Fix (Cohort Builder, Sets ): Make sure sets are always up-to-date

## 2020-09-15 kf-portal-ui 2.23.00

### Features
- [2534](https://github.com/kids-first/kf-portal-ui/issues/2534) Feature (Cohort Builder, Ontology Browser): Add a link to open the browser from the queries.
- [2573](https://github.com/kids-first/kf-portal-ui/issues/2573) Feature (Cohort Builder, Participants Saved sets): When saving a set of Participants, the textbox is now already populated with a default name to speed up the saving process.
- [2579](https://github.com/kids-first/kf-portal-ui/issues/2579) Feature (Cohort Builder, Participants Saved sets): The “Saved Participants set” button now offers more options than just saving a new set. The button now opens a dropdown menu showing all possible options for the user.
- [2582](https://github.com/kids-first/kf-portal-ui/issues/2582) Feature (Dashboard, Participants Saved sets): The list of sets is now visible in its own card on the Dashboard
- [2583](https://github.com/kids-first/kf-portal-ui/issues/2583) Feature (Dashboard, Participants Saved sets): It is now possible to edit the name of a set directly from the Dashboard.
- [2603](https://github.com/kids-first/kf-portal-ui/issues/2603) Feature (Dashboard, Participants Saved sets): It is now possible to delete a set directly from the Dashboard.
- [2615](https://github.com/kids-first/kf-portal-ui/issues/2615) Feature (Dashboard, Participants Saved sets): It is now possible to add the results of the active query to an already existing set.
- [2666](https://github.com/kids-first/kf-portal-ui/issues/2666) Feature (Dashboard, Participants Saved sets): It is now possible to remove the results of the active query from an already existing set.

### Technical / Other changes
- [2541](https://github.com/kids-first/kf-portal-ui/issues/2541) Refactor (UI Theme, scss): Modifications to the structure of some .scss files.
- [2621](https://github.com/kids-first/kf-portal-ui/issues/2621) Refactor (Login, Terms and Conditions): The user now has to accept the terms and conditions on every login.
- [2633](https://github.com/kids-first/kf-portal-ui/issues/2633) Refactor (Cohort Builder, Summary/Table view): Refactor of the Summary view, and the Table view tabs UI.
- [2634](https://github.com/kids-first/kf-portal-ui/issues/2634) Refactor (Antd, version): Update the Antd library version.
- [2652](https://github.com/kids-first/kf-portal-ui/issues/2652) Refactor (Portal, Freactal): Remove ‘provideToast’.
- [2653](https://github.com/kids-first/kf-portal-ui/issues/2653) Refactor (Portal, Freactal): Remove ‘provideLocalSqon’.
- [2669](https://github.com/kids-first/kf-portal-ui/issues/2669) Refactor (Portal, Freactal): Remove ‘provideState’ in the Settings section.
- [2676](https://github.com/kids-first/kf-portal-ui/issues/2676) Fix (Portal, Graphs): Remove extra spacing above and below the graphics on the dashboard and Cohort Builder pages.
- [2683](https://github.com/kids-first/kf-portal-ui/issues/2683) Refactor (Portal, Freactal): Remove fractal modal from the uploadIds modal in the File Repository.

## 2020-08-11 kf-portal-ui 2.22.00
### Technical / Other changes
- [2581](https://github.com/kids-first/kf-portal-ui/issues/2581) Feature (Cohort Builder, Saved Sets): Unique name for participant save set
- [2617](https://github.com/kids-first/kf-portal-ui/issues/2617) Fix (Cavatica): Change dataset payload sent to Cavatica.

## 2020-09-27 kf-portal-ui 2.21.0
### Features
- [2508](https://github.com/kids-first/kf-portal-ui/issues/2508) Feature (Participant, Clinical data): In the Participant entity page, the Observed and Not observed phenotypes are now split in two different tables.
- [2516](https://github.com/kids-first/kf-portal-ui/issues/2516) Feature (Observed Phenotype Browser): When returning into the browser, the branches to which the selected options belong to are now checked for a better user experience.
- [2529](https://github.com/kids-first/kf-portal-ui/issues/2529) Feature (Observed Phenotype Browser): A second column was added to separate the count of Participants with the exact term only from the count of Participants with the exact term as well as their descendants.
- [2556](https://github.com/kids-first/kf-portal-ui/issues/2556) Feature (Observed Phenotype Browser): Terms can now only be selected once, preventing redundant display for terms with multiple paths.

### Technical / Other changes
- [2202](https://github.com/kids-first/kf-portal-ui/issues/2202) Fix (Cohort Builder, Reporting): The system now prevents a user to request the download of another report until the first download is completed.
- [2332](https://github.com/kids-first/kf-portal-ui/issues/2332) Refactor (File Repository, Search): Improved the behaviour for the 'Search files by Participant ID' filter.
- [2333](https://github.com/kids-first/kf-portal-ui/issues/2333) Fix (File Repository, Cavatica): Addresses an issue where the transfer to Cavatica occasionally returned a success message even if the transfer failed.
- [2366](https://github.com/kids-first/kf-portal-ui/issues/2366) Refactor (File Repository): Modified the format of the Clinical and Biospecimen reports from .tsv to Excel.
- [2367](https://github.com/kids-first/kf-portal-ui/issues/2367) Fix (Cohort Builder, Menu): Fixes an issue where the Category Type menu was broken on Firefox.
- [2539](https://github.com/kids-first/kf-portal-ui/issues/2539) Refactor (ETL): Mapping modification for Mondo diagnosis.
- [2550](https://github.com/kids-first/kf-portal-ui/issues/2550) Test (Reporting Service): Implement automated testing.
- [2552](https://github.com/kids-first/kf-portal-ui/issues/2552) Fix (Cohort Builder, Observed Phenotype Browser): Fixes an issue where the Observed Phenotype Browser was giving an error message when using 3 queries at a time in the Cohort Builder.
- [2566](https://github.com/kids-first/kf-portal-ui/issues/2566) Fix (Dashboard, Virtual Studies): Fixes an issue where deleting a virtual study from the dashboard wouldn't prompt any validation popup before the deletion.
- [2568](https://github.com/kids-first/kf-portal-ui/issues/2568) Refactor (Cohort Builder): Improved the styling of the link to the file repository to make it more intuitive.
- [2570](https://github.com/kids-first/kf-portal-ui/issues/2570) Fix (Cohort Builder, Biospecimen Report): Fixes an issue with the Tissue Type (NCIT) column that was showing twice in the report.
- [2574](https://github.com/kids-first/kf-portal-ui/issues/2574) Refactor (Public stats API, Authentication): Remove all logic related to authenticating with vault.
- [2593](https://github.com/kids-first/kf-portal-ui/issues/2593) Refactor (Cohort Builder, Reporting): Improvement of the values ​​of the diagnostic category in the downloaded Participant report.
- [2609](https://github.com/kids-first/kf-portal-ui/issues/2609) Refactor (Cohort Builder, Cards): Cards are now slightly bigger to give the content a little more breathing room.
- [2618](https://github.com/kids-first/kf-portal-ui/issues/2618) Refactor (Portal, Support): Updated the links to the support site to point to the new documentation on Notion.

## 2020-05-15 kf-portal-ui 2.20.0

### Technical / Other changes
- [2506](https://github.com/kids-first/kf-portal-ui/issues/2514) Fix (CohortBuilder, Horizontal Bar Charts): show whole text in tooltip on left axis labels


## 2020-05-15 kf-portal-ui 2.19.0
- [2506](https://github.com/kids-first/kf-portal-ui/issues/2506) Fix (Variant Db): Improve visual of variant DB page
- [2511](https://github.com/kids-first/kf-portal-ui/issues/2511) Fix(sunburst): Fill all space for child phenotype
- [2383](https://github.com/kids-first/kf-portal-ui/issues/2383) Fix(sunburst): auto update on sqon changes


## 2020-05-12 kf-portal-ui 2.18.0
- [2495](https://github.com/kids-first/kf-portal-ui/issues/2495) Fix (Cohort builder): Visual glitch with the Download menu
- [2465](https://github.com/kids-first/kf-portal-ui/issues/2465) Feature(cohortBuilder): add saveSet Button
- [2468](https://github.com/kids-first/kf-portal-ui/issues/2468) Feature (Variant DB) : Add new Variant Page
- [2383](https://github.com/kids-first/kf-portal-ui/issues/2383) Feature (CohortBuilder, Dashboard): sunburst for phenotypes ontology


## 2020-05-06 kf-portal-ui 2.17.0

### Features
- [2342](https://github.com/kids-first/kf-portal-ui/issues/2342) Feature(Ontology Browser): HPO browser to explore data conveniently.
- [2448](https://github.com/kids-first/kf-portal-ui/issues/2448) Feature(Antd): update library to the latest version.
- [2391](https://github.com/kids-first/kf-portal-ui/issues/2391) Feature(Profile, Edit form): improve some form fields.

### Technical / Other changes
- [2432](https://github.com/kids-first/kf-portal-ui/issues/2432) Fix (CohortBuilder, Study Chart): make sure when we click a study the correct filter is added.
- [2387](https://github.com/kids-first/kf-portal-ui/issues/2387) Fix (Profile, About Me, Edit): fix visual regression.
- [2454](https://github.com/kids-first/kf-portal-ui/issues/2454) Refactor: remove some deprecated warnings.
- [2404](https://github.com/kids-first/kf-portal-ui/issues/2404) Performance: remove the need for antd-icon legacy library.
- [2399](https://github.com/kids-first/kf-portal-ui/issues/2399) Performance (Search filter): start searching only after a minimum of characters are typed.

## 2020-04-01 kf-portal-ui 2.15.0

### Features
- [#2338](https://github.com/kids-first/kf-portal-ui/issues/2338) Performance/Bug fix(Cohort Builder): show summary results using cardinality.
- [#2371](https://github.com/kids-first/kf-portal-ui/issues/2371) Performance (File Repo): show statistics results using cardinality.
- [#2283](https://github.com/kids-first/kf-portal-ui/issues/2283) Feature (Member Page, Admin): add a button to "inactivate" a member".

### Technical / Other changes
- [#2241](https://github.com/kids-first/kf-portal-ui/issues/2241) Build (App): remove unused code.
- [#2353](https://github.com/kids-first/kf-portal-ui/issues/2353) Build (App): update arranger-components to fix some security warnings.
- [#2379](https://github.com/kids-first/kf-portal-ui/issues/2379) Performance (App): use module-import style when using lodash for potential benefits.

## 2020-03-03 kf-portal-ui 2.14.0
​
### Features
​- [#2283](https://github.com/kids-first/kf-portal-ui/issues/2283) Admins can inactivate accounts
- [#2393](https://github.com/kids-first/kf-portal-ui/issues/2293) Enable an Admin user to see all members (private or public)
- [#2284](https://github.com/kids-first/kf-portal-ui/issues/2284) Add 'Report Member' button (under a non-dynamic feature toggle)
- [#2277](https://github.com/kids-first/kf-portal-ui/issues/2277) Add 'Relationship' tab in clinical data xls report
  ​- [#2285](https://github.com/kids-first/kf-portal-ui/issues/2285) Improve design of result header in cohort builder
  ​
### Technical / Other changes
​- [#2334](https://github.com/kids-first/kf-portal-ui/issues/2334) Fix File Repository page truncated
- [#2298](https://github.com/kids-first/kf-portal-ui/issues/2298) Fix scrolling in 'Authorized Studies' Card in Dashboard
- [#1546](https://github.com/kids-first/kf-portal-ui/issues/1546) Change message when no access to any study
- [#2278](https://github.com/kids-first/kf-portal-ui/issues/2278) Do not show login page when already logged in

## 2020-03-02 kf-portal-ui 2.13.8

This feature is a hotfix for this issue :
- [#2323](https://github.com/kids-first/kf-portal-ui/issues/2323) Change pedcbioportal link


## 2020-02-17 kf-portal-ui 2.13.8

This feature is a hotfix for this issue :
- [#2314](https://github.com/kids-first/kf-portal-ui/issues/2314) DCF : can not connect to the DCF fence


## 2020-01-28 kf-portal-ui 2.13.7

This feature is a hotfix for this issue :
- [#2296](https://github.com/kids-first/kf-portal-ui/issues/2296) Participant page : cPortalBio link is broken for PNOC study

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
