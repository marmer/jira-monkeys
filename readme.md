[![Build Status](https://dev.azure.com/MarianoMertinat/MarianoMertinat/_apis/build/status/marmer.jira-monkeys?branchName=master)](https://dev.azure.com/MarianoMertinat/MarianoMertinat/_build/latest?definitionId=1&branchName=master)
 
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=io.github.marmer.utils.jira-monkeys:jira-monkeys&metric=alert_status)](https://sonarcloud.io/dashboard?id=io.github.marmer.utils.jira-monkeys:jira-monkeys)
[![Code Coverage](https://sonarcloud.io/api/project_badges/measure?project=io.github.marmer.utils.jira-monkeys:jira-monkeys&metric=coverage)](https://sonarcloud.io/component_measures?id=io.github.marmer.utils.jira-monkeys:jira-monkeys&metric=Coverage)
[![Technical Dept](https://sonarcloud.io/api/project_badges/measure?project=io.github.marmer.utils.jira-monkeys:jira-monkeys&metric=sqale_index)](https://sonarcloud.io/project/issues?facetMode=effort&id=io.github.marmer.utils.jira-monkeys:jira-monkeys&resolved=false&types=CODE_SMELL)

[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=io.github.marmer.utils.jira-monkeys:jira-monkeys&metric=security_rating)](https://sonarcloud.io/component_measures?id=io.github.marmer.utils.jira-monkeys:jira-monkeys&metric=Security)
[![Maintainability](https://sonarcloud.io/api/project_badges/measure?project=io.github.marmer.utils.jira-monkeys:jira-monkeys&metric=sqale_rating)](https://sonarcloud.io/component_measures?id=io.github.marmer.utils.jira-monkeys:jira-monkeys&metric=Maintainability)
[![Reliability](https://sonarcloud.io/api/project_badges/measure?project=io.github.marmer.utils.jira-monkeys:jira-monkeys&metric=reliability_rating)](https://sonarcloud.io/component_measures?id=io.github.marmer.utils.jira-monkeys:jira-monkeys&metric=Reliability)

Jira Monkeys
============

Jira Monkeys is a tool to provide some additional functionality for and in jira which may be helpful in your daily work, regardless of whether you are a worker drone or the queen in your hive.

Of course it would be possible to create (or maybe buy) some jira plugins with the same or a similar ability, but this project is used es a playground for me.

Getting started
---------------
First you have to install the browser plugin Tampermonkey which works for chrome and firefox.
More details on how to install Tampermonkey at: [https://www.tampermonkey.net/](https://www.tampermonkey.net/)

Second you have to install the Jira Monkeys. If Tampermonkey is already installed a simple click [here](https://github.com/marmer/jira-monkeys/raw/master/dist/jira-monkeys.user.js) and an additional click on install should be enough. If this is not enough, you can install it manually. The just mentioned Tampermonkey documentation should be your friend.   

Usage
-----
If you've installed the plugin already open up any of your issues. You should see an inconspicuous checkbox without any text on the top left corner of the menu bar. If you click it, you will have access to all the features. .

![Open Monkeys](docs/open_monkeys2.gif)

Features
--------
### Worklog-summarizer
Here you'll get a sortable summed up overview of all the work logged to an issue.

![Open Monkeys](docs/worklog_sum.gif) 
 
### Estimation-shifter
You can easily shift parts of an estimation from one issue to another without the need to calculate the original and remaining estimate for both issues.

![Estimation Shifter](docs/estimation_shift.gif)

### Worklog-shifter
This feature allows you to either shift a part or a whole worklog from the current issue to another. You can also use it to split a worklog within an issue into multiple parts, depending on whether you enter the same or a different issue key for shifting in the target field.

![Worklog Shift](docs/worklog_shift.gif) 

### Estimation-fixer
Jira is sometimes not able to adjust the remaining time when a worklog is edited, deleted or moved. With only one click at "Fix estimation" button (if you have chosen the Estimatino-fixer in the menu before) this is getting fixed. Here is an example of a state before and after.

![Estimation Fix](docs/estimation_fix.gif) 

UI
--
Just as much as needed. This tool only has to work for me and whoever wants to use it ... it's not about to be beautiful
