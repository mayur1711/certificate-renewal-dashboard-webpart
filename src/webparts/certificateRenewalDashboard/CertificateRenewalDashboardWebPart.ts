import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import {
  BaseClientSideWebPart,
  WebPartContext,
} from "@microsoft/sp-webpart-base";

import * as strings from "CertificateRenewalDashboardWebPartStrings";
import CertificateRenewalDashboard from "./components/CertificateRenewalDashboard";
import { ICertificateRenewalDashboardProps } from "./interfaces/ICertificateRenewalDashboardProps";

export interface ICertificateRenewalDashboardWebPartProps {
  description: string;
  context: WebPartContext;
}

export default class CertificateRenewalDashboardWebPart extends BaseClientSideWebPart<ICertificateRenewalDashboardWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ICertificateRenewalDashboardProps> = React.createElement(
      CertificateRenewalDashboard,
      {
        description: this.properties.description,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // @ts-ignore
  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
