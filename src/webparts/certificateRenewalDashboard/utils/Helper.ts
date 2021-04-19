import { ICertificateDashboardDetails } from "../interfaces/ICertificateRenewalDashboardState";

export const getCertDashboardCardsConfiguration = (
  certDashboardDetails: ICertificateDashboardDetails
): any[] => {
  return [
    {
      title: "Active certificates",
      count: certDashboardDetails.certActive,
      color: "#4CAF50",
    },
    {
      title: "Expiring over 30 days",
      count: certDashboardDetails.certExpiringOver30Days,
      color: "#8BC34A",
    },
    {
      title: "Expiring in 16 to 30 days",
      count: certDashboardDetails.certExpiringIn16To30Days,
      color: "#FFEB3B",
    },
    {
      title: "Expiring in 8 to 15 days",
      count: certDashboardDetails.certExpiringIn8To15Days,
      color: "#FFC107",
    },
    {
      title: "Expiring in 7 days",
      count: certDashboardDetails.certExpiringIn7Days,
      color: "#FF9800",
    },
    {
      title: "Expired certificates",
      count: certDashboardDetails.certExpired,
      color: "#F44336",
    },
  ];
};

export const _loadBarChartOptions = (): any => {
  return {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
};

export const _loadBarChartData = (
  certDashboardDetails: ICertificateDashboardDetails
): any => {
  return {
    labels: certDashboardDetails.certBarChartLabels,
    datasets: [
      {
        label: "Certificates expiring",
        data: certDashboardDetails.certBarChartData,
        backgroundColor: (window as any).__themeState__.theme
          ? (window as any).__themeState__.theme.themeTertiary
          : "#71afe5",
        borderColor: (window as any).__themeState__.theme
          ? (window as any).__themeState__.theme.themePrimary
          : "#0078d4",
      },
    ],
  };
};

export const _loadBarChartDataPromise = (
  certDashboardDetails: ICertificateDashboardDetails
): Promise<any> => {
  return new Promise<any>((resolve) => {
    resolve(_loadBarChartData(certDashboardDetails));
  });
};

//function to check if a certificates expires in a given month
export const checkCertExpiringInMonth = (
  monthToCheck: number,
  certExpiryDate: Date,
  currentYear: number
): boolean => {
  if (
    certExpiryDate.getMonth() === monthToCheck &&
    currentYear === certExpiryDate.getFullYear()
  ) {
    return true;
  }
  return false;
};

// Take the difference between the dates and divide by milliseconds per day.
// Round to nearest whole number to deal with DST.
export const calculateDateDifference = (
  firstDate: Date,
  secondDate: Date
): number => {
  return Math.round(
    (secondDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  );
};
