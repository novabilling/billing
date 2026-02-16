use crate::{ClientConfig, ApiError, HttpClient, RequestOptions, QueryBuilder};
use reqwest::{Method};
use crate::api::{*};

pub struct CreditNotesClient {
    pub http_client: HttpClient,
}

impl CreditNotesClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
    http_client: HttpClient::new(config.clone())?
})
    }

    /// Retrieve a paginated list of credit notes.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn list(&self, request: &CreditNotesListQueryRequest, options: Option<RequestOptions>) -> Result<PaginatedCreditNoteResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            "api/credit-notes",
            None,
            QueryBuilder::new().string("customerId", request.customer_id.clone()).string("invoiceId", request.invoice_id.clone()).serialize("status", request.status.clone()).float("page", request.page.clone()).float("limit", request.limit.clone())
            .build(),
            options,
        ).await
    }

    /// Create a credit note against an invoice. Starts in DRAFT status.
    ///
    /// # Arguments
    ///
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn create(&self, request: &CreateCreditNoteDto, options: Option<RequestOptions>) -> Result<CreditNoteResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            "api/credit-notes",
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    pub async fn get(&self, id: &String, options: Option<RequestOptions>) -> Result<CreditNoteResponse, ApiError> {
        self.http_client.execute_request(
            Method::GET,
            &format!("api/credit-notes/{}", id),
            None,
            None,
            options,
        ).await
    }

    pub async fn credit_notes_controller_update(&self, id: &String, request: &UpdateCreditNoteDto, options: Option<RequestOptions>) -> Result<CreditNoteResponse, ApiError> {
        self.http_client.execute_request(
            Method::PATCH,
            &format!("api/credit-notes/{}", id),
            Some(serde_json::to_value(request).unwrap_or_default()),
            None,
            options,
        ).await
    }

    /// Move a credit note from DRAFT to FINALIZED status.
    ///
    /// # Arguments
    ///
    /// * `id` - Credit note ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn finalize(&self, id: &String, options: Option<RequestOptions>) -> Result<CreditNoteResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/credit-notes/{}/finalize", id),
            None,
            None,
            options,
        ).await
    }

    /// Cancel a credit note.
    ///
    /// # Arguments
    ///
    /// * `id` - Credit note ID
    /// * `options` - Additional request options such as headers, timeout, etc.
    ///
    /// # Returns
    ///
    /// JSON response from the API
    pub async fn void(&self, id: &String, options: Option<RequestOptions>) -> Result<CreditNoteResponse, ApiError> {
        self.http_client.execute_request(
            Method::POST,
            &format!("api/credit-notes/{}/void", id),
            None,
            None,
            options,
        ).await
    }

}

