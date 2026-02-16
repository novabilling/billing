//! # NovaBilling API SDK
//!
//! The official Rust SDK for the NovaBilling API.
//!
//! ## Getting Started
//!
//! ```rust
//! use novabilling_rust::prelude::*;
//!
//! #[tokio::main]
//! async fn main() {
//!     let config = ClientConfig {
//!         token: Some("<token>".to_string()),
//!         ..Default::default()
//!     };
//!     let client = NovaBillingClient::new(config).expect("Failed to build client");
//!     client
//!         .auth
//!         .register(
//!             &RegisterDto {
//!                 name: "John Doe".to_string(),
//!                 email: "john@company.com".to_string(),
//!                 password: "securePassword123".to_string(),
//!                 company_name: "Acme Corp".to_string(),
//!             },
//!             None,
//!         )
//!         .await;
//! }
//! ```
//!
//! ## Modules
//!
//! - [`api`] - Core API types and models
//! - [`client`] - Client implementations
//! - [`config`] - Configuration options
//! - [`core`] - Core utilities and infrastructure
//! - [`error`] - Error types and handling
//! - [`prelude`] - Common imports for convenience

pub mod api;
pub mod error;
pub mod core;
pub mod config;
pub mod client;
pub mod prelude;
pub mod environment;

pub use error::{ApiError};
pub use environment::{*};
pub use api::{*};
pub use core::{*};
pub use config::{*};
pub use client::{*};

