var navData = [];
var navDataArray = [];
var Url = getWebAbsoluteUrl();
var rootwebUrl;
//var arr = currentWebUrl.split("/");
var navigationList = "GlobalNavigation";

$(document).ready(function () {
    console.log("JS URL:" + Url);
    getNavigation();
    appendNav();//For sub menu apend
    siteNavigationJS();

    $('#search_btn').click(function () {
        var url = Url;
        searchThroughTenant(url);
    })
});

function getWebAbsoluteUrl() {

    if (typeof (_spPageContextInfo) == "undefined") {
        //alert("Not found");
        var currentUrl = window.location.href;        
        var arr = currentUrl.split('/');
        rootwebUrl=  arr[0] + "//" + arr[1] + arr[2] + "/";
        console.log("Current web url->Root web Url:"+rootwebUrl);

        console.log("Window Loaction:" + currentUrl);
        currentUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
        currentUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
        console.log("Current:" + currentUrl);
        return currentUrl;
    } else {
        //alert("Found");
        var arr = _spPageContextInfo.webAbsoluteUrl.split('/')
        rootwebUrl = arr[0]+"//"+arr[1]+arr[2]+"/";
        console.log("SP page->Root web Url:"+rootwebUrl);
        return _spPageContextInfo.webAbsoluteUrl;
    }
}

function nthIndex(str, pat, n) {
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

function searchThroughTenant(url) {
    console.log("THIS in function:" + this);
    var qryParam = $('#search_txt').val();
    console.log("Searched for:" + qryParam);
    var searchUrl = url + '/_layouts/15/search.aspx?q=' + qryParam;
    console.log("URL:" + searchUrl);
    window.location.href = searchUrl;
}
function siteNavigationJS() {

    $.ajax({
        url: Url + '/_api/web/navigation/QuickLaunch?$expand=Children',
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
            //console.log(JSON.stringify(data.d.results));
            siteNavigationData(data);
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
}

function siteNavigationData(data) {
    //For appending static html

    $.each(data.d.results, function (e, val) {
        if (val.Children.results.length > 0) {
            $.each(val.Children.results, function (e1, val1) {
                var navDataJSON = {
                    "parentTitle": val.Title,
                    "parentUrl": val.Url,
                    "ChildTitle": val.Children.results[e1].Title,
                    "ChildUrl": val.Children.results[e1].Url
                }
                navDataArray.push(navDataJSON);
            })
        } else {
            var navDataJSON = {
                "parentTitle": val.Title,
                "parentUrl": val.Url
            }
            navDataArray.push(navDataJSON);
        }
    })
    console.log("Array:" + JSON.stringify(navDataArray));
    appendNavDropdown();
}

var navArr = [];
function appendNavDropdown() {
    //navweburl = arr[0] + "//" + arr[1] + arr[2];
    //$('#top-navigation1').append("<ul id='topnavigationul'></ul>");
    $.each(navDataArray, function (e, val) {
        var tmpNav = val.parentTitle;
        if (navArr.indexOf(tmpNav) == -1) {
            navArr.push(tmpNav);
            var temp = $.grep(navDataArray, function (e1, val1) { return e1.parentTitle == tmpNav });
            console.log(temp);
            displayNav(temp, tmpNav);
        }
        else {
            console.log("Exist");
        }
    })

}

function displayNav(child, parent) {
    var navweburl = Url.substring(0, 35);
    var html = "";
    if (child[0].hasOwnProperty('ChildTitle')) {
        html += '<li id=' + parent + '>' +
            '<a class="dropdown-toggle" data-target="' + parent + '" data-toggle="dropdown" href="#">' + child[0].parentTitle + ' <span class="caret"></span></a>' +
            '<ul>';
        // $('#navBar').append(htmlChild);
        $.each(child, function (e, val) {
            console.log(val.ChildTitle);
            html += '<li><a href="' + navweburl + val.ChildUrl + '">' + val.ChildTitle + '</a></li>';
            //$('#' + parent + '').append('<li><a href="' + child.ChildUrl + '">' + child.ChildTitle + '</a></li>');
        })
        html += '</ul></li>';

    } else {
        html = '<li><a href="' + navweburl + child[0].parentUrl + '">' + parent + '</a></li>';
    }
    $('#topnavigationul').append(html);
}


function appendNav() {

    var html = '<div id="top-navigation1" class="nav">' +

        '</div>';
    $('.ms-siteHeader-groupInfo').append(html);
    $('#top-navigation1').prepend('<ul id="topnavigationul"></ul>');

}



function getSubNode(parentNode) {
    var temp = $.grep(navigationData, function (ele, index) { if (ele.Parent_x0020_Node.Title == parentNode) { return ele; } });
    var subNodehtml;
    if (temp.length > 0) {
        subNodehtml = '<ul>'
        temp.forEach(function (ele, i) {

            var subNodes = getSubNode(ele.Title);
            if (subNodes)
                subNodehtml += '<li role="menu" data="' + ele.Title + '"><a  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" href="' + ele.Url.Url + '"><i class="fa fa-plus"></i>' + ele.Title + '</a>' + subNodes + '</li>'
            else
                subNodehtml += '<li data="' + ele.Title + '"><a href="' + ele.Url.Url + '">' + ele.Title + '</a>' + subNodes + '</li>'

        })
        subNodehtml += '</ul>'
        return subNodehtml;
    }
    else {
        return "";
    }

}
function getNavigation() {
    $.ajax({
        url: rootwebUrl + "/_api/web/lists/getbytitle('" + navigationList + "')/Items?$select=Title,Url,Parent_x0020_Node/Title&$expand=Parent_x0020_Node",
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
            //console.log(JSON.stringify(data.d.results));
            console.log(data);
            navigationData = data.d.results;


            var nodes = $.grep(data.d.results, function (ele, index) { if (!ele.Parent_x0020_Node.Title) { return ele; } })
            console.log("Nodes:" + JSON.stringify(nodes));

            var parentNodehtml = '<ul style="margin-bottom:0px;">'

            nodes.forEach(function (ele, i) {

                var subNodes = getSubNode(ele.Title);
                if (subNodes)
                    parentNodehtml += '<li  data="' + ele.Title + '"><a  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" href="' + ele.Url.Url + '">' + ele.Title + '<span class="caret"></span></a>' + subNodes + '</li>'
                else
                    parentNodehtml += '<li  data="' + ele.Title + '"><a href="' + ele.Url.Url + '">' + ele.Title + '</a>' + subNodes + '</li>'

            })

            parentNodehtml += '</ul>';

            $("#top-navigation").append(parentNodehtml);
            //$('#top-navigation1').append(parentNodehtml);
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
}