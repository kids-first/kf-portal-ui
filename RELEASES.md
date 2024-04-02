## VERSION 5.1.1 (2024-04-02)

### Technical / Other changes
- [SKFP-964](https://d3b.atlassian.net/browse/SKFP-964) Fix: (Authorized Studies) Various bugs
- [SKFP-968](https://d3b.atlassian.net/browse/SKFP-968) Update: (UI) Update resources dropdown design
- [SKFP-985](https://d3b.atlassian.net/browse/SKFP-985) Fix: (Variant Entity) Do not display NO_GENE
- [SKFP-998](https://d3b.atlassian.net/browse/SKFP-998) Fix: (Studies) Add CBTN id to pedcbioportal map
- [SKFP-1001](https://d3b.atlassian.net/browse/SKFP-1001) Fix: (Cavatica) Unauthorized file despite being connected to Fence and Cavatica
- [SKFP-1002](https://d3b.atlassian.net/browse/SKFP-1002) Fix: (Dashboard) Mask the Variant Workbench widget

## VERSION 5.1.0 (2024-03-21)

### Features
- [SKFP-900](https://d3b.atlassian.net/browse/SKFP-900) Implement Variant Entity V2 
- [SKFP-965](https://d3b.atlassian.net/browse/SKFP-965) Add a search by Family ID to facets

### Technical / Other changes
- [SKFP-924](https://d3b.atlassian.net/browse/SKFP-924) Fix: (Dashboard) Fixed various bugs related to the Authorized Studies widget
- [SKFP-943](https://d3b.atlassian.net/browse/SKFP-943) Fix: (Data Exploration) Fixed missing values for Not Observed Phenotype and Observed Phenotype (Source text) in table
- [SKFP-944](https://d3b.atlassian.net/browse/SKFP-944) Fix: (Report) Fixed the missing histological diagnoses values in the download sample data
- [SKFP-980](https://d3b.atlassian.net/browse/SKFP-980) Fix: (Dashboard) Fixed the requirement to refresh to see authorized studies in widget
- [SKFP-982](https://d3b.atlassian.net/browse/SKFP-982) Refactor: (UI) Update palette for hex values
- [SKFP-983](https://d3b.atlassian.net/browse/SKFP-983) Refactor: (UI) Update palette for tag values
- [SKFP-988](https://d3b.atlassian.net/browse/SKFP-988) Refactor: (UI) Update palette for text values
- [SKFP-993](https://d3b.atlassian.net/browse/SKFP-993) Fix: (Data Exploration) Fixed the authorization lock in the table allowing users to copy authorized files to Cavatica
- [SKFP-995](https://d3b.atlassian.net/browse/SKFP-995) Add a see more functionality to RefSeq field

## VERSION 5.0.3 (2024-02-29)

### Features
- [SKFP-734](https://d3b.atlassian.net/browse/SKFP-734) Add Tags to Google Analytics 4 to capture user metrics
- [SKFP-742](https://d3b.atlassian.net/browse/SKFP-742) Feature: (Cavatica) Add associated metadata when files are being copied to a Cavatica project
- [SKFP-927](https://d3b.atlassian.net/browse/SKFP-927) Feature: (Studies) Add sort to columns
- [SKFP-894](https://d3b.atlassian.net/browse/SKFP-894) Feature: (Data Exploration) Add search by external ID in facets

### Technical / Other changes
- [SKFP-815](https://d3b.atlassian.net/browse/SKFP-815) Fix: (Export TSV) Added the field Platform in 
- [SKFP-817](https://d3b.atlassian.net/browse/SKFP-817) Fix: (UI) Fixed various text throughout the platform
- [SKFP-845](https://d3b.atlassian.net/browse/SKFP-845) Refactor: (UI) Upgrade to React 18
- [SKFP-890](https://d3b.atlassian.net/browse/SKFP-890) Fix: (Data Exploration) Fixed loss of positions and buttons for charts upon a window resize
- [SKFP-913](https://d3b.atlassian.net/browse/SKFP-913) Refactor: (Report) Remove Tissue type and source text in biospecimen report
- [SKFP-915](https://d3b.atlassian.net/browse/SKFP-915) Fix: (Data Exploration) Fixed the loss of column position personalization 
- [SKFP-917](https://d3b.atlassian.net/browse/SKFP-917) Fix: (Variant Exploration) Adjusted the value for the frequency to show the affected participant frequency and not the allele frequency
- [SKFP-918](https://d3b.atlassian.net/browse/SKFP-918) Fix: (Dashboard) Fixed various defects in Authorized Studies widget
- [SKFP-920](https://d3b.atlassian.net/browse/SKFP-920) Refactor: (Dashboard) Add a spinner to the Authorized Studies widget transition state
- [SKFP-926](https://d3b.atlassian.net/browse/SKFP-926) Fix: (Variant Exploration) Fixed the alternating table row colors
- [SKFP-933](https://d3b.atlassian.net/browse/SKFP-933) Fix: (Data Exploration) Remove the custom pill creation from QB
- [SKFP-936](https://d3b.atlassian.net/browse/SKFP-936) Fix: (Variant Exploration) Updated the CADD field to use the CADD (Phred Score) values and not the CADD (raw)
- [SKFP-941](https://d3b.atlassian.net/browse/SKFP-941) Fix (Data Exploration) Fixed the summary chart position reset button
- [SKFP-949](https://d3b.atlassian.net/browse/SKFP-949) Refactor: (Data Exploration) Add tooltip to disabled state buttons
- [SKFP-951](https://d3b.atlassian.net/browse/SKFP-951) Refactor: (Data Exploration) Display PedcBioportal link only for participants proband=true 
- [SKFP-953](https://d3b.atlassian.net/browse/SKFP-953) Refactor: (Data Exploration & Entity page) Remove the option to include family member files if the family count in the file manifest is 0 

## VERSION 5.0.2 (2024-01-18)

### Technical / Other changes
- [SKFP-880](https://d3b.atlassian.net/browse/SKFP-880) Update: (Variant Table) Update the UI of the variant table
- [SKFP-875](https://d3b.atlassian.net/browse/SKFP-875) Feature: (Data Exploration) Add tooltip on hover for study code
- [SKFP-898](https://d3b.atlassian.net/browse/SKFP-898)[Data Exploration & Entity page] Remove Tissue Type (NCIT) and Tissue Type (source text)
- [SKFP-663](https://d3b.atlassian.net/browse/SKFP-663)[UI Theme] Les couleurs de src/style/themes/kids-first/colors.less
- [SKFP-910](https://d3b.atlassian.net/browse/SKFP-910) Login with email/pwd crash application
- [SKFP-911](https://d3b.atlassian.net/browse/SKFP-911)[Theme / Tags] Do not change text color for links within tags
- [SKFP-874](https://d3b.atlassian.net/browse/SKFP-874) [Authorized Studies] Refactor widget

## VERSION 5.0.1 (2023-12-14)

### Features
- [SKFP-889](https://d3b.atlassian.net/browse/SKFP-889) Feature: (Google Analytics) Connect beta portal prd to Google Analytics 4

## VERSION 5.0.0 (2023-12-11)

### Features
- [SKFP-827](https://d3b.atlassian.net/browse/SKFP-827) Feature: (Data Exploration) Added accessibility patterns to the graphs and pie charts

### Technical / Other changes
- [SKFP-767](https://d3b.atlassian.net/browse/SKFP-767) Refactor: (Study page) Remove the apply and clear button from the facets
- [SKFP-815](https://d3b.atlassian.net/browse/SKFP-815) Fix: (Export TSV) Added the field Platform in the File table export as TSV
- [SKFP-831](https://d3b.atlassian.net/browse/SKFP-831) Refactor: (Facets) Removed the No Data checkbox for numerical range type facets in Variant Exploration 
- [SKFP-832](https://d3b.atlassian.net/browse/SKFP-832) Fix: (Saved Filter Dashboard) Fixed the incorrect redirection of the variants saved filters
- [SKFP-836](https://d3b.atlassian.net/browse/SKFP-836) Fix: (Saved Filter QB) Fixed a shared filter url returning an empty query builder
- [SKFP-842](https://d3b.atlassian.net/browse/SKFP-842) Refactor:  (Data Exploration & Entity page) Added missing fields and facets to the Data Exploration and entity page
- [SKFP-847](https://d3b.atlassian.net/browse/SKFP-847) Fix: (Data Exploration) Fixed sunburst that would not load when there were no search queries active
- [SKFP-850](https://d3b.atlassian.net/browse/SKFP-850) Fix: (Variant Exploration) Fixed the display of NO_GENES for intergenic consequences which led to an error 500
- [SKFP-852](https://d3b.atlassian.net/browse/SKFP-852) Fix: (Data Exploration) Fixed the recovery of user configs which would cause the portal to crash for certain users
- [SKFP-853](https://d3b.atlassian.net/browse/SKFP-853) Fix: (Data Exploration) Fixed the reset button on the summary view
- [SKFP-855](https://d3b.atlassian.net/browse/SKFP-855) Fix: (Variant Entity) Fixed an error 500 upon clicking on the query pill generated from a Variant entity page study redirect 
- [SKFP-858](https://d3b.atlassian.net/browse/SKFP-858) Fix: (Data Exploration) Fixed the cut off on the graph and chart mouseovers
- [SKFP-861](https://d3b.atlassian.net/browse/SKFP-861) Refactor: (Dashboard) Updated the empty state text for the Saved set and Saved filter widgets
- [SKFP-863](https://d3b.atlassian.net/browse/SKFP-863) Refactor: (Data Exploration) Modified naming of column to External Participant ID and removed Age at Outcome in the Participant table
- [SKFP-869](https://d3b.atlassian.net/browse/SKFP-869) Fix: (Data Exploration) Fixed the button to remove charts and graphs in the summary view
- [SKFP-870](https://d3b.atlassian.net/browse/SKFP-870) Fix: (Participant Entity) Fixed participant entity pages that would display no data

