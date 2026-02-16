pub use crate::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct AssignTaxDto {
    /// Tax ID to assign
    #[serde(rename = "taxId")]
    pub tax_id: String,
}