use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct AnalyticsClient {
    pub http_client: HttpClient,
}

impl AnalyticsClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve revenue metrics including total revenue, MRR (monthly recurring revenue), and revenue breakdown by period. Supports filtering by date range and currency.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_revenue(&self, request: &GetRevenueQueryRequest, options: Option<RequestOptions>) -> Result<RevenueAnalyticsResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/analytics/revenue",
            None,
            QueryBuilder::new().string("dateFrom", request.date_from.clone()).string("dateTo", request.date_to.clone()).string("currency", request.currency.clone()).serialize("groupBy", request.group_by.clone())
            .build(),
            options,
        ).await
    }

    /// Retrieve subscription metrics including active count, churn rate, new subscriptions, and status distribution.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_subscriptions(&self, request: &GetSubscriptionsQueryRequest, options: Option<RequestOptions>) -> Result<SubscriptionAnalyticsResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/analytics/subscriptions",
            None,
            QueryBuilder::new().string("dateFrom", request.date_from.clone()).string("dateTo", request.date_to.clone()).string("currency", request.currency.clone()).serialize("groupBy", request.group_by.clone())
            .build(),
            options,
        ).await
    }

    /// Retrieve customer metrics including total count, new customers, and geographic distribution.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_customers(&self, request: &GetCustomersQueryRequest, options: Option<RequestOptions>) -> Result<CustomerAnalyticsResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/analytics/customers",
            None,
            QueryBuilder::new().string("dateFrom", request.date_from.clone()).string("dateTo", request.date_to.clone()).string("currency", request.currency.clone()).serialize("groupBy", request.group_by.clone())
            .build(),
            options,
        ).await
    }

    /// Retrieve payment metrics including success rate, failure rate, total volume, and breakdown by payment provider.
    ///
    /// # Arguments
    ///
    /// * `provider` - Filter by payment provider name
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_payments(&self, request: &AnalyticsGetPaymentsQueryRequest, options: Option<RequestOptions>) -> Result<PaymentAnalyticsResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/analytics/payments",
            None,
            QueryBuilder::new().string("dateFrom", request.date_from.clone()).string("dateTo", request.date_to.clone()).string("currency", request.currency.clone()).serialize("groupBy", request.group_by.clone()).string("provider", request.provider.clone())
            .build(),
            options,
        ).await
    }

    /// MRR breakdown by movement type (new, expansion, contraction, churn) and by plan.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_mrr_breakdown(&self, request: &GetMrrBreakdownQueryRequest, options: Option<RequestOptions>) -> Result<MrrBreakdownResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/analytics/mrr-breakdown",
            None,
            QueryBuilder::new().string("dateFrom", request.date_from.clone()).string("dateTo", request.date_to.clone()).string("currency", request.currency.clone()).serialize("groupBy", request.group_by.clone())
            .build(),
            options,
        ).await
    }

    /// Gross revenue minus refunds and credit notes.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_net_revenue(&self, request: &GetNetRevenueQueryRequest, options: Option<RequestOptions>) -> Result<NetRevenueResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/analytics/net-revenue",
            None,
            QueryBuilder::new().string("dateFrom", request.date_from.clone()).string("dateTo", request.date_to.clone()).string("currency", request.currency.clone()).serialize("groupBy", request.group_by.clone())
            .build(),
            options,
        ).await
    }

    /// Monthly cohort retention matrix showing what percentage of each cohort is retained over time.
    ///
    /// # Arguments
    ///
    /// * `months` - Number of months to analyze (default 12)
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_churn_cohorts(&self, request: &GetChurnCohortsQueryRequest, options: Option<RequestOptions>) -> Result<ChurnCohortsResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/analytics/churn-cohorts",
            None,
            QueryBuilder::new().float("months", request.months.clone())
            .build(),
            options,
        ).await
    }

    /// Average customer LTV and lifespan, broken down by plan.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn get_lifetime_value(&self, options: Option<RequestOptions>) -> Result<LtvResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/analytics/ltv",
            None,
            None,
            options,
        ).await
    }

}

