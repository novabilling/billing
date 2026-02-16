pub use crate::prelude::*;

/// Request type for API operation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct BatchEventsDto {
    /// Array of events to ingest (max 100)
    pub events: Vec<CreateEventDto>,
}
