export interface ICertificateRenewalDashboardState {
  externalCertListData: ICertificateDetails[];
  externalCertDashboardDetails: ICertificateDashboardDetails;
  internalCertListData: ICertificateDetails[];
  internalCertDashboardDetails: ICertificateDashboardDetails;
}

export interface ICertificateDetails {
  ExpirationDate: string;
}

export interface ICertificateDashboardDetails {
  certBarChartLabels: string[];
  certBarChartData: number[];
  certActive: number;
  certExpiringOver30Days: number;
  certExpiringIn16To30Days: number;
  certExpiringIn8To15Days: number;
  certExpiringIn7Days: number;
  certExpired: number;
}