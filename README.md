# Tableau-ViewImageRefresh
A POC to pull back Tableau views as images and auto refresh them for use on display screens

Install with "npm install"

Change app.js line 142 to include your own username, password and Tableau Online Site. 
you will need to change the hostname too depending on your Tableau Online pod/Tableau Server. (This can be found in the URL when you've logged into TOL for example) 

Run with "node app.js"

You can then call a Tableau view using the format 

http://localhost:3000/test?vn=Tableau%20View%20Name&to=5

localhost:3000 is where the express app will run

vn is a parameter to take a Tableau view name. NB this is the name of the view, so what it looks like on the worksheet tab. Spaces must be maintained. As Tableau doesn't ensure the view name is unique, ensure that you only call unique names by a naming convention. (Or amend the code to make it more robust!) 

to is a timeout paramter in minutes for the refresh. Min value is 1 min.

This code calls for the high resolution image of the view. If a Tableau view is set to automatic sizing, the resultant image will be a square 1600x1600. If a fixed size is used, the aspect ratio will be maintained at 4x the resolution. 

There is no error checking, or elegant auth handling here. This code is just for demonstrating how to pull images of a dashboard using the REST API. 


