pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CreateTaxDto {
    /// Tax name
    pub name: String,
    /// Unique tax code (lowercase, underscores)
    pub code: String,
    /// Tax rate as a percentage (e.g., 18 for 18%)
    pub rate: f64,
    /// Tax description
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    /// Whether this tax is applied by default to all invoices
    #[serde(rename = "appliedByDefault")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub applied_by_default: Option<bool>,
}
