const LANDING_URL = process.env.LANDING_URL || "http://localhost:4001";
const DASHBOARD_URL = process.env.DASHBOARD_URL || "http://localhost:4002";
const API_REF_URL =
  process.env.API_REF_URL || "http://localhost:4000/api/reference";

export default defineAppConfig({
  docus: {
    title: "PimaBill",
    description: "Borderless Billing Infrastructure for Africa & Beyond",
    navigation: true,
    header: {
      title: "PimaBill",
      links: [
        { title: "Home", to: LANDING_URL, target: "_blank" },
        { title: "Dashboard", to: DASHBOARD_URL, target: "_blank" },
        {
          title: "API Reference",
          to: API_REF_URL,
          target: "_blank",
        },
      ],
    },
    footer: {
      credits: "PimaBill",
    },
  },
  ui: {
    colors: {
      primary: "purple",
      neutral: "zinc",
    },
  },
});
