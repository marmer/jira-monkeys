Jira Monkeys
============

Jira Monkeys is a tool to provide some additional Functionality to jira which may help in your daily work, regardless whether you are a worker drone or the queen of your hive (workplace).

Of course it would be possible to create (or maybe buy) some jira Plugins with the same ability, but this project is used es a playground for me.

Getting started
---------------
First you have to install the Tampermonkey to yuor browser. The Jira Monkeys are developed (and tested only) with chrome but may work with Firefox as well.
You can find details on how to install Tampermonkey at: [https://www.tampermonkey.net/](https://www.tampermonkey.net/)

Second you have to install the Jira Monkeys. If Tampermonkey is already installed a simple click [here](https://github.com/marmer/jira-monkeys/raw/master/dist/jira-monkeys.user.js) and an additional click on install should be enough. If this is not enough, you can install it manually. The just mentioned Tampermonkey documentation should be your friend.   

Usage
-----
If you've installed the Plugin already open up any of your issues. You should see an inconspicuous checkbox without any text on the top left corner of the menu bar. If you click it, you will see all the currently implemented features.

Features
--------
- Summing up worklogs of an issue per user
- Moving worklogs from one issue to another (not implemented yet)
- Moving time-estimations from one ticket to another (not implemented yet)
- Fix/Recalculate difference of estimated and remaining time ... a problem which occurs if the worklog summary once was bigger than the estimation (not implemented yet)
- ... whatever is fun implementing it or helps to do the daily work in an easier way

UI
--
Just as much as needed. This tool only has to work for me and whoever wants to use it, not to look good ;)