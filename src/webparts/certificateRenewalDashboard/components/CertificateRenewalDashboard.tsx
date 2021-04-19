import * as React from "react";
import { ICertificateRenewalDashboardProps } from "../interfaces/ICertificateRenewalDashboardProps";
import {
  ICertificateRenewalDashboardState,
  ICertificateDetails,
  ICertificateDashboardDetails,
} from "../interfaces/ICertificateRenewalDashboardState";
import { ChartControl, ChartType } from "@pnp/spfx-controls-react";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Card, ICardTokens } from "@uifabric/react-cards";
import {
  FontWeights,
  Text,
  ITextStyles,
  Pivot,
  PivotItem,
} from "office-ui-fabric-react";
import styles from "./CertificateRenewalDashboard.module.scss";
import * as Helper from "../utils/Helper";
import * as Constants from "../utils/Constants";

export default class CertificateRenewalDashboard extends React.Component<
  ICertificateRenewalDashboardProps,
  ICertificateRenewalDashboardState
> {
  private certificateTypes: string[] = [
    Constants.EXTERNAL_CERT,
    Constants.INTERNAL_CERT,
  ];

  public constructor(props: ICertificateRenewalDashboardProps) {
    super(props);
    this.state = {
      externalCertListData: [],
      externalCertDashboardDetails: {
        certBarChartData: [],
        certBarChartLabels: [],
        certActive: 0,
        certExpiringOver30Days: 0,
        certExpiringIn16To30Days: 0,
        certExpiringIn8To15Days: 0,
        certExpiringIn7Days: 0,
        certExpired: 0,
      },
      internalCertListData: [],
      internalCertDashboardDetails: {
        certBarChartData: [],
        certBarChartLabels: [],
        certActive: 0,
        certExpiringOver30Days: 0,
        certExpiringIn16To30Days: 0,
        certExpiringIn8To15Days: 0,
        certExpiringIn7Days: 0,
        certExpired: 0,
      },
    };
  }

  public componentDidMount() {
    this.processCertificateData(Constants.EXTERNAL_CERT);
    this.processCertificateData(Constants.INTERNAL_CERT);
  }

  public render(): React.ReactElement<ICertificateRenewalDashboardProps> {
    const {
      externalCertDashboardDetails,
      internalCertDashboardDetails,
    } = this.state;

    const cardTitleTextStyles: ITextStyles = {
      root: {
        color: "#025F52",
        fontWeight: FontWeights.semibold,
      },
    };

    const cardCountTextStyles: ITextStyles = {
      root: {
        color: "#025F52",
        fontWeight: FontWeights.bold,
        display: "block",
      },
    };

    const cardTokens: ICardTokens = {
      childrenMargin: 6,
      childrenGap: 0,
      minWidth: 100,
      maxWidth: 300,
      boxShadowHovered:
        "rgba(0, 0, 0, 0.1) 3px 0px 1px 0px, rgba(0, 0, 0, 0.2) 4px 0px 1px 0px,rgba(0, 0, 0, 0.1) -3px 0px 1px 0px, rgba(0, 0, 0, 0.2) -4px 0px 1px 0px",
    };

    return (
      <div className={styles.certificateRenewalDashboard}>
        <div className={styles.container}>
          <Pivot>
            {this.certificateTypes.map((data, index) => (
              <PivotItem headerText={data + " Certificate Metrics"} key={index}>
                <div className="ms-Grid" dir="ltr">
                  <div className="ms-Grid-row p-xy-8 m-top-16 center-xy">
                    <div className="ms-Grid-col ms-md3 p-xy-8">
                      {Helper.getCertDashboardCardsConfiguration(
                        data == Constants.EXTERNAL_CERT
                          ? externalCertDashboardDetails
                          : internalCertDashboardDetails
                      ).map((card, index) => {
                        return (
                          <Card
                            key={index}
                            horizontal
                            tokens={cardTokens}
                            style={{ backgroundColor: card.color }}
                          >
                            <Card.Section>
                              <Text styles={cardTitleTextStyles}>
                                {card.title}
                              </Text>
                              <Text
                                variant="xLarge"
                                styles={cardCountTextStyles}
                              >
                                {card.count}
                              </Text>
                            </Card.Section>
                          </Card>
                        );
                      })}
                    </div>
                    <div className="ms-Grid-col ms-md9 p-xy-8">
                      <ChartControl
                        type={ChartType.Bar}
                        options={Helper._loadBarChartOptions()}
                        data={Helper._loadBarChartData(
                          data == Constants.EXTERNAL_CERT
                            ? externalCertDashboardDetails
                            : internalCertDashboardDetails
                        )}
                        datapromise={Helper._loadBarChartDataPromise(
                          data == Constants.EXTERNAL_CERT
                            ? externalCertDashboardDetails
                            : internalCertDashboardDetails
                        )}
                      />
                    </div>
                  </div>
                </div>
              </PivotItem>
            ))}
          </Pivot>
        </div>
      </div>
    );
  }

  private processCertificateData(certType: string) {
    this.getCertificateData(certType)
      .then(() => {
        const { externalCertListData, internalCertListData } = this.state;
        if (certType === Constants.EXTERNAL_CERT) {
          if (externalCertListData.length > 0) {
            this.setState({
              externalCertDashboardDetails: this.populateDashboardDetails(
                externalCertListData
              ),
            });
          }
        } else {
          if (internalCertListData.length > 0) {
            this.setState({
              internalCertDashboardDetails: this.populateDashboardDetails(
                internalCertListData
              ),
            });
          }
        }
        console.log(this.state);
      })
      .catch((error) => {
        console.error(
          `Error in fetching/parsing ${certType} certificate response. ${error}`
        );
      });
  }

  private getCertificateData(certType: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.props.context.spHttpClient
        .get(
          `${this.props.context.pageContext.web.absoluteUrl}` +
            `/_api/web/lists/getbytitle('${certType} certificates')/items`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              Accept: "application/json;odata=nometadata",
              "odata-version": "",
            },
          }
        )
        .then((response: SPHttpClientResponse) => response.json())
        .catch((error: any) => reject(error))
        .then((response: any) => {
          if (response && response.value && response.value.length > 0) {
            let listData: ICertificateDetails[] = response.value.map(
              (cert: any): ICertificateDetails => ({
                ExpirationDate: cert.ExpirationDate,
              })
            );
            if (certType === Constants.EXTERNAL_CERT) {
              this.setState({ externalCertListData: listData });
            } else {
              this.setState({ internalCertListData: listData });
            }
            resolve(response);
          }
        });
    });
  }

  private populateDashboardDetails(
    certListData: ICertificateDetails[]
  ): ICertificateDashboardDetails {
    let certDashboardDetails = {} as ICertificateDashboardDetails;

    let months: string[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let monthsWithCurrentYear: string[] = months.map(
      (e) => `${e}-${new Date().getFullYear().toString().substr(2, 2)}`
    );
    certDashboardDetails.certBarChartLabels = monthsWithCurrentYear;

    let certBarChartData: number[] = [];
    for (let i = 0; i < 12; i++) {
      certBarChartData.push(
        certListData.filter((cert) =>
          Helper.checkCertExpiringInMonth(
            i,
            new Date(cert.ExpirationDate),
            Constants.CURRENT_YEAR
          )
        ).length
      );
    }
    certDashboardDetails.certBarChartData = certBarChartData;

    certDashboardDetails.certExpiringOver30Days = certListData.filter(
      (cert) =>
        Helper.calculateDateDifference(
          Constants.CURRENT_DATE,
          new Date(cert.ExpirationDate)
        ) > 30
    ).length;

    certDashboardDetails.certExpiringIn16To30Days = certListData.filter(
      (cert) =>
        Helper.calculateDateDifference(
          Constants.CURRENT_DATE,
          new Date(cert.ExpirationDate)
        ) >= 16 &&
        Helper.calculateDateDifference(
          Constants.CURRENT_DATE,
          new Date(cert.ExpirationDate)
        ) <= 30
    ).length;

    certDashboardDetails.certExpiringIn8To15Days = certListData.filter(
      (cert) =>
        Helper.calculateDateDifference(
          Constants.CURRENT_DATE,
          new Date(cert.ExpirationDate)
        ) >= 8 &&
        Helper.calculateDateDifference(
          Constants.CURRENT_DATE,
          new Date(cert.ExpirationDate)
        ) <= 15
    ).length;

    certDashboardDetails.certExpiringIn7Days = certListData.filter(
      (cert) =>
        Helper.calculateDateDifference(
          Constants.CURRENT_DATE,
          new Date(cert.ExpirationDate)
        ) >= 0 &&
        Helper.calculateDateDifference(
          Constants.CURRENT_DATE,
          new Date(cert.ExpirationDate)
        ) <= 7
    ).length;

    certDashboardDetails.certExpired = certListData.filter(
      (cert) =>
        Helper.calculateDateDifference(
          Constants.CURRENT_DATE,
          new Date(cert.ExpirationDate)
        ) < 0
    ).length;

    certDashboardDetails.certActive =
      certListData.length - certDashboardDetails.certExpired;

    return certDashboardDetails;
  }
}
