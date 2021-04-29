# Tableau-ViewImageRefresh
A POC to pull back Tableau views as images and auto refresh them for use on display screens

Install with "npm install"

Change app.js line 142 to include your own username, password and Tableau Online Site. 
you will need to change the hostname too depending on your Tableau Online pod/Tableau Server. (This can be found in the URL when you've logged into TOL for example) 
https://help.tableau.com/current/pro/desktop/en-us/useracct.htm

Tableau Host is the full pod name including https://, eg: https://eu-west-1a.online.tableau.com/
Tableau Site is the Tableua Site
PAT Name and PAT Secret are your values for authentcation. 

Run with "node app.js"

You can then call a Tableau view using the format 

http://localhost:3000/index.html?proj=default&view=My%20View&refresh=1
localhost:3000 is where the express app will run

view is a parameter to take a Tableau view name. NB this is the name of the view, so what it looks like on the worksheet tab. Spaces must be maintained. 
proj is the Tableau project where the view resides. If the proj parameter is omitted then it will default to the default site. 
refresh is the time in minutes of the refresh rate of the image.

As Tableau doesn't ensure the view name is unique, ensure that you only call unique names by a naming convention. (Or amend the code to make it more robust!) 

This code calls for the high resolution image of the view. If a Tableau view is set to automatic sizing, the resultant image will be a square 1600x1600. If a fixed size is used, the aspect ratio will be maintained at 4x the resolution. 

There is some error checking to ensure that the project names and views exist, however this code is provided "as is".  


