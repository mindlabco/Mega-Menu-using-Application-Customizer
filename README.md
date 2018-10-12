# Mega Menu using Application Customizer
# Description
This web part is an Extension developed in SharePoint Framework (SPFx). Application Customizer is a one of the type in Extension. Application Customizer is used to do custom branding inside the modern page like for an example to create dynamic header and footer experience that render across all the Modern pages in SharePoint online. We have used this Customizer to create custom header footer along with dynamic navigation. We have used a custom list named “Global-Navigation” for getting the Navigation values. List is created based on parent – child relations. We have also used OOTB search to search in entire site.

We have used font Googleapis, jQuery, font-awesome, wow-min for animation, and animated-menu for drop down effects in menu for this extension. We have used our custom script for getting the data from the list
# How to use
To use the web part follow the below steps:-
1) Clone or Download the web part solution
2) Install the list STP (which is available inside the repository) in your site (Keep the name same as it is, do not change the name of the list)
3) Open that list and add one more look up column named *Parent Node*. That look up column will have the values of *Title* column of the same list.
4) Navigate to the cloned repository folder
5) Open your system's terminal on that folder
6) In your terminal, Navigate to the web part folder inside the cloned repository
7) Now run *npm install* command to install all the npm packages
# Column Configuration

Below is screen shot of the column configuration named *Parent Node*

![Image of Yaktocat](https://github.com/mindlabco/Mega-Menu-using-Application-Customizer/blob/master/Column-Configuration.png)

# Output

Below Screenshot wil be the output of this extension

![Image of Yaktocat](https://github.com/mindlabco/Mega-Menu-using-Application-Customizer/blob/master/Transocean-navigation.png)
