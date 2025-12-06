// src/webparts/pollinationsImageLab/PollinationsImageLabWebPart.ts

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import {
  BaseClientSideWebPart
} from '@microsoft/sp-webpart-base';

import PollinationsImageLab from './components/PollinationsImageLab';
import { IPollinationsImageLabProps } from './components/IPollinationsImageLabProps';

export interface IPollinationsImageLabWebPartProps {
  description: string;
}

export default class PollinationsImageLabWebPart
  extends BaseClientSideWebPart<IPollinationsImageLabWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  // You can customize this later if you want a friendlier message
  private _getEnvironmentMessage(): string {
    return 'Pollinations.ai Image Lab (SharePoint workbench)';
  }

  public render(): void {
    const element: React.ReactElement<IPollinationsImageLabProps> = React.createElement(
      PollinationsImageLab,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected async onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Pollinations.ai Image Lab settings'
          },
          groups: [
            {
              groupName: 'General',
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Subtitle (optional)',
                  description: 'Shown under the title in the web part UI.'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}