import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'TransoceanNavigationApplicationCustomizerStrings';

//For rest calls in sharepoint
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import { SPComponentLoader } from '@microsoft/sp-loader';
import { INavigationSites } from './INavigationSites';


const LOG_SOURCE: string = 'TransoceanNavigationApplicationCustomizer';
declare var window: any;
/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ITransoceanNavigationApplicationCustomizerProperties {
  // This is an example; replace with your own property
  Top: string;
  Bottom: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class TransoceanNavigationApplicationCustomizer
  extends BaseApplicationCustomizer<ITransoceanNavigationApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;
  private logoImage: any = require('./images/logo.png');
  private siteUrl: string = "";
  private homePageUrl: string = "";
  private siteNavigationData: any = "";


  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    // Added to handle possible changes on the existence of placeholders.
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

    // Call render method for generating the HTML elements.
    //this._renderPlaceHolders();
    return Promise.resolve<void>();
  }

  private _searchThroughTenant(): void {


    // var el:HTMLElement=document.getElementById('search_txt');
    // console.log("EL:"+el);
    // console.log((<HTMLInputElement>document.getElementById('search_txt')).value);
    // //var siteUrl = this._getWebAbsoluteUrl();

    var qryParam = (<HTMLInputElement>document.getElementById('search_txt')).value;
    console.log("Searched for:" + qryParam);
    var searchUrl = this.siteUrl + '/_layouts/15/search.aspx?q=' + qryParam;
    console.log("URL:" + searchUrl);
    window.location.href = searchUrl;

    //return this.siteUrl;
  } 


  private _renderPlaceHolders(): void {
    if (typeof window.jQuery == 'undefined') {
      // jQuery IS NOT loaded, do stuff here.
      require('./style.css');
      console.log("Jquery is now loading")
      SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
      SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
      SPComponentLoader.loadCss('https://fonts.googleapis.com/css?family=Quantico:700|Titillium+Web:300,300i,700,700i');
      SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', { globalExportsName: 'jQuery' }).then((jQuery: any): void => {
        SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js', { globalExportsName: 'jQuery' }).then((): void => {
        });


        require('./app/jquery.flexslider.js');
        //require('./app/wow.min.js');
        require('./app/mycustomscript.js');
        require('./app/animated-menu.js');
        require('./app/animate.min.css');
        require('./app/bootstrap-dropdownhover.min.css');
        require('./app/bootstrap-dropdownhover.min.js');
        //require('./app/mysp.js');


      });

    } else {
      console.log("Jquery is already loaded");
    }
    console.log('ApplicationCustomizer._renderPlaceHolders()');
    console.log('Available placeholders: ',
      this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(', '));

    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose });

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error('The expected placeholder (Top) was not found.');
        return;
      }

      if (this.properties) {
        let topString: string = this.properties.Top;
        if (!topString) {
          topString = '(Top property was not defined.)';
        }

        if (this._topPlaceholder.domElement) {
          console.log("Inside Top Placeholer");
          const currentWebUrl: string = this.context.pageContext.web.absoluteUrl;
          console.log("URL:" + currentWebUrl);
          this.siteUrl = currentWebUrl;
          this.homePageUrl = this.siteUrl + "/SitePages/Home.aspx"
          this._topPlaceholder.domElement.innerHTML = `
          <SharePoint:SharePointForm runat="server" ></SharePoint:SharePointForm>
    <div class="header_bg">
      <div class="header">
        <div class="logo"><a href="${this.homePageUrl}"><img src="${this.logoImage}" alt="Logo" /></a></div>
        <div id="top-navigation" class="nav global-nav-overlap">
          
          
        </div>
          <form class="search_form">
            <input type="button" class="search_submit" value="Search" id="search_btn"/>
            <input id="search_txt" type="search" class="search_field" placeholder="Search here..." value="" name="s" title="Search for:" />
          </form>    
        <div class="clear"></div>`;

          this._setButtonEventHandlers();
        }
      }
    }

    // Handling the bottom placeholder
    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Bottom,
          { onDispose: this._onDispose });

      // The extension should not assume that the expected placeholder is available.
      if (!this._bottomPlaceholder) {
        console.error('The expected placeholder (Bottom) was not found.');
        return;
      }

      if (this.properties) {
        let bottomString: string = this.properties.Bottom;
        if (!bottomString) {
          bottomString = '(Bottom property was not defined.)';
        }

        if (this._bottomPlaceholder.domElement) {
          this._bottomPlaceholder.domElement.innerHTML = `
    <div class="footer_bg">
    <div class="footer">
      <p>&copy;2018 OCEAN LTD. PRIVACY POLICY <a href="#">ABOUT</a> <a href="#">CONTACT</a> </p>
      <div class="clear"></div>
    </div>
    <div class="clear"></div>
  </div>`;
        }
      }
    }
  }

  private _onDispose(): void {
    console.log('[ApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }
  private _setButtonEventHandlers(): void {
    this._topPlaceholder.domElement.querySelector('#search_btn').addEventListener('click', () => {
      this._searchThroughTenant();
    });
  }
}
